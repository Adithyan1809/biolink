// Cloudflare Pages Function: GET /api/spotify/top
export async function onRequestGet(context) {
  const env = context.env || {};
  const SPOTIFY_API_KEY = env.SPOTIFY_API_KEY || 'spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr';
  const SPOTIFY_USER_ID = env.SPOTIFY_USER_ID || '31zymccmdqzrzvjkdryasaqmkwlq';

  try {
    const headers = {
      'Authorization': `Bearer ${SPOTIFY_API_KEY}`,
      'X-Api-Key': SPOTIFY_API_KEY
    };

    const [artRes, trkRes] = await Promise.all([
      fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}/top/artists`, { headers }).then((r) => r.json()),
      fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}/top/tracks`, { headers }).then((r) => r.json())
    ]);

    const artists = (artRes.items || []).slice(0, 6).map((item) => {
      const art = item.artist || {};
      const spotifyId = art.externalIds?.spotify?.[0] || art.spotifyId;
      return {
        name: art.name || 'Artist',
        image: art.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
        genres: art.genres || [],
        spotifyUrl: spotifyId ? `https://open.spotify.com/artist/${spotifyId}` : 'https://open.spotify.com'
      };
    });

    const tracks = (trkRes.items || []).slice(0, 6).map((item) => {
      const trk = item.track || {};
      const spotifyId = trk.externalIds?.spotify?.[0] || trk.spotifyId;
      return {
        name: trk.name || 'Track',
        artists: trk.artists?.map((a) => a.name).join(', ') || 'Artist',
        cover: trk.albums?.[0]?.image || trk.album?.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
        spotifyUrl: spotifyId ? `https://open.spotify.com/track/${spotifyId}` : 'https://open.spotify.com'
      };
    });

    return new Response(JSON.stringify({ success: true, artists, tracks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
