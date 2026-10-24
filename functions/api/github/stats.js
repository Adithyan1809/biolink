// Cloudflare Pages Function: GET /api/github/stats
export async function onRequestGet(context) {
  const env = context.env || {};
  const GITHUB_USERNAME = env.GITHUB_USERNAME || 'Adithyan1809';

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { 'User-Agent': 'Adithyan-Biolink-Cloudflare-Pages' }
    });
    const u = await res.json();
    const stats = {
      username: GITHUB_USERNAME,
      name: u.name || GITHUB_USERNAME,
      publicRepos: u.public_repos || 24,
      followers: u.followers || 18,
      avatar: u.avatar_url || 'https://github.com/Adithyan1809.png',
      profileUrl: `https://github.com/${GITHUB_USERNAME}`,
      bio: u.bio || 'Developer & builder'
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      username: GITHUB_USERNAME,
      publicRepos: 24,
      followers: 18,
      avatar: 'https://github.com/Adithyan1809.png',
      profileUrl: `https://github.com/${GITHUB_USERNAME}`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
