// Cloudflare Pages Function: GET /api/spotify/profile
export async function onRequestGet(context) {
  const env = context.env || {};
  const SPOTIFY_API_KEY = env.SPOTIFY_API_KEY || 'spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr';
  const SPOTIFY_USER_ID = env.SPOTIFY_USER_ID || '31zymccmdqzrzvjkdryasaqmkwlq';

  try {
    const res = await fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}`, {
      headers: {
        'Authorization': `Bearer ${SPOTIFY_API_KEY}`,
        'X-Api-Key': SPOTIFY_API_KEY
      }
    });

    if (!res.ok) throw new Error(`StatsFM API returned HTTP ${res.status}`);
    const data = await res.json();
    const itemData = {
      displayName: data.item?.displayName || 'Adithyan',
      customId: data.item?.customId || SPOTIFY_USER_ID,
      image: data.item?.image || 'https://i.scdn.co/image/ab6775700000ee85ad94aad60ef11d0c693bb42f',
      profileUrl: `https://open.spotify.com/user/${SPOTIFY_USER_ID}`
    };

    return new Response(JSON.stringify({ item: itemData, ...itemData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    const fallback = {
      displayName: 'Adithyan',
      customId: SPOTIFY_USER_ID,
      image: 'https://i.scdn.co/image/ab6775700000ee85ad94aad60ef11d0c693bb42f',
      profileUrl: `https://open.spotify.com/user/${SPOTIFY_USER_ID}`
    };
    return new Response(JSON.stringify({ item: fallback, ...fallback }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
