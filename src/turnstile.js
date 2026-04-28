import { corsHeaders } from './utils.js';
import { getTurnstileHTML } from './html/turnstile.js';

function sanitizeRedirect(redirect) {
  if (!redirect || typeof redirect !== 'string') return '/';
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/';
  if (/[\r\n\0]/.test(redirect)) return '/';
  if (redirect.length > 200) return '/';
  return redirect;
}

const SESSION_DURATION = 60 * 60;
const SESSION_COOKIE_NAME = 'ts_session';
const SESSION_HEADER_NAME = 'X-Session-Token';
const SESSION_KEY_PREFIX = 'session:';

export function generateSessionId() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function getSessionFromRequest(request) {
  const headerSession = request.headers.get(SESSION_HEADER_NAME);
  if (headerSession) return headerSession;
  
  const url = new URL(request.url);
  const querySession = url.searchParams.get('_ts');
  if (querySession) return querySession;
  
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

function getSessionKey(sessionId) {
  return `${SESSION_KEY_PREFIX}${sessionId}`;
}

async function getSessionRecord(sessionId, env) {
  if (!sessionId) return null;
  if (!/^[a-f0-9]{64}$/.test(sessionId)) return null;

  const raw = await env.LINKS.get(getSessionKey(sessionId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {}

  // Backward compatibility for older plain-string session values.
  return { createdAt: Number(raw) || Date.now(), verifiedPaths: {} };
}

async function saveSessionRecord(sessionId, env, session) {
  await env.LINKS.put(getSessionKey(sessionId), JSON.stringify(session), {
    expirationTtl: SESSION_DURATION
  });
}

export async function isSessionValid(sessionId, env) {
  const session = await getSessionRecord(sessionId, env);
  return session !== null;
}

export async function createSession(env, verifiedPath = null) {
  const sessionId = generateSessionId();
  await saveSessionRecord(sessionId, env, {
    createdAt: Date.now(),
    verifiedPaths: verifiedPath ? { [verifiedPath]: Date.now() } : {},
  });
  return sessionId;
}

async function grantVerifiedPath(env, sessionId, verifiedPath) {
  const session = await getSessionRecord(sessionId, env);
  const nextSession = session || {
    createdAt: Date.now(),
    verifiedPaths: {},
  };

  const verifiedPaths = nextSession.verifiedPaths && typeof nextSession.verifiedPaths === 'object'
    ? nextSession.verifiedPaths
    : {};

  verifiedPaths[verifiedPath] = Date.now();
  nextSession.verifiedPaths = verifiedPaths;

  await saveSessionRecord(sessionId, env, nextSession);
}

export function getSessionCookie(sessionId) {
  return `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Secure; SameSite=Lax; Max-Age=${SESSION_DURATION}`;
}

export async function handleTurnstilePage(env, redirectPath = '/') {
  const siteKey = env.TURNSTILE_SITE_KEY;
  if (!siteKey) {
    return new Response('Turnstile not configured', { status: 500 });
  }
  return new Response(getTurnstileHTML(siteKey, redirectPath), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export async function handleTurnstileVerify(request, env) {
  let body;
  try {
    const text = await request.text();
    if (text.length > 10 * 1024) {
      return new Response(JSON.stringify({ success: false, error: 'Payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    body = JSON.parse(text);
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const { token, redirect } = body;

  if (!token || typeof token !== 'string' || token.length > 2048) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const secretKey = env.TURNSTILE_ENABLED ? env.TURNSTILE_SECRET_KEY : '';
  if (!secretKey) {
    return new Response(JSON.stringify({ success: false, error: 'Turnstile not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  formData.append('remoteip', request.headers.get('CF-Connecting-IP') || '');

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });

  const outcome = await result.json();

  if (outcome.success) {
    const safeRedirect = sanitizeRedirect(redirect);
    const existingSessionId = getSessionFromRequest(request);
    const hasValidSession = await isSessionValid(existingSessionId, env);
    const sessionId = hasValidSession ? existingSessionId : await createSession(env);
    await grantVerifiedPath(env, sessionId, safeRedirect);
    return new Response(JSON.stringify({ success: true, redirect: safeRedirect, sessionToken: sessionId }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Set-Cookie': getSessionCookie(sessionId)
      }
    });
  }

  return new Response(JSON.stringify({ success: false, error: 'Verification failed' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function hasVerifiedPathGrant(request, env, sessionId) {
  const session = await getSessionRecord(sessionId, env);
  if (!session) return false;

  const url = new URL(request.url);
  const verifiedPaths = session.verifiedPaths && typeof session.verifiedPaths === 'object'
    ? session.verifiedPaths
    : {};
  const verifiedAt = verifiedPaths[url.pathname];
  if (!verifiedAt) return false;

  if ((Date.now() - verifiedAt) > SESSION_DURATION * 1000) {
    delete verifiedPaths[url.pathname];
    session.verifiedPaths = verifiedPaths;
    await saveSessionRecord(sessionId, env, session);
    return false;
  }

  return true;
}

export async function requireTurnstile(request, env, options = {}) {
  if (!env.TURNSTILE_ENABLED || !env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY) {
    return null;
  }

  const sessionId = getSessionFromRequest(request);
  const valid = await isSessionValid(sessionId, env);

  if (options.requireFreshPathGrant) {
    const granted = valid ? await hasVerifiedPathGrant(request, env, sessionId) : false;
    if (!granted) {
      const url = new URL(request.url);
      return handleTurnstilePage(env, url.pathname);
    }
    return null;
  }

  if (!valid) {
    const url = new URL(request.url);
    return handleTurnstilePage(env, url.pathname);
  }

  return null;
}
