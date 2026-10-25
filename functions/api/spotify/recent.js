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
    const fallbackItems = [
      {
        title: "Bad Habit",
        artist: "Steve Lacy",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/2a/cb/e3/2acbe3f1-7a65-e2c1-8f12-ba04c6ee05dc/196589099631.jpg/768x768bb.jpg",
        spotifyUrl: "https://open.spotify.com/track/4k6Uh1HXdhtusDW5y8Gbvy",
        playedAt: new Date().toISOString()
      },
      {
        title: "Snooze",
        artist: "SZA",
        cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/768x768bb.jpg",
        spotifyUrl: "https://open.spotify.com/track/4iZ4mst790ZCrSV4YAVvBP",
        playedAt: new Date().toISOString()
      }
    ];
    return new Response(JSON.stringify({ success: true, count: fallbackItems.length, items: fallbackItems }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
