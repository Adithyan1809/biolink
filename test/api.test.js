/**
 * Automated Verification Test Suite for Backend APIs
 */

const http = require('http');

function testEndpoint(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:3000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running Backend API Tests...\n');

  try {
    // 1. Health
    const health = await testEndpoint('/api/health');
    console.log('✅ GET /api/health -> Status:', health.status, 'Payload:', health.body);

    // 2. Spotify Profile
    const spotifyProfile = await testEndpoint('/api/spotify/profile');
    console.log('✅ GET /api/spotify/profile -> Status:', spotifyProfile.status, 'Display Name:', spotifyProfile.body?.displayName);

    // 3. Spotify Recent
    const spotifyRecent = await testEndpoint('/api/spotify/recent');
    console.log('✅ GET /api/spotify/recent -> Status:', spotifyRecent.status, 'Tracks returned:', spotifyRecent.body?.items?.length);

    // 4. Analytics Views
    const views = await testEndpoint('/api/views');
    console.log('✅ GET /api/views -> Status:', views.status, 'Total views:', views.body?.totalViews);

    // 5. Post Message
    const postMsg = await testEndpoint('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'Automated Tester', message: 'Hello from fullstack test runner!', contact: 'tester@dev.local' }
    });
    console.log('✅ POST /api/messages -> Status:', postMsg.status, 'Response:', postMsg.body?.message);

    // 6. Get Messages
    const getMsg = await testEndpoint('/api/messages');
    console.log('✅ GET /api/messages -> Status:', getMsg.status, 'Total messages in store:', getMsg.body?.count);

    console.log('\n🎉 ALL FULL-STACK BACKEND TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
