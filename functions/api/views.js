// Cloudflare Pages Function: GET & POST /api/views
let memoryViews = 4185;

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.BIOLINK_KV;

  let currentViews = memoryViews;

  if (kv) {
    try {
      const stored = await kv.get('totalViews');
      if (stored) {
        currentViews = parseInt(stored, 10);
      }
    } catch (_) {}
  }

  if (request.method === 'POST') {
    currentViews += 1;
    memoryViews = currentViews;
    if (kv) {
      try {
        await kv.put('totalViews', currentViews.toString());
      } catch (_) {}
    }
  }

  return new Response(JSON.stringify({
    success: true,
    views: currentViews,
    totalViews: currentViews
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}
