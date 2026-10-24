// Cloudflare Pages Function: GET /api/health
export async function onRequestGet(context) {
  const data = {
    status: 'ok',
    platform: 'Cloudflare Pages & Workers',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(Date.now() / 1000),
    colo: context.request.cf?.colo || 'EDGE'
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}
