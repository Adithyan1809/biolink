// Cloudflare Pages Function: GET /api/spotify/recent
export async function onRequestGet(context) {
  const env = context.env || {};
  const SPOTIFY_API_KEY = env.SPOTIFY_API_KEY || 'spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr';
  const SPOTIFY_USER_ID = env.SPOTIFY_USER_ID || '31zymccmdqzrzvjkdryasaqmkwlq';

  try {
    const res = await fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}/streams/recent`, {
      headers: {
        'Authorization': `Bearer ${SPOTIFY_API_KEY}`,
        'X-Api-Key': SPOTIFY_API_KEY
      }
    });

    if (!res.ok) throw new Error(`StatsFM API returned HTTP ${res.status}`);
    const raw = await res.json();
    const items = (raw.items || []).slice(0, 10).map((item) => {
      const t = item.track || {};
      const spotifyId = t.externalIds?.spotify?.[0];
      return {
        title: t.name || 'Unknown Track',
        artist: t.artists?.map((a) => a.name).join(', ') || 'Unknown Artist',
        cover: t.albums?.[0]?.image || t.album?.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80',
        spotifyUrl: spotifyId ? `https://open.spotify.com/track/${spotifyId}` : 'https://open.spotify.com',
        playedAt: item.endTime
      };
    });

    return new Response(JSON.stringify({ success: true, count: items.length, items }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=45, s-maxage=45',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, items: [] }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
