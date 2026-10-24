// Verification suite for Cloudflare Pages Functions
async function runCloudflareTests() {
  console.log('🧪 Verifying Cloudflare Pages Functions suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health
  await test('functions/api/health.js returns status ok', async () => {
    const mod = await import('../functions/api/health.js');
    const res = await mod.onRequestGet({ request: { cf: { colo: 'SIN' } } });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Expected ok, got ${data.status}`);
    if (data.platform !== 'Cloudflare Pages & Workers') throw new Error('Platform mismatch');
  });

  // 2. Spotify Profile
  await test('functions/api/spotify/profile.js returns profile object', async () => {
    const mod = await import('../functions/api/spotify/profile.js');
    const res = await mod.onRequestGet({ env: {} });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.displayName || !data.item) throw new Error('Missing profile properties');
  });

  // 3. Spotify Recent
  await test('functions/api/spotify/recent.js returns tracks list', async () => {
    const mod = await import('../functions/api/spotify/recent.js');
    const res = await mod.onRequestGet({ env: {} });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.items)) throw new Error('Missing items array');
  });

  // 4. GitHub Stats
  await test('functions/api/github/stats.js returns github data', async () => {
    const mod = await import('../functions/api/github/stats.js');
    const res = await mod.onRequestGet({ env: {} });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.username !== 'Adithyan1809') throw new Error(`Expected Adithyan1809, got ${data.username}`);
  });

  // 5. Views
  await test('functions/api/views.js increments view count', async () => {
    const mod = await import('../functions/api/views.js');
    const getRes = await mod.onRequest({ request: { method: 'GET' }, env: {} });
    const prev = (await getRes.json()).views;

    const postRes = await mod.onRequest({ request: { method: 'POST' }, env: {} });
    const curr = (await postRes.json()).views;
    if (curr !== prev + 1) throw new Error(`Views did not increment. Prev: ${prev}, Curr: ${curr}`);
  });

  // 6. Messages
  await test('functions/api/messages.js posts sanitized note', async () => {
    const mod = await import('../functions/api/messages.js');
    const postRes = await mod.onRequestPost({
      request: {
        json: async () => ({
          name: 'Cloudflare Tester <script>alert(1)</script>',
          contact: '@edge',
          message: 'Fast and global on Cloudflare!'
        })
      },
      env: {}
    });

    if (postRes.status !== 201) throw new Error(`Status ${postRes.status}`);
    const data = await postRes.json();
    if (data.item.name.includes('<script>')) throw new Error('XSS not sanitized');

    const getRes = await mod.onRequestGet({ env: {} });
    const list = await getRes.json();
    if (!list.messages || list.messages.length === 0) throw new Error('Message list empty');
  });

  console.log(`\n==============================================`);
  console.log(`Cloudflare Suite: ${passed} / ${total} tests passed.`);
  console.log(`==============================================\n`);

  if (passed !== total) process.exit(1);
}

runCloudflareTests().catch((err) => {
  console.error('Fatal error in Cloudflare test:', err);
  process.exit(1);
});
