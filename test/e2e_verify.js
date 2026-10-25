// End-to-end test and validation for Adithyan's Full-Stack Biolink website
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(body); } catch (_) { parsed = body; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('🧪 Starting Full-Stack Production Verification Suite...\n');
  let passed = 0;
  let total = 0;
  let serverProcess = null;

  try {
    // Check if server is already running, else start it
    try {
      await request({ host: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    } catch (_) {
      serverProcess = spawn(process.execPath, ['server.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'ignore'
      });
      for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
          const h = await request({ host: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
          if (h.status === 200) break;
        } catch (_) {}
      }
    }

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

  // 1. Static HTML serving & SEO tags
  await test('GET / returns 200 and production SEO / PWA meta tags', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (typeof res.body !== 'string') throw new Error('Body is not HTML string');
    if (!res.body.includes('og:title')) throw new Error('Missing og:title');
    if (!res.body.includes('manifest.json')) throw new Error('Missing manifest link');
    if (!res.body.includes('guestbook-modal')) throw new Error('Missing guestbook-modal markup');
    if (!res.body.includes('footer-views-count')) throw new Error('Missing footer-views-count markup');
  });

  // 2. Security Headers
  await test('GET / contains security headers', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/', method: 'GET' });
    if (res.headers['x-content-type-options'] !== 'nosniff') throw new Error('Missing X-Content-Type-Options: nosniff');
    if (res.headers['x-frame-options'] !== 'SAMEORIGIN') throw new Error('Missing X-Frame-Options: SAMEORIGIN');
  });

  // 3. Static Assets serving
  await test('GET /script.js returns 200 and contains initFullStackSuite', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/script.js', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (!res.body.includes('initFullStackSuite')) throw new Error('script.js does not contain initFullStackSuite');
  });

  // 4. API Health Endpoint
  await test('GET /api/health returns 200 and status ok', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (res.body.status !== 'ok') throw new Error(`Unexpected status ${res.body.status}`);
    if (typeof res.body.uptime !== 'number') throw new Error('uptime missing');
  });

  // 5. API Views Counter POST & GET
  await test('POST /api/views increments analytics views', async () => {
    const getInitial = await request({ host: 'localhost', port: 3000, path: '/api/views', method: 'GET' });
    const prevViews = getInitial.body.views || 0;

    const postRes = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/views',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { page: '/' });

    if (postRes.status !== 200) throw new Error(`POST status was ${postRes.status}`);
    if (postRes.body.views !== prevViews + 1) throw new Error(`Views did not increment correctly. Prev: ${prevViews}, Now: ${postRes.body.views}`);
  });

  // 6. API Guestbook POST & Validation
  await test('POST /api/messages creates and sanitizes a new visitor note', async () => {
    const testMsg = {
      name: 'Vibe Checker <script>alert(1)</script>',
      contact: '@vibecheck',
      message: 'Clean code & full-stack architecture looks incredible! 🚀'
    };

    const res = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/messages',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testMsg);

    if (res.status !== 201) throw new Error(`Status was ${res.status}`);
    if (!res.body.item || res.body.item.message !== testMsg.message) throw new Error('Message not stored properly');
    if (res.body.item.name.includes('<script>')) throw new Error('XSS not sanitized');
  });

  // 7. API Guestbook GET
  await test('GET /api/messages returns message list with created entry', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/api/messages', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (!Array.isArray(res.body.messages) || res.body.messages.length === 0) throw new Error('Messages list empty');
    const latest = res.body.messages[0];
    if (!latest.name || !latest.message) throw new Error('Invalid message shape');
  });

  // 8. API Spotify Profile Proxy
  await test('GET /api/spotify/profile returns Spotify user data', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/api/spotify/profile', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (!res.body.item || !res.body.item.displayName) throw new Error('Invalid profile item');
  });

  // 9. API Spotify Recent Proxy
  await test('GET /api/spotify/recent returns recent tracks list', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/api/spotify/recent', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (!Array.isArray(res.body.items) || res.body.items.length === 0) throw new Error('No items returned in recent tracks');
  });

  // 10. API GitHub Stats Proxy
  await test('GET /api/github/stats returns repository/profile stats', async () => {
    const res = await request({ host: 'localhost', port: 3000, path: '/api/github/stats', method: 'GET' });
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (res.body.username !== 'Adithyan1809') throw new Error(`Expected username Adithyan1809, got ${res.body.username}`);
  });

  console.log(`\n==============================================`);
  console.log(`Verification Complete: ${passed} / ${total} tests passed.`);
  console.log(`==============================================\n`);

  if (serverProcess) {
    serverProcess.kill();
  }

  if (passed !== total) {
    process.exit(1);
  }
} finally {
  if (serverProcess) {
    try { serverProcess.kill(); } catch (_) {}
  }
}
}

runE2ETests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
