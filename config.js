/**
 * =========================================================================
 *                    BIOLINK CONFIGURATION FILE
 * =========================================================================
 * Pattern: haunt.gg/rachel (Modular floating cards)
 * Theme: Cyber / Red Bull F1 / Drift Phonk / Smoky Tendril Cursor
 */

const CONFIG = {
  // ── Profile Information ──
  profile: {
    name: "Adithyan",                      // Display name matching haunt.gg reference image
    handle: "adithyan1809",                    // Username handle
    avatar: "assets/ghostly_avatar.png",  // Night city skyline window view from reference image
    banner: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80",
    bio: "developer & drift enthusiast 🏎️",
    quoteText: "hi im cool af.",
    typewriterTexts: [
      "hi im cool af.",
      "developer & drift enthusiast 🏎️",
      "building cool stuff online ⚡",
      "shipping code from bengaluru",
      "crafting digital experiences • adithyanp.me",
      "late night commits & 808 beats 🔊",
      "obsessed with clean code & aesthetics"
    ],
    location: "Bengaluru, India",
    timezone: "Asia/Kolkata",             // Real-time clock (e.g. "Europe/London", "Asia/Tokyo", "America/New_York")
    joinYear: "2024",
    viewsCount: 4210,                     // Starting view count
    badges: [
      { id: "racing", name: "F1 Fanatic", icon: "🏎️", color: "#e10600", tooltip: "Red Bull Racing Crew" },
      { id: "verified", name: "Verified", icon: "✓", color: "#38bdf8", tooltip: "Verified Profile" },
      { id: "dev", name: "Developer", icon: "⚡", color: "#eab308", tooltip: "Code Contributor" },
      { id: "premium", name: "Premium", icon: "💎", color: "#f27db3", tooltip: "Subscriber" }
    ]
  },

  // ── Video Background (F1 / Red Bull Racing) ──
  videoBackground: {
    enabled: true,                        // Video enabled in the background
    videoUrl: "assets/f1_video.mp4",      // 1080p Full HD Red Bull F1 Racing Video (H.264 FastStart)
    fallbackUrl: "assets/f1_video.mp4",
    posterImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&auto=format&fit=crop&q=80",
    
    // ── Video Controls ──
    playbackSpeed: 1.0,                   // Original full speed!
    loop: true,                           // Plays continuously on seamless infinite loop
    blur: "3px",                          // Subtle depth-of-field blur: pushes video to background so widgets pop!
    brightness: 0.68,                     // Balanced brightness to maintain high text contrast
    overlayDarkness: 0.55                 // Deep radial vignette focusing user attention on your content
  },

  // ── Visual Effects ──
  effects: {
    cursorEffect: false
  },

  // ── Styling & Layouts ──
  theme: {
    defaultBgMode: "cinematic",                  // "cinematic" (F1 video loop) or "ambient" (aurora liquid mesh)
    fontHeading: "'Syne', sans-serif",           // Aggressive modern display font
    fontBody: "'Space Grotesk', sans-serif",     // Futuristic tech font
    accentColor: "#e10600",                      // Crimson accent
    accentGlow: "rgba(225, 6, 0, 0.45)",
    cardBackground: "rgba(10, 12, 20, 0.80)",
    cardBorder: "rgba(255, 255, 255, 0.09)",
    cardHoverBorder: "rgba(225, 6, 0, 0.5)",
    
    // Gate / Enter Screen
    enterScreen: {
      enabled: true,                      // Reliable auto-run on user's first tap
      text: "click to enter",
      subtext: "heavy 808 phonk auto-running • F1 background",
      icon: "lock_open"
    }
  },

  // ── Background Audio: PHONK (Heavy 808s & Cowbells) ──
  music: {
    enabled: true,
    autoplayOnEnter: true,                // Starts grooving immediately upon opening / clicking enter
    title: "EXECUTIONER",
    genre: "Drift Phonk",
    artist: "Phonk Drift",
    audioUrl: "assets/phonk_song.mp3",
    fallbackAudioUrl: "https://archive.org/download/executioner_202411/EXECUTIONER.mp3",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
    initialVolume: 0.40,
    recentTracks: [
      { title: "BRAZILIAN DRIFT (808s)", time: "1 hour ago", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&q=80" },
      { title: "TOKYO SHUTOKO NIGHT", time: "3 hours ago", cover: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&q=80" },
      { title: "MIDNIGHT RUSH", time: "5 hours ago", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80" }
    ]
  },

  // ── Steam Profile Card (Matching Image 2) ──
  steam: {
    enabled: true,
    username: "Alex",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    level: 24,
    gamesCount: 82,
    hoursPlayed: "1,420h",
    memberSince: "2024",
    profileUrl: "https://steamcommunity.com"
  },

  // ── Discord Live Integration ──
  discord: {
    enabled: true,
    userId: null,
    fallback: {
      username: "adithyan1809",
      status: "online",
      role: "Developer",
      activityName: "Visual Studio Code",
      activityDetails: "shipping code from bengaluru",
      activityState: "vibing"
    }
  },

  // ── Social Links ──
  socials: [
    { platform: "discord", label: "Discord", url: "https://discord.com", icon: "discord" },
    { platform: "github", label: "GitHub", url: "https://github.com", icon: "github" },
    { platform: "spotify", label: "Spotify", url: "https://open.spotify.com/user/31zymccmdqzrzvjkdryasaqmkwlq", icon: "spotify" },
    { platform: "steam", label: "Steam", url: "https://steamcommunity.com", icon: "steam" },
    { platform: "x", label: "X / Twitter", url: "https://x.com", icon: "x" },
    { platform: "tiktok", label: "TikTok", url: "https://tiktok.com", icon: "tiktok" },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com", icon: "youtube" }
  ],

  // ── Skills / Tech Tags ──
  skills: [
    { name: "Python", icon: "🐍" },
    { name: "Go", icon: "🐹" },
    { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "📘" },
    { name: "Linux", icon: "🐧" },
    { name: "Git", icon: "📦" },
    { name: "Telemetry Analysis", icon: "📊" },
    { name: "Reverse Eng", icon: "⚡" }
  ],

  // ── Projects Showcase ──
  projects: [
    {
      title: "F1 Telemetry Visualizer",
      description: "Real-time throttle, brake, RPM, and speed delta comparison across Grand Prix laps.",
      tags: ["Python", "FastF1", "DataViz"],
      url: "https://github.com/placeholder/f1-telemetry",
      icon: "terminal"
    },
    {
      title: "Security Suite",
      description: "Single-file offensive security toolkit and vulnerability scanner with custom payload tests.",
      tags: ["Python", "Security", "CLI"],
      url: "https://github.com/placeholder/security-suite",
      icon: "shield"
    },
    {
      title: "Latency Proxy",
      description: "High-performance SOCKS5/HTTP tunnel simulating network latency and geographical hops.",
      tags: ["Go", "Networking", "SOCKS5"],
      url: "https://github.com/placeholder/latency-proxy",
      icon: "server"
    },
    {
      title: "Pitstop Strategy Simulator",
      description: "Monte Carlo race tire degradation model predicting optimum undercut/overcut windows.",
      tags: ["Python", "Simulation", "Stats"],
      url: "https://github.com/placeholder/pitstop-sim",
      icon: "alert"
    }
  ],

  // ── Layout 3: The Ultra Gen-Z Bento Moodboard Data (Multi-faceted Life) ──
  layout3Data: {
    // ── Simple Centered Hero (Matching User Reference Image haunt.gg/ghostly) ──
    simpleHero: {
      avatar: "assets/ghostly_avatar.png",
      name: "Adithyan",
      verified: true,
      bioText: "developer & drift enthusiast 🏎️",
      typewriterTexts: [
        "hi im cool af.",
        "developer & drift enthusiast 🏎️",
        "building cool stuff online ⚡",
        "shipping code from bengaluru",
        "crafting digital experiences • adithyanp.me",
        "late night commits & 808 beats 🔊",
        "obsessed with clean code & aesthetics"
      ],
      socials: [
        { platform: "github", url: "https://github.com/Adithyan1809", label: "GitHub" },
        { platform: "instagram", url: "https://instagram.com/adithyan_1895", label: "Instagram" },
        { platform: "x", url: "https://x.com/Adithyan1895", label: "X" },
        { platform: "discord", url: "https://discord.com/users/adithyan1809", label: "Discord" },
        { platform: "spotify", url: "https://open.spotify.com/user/31zymccmdqzrzvjkdryasaqmkwlq", label: "Spotify" },
        { platform: "web", url: "https://adithyanp.me", label: "Website" },
        { platform: "email", url: "mailto:adithyan18092005@gmail.com", label: "Email" }
      ]
    },

    // ── About Me Live Widgets (Exact Match to User Reference Screenshot) ──
    aboutMe: {
      title: "About me",
      greeting: "Hi. I am cool asf.",
      
      // Spotify Live Widget (Synced with Adithyan's Real Spotify Data)
      spotify: {
        apiKey: "spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr",
        userId: "31zymccmdqzrzvjkdryasaqmkwlq",
        username: "Adithyan",
        avatar: "https://i.scdn.co/image/ab6775700000ee85ad94aad60ef11d0c693bb42f",
        profileUrl: "https://open.spotify.com/user/31zymccmdqzrzvjkdryasaqmkwlq",
        streamsCount: "1,895 streams",
        moodStatus: "vibin' to phonk",
        recentTracks: [
          {
            title: "Bad Habit",
            artist: "Steve Lacy",
            time: "recent stream",
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/2a/cb/e3/2acbe3f1-7a65-e2c1-8f12-ba04c6ee05dc/196589099631.jpg/768x768bb.jpg",
            url: "https://open.spotify.com/track/4k6Uh1HXdhtusDW5y8Gbvy"
          },
          {
            title: "Where'd All the Time Go?",
            artist: "Dr. Dog",
            time: "recent stream",
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f5/9d/99/f59d994f-c48e-aba4-4347-fe934d46d4fe/0045778705450.png/768x768bb.jpg",
            url: "https://open.spotify.com/track/0UV5zxRMz6AO4Zw9ZNIKIu"
          },
          {
            title: "Snooze",
            artist: "SZA",
            time: "recent stream",
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/768x768bb.jpg",
            url: "https://open.spotify.com/track/4iZ4mst790ZCrSV4YAVvBP"
          },
          {
            title: "Shut up My Moms Calling",
            artist: "Hotel Ugly",
            time: "recent stream",
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/63/11/1b/63111b50-00ce-2734-e09f-94fb791c9dee/0d6bb465-1f3e-457c-99e5-a786f63c3fbb.jpg/768x768bb.jpg",
            url: "https://open.spotify.com/track/4lJcQ6L79nQyE8K9kR7w8x"
          }
        ]
      },

      // Discord Widget
      discord: {
        username: "adithyan1809",
        avatar: "assets/discord_avatar.svg",
        statusText: "shipping code & vibing",
        userId: null // Enter your 18-19 digit Discord User ID here to sync live Discord photo & presence 24/7
      },

      // Timezone Clock Widget
      clock: {
        timezone: "Asia/Kolkata", // UTC+5:30
        timezoneLabel: "UTC+5:30 (Bengaluru)",
        dateString: "Saturday, October 24",
        linkUrl: "https://time.is/Bengaluru"
      }
    },

    moodPill: "🌙 midnight flow state • coding & 808s",
    
    // Interactive Polaroid Gallery (Draggable Photo Deck with Lightbox)
    polaroids: [
      {
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=85",
        caption: "late night coding session • 3:42 AM",
        tag: "WORKSPACE",
        date: "'26 10 24",
        exif: "35mm • ISO 400 • f/1.8"
      },
      {
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=85",
        caption: "shibuya neon reflections in rain",
        tag: "STREET PHOTOGRAPHY",
        date: "'26 09 18",
        exif: "28mm • ISO 800 • f/2.0"
      },
      {
        url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1000&auto=format&fit=crop&q=85",
        caption: "iced oat matcha latte obsession",
        tag: "DAILY FUEL",
        date: "'26 10 12",
        exif: "50mm • ISO 200 • f/2.8"
      },
      {
        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=85",
        caption: "custom lubed 60HE build with tape mod",
        tag: "KEYBOARDS",
        date: "'26 08 30",
        exif: "35mm • ISO 250 • f/1.8"
      },
      {
        url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=85",
        caption: "weekend track day apex hunt 🏎️",
        tag: "MOTORSPORT",
        date: "'26 10 05",
        exif: "85mm • ISO 160 • f/2.2"
      }
    ],

    // Life Matrix (What I'm currently into)
    matrix: [
      { category: "MUSIC", icon: "🎧", value: "Drift Phonk, Hyperpop, Ambient" },
      { category: "GAMING", icon: "🎮", value: "Valorant (Ascendant) • CS2 • Assetto" },
      { category: "STACK", icon: "💻", value: "TypeScript • Python • Three.js • Neovim" },
      { category: "FUEL", icon: "🍵", value: "Matcha Latte & Midnight Espresso" },
      { category: "READING", icon: "📖", value: "Cyberpunk: Edgerunners & Initial D" }
    ],



    // GitHub Live Stats (Synced with Adithyan1809)
    githubStats: {
      username: "Adithyan1809",
      totalCommits: "303 contributions",
      currentStreak: "active contributor",
      topLang: "Python & TypeScript"
    },


    // ── Weather Widget (Matching User Reference Image) ──
    weather: {
      enabled: true,
      city: "Bengaluru, India",
      temp: "24°C",
      condition: "Pleasant & Breezy",
      icon: "sun"
    },

    // ── Favourite Tracks & Artists (Synced with Adithyan's Real Stats.fm Data) ──
    favouriteMusic: [
      {
        name: "The Weeknd",
        image: "https://i.scdn.co/image/ab6761610000e5ebc1719ac9e6a75c1c25835018",
        url: "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ",
        genre: "R&B / Soul • #1 Artist"
      },
      {
        name: "SZA",
        image: "https://i.scdn.co/image/ab6761610000e5ebfd0a9fb6c252a3ba44079acf",
        url: "https://open.spotify.com/artist/7tYKF4w9nC0nq9CsPZTHte",
        genre: "R&B / Soul"
      },
      {
        name: "Seedhe Maut",
        image: "https://i.scdn.co/image/ab6761610000e5ebdbfd70ecee8d42dfd5fbb29d",
        url: "https://open.spotify.com/artist/2oBG74gAocPMFv6Ij9ykcG",
        genre: "Desi Hip-Hop"
      },
      {
        name: "Gesaffelstein",
        image: "https://i.scdn.co/image/ab6761610000e5ebd1b0c16bf77cfe30c09b4951",
        url: "https://open.spotify.com/artist/3K2ISj5Tz5J7Nu5J9vO7eX",
        genre: "Dark Synth / Electronic"
      },
      {
        name: "All The Stars",
        image: "https://i.scdn.co/image/ab67616d0000b27310c123786c0a258b75c44941",
        url: "https://open.spotify.com/track/5RTVMR0OXWejMsK86IfR2l",
        genre: "Kendrick Lamar & SZA"
      },
      {
        name: "The Hills",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/93/4e/0a/934e0a15-e6f3-5e26-6593-93ecf65a82cf/15UMGIM58633.rgb.jpg/768x768bb.jpg",
        url: "https://open.spotify.com/track/2HNcNd5RPZ7DSRNbIl6JsP",
        genre: "The Weeknd"
      },
      {
        name: "I Was Never There",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2a/aa/b4/2aaab42a-a4cb-a600-4a25-d78961495960/18UMGIM17204.rgb.jpg/768x768bb.jpg",
        url: "https://open.spotify.com/track/1cKHdTo9u0ZymJdPGSh6nq",
        genre: "The Weeknd & Gesaffelstein"
      },
      {
        name: "Parda Hata Do",
        image: "https://i.scdn.co/image/ab6742d3000053b7f85e5cd1de901e87ab94b13f",
        url: "https://open.spotify.com/track/46FuCEUCtUXVnTbBl4XCyZ",
        genre: "Trap Mix • Asha Bhosle & Rafi"
      }
    ],

    // ── Spotify Full Integration & Music Hub ──
    spotify: {
      enabled: true,
      apiKey: "spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr",
      userId: "31zymccmdqzrzvjkdryasaqmkwlq",
      discordUserId: null,
      profileUrl: "https://open.spotify.com/user/31zymccmdqzrzvjkdryasaqmkwlq",
      rankBadge: "TOP 0.01% LISTENER",

      // Featured Favorite Song (On Repeat)
      favoriteSong: {
        title: "Live Another Day",
        artist: "Kordhell",
        album: "A Million Ways to Murder",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
        duration: "2:14",
        durationSec: 134,
        streams: "482M streams",
        audioPreview: "assets/phonk_song.mp3",
        spotifyUrl: "https://open.spotify.com"
      },

      // Artists I Listen To (Top Rotation)
      artists: [
        {
          name: "Kordhell",
          genre: "Drift Phonk",
          listeners: "8.4M monthly",
          avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          name: "DVRST",
          genre: "Wave Phonk",
          listeners: "6.9M monthly",
          avatar: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          name: "Hensonn",
          genre: "Dark Phonk",
          listeners: "5.1M monthly",
          avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          name: "Playaphonk",
          genre: "Memphis Phonk",
          listeners: "4.3M monthly",
          avatar: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          name: "INTERWORLD",
          genre: "Rapture Phonk",
          listeners: "5.8M monthly",
          avatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        }
      ],

      // Top Tracks / Heavy Rotation
      topTracks: [
        {
          rank: "01",
          title: "Live Another Day",
          artist: "Kordhell",
          streams: "482M",
          cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          rank: "02",
          title: "Close Eyes",
          artist: "DVRST",
          streams: "394M",
          cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          rank: "03",
          title: "Sahara",
          artist: "Hensonn",
          streams: "312M",
          cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          rank: "04",
          title: "Metamorphosis",
          artist: "INTERWORLD",
          streams: "445M",
          cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        },
        {
          rank: "05",
          title: "Murder In My Mind",
          artist: "KORDHELL",
          streams: "520M",
          cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80",
          url: "https://open.spotify.com"
        }
      ]
    },

    // ── Step Scrolling System (6 Discrete Steps) ──
    stepScrolling: {
      enabled: true,
      throttleMs: 650,
      steps: [
        { id: "l3-step-1", name: "Profile" },
        { id: "l3-step-2", name: "About Me" },
        { id: "l3-step-3", name: "Favourite Tracks" },
        { id: "l3-step-4", name: "Visual Journal" },
        { id: "l3-step-5", name: "Currently In My Life" },
        { id: "l3-step-6", name: "GitHub & Footer" }
      ]
    }
  }
};

// Expose globally
window.CONFIG = CONFIG;
