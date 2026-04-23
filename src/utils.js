export const MAX_PAYLOAD_SIZE = 10 * 1024;
export const MAX_URL_LENGTH = 2048;
export const MAX_SLUG_LENGTH = 50;
export const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;
export const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

export function verifyApiKey(request, env) {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey === env.ADMIN_API_KEY;
}

export function generateSlug(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.length > MAX_SLUG_LENGTH) return false;
  if (!SLUG_PATTERN.test(slug)) return false;
  const reserved = ['api', 'admin', 'static', 'assets', 'favicon.ico'];
  if (reserved.includes(slug.toLowerCase())) return false;
  return true;
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
  if (url.length > MAX_URL_LENGTH) return { valid: false, error: 'URL too long' };
  
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    
    if (!['http:', 'https:'].includes(protocol)) {
      return { valid: false, error: 'Only HTTP/HTTPS URLs allowed' };
    }
    
    for (const blocked of BLOCKED_PROTOCOLS) {
      if (url.toLowerCase().includes(blocked)) {
        return { valid: false, error: 'Invalid URL' };
      }
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export async function parseJsonBody(request) {
  const contentLength = request.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
    return { error: 'Payload too large', status: 413 };
  }
  
  try {
    const text = await request.text();
    if (text.length > MAX_PAYLOAD_SIZE) {
      return { error: 'Payload too large', status: 413 };
    }
    return { data: JSON.parse(text) };
  } catch {
    return { error: 'Invalid JSON', status: 400 };
  }
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Session-Token',
};
