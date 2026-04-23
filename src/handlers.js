import { 
  verifyApiKey, 
  generateSlug, 
  validateSlug,
  validateUrl,
  parseJsonBody,
  corsHeaders 
} from './utils.js';
import { get404HTML } from './html/404.js';

export async function handleShorten(request, env) {
  const parsed = await parseJsonBody(request);
  if (parsed.error) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: parsed.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const { url, customSlug, expiresIn } = parsed.data;

  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) {
    return new Response(JSON.stringify({ error: urlValidation.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let slug;

  if (customSlug) {
    if (!validateSlug(customSlug)) {
      return new Response(JSON.stringify({ error: 'Invalid slug format. Use only letters, numbers, hyphens, and underscores.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const existing = await env.LINKS.get(customSlug);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    slug = customSlug;
  } else {
    // Auto-generate slug with collision retry (up to 5 attempts)
    let attempts = 0;
    do {
      slug = generateSlug();
      const existing = await env.LINKS.get(slug);
      if (!existing) break;
      attempts++;
    } while (attempts < 5);
  }

  const linkData = {
    url,
    createdAt: new Date().toISOString(),
    clicks: 0,
  };

  const options = {};
  if (expiresIn && expiresIn > 0) {
    options.expirationTtl = expiresIn;
    linkData.expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  }

  await env.LINKS.put(slug, JSON.stringify(linkData), options);

  const shortUrl = new URL(request.url).origin + '/' + slug;

  return new Response(
    JSON.stringify({
      success: true,
      slug,
      shortUrl,
      originalUrl: url,
      createdAt: linkData.createdAt,
      expiresAt: linkData.expiresAt || null,
    }),
    {
      status: 201,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}

export async function handleRedirect(slug, env) {
  const data = await env.LINKS.get(slug);

  if (!data) {
    return new Response(get404HTML(), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const linkData = JSON.parse(data);

  linkData.clicks = (linkData.clicks || 0) + 1;
  linkData.lastClickedAt = new Date().toISOString();

  await env.LINKS.put(slug, JSON.stringify(linkData));

  return Response.redirect(linkData.url, 302);
}

export async function handleListLinks(request, env) {
  if (!verifyApiKey(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Explicitly request the maximum page size.
  // NOTE: If list.list_complete === false, there are more keys beyond this page.
  // Full pagination across cursor pages is not implemented here; for stores
  // with more than 1000 keys a cursor-based loop would be required.
  const list = await env.LINKS.list({ limit: 1000 });
  const links = [];

  for (const key of list.keys) {
    if (key.name.startsWith('session:')) continue;
    
    const data = await env.LINKS.get(key.name);
    if (data) {
      try {
        const linkData = JSON.parse(data);
        if (linkData.url) {
          links.push({
            slug: key.name,
            ...linkData,
          });
        }
      } catch (e) {}
    }
  }

  links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return new Response(JSON.stringify({ links }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function handleDelete(request, env, path) {
  if (!verifyApiKey(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const slug = path.replace('/api/delete/', '');

  const existing = await env.LINKS.get(slug);
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Link not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  await env.LINKS.delete(slug);

  return new Response(JSON.stringify({ success: true, deleted: slug }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function handleStats(request, env, path) {
  if (!verifyApiKey(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const slug = path.replace('/api/stats/', '');

  const data = await env.LINKS.get(slug);
  if (!data) {
    return new Response(JSON.stringify({ error: 'Link not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const linkData = JSON.parse(data);

  return new Response(
    JSON.stringify({
      slug,
      ...linkData,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}