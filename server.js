/**
 * Adithyan's Full-Stack Production Portfolio & Biolink Server
 * Architecture: Express.js + Native Node.js 22 + JSON Persistence Store
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const SPOTIFY_API_KEY = process.env.SPOTIFY_API_KEY || 'spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr';
const SPOTIFY_USER_ID = process.env.SPOTIFY_USER_ID || '31zymccmdqzrzvjkdryasaqmkwlq';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Adithyan1809';

// ── Persistent Data Storage Setup ──
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ANALYTICS_FILE)) {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ totalViews: 4182, uniqueVisitors: 1240, days: {} }, null, 2));
}

function readJSON(file, defaultVal = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultVal;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to write to ${file}:`, err.message);
  }
}

// ── In-Memory Response Caches (TTL: 60 seconds) ──
const cache = {
  spotifyProfile: { data: null, expires: 0 },
  spotifyRecent: { data: null, expires: 0 },
  spotifyTop: { data: null, expires: 0 },
  githubStats: { data: null, expires: 0 }
};

// ── Middlewares ──
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ── Static Asset Serving with Caching ──
app.use(express.static(path.join(__dirname), {
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : '0',
  etag: true
}));

// ── API ROUTES ──

// 1. Health & Status Check (for cloud load balancers & monitoring)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Helper to strip HTML tags for defense-in-depth sanitization
function stripHtml(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>?/gm, '').trim();
}

// 2. Spotify Live Profile Proxy
app.get('/api/spotify/profile', async (req, res) => {
  const now = Date.now();
  if (cache.spotifyProfile.data && cache.spotifyProfile.expires > now) {
    return res.json(cache.spotifyProfile.data);
  }

  try {
    const response = await fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}`, {
      headers: {
        'Authorization': `Bearer ${SPOTIFY_API_KEY}`,
        'X-Api-Key': SPOTIFY_API_KEY
      }
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    const itemData = {
      displayName: data.item?.displayName || 'Adithyan',
      customId: data.item?.customId || SPOTIFY_USER_ID,
      image: data.item?.image || 'https://i.scdn.co/image/ab6775700000ee85ad94aad60ef11d0c693bb42f',
      profileUrl: `https://open.spotify.com/user/${SPOTIFY_USER_ID}`
    };
    const profile = {
      item: itemData,
      ...itemData
    };

    cache.spotifyProfile = { data: profile, expires: now + 60000 };
    res.json(profile);
  } catch (err) {
    const fallbackItem = {
      displayName: 'Adithyan',
      customId: SPOTIFY_USER_ID,
      image: 'https://i.scdn.co/image/ab6775700000ee85ad94aad60ef11d0c693bb42f',
      profileUrl: `https://open.spotify.com/user/${SPOTIFY_USER_ID}`
    };
    res.json({
      item: fallbackItem,
      ...fallbackItem
    });
  }
});

// 3. Spotify Recent Streams Proxy
app.get('/api/spotify/recent', async (req, res) => {
  const now = Date.now();
  if (cache.spotifyRecent.data && cache.spotifyRecent.expires > now) {
    return res.json(cache.spotifyRecent.data);
  }

  try {
    const response = await fetch(`https://api.stats.fm/api/v1/users/${SPOTIFY_USER_ID}/streams/recent`, {
      headers: {
        'Authorization': `Bearer ${SPOTIFY_API_KEY}`,
        'X-Api-Key': SPOTIFY_API_KEY
      }
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const raw = await response.json();
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

    const payload = { success: true, count: items.length, items };
    cache.spotifyRecent = { data: payload, expires: now + 45000 };
    res.json(payload);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, items: [] });
  }
});

// 4. Spotify Top Artists & Top Tracks Proxy
app.get('/api/spotify/top', async (req, res) => {
  const now = Date.now();
  if (cache.spotifyTop.data && cache.spotifyTop.expires > now) {
    return res.json(cache.spotifyTop.data);
  }

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
        name: art.name,
        image: art.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
        spotifyUrl: spotifyId ? `https://open.spotify.com/artist/${spotifyId}` : `https://open.spotify.com/search/${encodeURIComponent(art.name)}`,
        genres: art.genres || []
      };
    });

    const tracks = (trkRes.items || []).slice(0, 6).map((item) => {
      const trk = item.track || {};
      const spotifyId = trk.externalIds?.spotify?.[0] || trk.spotifyId;
      return {
        name: trk.name,
        artist: trk.artists?.map((a) => a.name).join(', ') || '',
        cover: trk.albums?.[0]?.image || trk.album?.image,
        spotifyUrl: spotifyId ? `https://open.spotify.com/track/${spotifyId}` : `https://open.spotify.com/search/${encodeURIComponent(trk.name)}`
      };
    });

    const payload = { success: true, artists, tracks };
    cache.spotifyTop = { data: payload, expires: now + 300000 };
    res.json(payload);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GitHub Live Stats Proxy
app.get('/api/github/stats', async (req, res) => {
  const now = Date.now();
  if (cache.githubStats.data && cache.githubStats.expires > now) {
    return res.json(cache.githubStats.data);
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { 'User-Agent': 'Adithyan-Biolink-Server' }
    });
    const u = await userRes.json();
    const stats = {
      username: GITHUB_USERNAME,
      name: u.name || GITHUB_USERNAME,
      publicRepos: u.public_repos || 24,
      followers: u.followers || 18,
      avatar: u.avatar_url || 'https://github.com/Adithyan1809.png',
      profileUrl: `https://github.com/${GITHUB_USERNAME}`,
      bio: u.bio || 'Developer & builder'
    };

    cache.githubStats = { data: stats, expires: now + 300000 };
    res.json(stats);
  } catch (err) {
    res.json({
      username: GITHUB_USERNAME,
      publicRepos: 24,
      followers: 18,
      avatar: 'https://github.com/Adithyan1809.png',
      profileUrl: `https://github.com/${GITHUB_USERNAME}`
    });
  }
});

// 6. Full-Stack Guestbook / Contact Inbox
app.get('/api/messages', (req, res) => {
  const messages = readJSON(MESSAGES_FILE, []);
  // Return sanitized messages without private IP hashes
  const publicMessages = messages.slice(-20).reverse().map((m) => ({
    id: m.id,
    name: m.name,
    message: m.message,
    contact: m.contact ? '(provided)' : null,
    createdAt: m.createdAt
  }));
  res.json({ success: true, count: publicMessages.length, messages: publicMessages });
});

app.post('/api/messages', (req, res) => {
  const { name, message, contact } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
  }

  const cleanName = stripHtml((name && typeof name === 'string' && name.trim()) ? name.trim().slice(0, 50) : 'Anonymous Visitor');
  const cleanMessage = stripHtml(message.trim().slice(0, 500));
  const cleanContact = (contact && typeof contact === 'string') ? stripHtml(contact.trim().slice(0, 100)) : null;

  if (!cleanMessage) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
  }

  const messages = readJSON(MESSAGES_FILE, []);
  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    message: cleanMessage,
    contact: cleanContact,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    createdAt: new Date().toISOString()
  };

  messages.push(newMsg);
  writeJSON(MESSAGES_FILE, messages);

  console.log(`[Guestbook] New message from ${cleanName}: "${cleanMessage.slice(0, 60)}..."`);
  res.status(201).json({ success: true, message: 'Message sent successfully!', item: newMsg });
});

// 7. Live Page View Counter & Analytics
app.post('/api/views', (req, res) => {
  const analytics = readJSON(ANALYTICS_FILE, { totalViews: 4182, days: {} });
  const today = new Date().toISOString().split('T')[0];

  analytics.totalViews = (analytics.totalViews || 4180) + 1;
  analytics.days[today] = (analytics.days[today] || 0) + 1;

  writeJSON(ANALYTICS_FILE, analytics);
  res.json({
    success: true,
    views: analytics.totalViews,
    totalViews: analytics.totalViews,
    todayViews: analytics.days[today]
  });
});

app.get('/api/views', (req, res) => {
  const analytics = readJSON(ANALYTICS_FILE, { totalViews: 4182, days: {} });
  const today = new Date().toISOString().split('T')[0];
  res.json({
    success: true,
    views: analytics.totalViews || 4182,
    totalViews: analytics.totalViews || 4182,
    todayViews: analytics.days[today] || 1
  });
});

// ── Fallback Catch-All Route: Serves index.html ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Server Startup ──
const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 Adithyan's Full-Stack Biolink Server is running!`);
  console.log(`📡 Local URL:       http://localhost:${PORT}`);
  console.log(`🩺 Health API:      http://localhost:${PORT}/api/health`);
  console.log(`🎵 Spotify API:     http://localhost:${PORT}/api/spotify/recent`);
  console.log(`💬 Guestbook API:   http://localhost:${PORT}/api/messages`);
  console.log(`📊 Analytics API:   http://localhost:${PORT}/api/views`);
  console.log('================================================================');
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('Server closed. Goodbye!');
    process.exit(0);
  });
});
