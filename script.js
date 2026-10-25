/**
 * ==========================================================================
 *                    BIOLINK CORE JAVASCRIPT
 *    - Smoky Tendril Ribbon Cursor Trail (Matching User Reference Image)
 *    - Red Bull F1 Background Video Controller
 *    - Syne & Space Grotesk Typographic System
 *    - Phonk Auto-Run Engine & Open Modular Grid
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.CONFIG || {};

  // ── Apply Accent Colors & CSS Variables ──
  if (cfg.theme) {
    const root = document.documentElement;
    if (cfg.theme.accentColor) {
      root.style.setProperty("--accent-color", cfg.theme.accentColor);
      root.style.setProperty("--accent-glow", cfg.theme.accentGlow || `${cfg.theme.accentColor}55`);
    }
  }

  // ── 1. Video Background Controller (F1 / Red Bull) ──
  initVideoBackground(cfg.videoBackground);

  // ── 2. Populate Profile Information ──
  populateProfile(cfg.profile);

  // ── 3. Populate Social Links ──
  populateSocials(cfg.socials);

  // ── 4. Populate Steam Card ──
  populateSteam(cfg.steam);

  // ── 5. Populate Skills & Projects ──
  populateSkills(cfg.skills);
  populateProjects(cfg.projects);


  // ── 7. Setup Phonk Audio Player & Auto-Run ──
  initAudioAndGate(cfg.music, cfg.theme?.enterScreen);

  // ── 8. Setup Live Clock ──
  initLiveClock(cfg.profile?.timezone);

  // ── 9. Setup Typewriter Effect (in Quote Banner) ──
  initTypewriter(cfg.profile?.typewriterTexts || [cfg.profile?.quoteText]);

  // ── 10. Setup Discord Live Activity (Lanyard API) ──
  if (cfg.discord?.enabled) {
    initDiscordActivity(cfg.discord);
  }

  // ── 11. Setup Tooltip System ──
  initTooltips();

  // ── 12. Populate Layout 3: Gen-Z Bento Moodboard ──
  populateLayout3(cfg);

  // ── 13. Setup Background Mode Switcher (Cinematic vs Ambient) ──
  initBackgroundModeSwitcher();

  // ── 14. Setup Production Full-Stack Suite (Analytics, Live Health, Guestbook) ──
  initFullStackSuite();
});

/* --------------------------------------------------------------------------
   1. Video Background Controller (F1 / Red Bull Racing)
-------------------------------------------------------------------------- */
function initVideoBackground(vCfg = {}) {
  const video = document.getElementById("bg-video");
  const container = document.getElementById("video-bg-container");
  if (!container || !video) return;

  if (vCfg.enabled === false) {
    container.style.display = "none";
    return;
  }

  if (vCfg.posterImage && !video.poster) {
    video.poster = vCfg.posterImage;
  }

  // Apply video speed & atmospheric tuning from config
  const targetSpeed = vCfg.playbackSpeed !== undefined ? vCfg.playbackSpeed : 1.0;
  if (vCfg.blur) {
    document.documentElement.style.setProperty("--video-blur", vCfg.blur);
  }
  if (vCfg.brightness !== undefined) {
    document.documentElement.style.setProperty("--video-brightness", vCfg.brightness);
  }

  // Ensure attributes for silent autoplay and seamless infinite looping
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("loop", "");

  const applySpeed = () => {
    try {
      video.playbackRate = targetSpeed;
    } catch (_) {}
  };

  const safePlay = () => {
    applySpeed();
    if (video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => applySpeed()).catch(() => {});
      }
    }
  };

  safePlay();
  video.addEventListener("loadeddata", safePlay, { once: true });
  video.addEventListener("canplay", safePlay, { once: true });
  video.addEventListener("play", applySpeed);

  // Fallback if local source has any issue
  video.addEventListener("error", () => {
    if (vCfg.fallbackUrl && video.src !== vCfg.fallbackUrl) {
      video.src = vCfg.fallbackUrl;
      video.load();
      safePlay();
    }
  });

  // Seamless continuous loop enforcement: if browser loop stalls or reaches end, rewind and replay instantly
  video.addEventListener("ended", () => {
    video.currentTime = 0;
    safePlay();
  });
  video.addEventListener("timeupdate", () => {
    // Keep 1.0x original speed enforced
    if (Math.abs(video.playbackRate - targetSpeed) > 0.05) {
      video.playbackRate = targetSpeed;
    }
    // Seamless buffer loop before end
    if (video.duration && video.currentTime >= video.duration - 0.15) {
      video.currentTime = 0;
      safePlay();
    }
  });

  // Fallback play trigger on any user interaction
  const triggers = ["click", "touchstart", "keydown", "scroll"];
  const onUserWake = () => {
    safePlay();
    triggers.forEach((t) => window.removeEventListener(t, onUserWake));
  };
  triggers.forEach((t) => window.addEventListener(t, onUserWake, { passive: true }));

  // Cinema / Ambient Focus Mode Toggle
  const cinemaBtn = document.getElementById("cinema-toggle-pill");
  const cinemaText = document.getElementById("cinema-toggle-text");
  if (cinemaBtn) {
    cinemaBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const current = document.body.dataset.cinema === "true";
      if (current) {
        document.body.dataset.cinema = "false";
        video.playbackRate = targetSpeed;
        if (cinemaText) cinemaText.textContent = "ambient bg";
      } else {
        document.body.dataset.cinema = "true";
        video.playbackRate = 1.0;
        if (cinemaText) cinemaText.textContent = "cinema mode";
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Populate Basic Profile Info
-------------------------------------------------------------------------- */
function populateProfile(prof = {}) {
  const displayName = document.getElementById("display-name");
  const handleText = document.getElementById("handle-text");
  const avatarImg = document.getElementById("profile-avatar");
  const bioPara = document.getElementById("bio-paragraph");
  const locationSpan = document.getElementById("profile-location");
  const viewsSpan = document.getElementById("views-count");
  const badgesRow = document.getElementById("badges-row");
  const footerJoined = document.getElementById("footer-joined");
  const currentYear = document.getElementById("current-year");

  if (displayName) displayName.textContent = prof.name || "Alex";
  if (handleText) handleText.textContent = `@${prof.handle || "alex"}`;
  if (avatarImg && prof.avatar) avatarImg.src = prof.avatar;
  if (bioPara) bioPara.textContent = prof.bio || "";
  if (locationSpan) locationSpan.textContent = prof.location || "Silverstone";
  if (footerJoined) footerJoined.textContent = `member since ${prof.joinYear || "2024"}`;
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  // Views counter
  let views = parseInt(localStorage.getItem("biolink_views") || prof.viewsCount || 4210, 10);
  views += 1;
  localStorage.setItem("biolink_views", views);
  if (viewsSpan) viewsSpan.textContent = views.toLocaleString();

  // Badges
  if (badgesRow && Array.isArray(prof.badges)) {
    badgesRow.innerHTML = "";
    prof.badges.forEach((b) => {
      const chip = document.createElement("span");
      chip.className = "badge-chip";
      chip.textContent = b.icon || "✦";
      chip.dataset.tooltip = `${b.name} • ${b.tooltip || ""}`;
      if (b.color) {
        chip.style.color = b.color;
        chip.style.borderColor = `${b.color}45`;
      }
      badgesRow.appendChild(chip);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Social Icons
-------------------------------------------------------------------------- */
const SVG_ICONS = {
  discord: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>',
  github: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>',
  spotify: '<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>',
  steam: '<path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm-3.613 17.525c0-.612.339-1.148.84-1.434l2.428 1.004c-.066.216-.104.444-.104.68 0 1.353 1.097 2.451 2.45 2.451.272 0 .531-.047.771-.13l-1.029 2.484c-.426.111-.876.173-1.342.173-2.218 0-4.014-1.796-4.014-4.228zm7.573-6.614c-1.395 0-2.529-1.134-2.529-2.529s1.134-2.529 2.529-2.529c1.396 0 2.531 1.134 2.531 2.529s-1.135 2.529-2.531 2.529z"/>',
  x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01V15.5c0 1.65-.43 3.32-1.36 4.67-1.38 1.94-3.71 3.12-6.11 3.12-2.3 0-4.52-1.12-5.88-2.97-1.36-1.85-1.63-4.32-.73-6.43.9-2.11 2.87-3.64 5.16-4.03.62-.1 1.25-.13 1.88-.07v4.04c-.33-.06-.67-.06-1-.02-.92.1-1.78.61-2.28 1.39-.5.78-.6 1.78-.26 2.66.34.88 1.12 1.52 2.06 1.7 1.25.24 2.57-.3 3.25-1.36.37-.58.55-1.28.55-1.98V.02h-.36z"/>',
  youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
};

function populateSocials(socials = []) {
  const container = document.getElementById("socials-row");
  if (!container) return;
  container.innerHTML = "";

  socials.forEach((s) => {
    const a = document.createElement("a");
    a.href = s.url || "#";
    a.className = "social-btn";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.dataset.tooltip = s.label || s.platform;
    a.setAttribute("aria-label", s.label || s.platform);

    const iconKey = (s.icon || s.platform || "").toLowerCase();
    const svgPath = SVG_ICONS[iconKey] || SVG_ICONS["github"];
    a.innerHTML = `<svg viewBox="0 0 24 24">${svgPath}</svg>`;
    container.appendChild(a);
  });
}

/* --------------------------------------------------------------------------
   3. Populate Steam Profile Card
-------------------------------------------------------------------------- */
function populateSteam(steamCfg = {}) {
  if (!steamCfg.enabled) return;
  const usernameEl = document.getElementById("steam-username");
  const avatarEl = document.getElementById("steam-avatar");
  const levelEl = document.getElementById("steam-level");
  const gamesEl = document.getElementById("steam-games");
  const hoursEl = document.getElementById("steam-hours");
  const linkEl = document.getElementById("steam-link");

  if (usernameEl) usernameEl.textContent = steamCfg.username || "Alex";
  if (avatarEl && steamCfg.avatar) avatarEl.src = steamCfg.avatar;
  if (levelEl) levelEl.textContent = steamCfg.level || "24";
  if (gamesEl) gamesEl.textContent = steamCfg.gamesCount || "82";
  if (hoursEl) hoursEl.textContent = steamCfg.hoursPlayed || "1,420h";
  if (linkEl && steamCfg.profileUrl) linkEl.href = steamCfg.profileUrl;
}

/* --------------------------------------------------------------------------
   4. Populate Skills Strip
-------------------------------------------------------------------------- */
function populateSkills(skills = []) {
  const container = document.getElementById("skills-strip");
  if (!container) return;
  container.innerHTML = "";

  skills.forEach((s) => {
    const pill = document.createElement("div");
    pill.className = "skill-pill";
    const name = typeof s === "string" ? s : s.name;
    const icon = typeof s === "object" ? s.icon : "✦";
    pill.innerHTML = `<span class="skill-icon">${icon}</span> <span>${name}</span>`;
    container.appendChild(pill);
  });
}

const PROJECT_ICONS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  alert: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'
};

function populateProjects(projects = []) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projects.forEach((p) => {
    const card = document.createElement("a");
    card.href = p.url || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "project-card";

    const iconSvg = PROJECT_ICONS[p.icon] || PROJECT_ICONS["terminal"];
    const tagsHtml = (p.tags || []).map((t) => `<span class="project-tag">${t}</span>`).join("");

    card.innerHTML = `
      <div>
        <div class="project-top">
          <div class="project-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${iconSvg}
            </svg>
          </div>
          <svg class="project-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
      </div>
      <div class="project-tags">${tagsHtml}</div>
    `;

    grid.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   6. Phonk Audio Player & Auto-Run
-------------------------------------------------------------------------- */
function initAudioAndGate(musicCfg = {}, gateCfg = {}) {
  const enterScreen = document.getElementById("enter-screen");
  const enterText = document.getElementById("enter-text");
  const enterHint = document.getElementById("enter-hint");
  const audio = document.getElementById("bg-audio");
  const musicCard = document.getElementById("music-widget");
  const toggleBtn = document.getElementById("audio-toggle-btn");
  const volSlider = document.getElementById("volume-slider");
  const titleEl = document.getElementById("phonk-track-title");
  const artistEl = document.getElementById("phonk-artist");
  const coverImg = document.getElementById("phonk-album-art");
  const recentList = document.getElementById("recent-tracks-list");

  if (gateCfg.text && enterText) enterText.textContent = gateCfg.text;
  if (gateCfg.subtext && enterHint) enterHint.textContent = gateCfg.subtext;

  if (musicCfg.enabled && audio) {
    audio.volume = musicCfg.initialVolume !== undefined ? musicCfg.initialVolume : 0.4;
    if (volSlider) volSlider.value = audio.volume;
    if (titleEl) titleEl.textContent = musicCfg.title || "EXECUTIONER";
    if (artistEl) artistEl.textContent = musicCfg.artist || "Phonk Drift";
    if (coverImg && musicCfg.albumArt) coverImg.src = musicCfg.albumArt;

    // Populate recent tracks list (Matching Image 2)
    if (recentList && Array.isArray(musicCfg.recentTracks)) {
      recentList.innerHTML = "";
      musicCfg.recentTracks.forEach((rt) => {
        const item = document.createElement("div");
        item.className = "recent-track-item";
        item.innerHTML = `
          <div class="recent-track-left">
            <img src="${rt.cover}" alt="" class="recent-track-img">
            <span class="recent-track-name">${rt.title}</span>
          </div>
          <span class="recent-track-time">${rt.time}</span>
        `;
        recentList.appendChild(item);
      });
    }
  }

  if (gateCfg.enabled === false) {
    document.body.dataset.entered = "true";
  }

  let audioStarted = false;

  function startPhonkGroove() {
    if (audioStarted) return;
    audioStarted = true;
    document.body.dataset.entered = "true";

    // Guarantee background video is playing
    const video = document.getElementById("bg-video");
    if (video && video.paused && document.body.dataset.bgMode !== "ambient") {
      video.play().catch(() => {});
    }

    if (musicCfg.enabled && audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (musicCard) musicCard.classList.add("playing");
          })
          .catch((err) => {
            console.log("Audio play error, attempting fallback source:", err);
            if (musicCfg.fallbackAudioUrl) {
              audio.src = musicCfg.fallbackAudioUrl;
              audio.play().then(() => {
                if (musicCard) musicCard.classList.add("playing");
              });
            }
          });
      }
    }
  }

  // 1. Proactively attempt auto-run immediately
  if (musicCfg.enabled && audio) {
    audio.play().then(() => {
      audioStarted = true;
      document.body.dataset.entered = "true";
      if (musicCard) musicCard.classList.add("playing");
    }).catch(() => {
      // Browser blocked unmuted autoplay. Ready for first click!
    });
  }

  // 2. Guaranteed auto-run on first click, wheel, or keypress anywhere
  if (enterScreen) {
    enterScreen.addEventListener("click", startPhonkGroove);
  }
  document.addEventListener("click", () => {
    if (!audioStarted) startPhonkGroove();
  }, { once: true });

  window.addEventListener("wheel", () => {
    if (!audioStarted) startPhonkGroove();
  }, { once: true, passive: true });

  window.addEventListener("keydown", () => {
    if (!audioStarted) startPhonkGroove();
  }, { once: true, passive: true });

  // Toggle button (Play/Pause)
  if (toggleBtn && audio) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play().then(() => {
          if (musicCard) musicCard.classList.add("playing");
        });
      } else {
        audio.pause();
        if (musicCard) musicCard.classList.remove("playing");
      }
    });
  }

  // Volume slider
  if (volSlider && audio) {
    volSlider.addEventListener("input", (e) => {
      audio.volume = parseFloat(e.target.value);
    });
  }
}

/* --------------------------------------------------------------------------
   7. Live Timezone Clock
-------------------------------------------------------------------------- */
function initLiveClock(timezone = "Europe/London") {
  const clockEl = document.getElementById("live-clock");
  if (!clockEl) return;

  function update() {
    try {
      const now = new Date();
      const options = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      clockEl.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
    } catch {
      clockEl.textContent = new Date().toLocaleTimeString();
    }
  }
  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   8. Typewriter Effect
-------------------------------------------------------------------------- */
function initTypewriter(texts = []) {
  const el = document.getElementById("typewriter-text");
  if (!el || !texts.length) return;

  let textIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = texts[textIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === current.length) {
      delay = 2400;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }
  tick();
}

/* --------------------------------------------------------------------------
   9. Discord Live Activity (Lanyard API Integration)
-------------------------------------------------------------------------- */
function initDiscordActivity(discordCfg = {}) {
  const avatarEl = document.getElementById("discord-avatar");
  const usernameEl = document.getElementById("discord-username");
  const badgeEl = document.getElementById("discord-status-badge");
  const customStatusEl = document.getElementById("discord-custom-status");
  const actNameEl = document.getElementById("activity-name");
  const actDetailsEl = document.getElementById("activity-details");
  const statusIndicator = document.getElementById("status-indicator");
  const rolePill = document.getElementById("discord-role-pill");

  const fallback = discordCfg.fallback || {};
  if (usernameEl) usernameEl.textContent = fallback.username || "alex#0001";
  if (rolePill) rolePill.textContent = fallback.role || "Strategist";
  if (actNameEl) actNameEl.textContent = fallback.activityName || "Formula 1 TV";
  if (actDetailsEl) actDetailsEl.textContent = fallback.activityDetails || "Watching On-Board Telemetry";
  if (customStatusEl) customStatusEl.textContent = fallback.status || "Race Weekend";

  if (!discordCfg.userId) return;

  fetch(`https://api.lanyard.rest/v1/users/${discordCfg.userId}`)
    .then((res) => res.json())
    .then((res) => {
      if (!res.success || !res.data) return;
      const data = res.data;

      const status = data.discord_status || "online";
      if (statusIndicator) {
        statusIndicator.className = `status-indicator ${status}`;
      }
      if (badgeEl) {
        const colors = { online: "#22c55e", idle: "#f59e0b", dnd: "#ef4444", offline: "#71717a" };
        badgeEl.style.backgroundColor = colors[status] || "#22c55e";
      }

      if (avatarEl && data.discord_user?.avatar) {
        avatarEl.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`;
      }
      if (usernameEl && data.discord_user?.username) {
        usernameEl.textContent = data.discord_user.username;
      }

      const customActivity = data.activities?.find((a) => a.type === 4);
      if (customStatusEl && customActivity?.state) {
        customStatusEl.textContent = customActivity.state;
      }

      if (data.spotify) {
        if (actNameEl) actNameEl.textContent = `Listening to ${data.spotify.song}`;
        if (actDetailsEl) actDetailsEl.textContent = `by ${data.spotify.artist}`;
      } else {
        const game = data.activities?.find((a) => a.type !== 4);
        if (game) {
          if (actNameEl) actNameEl.textContent = `Playing ${game.name}`;
          if (actDetailsEl) actDetailsEl.textContent = game.details || game.state || "In game";
        }
      }
    })
    .catch((err) => {
      console.log("Lanyard fallback active:", err);
    });
}

/* --------------------------------------------------------------------------
   10. Interactive Tooltips
-------------------------------------------------------------------------- */
function initTooltips() {
  const tooltip = document.getElementById("app-tooltip");
  if (!tooltip) return;

  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest("[data-tooltip]");
    if (target) {
      tooltip.textContent = target.dataset.tooltip;
      tooltip.classList.add("visible");
      positionTooltip(target, tooltip);
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest("[data-tooltip]");
    if (target) {
      tooltip.classList.remove("visible");
    }
  });

  function positionTooltip(el, tt) {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 8;
    tt.style.left = `${x}px`;
    tt.style.top = `${y}px`;
  }
}

/* --------------------------------------------------------------------------
   11. Background Mode Switcher (Cinematic Video vs Ambient Mesh Aurora)
-------------------------------------------------------------------------- */
window.setBgMode = function(mode) {
  if (!mode) return;
  document.body.dataset.bgMode = mode;
  document.body.setAttribute("data-bg-mode", mode);

  const btns = document.querySelectorAll(".bg-mode-btn");
  btns.forEach((b) => {
    const isTarget = b.dataset.mode === mode;
    b.classList.toggle("active", isTarget);
    b.setAttribute("aria-pressed", isTarget ? "true" : "false");
  });

  const bgVideo = document.getElementById("bg-video");
  if (bgVideo) {
    if (mode === "ambient") {
      try { bgVideo.pause(); } catch(e) {}
    } else {
      try {
        const p = bgVideo.play();
        if (p !== undefined) p.catch(() => {});
      } catch(e) {}
    }
  }

  try {
    localStorage.setItem("biolink_bg_mode", mode);
  } catch(e) {}
};

function initBackgroundModeSwitcher() {
  const btns = document.querySelectorAll(".bg-mode-btn");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mode = btn.dataset.mode || btn.getAttribute("data-mode");
      if (mode && typeof window.setBgMode === "function") {
        window.setBgMode(mode);
      }
    });
  });

  const savedMode = localStorage.getItem("biolink_bg_mode") || (window.BIOLINK_CONFIG?.theme?.defaultBgMode || "cinematic");
  window.setBgMode(savedMode);
}

/* --------------------------------------------------------------------------
   12. Populate Layout 3: The Ultra Gen-Z Bento Moodboard
-------------------------------------------------------------------------- */
function populateLayout3(cfg = {}) {
  const l3Data = cfg.layout3Data || {};
  const prof = cfg.profile || {};
  const music = cfg.music || {};

  const currentYearL3 = document.getElementById("current-year-l3");
  if (currentYearL3) currentYearL3.textContent = new Date().getFullYear();

  // ── 1. Simple Centered Haunt.gg Hero (Matching User Reference Image) ──
  populateHauntHero(cfg);

  // ── 2. Interactive Draggable Polaroid Photo Deck with Lightbox & Shutter SFX ──
  const dragCard = document.getElementById("polaroid-drag-card");
  const polaroidImg = document.getElementById("polaroid-img");
  const polaroidTag = document.getElementById("polaroid-tag");
  const polaroidCaption = document.getElementById("polaroid-caption");
  const polaroidCounter = document.getElementById("polaroid-counter");
  const polaroidDate = document.getElementById("polaroid-date");
  const tossBtn = document.getElementById("polaroid-hint-text");
  const zoomBtn = document.getElementById("polaroid-zoom-btn");
  const polaroidPrevBtn = document.getElementById("polaroid-prev-btn");
  const polaroidNextBtn = document.getElementById("polaroid-next-btn");
  const polaroidDots = document.getElementById("polaroid-dots");

  const polaroids = l3Data.polaroids || [
    {
      url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=85",
      caption: "late night coding session • 3:42 AM",
      tag: "WORKSPACE",
      date: "'26 10 24",
      exif: "35mm • ISO 400 • f/1.8"
    }
  ];

  // Synthesize authentic analog camera shutter sound (zero external audio file needed)
  function playCameraShutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const t = ctx.currentTime;
      
      // Stage 1: Mechanical shutter latch snap
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);
      oscGain.gain.setValueAtTime(0.25, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);

      // Stage 2: Curtain blade snap noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2400, t + 0.025);
      filter.Q.setValueAtTime(3, t + 0.025);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, t + 0.025);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t + 0.025);
      noise.stop(t + 0.07);
    } catch (_) {}
  }

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isAnimating = false;

  function renderPolaroidDots() {
    if (!polaroidDots) return;
    polaroidDots.innerHTML = polaroids.map((_, i) => `
      <span class="polaroid-dot${i === currentIndex ? ' active' : ''}" data-idx="${i}" title="View photo ${i + 1}"></span>
    `).join("");

    polaroidDots.querySelectorAll(".polaroid-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetIdx = parseInt(dot.dataset.idx, 10);
        if (targetIdx !== currentIndex) {
          playCameraShutterSound();
          currentIndex = targetIdx;
          renderPolaroid(currentIndex);
        }
      });
    });
  }

  function renderPolaroid(idx) {
    const p = polaroids[idx];
    if (!p) return;
    if (polaroidImg) polaroidImg.src = p.url;
    if (polaroidTag) polaroidTag.textContent = p.tag || "SNAPSHOT";
    if (polaroidCaption) polaroidCaption.textContent = p.caption || "";
    if (polaroidCounter) polaroidCounter.textContent = `${idx + 1} / ${polaroids.length}`;
    if (polaroidDate) polaroidDate.textContent = p.date || "'26 10 25";
    renderPolaroidDots();
  }

  function tossCard(direction = 1) {
    if (isAnimating || !dragCard) return;
    isAnimating = true;
    playCameraShutterSound();

    dragCard.classList.remove("tossed-left", "tossed-right", "is-dragging");
    dragCard.classList.add(direction > 0 ? "tossed-right" : "tossed-left");

    setTimeout(() => {
      currentIndex = (direction > 0)
        ? (currentIndex + 1) % polaroids.length
        : (currentIndex - 1 + polaroids.length) % polaroids.length;
      renderPolaroid(currentIndex);
      dragCard.style.transform = "";
      dragCard.classList.remove("tossed-left", "tossed-right");

      // Smooth elastic entrance bounce for the newly surfaced card
      dragCard.style.transform = "scale(0.92) rotate(-3deg)";
      dragCard.style.opacity = "0.75";
      setTimeout(() => {
        dragCard.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
        dragCard.style.transform = "rotate(-1.2deg)";
        dragCard.style.opacity = "1";
        setTimeout(() => {
          dragCard.style.transition = "";
          isAnimating = false;
        }, 280);
      }, 50);
    }, 320);
  }

  // Pointer drag gestures (mouse + touch with physical velocity tilt)
  if (dragCard) {
    const onStart = (e) => {
      if (isAnimating) return;
      if (e.target.closest("#polaroid-zoom-btn")) return;
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      currentX = 0;
      currentY = 0;
      dragCard.classList.add("is-dragging");
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      currentX = clientX - startX;
      currentY = clientY - startY;

      // Realistic tilt & drag rotation
      const rot = currentX * 0.08 - 1.2;
      dragCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rot}deg)`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      dragCard.classList.remove("is-dragging");

      if (Math.abs(currentX) > 75) {
        tossCard(currentX > 0 ? 1 : -1);
      } else {
        // Elastic snap back to deck
        dragCard.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        dragCard.style.transform = "rotate(-1.2deg)";
        setTimeout(() => {
          dragCard.style.transition = "";
        }, 300);
      }
    };

    dragCard.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    dragCard.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    if (tossBtn) {
      tossBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tossCard(1);
      });
    }

    if (polaroidPrevBtn) {
      polaroidPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tossCard(-1);
      });
    }

    if (polaroidNextBtn) {
      polaroidNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tossCard(1);
      });
    }
  }

  // ── Fullscreen Polaroid Lightbox Modal ──
  const lightbox = document.getElementById("polaroid-lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTag = document.getElementById("lightbox-tag");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbDate = document.getElementById("lightbox-date");
  const lbExif = document.getElementById("lightbox-exif");
  const lbCounter = document.getElementById("lightbox-counter");
  const lbClose = document.getElementById("lightbox-close-btn");
  const lbPrev = document.getElementById("lightbox-prev-btn");
  const lbNext = document.getElementById("lightbox-next-btn");

  let lightboxIdx = 0;

  function updateLightbox(idx) {
    const p = polaroids[idx];
    if (!p) return;
    lightboxIdx = idx;
    if (lbImg) {
      lbImg.style.opacity = "0";
      lbImg.style.transform = "scale(0.97)";
      setTimeout(() => {
        lbImg.src = p.url;
        if (lbTag) lbTag.textContent = p.tag || "SNAPSHOT";
        if (lbCaption) lbCaption.textContent = p.caption || "";
        if (lbDate) lbDate.textContent = p.date || "'26 10 25";
        if (lbExif) lbExif.textContent = p.exif || "35mm • ISO 400 • f/1.8";
        if (lbCounter) lbCounter.textContent = `${idx + 1} / ${polaroids.length}`;
        lbImg.style.opacity = "1";
        lbImg.style.transform = "scale(1)";
      }, 150);
    }
  }

  function openLightbox(idx = currentIndex) {
    if (!lightbox) return;
    playCameraShutterSound();
    updateLightbox(idx);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  if (zoomBtn) {
    zoomBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(currentIndex);
    });
  }

  if (dragCard) {
    dragCard.addEventListener("dblclick", () => {
      openLightbox(currentIndex);
    });
  }

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lbPrev) {
    lbPrev.addEventListener("click", () => {
      playCameraShutterSound();
      lightboxIdx = (lightboxIdx - 1 + polaroids.length) % polaroids.length;
      updateLightbox(lightboxIdx);
    });
  }

  if (lbNext) {
    lbNext.addEventListener("click", () => {
      playCameraShutterSound();
      lightboxIdx = (lightboxIdx + 1) % polaroids.length;
      updateLightbox(lightboxIdx);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      playCameraShutterSound();
      lightboxIdx = (lightboxIdx - 1 + polaroids.length) % polaroids.length;
      updateLightbox(lightboxIdx);
    }
    if (e.key === "ArrowRight") {
      playCameraShutterSound();
      lightboxIdx = (lightboxIdx + 1) % polaroids.length;
      updateLightbox(lightboxIdx);
    }
  });

  renderPolaroid(0);

  // ── 3. Interactive Hero Mini Player (Phonk Player) ──
  const bgAudio = document.getElementById("bg-audio");
  const l3PlayBtn = document.getElementById("l3-play-btn");
  const l3TrackTitle = document.getElementById("l3-track-title");
  const l3Artist = document.getElementById("l3-artist");
  const l3VinylArt = document.getElementById("l3-vinyl-art");
  const vinylDisc = document.getElementById("vinyl-disc");
  const vinylEq = document.getElementById("vinyl-eq-bars");
  const l3VolSlider = document.getElementById("l3-vol-slider");
  const l3VolToggle = document.getElementById("l3-vol-toggle");
  const l3VolIcon = document.getElementById("l3-vol-icon");

  if (l3TrackTitle) l3TrackTitle.textContent = music.title || music.trackName || "EXECUTIONER";
  if (l3Artist) l3Artist.textContent = music.artist || "Phonk Drift";
  if (l3VinylArt) l3VinylArt.src = music.albumArt || prof.avatar || "assets/avatar.jpg";

  function updateVinylPlayState(isPlaying) {
    if (vinylDisc) {
      vinylDisc.style.animationPlayState = isPlaying ? "running" : "paused";
    }
    if (vinylEq) {
      vinylEq.querySelectorAll(".eq-bar").forEach((b) => {
        b.style.animationPlayState = isPlaying ? "running" : "paused";
      });
    }
    if (l3PlayBtn) {
      l3PlayBtn.innerHTML = isPlaying
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  }

  if (bgAudio) {
    if (l3VolSlider) {
      l3VolSlider.value = bgAudio.volume;
      l3VolSlider.addEventListener("input", (e) => {
        bgAudio.volume = parseFloat(e.target.value);
      });
      bgAudio.addEventListener("volumechange", () => {
        l3VolSlider.value = bgAudio.volume;
      });
    }

    let lastNonZeroVol = 0.4;
    if (l3VolToggle) {
      l3VolToggle.addEventListener("click", () => {
        if (bgAudio.volume > 0) {
          lastNonZeroVol = bgAudio.volume;
          bgAudio.volume = 0;
        } else {
          bgAudio.volume = lastNonZeroVol || 0.4;
        }
      });

      const updateVolIcon = () => {
        if (!l3VolIcon) return;
        if (bgAudio.volume === 0) {
          l3VolIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
        } else {
          l3VolIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        }
      };
      bgAudio.addEventListener("volumechange", updateVolIcon);
      updateVolIcon();
    }

    if (l3PlayBtn) {
      l3PlayBtn.addEventListener("click", () => {
        if (bgAudio.paused) {
          bgAudio.play().then(() => updateVinylPlayState(true)).catch(() => {});
        } else {
          bgAudio.pause();
          updateVinylPlayState(false);
        }
      });
    }

    bgAudio.addEventListener("play", () => updateVinylPlayState(true));
    bgAudio.addEventListener("pause", () => updateVinylPlayState(false));
    updateVinylPlayState(!bgAudio.paused);
  }

  // ── 4. Life & Taste Matrix (Currently In My Life) ──
  const l3MatrixList = document.getElementById("l3-matrix-list");
  if (l3MatrixList && l3Data.matrix) {
    l3MatrixList.innerHTML = l3Data.matrix.map((item, idx) => `
      <div class="matrix-item-spacious${idx === l3Data.matrix.length - 1 ? ' span-full' : ''}">
        <div class="matrix-icon-box">${item.icon}</div>
        <div class="matrix-content-col">
          <span class="matrix-cat-label">${item.category}</span>
          <span class="matrix-val-text">${item.value}</span>
        </div>
      </div>
    `).join("");
  }



  // ── 6. Live GitHub Contribution Heatmap (Synced with Adithyan1809) ──
  const l3GithubStreak = document.getElementById("l3-github-streak");
  const l3GithubTotal = document.getElementById("l3-github-total");
  const l3HeatmapGrid = document.getElementById("l3-heatmap-grid");

  if (l3GithubStreak && l3Data.githubStats?.currentStreak) {
    l3GithubStreak.textContent = l3Data.githubStats.currentStreak;
  }
  if (l3GithubTotal && l3Data.githubStats?.totalCommits) {
    l3GithubTotal.textContent = `${l3Data.githubStats.totalCommits} in the last year`;
  }

  if (l3HeatmapGrid) {
    syncGitHubContributionsLive(l3Data.githubStats?.username || "Adithyan1809", l3HeatmapGrid, l3GithubTotal, l3GithubStreak);
  }


  // ── 8. Weather Widget (Matching User Image 1) ──
  populateWeather(l3Data.weather || cfg.weather);

  // ── 8a. Off The Record Showcase (Dedicated Step 6) ──
  initOffTheRecordPage(l3Data.offTheRecord || l3Data.datingDossier || cfg.offTheRecord);

  // ── 8b. About Me Live Widgets (Stats.fm, Discord, Timezone Clock) ──
  initAboutMeWidgets(cfg);

  // ── 9. Favourite Tracks & Artists (Step 3 - 4x2 Cards Grid) ──
  populateFavouriteMusic(l3Data.favouriteMusic || cfg.favouriteMusic);

  // ── 10. Spotify Live Connect & Activity Hub ──
  populateSpotifyHub(l3Data.spotify || cfg.spotify);

  // ── 11. Initialize 3D Interactive Card Tilt ──
  initTiltCards();
}

/* --------------------------------------------------------------------------
   12a. Real GitHub Contribution Sync (Adithyan1809)
-------------------------------------------------------------------------- */
async function syncGitHubContributionsLive(username = "Adithyan1809", gridEl, totalEl, streakEl) {
  if (!gridEl) return;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function renderCells(days, totalCount) {
    if (!days || !days.length) return;
    gridEl.innerHTML = "";

    days.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = `heatmap-cell lvl-${day.level || 0}`;

      // Date formatted as 'Oct 24, 2026'
      let dateStr = day.date;
      if (day.date && day.date.includes("-")) {
        const parts = day.date.split("-");
        if (parts.length === 3) {
          const mIdx = parseInt(parts[1], 10) - 1;
          const dNum = parseInt(parts[2], 10);
          dateStr = `${months[mIdx]} ${dNum}, ${parts[0]}`;
        }
      }

      if (day.count > 0) {
        cell.dataset.tooltip = `${day.count} contribution${day.count > 1 ? "s" : ""} on ${dateStr}`;
      } else {
        cell.dataset.tooltip = `No contributions on ${dateStr}`;
      }

      cell.addEventListener("click", () => {
        window.open(`https://github.com/${username}`, "_blank", "noopener,noreferrer");
      });

      gridEl.appendChild(cell);
    });

    if (totalEl && totalCount !== undefined) {
      totalEl.textContent = `${totalCount} contributions in the last year`;
    }
  }

  // 1. Immediately render cached data from assets/github_contribs.json (instant, no flash)
  try {
    const res = await fetch("assets/github_contribs.json");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
        renderCells(data.contributions, data.total?.lastYear || 303);
      }
    }
  } catch (e) {
    console.warn("Could not read local github_contribs.json cache:", e);
  }

  // 2. Fetch live data from GitHub contributions API to stay dynamic in real-time
  try {
    const liveRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData && Array.isArray(liveData.contributions) && liveData.contributions.length > 0) {
        renderCells(liveData.contributions, liveData.total?.lastYear || liveData.total?.year);
      }
    }
  } catch (liveErr) {
    // Graceful fallback to existing rendered data
  }
}

/* --------------------------------------------------------------------------
   12b. Simple Centered Haunt.gg Hero (Matching User Reference Image)
-------------------------------------------------------------------------- */
function populateHauntHero(cfg = {}) {
  const l3Data = cfg.layout3Data || {};
  const heroCfg = l3Data.simpleHero || {};
  const prof = cfg.profile || {};

  const hauntAvatar = document.getElementById("haunt-avatar");
  const hauntDisplayName = document.getElementById("haunt-display-name");
  const hauntTypewriter = document.getElementById("haunt-typewriter-text");
  const scrollBtn = document.getElementById("hero-scroll-btn");

  if (hauntAvatar) {
    hauntAvatar.src = heroCfg.avatar || prof.avatar || "assets/ghostly_avatar.png";
  }

  if (hauntDisplayName) {
    hauntDisplayName.textContent = heroCfg.name || prof.name || "ghostly";
  }

  // Typewriter loop with realistic timing
  const phrases = heroCfg.typewriterTexts || [
    heroCfg.bioText || prof.bio || "haunt.gg/ghostly on top"
  ];
  if (hauntTypewriter && phrases.length) {
    let pIdx = 0;
    let cIdx = 0;
    let isDeleting = false;
    let timer = null;

    function typeStep() {
      const current = phrases[pIdx];
      if (isDeleting) {
        cIdx--;
        hauntTypewriter.textContent = current.slice(0, cIdx);
        if (cIdx <= 0) {
          isDeleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          timer = setTimeout(typeStep, 450);
          return;
        }
        timer = setTimeout(typeStep, 35);
      } else {
        cIdx++;
        hauntTypewriter.textContent = current.slice(0, cIdx);
        if (cIdx >= current.length) {
          isDeleting = true;
          timer = setTimeout(typeStep, 2600);
          return;
        }
        timer = setTimeout(typeStep, 75);
      }
    }
    typeStep();
  }

  // Scroll arrow click handler to jump to Step 2
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const step2 = document.getElementById("l3-step-2");
      if (step2) {
        step2.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   12c. About Me Live Widgets (Spotify, Discord, Timezone Clock)
-------------------------------------------------------------------------- */
function initAboutMeWidgets(cfg = {}) {
  const l3Data = cfg.layout3Data || {};
  const aboutCfg = l3Data.aboutMe || {};
  const statsCfg = aboutCfg.spotify || aboutCfg.statsfm || {};
  const discCfg = aboutCfg.discord || {};
  const clockCfg = aboutCfg.clock || {};

  // 1. Greeting text
  const greetingEl = document.getElementById("about-greeting-text");
  if (greetingEl && aboutCfg.greeting) {
    greetingEl.textContent = aboutCfg.greeting;
  }

  // 2. Spotify Profile Info & Recent Tracks
  const sAvatar = document.getElementById("spotify-avatar") || document.getElementById("statsfm-avatar");
  const sUser = document.getElementById("spotify-username") || document.getElementById("statsfm-username");
  const sStreams = document.getElementById("spotify-streams") || document.getElementById("statsfm-streams");
  const sMood = document.getElementById("spotify-mood") || document.getElementById("statsfm-mood");
  const sBtn = document.getElementById("spotify-profile-btn") || document.getElementById("statsfm-profile-btn");
  const recentGrid = document.getElementById("spotify-recent-grid") || document.getElementById("statsfm-recent-grid");

  if (sAvatar && statsCfg.avatar) sAvatar.src = statsCfg.avatar;
  if (sUser && statsCfg.username) sUser.textContent = statsCfg.username;
  if (sStreams && statsCfg.streamsCount) sStreams.textContent = statsCfg.streamsCount;
  if (sMood && statsCfg.moodStatus) sMood.textContent = statsCfg.moodStatus;
  if (sBtn && statsCfg.profileUrl) sBtn.href = statsCfg.profileUrl;

  if (recentGrid && statsCfg.recentTracks) {
    recentGrid.innerHTML = statsCfg.recentTracks.map((t) => `
      <a href="${t.url || '#'}" target="_blank" rel="noopener noreferrer" class="spotify-track-item statsfm-track-item" title="Listen on Spotify">
        <img src="${t.cover}" alt="${t.title}" class="spotify-track-cover statsfm-track-cover">
        <div class="spotify-track-meta statsfm-track-meta">
          <span class="spotify-track-title statsfm-track-title">${t.title}</span>
          <span class="spotify-track-artist statsfm-track-artist">${t.artist}</span>
        </div>
        <span class="spotify-track-time statsfm-track-time">${t.time}</span>
      </a>
    `).join("");
  }

  // 3. Discord Status & Avatar Sync (adithyan1809)
  const discCard = document.getElementById("discord-widget");
  const discUser = document.getElementById("discord-username");
  const discAvatar = document.getElementById("discord-avatar-img");
  const discStatus = document.getElementById("discord-status-text");
  const discDot = document.getElementById("discord-status-dot");

  const targetUsername = discCfg.username || "adithyan1809";
  const discordId = discCfg.userId || l3Data.spotify?.discordUserId;

  if (discUser) discUser.textContent = targetUsername;
  if (discStatus) discStatus.textContent = discCfg.statusText || "shipping code & vibing";
  if (discAvatar && discCfg.avatar) discAvatar.src = discCfg.avatar;
  if (discDot) discDot.className = "discord-status-dot online";

  // Make Discord card interactive & direct link to user profile
  if (discCard) {
    if (discordId) {
      discCard.href = `https://discord.com/users/${discordId}`;
    } else {
      discCard.href = `https://discord.com/users/adithyan1809`;
    }

    discCard.addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetUsername);
        if (typeof showToast === "function") {
          showToast(`Copied Discord username: ${targetUsername} 🎮`);
        }
      }
    });
  }

  if (discordId) {
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          // Sync live Discord avatar photo
          if (discAvatar && d.discord_user && d.discord_user.avatar) {
            discAvatar.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=256`;
          }
          if (discCard) {
            discCard.href = `https://discord.com/users/${d.discord_user.id}`;
          }
          if (discDot) {
            discDot.className = `discord-status-dot ${d.discord_status || 'online'}`;
          }
          if (discStatus) {
            if (d.listening_to_spotify && d.spotify) {
              discStatus.textContent = `Listening to ${d.spotify.song}`;
            } else if (d.activities && d.activities.length) {
              const act = d.activities[0];
              discStatus.textContent = act.state ? `${act.name}: ${act.state}` : `Playing ${act.name}`;
            } else if (d.discord_status === "online") {
              discStatus.textContent = "Online on Discord";
            } else if (d.discord_status === "idle") {
              discStatus.textContent = "Idle on Discord";
            } else if (d.discord_status === "dnd") {
              discStatus.textContent = "Do Not Disturb";
            }
          }
        }
      })
      .catch(() => {});
  }

  // 4. Connect Dynamic Live Spotify Sync Engine
  const spotifyApiKey = statsCfg.apiKey || l3Data.spotify?.apiKey || "spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr";
  const spotifyUserId = statsCfg.userId || l3Data.spotify?.userId || "31zymccmdqzrzvjkdryasaqmkwlq";
  syncSpotifyLive(spotifyApiKey, spotifyUserId);

  // 4. Live Analog & Digital Timezone Clock (Bengaluru, India • UTC+5:30)
  const hourHand = document.getElementById("analog-hour-hand");
  const minHand = document.getElementById("analog-minute-hand");
  const secHand = document.getElementById("analog-second-hand");
  const digiTime = document.getElementById("clock-digital-time");
  const dateStr = document.getElementById("clock-date-str");
  const visitorOffset = document.getElementById("clock-visitor-offset");

  function updateClock() {
    const now = new Date();
    // Precise Bengaluru, India time via standard IANA timezone
    const bengaluruStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const targetTime = new Date(bengaluruStr);

    const s = targetTime.getSeconds();
    const m = targetTime.getMinutes();
    const h = targetTime.getHours();

    // Analog Hands Angles
    const secDeg = (s / 60) * 360;
    const minDeg = ((m + s / 60) / 60) * 360;
    const hrDeg = (((h % 12) + m / 60) / 12) * 360;

    if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hrDeg}deg)`;

    // Digital Time Format (UTC+5:30)
    const pad = (n) => (n < 10 ? "0" : "") + n;
    if (digiTime) digiTime.textContent = `${pad(h)}:${pad(m)}:${pad(s)} (UTC+5:30)`;

    // Date String for Bengaluru
    if (dateStr) {
      const options = { weekday: "long", month: "long", day: "numeric" };
      dateStr.textContent = targetTime.toLocaleDateString("en-US", options);
    }

    // Visitor comparison offset relative to Bengaluru (IST is UTC+5:30 = +330 min)
    if (visitorOffset) {
      const visitorH = now.getHours();
      const visitorM = now.getMinutes();
      const visitorOffsetMinutes = -now.getTimezoneOffset();
      const bengaluruOffsetMinutes = 330; // +5h 30m
      const diffMinutes = visitorOffsetMinutes - bengaluruOffsetMinutes;

      let diffStr = "";
      if (diffMinutes === 0) {
        diffStr = "same time";
      } else {
        const sign = diffMinutes > 0 ? "+" : "-";
        const absMin = Math.abs(diffMinutes);
        const hrs = Math.floor(absMin / 60);
        const mins = absMin % 60;
        diffStr = mins > 0 ? `${sign}${hrs}h ${mins}m` : `${sign}${hrs}h`;
      }
      visitorOffset.textContent = `Your time: ${pad(visitorH)}:${pad(visitorM)} (${diffStr})`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   13. Live Bengaluru Weather Populator (Open-Meteo Real-Time Sync)
-------------------------------------------------------------------------- */
function populateWeather(wCfg = {}) {
  const cityEl = document.getElementById("weather-city");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const clockWeatherItem = document.getElementById("clock-weather-item");
  const clockWeatherText = document.getElementById("clock-weather-text");
  const clockWeatherIcon = document.getElementById("clock-weather-icon");

  // Initial fallback from config
  if (cityEl) cityEl.textContent = wCfg.city || "Bengaluru, India";
  if (tempEl) tempEl.textContent = wCfg.temp || "25°C";
  if (descEl) descEl.textContent = wCfg.condition || "Pleasant Breeze";
  if (clockWeatherText) clockWeatherText.textContent = `${wCfg.temp || '25°C'} • Bengaluru`;

  const weatherCodeMap = {
    0: { desc: "Clear Sky", dayIcon: "☀️", nightIcon: "🌙" },
    1: { desc: "Mainly Clear", dayIcon: "🌤️", nightIcon: "🌤️" },
    2: { desc: "Partly Cloudy", dayIcon: "⛅", nightIcon: "⛅" },
    3: { desc: "Overcast", dayIcon: "☁️", nightIcon: "☁️" },
    45: { desc: "Misty Breeze", dayIcon: "🌫️", nightIcon: "🌫️" },
    48: { desc: "Foggy Air", dayIcon: "🌫️", nightIcon: "🌫️" },
    51: { desc: "Light Drizzle", dayIcon: "🌦️", nightIcon: "🌧️" },
    53: { desc: "Moderate Drizzle", dayIcon: "🌧️", nightIcon: "🌧️" },
    55: { desc: "Dense Drizzle", dayIcon: "🌧️", nightIcon: "🌧️" },
    61: { desc: "Light Rain", dayIcon: "🌧️", nightIcon: "🌧️" },
    63: { desc: "Steady Rain", dayIcon: "🌧️", nightIcon: "🌧️" },
    65: { desc: "Heavy Rain", dayIcon: "🌧️", nightIcon: "🌧️" },
    80: { desc: "Rain Showers", dayIcon: "🌦️", nightIcon: "🌧️" },
    95: { desc: "Thunderstorm Beats", dayIcon: "⛈️", nightIcon: "⛈️" }
  };

  function fetchBengaluruWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data || !data.current) return;
        const cur = data.current;
        const temp = Math.round(cur.temperature_2m);
        const code = cur.weather_code;
        const isDay = cur.is_day === 1;
        const mapping = weatherCodeMap[code] || { desc: "Pleasant Breeze", dayIcon: "☀️", nightIcon: "🌙" };
        const icon = isDay ? mapping.dayIcon : mapping.nightIcon;

        if (cityEl) cityEl.textContent = "Bengaluru, India";
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (descEl) descEl.textContent = `${icon} ${mapping.desc}`;
        if (clockWeatherText) clockWeatherText.textContent = `${temp}°C • ${mapping.desc}`;
        if (clockWeatherIcon) clockWeatherIcon.textContent = icon;
      })
      .catch(() => {});
  }

  fetchBengaluruWeather();
  setInterval(fetchBengaluruWeather, 10 * 60 * 1000); // Live poll every 10 mins
}

/* --------------------------------------------------------------------------
   13b. Off The Record Showcase (Dedicated Step 6)
-------------------------------------------------------------------------- */
function initOffTheRecordPage(offCfg = {}) {
  if (!offCfg) return;

  // 1. Populate Core Vibe Cards
  const vibesGrid = document.getElementById("offrecord-vibes-grid");
  const bioCards = offCfg.bioCards || [];
  if (vibesGrid && bioCards.length) {
    vibesGrid.innerHTML = bioCards.map((b) => `
      <div class="offrecord-vibe-card">
        <div class="offrecord-vibe-header">
          <span class="offrecord-vibe-num">${b.label || b.num || '01'}</span>
          <span class="offrecord-vibe-icon">${b.icon}</span>
        </div>
        <span class="offrecord-vibe-title">${b.title}</span>
        <p class="offrecord-vibe-desc">${b.desc}</p>
      </div>
    `).join("");
  }

  // 2. Populate The Wavelength List
  const waveList = document.getElementById("offrecord-wavelength-list");
  const waveItems = offCfg.wavelength || offCfg.greenFlags || [];
  if (waveList && waveItems.length) {
    waveList.innerHTML = waveItems.map((item) => `
      <span class="offrecord-wave-chip">
        <span class="offrecord-wave-dot"></span>
        <span>${item}</span>
      </span>
    `).join("");
  }

  // 3. Populate & Connect Move Options (Interactive Adventure Picker)
  const optionsContainer = document.getElementById("offrecord-move-options");
  const pitchBtn = document.getElementById("offrecord-pitch-btn");
  const pitchText = document.getElementById("offrecord-pitch-text");
  const moveOptions = offCfg.moveOptions || offCfg.firstDateOptions || [];

  let selectedOption = moveOptions[0] || null;

  if (optionsContainer && moveOptions.length) {
    optionsContainer.innerHTML = moveOptions.map((opt, idx) => `
      <div class="offrecord-move-card${idx === 0 ? " selected" : ""}" data-idx="${idx}">
        <div class="move-card-top">
          <span class="move-card-icon">${opt.icon}</span>
          <span class="move-card-title">${opt.title}</span>
        </div>
        <p class="move-card-sub">${opt.subtitle}</p>
      </div>
    `).join("");

    const cards = optionsContainer.querySelectorAll(".offrecord-move-card");
    cards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedOption = moveOptions[idx];
        if (pitchText && selectedOption) {
          pitchText.textContent = `Pitch "${selectedOption.title}" to Adithyan`;
        }
      });
    });
  }

  if (pitchBtn) {
    pitchBtn.addEventListener("click", () => {
      if (!selectedOption) return;
      const icebreaker = selectedOption.icebreaker || `Hey Adithyan! Saw your site — I'm picking: ${selectedOption.title} 🏎️☕`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(icebreaker).catch(() => {});
      }
      if (typeof showToast === "function") {
        showToast("Plan copied! Opening Adithyan's Instagram DMs... 💬");
      }
      setTimeout(() => {
        const url = offCfg.instagramDmUrl || "https://ig.me/m/adithyan_1895";
        window.open(url, "_blank", "noopener,noreferrer");
      }, 650);
    });
  }
}

/* --------------------------------------------------------------------------
   14. Favourite Tracks & Artists (Haunt.gg 4-Column Grid)
-------------------------------------------------------------------------- */
function populateFavouriteMusic(items = []) {
  const grid = document.getElementById("fav-music-grid");
  if (!grid || !items.length) return;

  grid.innerHTML = items.map((a) => `
    <a href="${a.url || '#'}" target="_blank" rel="noopener noreferrer" class="fav-music-card tilt-card" title="Listen to ${a.name} on Spotify">
      <div class="fav-card-img-wrap">
        <img src="${a.image}" alt="${a.name}" class="fav-card-img" loading="lazy">
        <div class="fav-card-play-overlay">
          <div class="fav-card-spotify-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0c0d12">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
          </div>
        </div>
      </div>
      <div class="fav-card-footer">
        <div class="fav-card-meta">
          <span class="fav-card-name">${a.name}</span>
          ${a.genre ? `<span class="fav-card-genre">${a.genre}</span>` : ''}
        </div>
        <svg class="fav-card-sp-icon" width="16" height="16" viewBox="0 0 24 24" fill="#1db954">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>
    </a>
  `).join("");
}

/* --------------------------------------------------------------------------
   14b. Live Dynamic Spotify Data Synchronization (Proxy-First with Fallback)
-------------------------------------------------------------------------- */
function syncSpotifyLive(apiKey, userId) {
  const uid = userId || "31zymccmdqzrzvjkdryasaqmkwlq";
  const key = apiKey || "spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr";
  if (!uid) return;

  const directHeaders = {
    "Authorization": `Bearer ${key}`,
    "X-Api-Key": key
  };

  // 1. Fetch user profile (Try backend proxy first, fallback to direct stats.fm)
  const fetchProfile = fetch("/api/spotify/profile")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .catch(() => fetch(`https://api.stats.fm/api/v1/users/${uid}`, { headers: directHeaders }).then((r) => r.json()));

  fetchProfile
    .then((data) => {
      const u = data?.item;
      if (u) {
        if (u.image) {
          const sAvatar = document.getElementById("spotify-avatar") || document.getElementById("statsfm-avatar");
          if (sAvatar) sAvatar.src = u.image;
        }
        if (u.displayName) {
          const sUser = document.getElementById("spotify-username") || document.getElementById("statsfm-username");
          if (sUser) sUser.textContent = u.displayName;
        }
        const sBtn = document.getElementById("spotify-profile-btn") || document.getElementById("statsfm-profile-btn");
        if (sBtn) {
          sBtn.href = `https://open.spotify.com/user/${uid}`;
        }
      }
    })
    .catch(() => {});

  // 2. Fetch Recent Streams (Try backend proxy first, fallback to direct stats.fm)
  const fetchRecent = fetch("/api/spotify/recent")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .catch(() => fetch(`https://api.stats.fm/api/v1/users/${uid}/streams/recent`, { headers: directHeaders }).then((r) => r.json()));

  fetchRecent
    .then((data) => {
      if (data?.items && Array.isArray(data.items) && data.items.length >= 4) {
        const recentGrid = document.getElementById("spotify-recent-grid") || document.getElementById("statsfm-recent-grid");
        if (!recentGrid) return;

        const formatTimeAgo = (isoString) => {
          if (!isoString) return "recently";
          const diffMs = Date.now() - new Date(isoString).getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHrs < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m ago`;
          if (diffHrs < 24) return `${diffHrs}h ago`;
          const diffDays = Math.floor(diffHrs / 24);
          return `${diffDays}d ago`;
        };

        recentGrid.innerHTML = data.items.slice(0, 4).map((item) => {
          const t = item.track || {};
          const trackTitle = t.name || "Track";
          const artistName = t.artists?.map((a) => a.name).join(", ") || "Artist";
          const cover = t.albums?.[0]?.image || t.album?.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80";
          const spotifyId = t.externalIds?.spotify?.[0];
          const url = spotifyId ? `https://open.spotify.com/track/${spotifyId}` : (t.externalIds?.spotify || `https://open.spotify.com/search/${encodeURIComponent(trackTitle)}`);
          const timeAgo = formatTimeAgo(item.endTime);

          return `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="spotify-track-item statsfm-track-item" title="Listen to ${trackTitle} on Spotify">
              <img src="${cover}" alt="${trackTitle}" class="spotify-track-cover statsfm-track-cover" loading="lazy">
              <div class="spotify-track-meta statsfm-track-meta">
                <span class="spotify-track-title statsfm-track-title">${trackTitle}</span>
                <span class="spotify-track-artist statsfm-track-artist">${artistName}</span>
              </div>
              <span class="spotify-track-time statsfm-track-time">${timeAgo}</span>
            </a>
          `;
        }).join("");
      }
    })
    .catch(() => {});

  // 3. Fetch Top Artists & Top Tracks dynamically for Step 3
  const fetchTop = fetch("/api/spotify/top")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((res) => [res.artists, res.tracks])
    .catch(() => {
      return Promise.all([
        fetch(`https://api.stats.fm/api/v1/users/${uid}/top/artists`, { headers: directHeaders }).then((r) => r.json()).catch(() => null),
        fetch(`https://api.stats.fm/api/v1/users/${uid}/top/tracks`, { headers: directHeaders }).then((r) => r.json()).catch(() => null)
      ]);
    });

  fetchTop.then(([artistsRes, tracksRes]) => {
    const favGrid = document.getElementById("fav-music-grid");
    if (!favGrid) return;

    const cards = [];
    if (artistsRes?.items && Array.isArray(artistsRes.items)) {
      artistsRes.items.slice(0, 4).forEach((item, idx) => {
        const art = item.artist || {};
        const spotifyId = art.externalIds?.spotify?.[0] || art.spotifyId;
        cards.push({
          name: art.name,
          image: art.image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
          url: spotifyId ? `https://open.spotify.com/artist/${spotifyId}` : `https://open.spotify.com/search/${encodeURIComponent(art.name)}`,
          genre: art.genres?.slice(0, 2).join(" / ") || (idx === 0 ? "Top Artist" : "Artist")
        });
      });
    }

    if (tracksRes?.items && Array.isArray(tracksRes.items)) {
      tracksRes.items.slice(0, 4).forEach((item) => {
        const trk = item.track || {};
        const artists = trk.artists?.map((a) => a.name).join(", ");
        const cover = trk.albums?.[0]?.image || trk.album?.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80";
        const spotifyId = trk.externalIds?.spotify?.[0] || trk.spotifyId;
        cards.push({
          name: trk.name,
          image: cover,
          url: spotifyId ? `https://open.spotify.com/track/${spotifyId}` : `https://open.spotify.com/search/${encodeURIComponent(trk.name)}`,
          genre: artists || "Track"
        });
      });
    }

    if (cards.length >= 8) {
      populateFavouriteMusic(cards.slice(0, 8));
    }
  }).catch(() => {});
}

// Backwards-compatibility alias
function syncStatsFmLive(userProfileUrl) {
  syncSpotifyLive();
}

/* --------------------------------------------------------------------------
   15. Spotify Live Connect & Status Bar
-------------------------------------------------------------------------- */
function populateSpotifyHub(sCfg = {}) {
  if (!sCfg) return;

  const statusText = document.getElementById("spotify-status-text");
  const currentSong = document.getElementById("spotify-current-song");
  const pulseDot = document.getElementById("spotify-pulse-dot");
  const rankEl = document.getElementById("spotify-rank");

  const favSong = sCfg.favoriteSong || {};

  // Rank badge
  if (rankEl && sCfg.rankBadge) {
    rankEl.textContent = sCfg.rankBadge;
  }

  function setFavoriteSongFallback() {
    if (statusText) statusText.textContent = "SPOTIFY CONNECTED";
    if (currentSong) currentSong.textContent = `${favSong.title || "Live Another Day"} • ${favSong.artist || "Kordhell"}`;
    if (pulseDot) pulseDot.className = "spotify-pulse-dot idle";
  }

  setFavoriteSongFallback();

  // Live Spotify Activity via Lanyard API
  const discordId = sCfg.discordUserId || "694051043998171198";

  function syncLiveSpotify() {
    if (!discordId) return;
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.success || !res.data) return;
        const data = res.data;

        if (data.listening_to_spotify && data.spotify) {
          const sp = data.spotify;
          if (statusText) statusText.textContent = "LIVE ON SPOTIFY";
          if (currentSong) currentSong.textContent = `${sp.song} • ${sp.artist}`;
          if (pulseDot) pulseDot.className = "spotify-pulse-dot";
          if (rankEl) rankEl.textContent = "LISTENING NOW";
        } else {
          setFavoriteSongFallback();
        }
      })
      .catch(() => {
        setFavoriteSongFallback();
      });
  }

  syncLiveSpotify();
  setInterval(syncLiveSpotify, 7000);

  // 3. Play / Pause preview hook connected to master audio
  const bgAudio = document.getElementById("bg-audio");
  if (playBtn && bgAudio) {
    playBtn.addEventListener("click", () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          if (playText) playText.textContent = "Pause Preview";
        }).catch(() => {});
      } else {
        bgAudio.pause();
        if (playText) playText.textContent = "Play Preview";
      }
    });

    bgAudio.addEventListener("play", () => {
      if (playText) playText.textContent = "Pause Preview";
    });
    bgAudio.addEventListener("pause", () => {
      if (playText) playText.textContent = "Play Preview";
    });
  }

  // 4. Populate "Heavy Rotation / Top Tracks"
  if (topTracksList && sCfg.topTracks) {
    topTracksList.innerHTML = sCfg.topTracks.slice(0, 3).map((tr) => `
      <div class="spotify-track-row" data-url="${tr.url || '#'}">
        <div class="track-row-left">
          <span class="track-rank-badge">${tr.rank}</span>
          <img src="${tr.cover}" alt="${tr.title}" class="track-row-thumb">
          <div class="track-row-info">
            <span class="track-row-title">${tr.title}</span>
            <span class="track-row-artist">${tr.artist}</span>
          </div>
        </div>
        <span class="track-row-streams">${tr.streams}</span>
      </div>
    `).join("");

    topTracksList.querySelectorAll(".spotify-track-row").forEach((row) => {
      row.addEventListener("click", () => {
        const url = row.dataset.url;
        if (url && url !== "#") window.open(url, "_blank");
      });
    });
  }

  // 5. Populate "Artists I Listen To" Grid
  if (artistsGrid && sCfg.artists) {
    if (artistsCount) artistsCount.textContent = `${sCfg.artists.length} favorites`;
    artistsGrid.innerHTML = sCfg.artists.map((a) => `
      <a href="${a.url || '#'}" target="_blank" rel="noopener noreferrer" class="artist-pill-card" title="Listen to ${a.name} on Spotify">
        <div class="artist-avatar-ring">
          <img src="${a.avatar}" alt="${a.name}" class="artist-avatar-sm">
          <span class="artist-check-badge">✓</span>
        </div>
        <div class="artist-info-sm">
          <span class="artist-name-sm">${a.name}</span>
          <span class="artist-genre-sm">${a.genre}</span>
          <span class="artist-listeners-sm">${a.listeners}</span>
        </div>
      </a>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   16. Production Full-Stack Suite (Analytics, Live Health, Guestbook)
-------------------------------------------------------------------------- */
function initFullStackSuite() {
  // A. View Tracking & Real-Time Analytics
  const viewsEl = document.getElementById("footer-views-count");
  if (viewsEl) {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname || "/" })
    })
      .then((r) => (r.ok ? r.json() : fetch("/api/views").then((r2) => r2.json())))
      .then((data) => {
        if (data && typeof data.views === "number") {
          viewsEl.textContent = `${data.views.toLocaleString()} views`;
        }
      })
      .catch(() => {});
  }

  // B. Live Health Indicator
  const healthBadge = document.getElementById("footer-health-badge");
  if (healthBadge) {
    fetch("/api/health")
      .then((r) => r.json())
      .then((res) => {
        if (res && res.status === "ok") {
          healthBadge.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span>Node.js API • Live</span>
          `;
          healthBadge.title = `Production API Healthy (Uptime: ${Math.round(res.uptime)}s)`;
        }
      })
      .catch(() => {
        healthBadge.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle></svg>
          <span>Static Mirror</span>
        `;
        healthBadge.title = "Operating in static client mode";
      });
  }

  // C. Toast Notification Helper
  const toastEl = document.getElementById("app-toast");
  let toastTimer = null;
  function showToast(msg, duration = 3000) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("visible");
    }, duration);
  }

  // D. Full-Stack Interactive Guestbook
  const modal = document.getElementById("guestbook-modal");
  const openBtn = document.getElementById("guestbook-toggle-btn");
  const closeBtn = document.getElementById("guestbook-close-btn");
  const form = document.getElementById("guestbook-form");
  const nameInput = document.getElementById("guestbook-name");
  const contactInput = document.getElementById("guestbook-contact");
  const msgInput = document.getElementById("guestbook-message");
  const charsEl = document.getElementById("guestbook-chars");
  const submitBtn = document.getElementById("guestbook-submit-btn");
  const messagesList = document.getElementById("guestbook-messages-list");

  if (!modal) return;

  function formatRelativeTime(iso) {
    if (!iso) return "just now";
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderMessages(messages) {
    if (!messagesList) return;
    if (!messages || messages.length === 0) {
      messagesList.innerHTML = `<p style="font-size: 0.78rem; color: #64748b; font-style: italic; padding: 10px 0;">No notes left yet. Be the first to drop one!</p>`;
      return;
    }

    messagesList.innerHTML = messages.slice(0, 15).map((m) => {
      const timeStr = formatRelativeTime(m.createdAt);
      const safeName = escapeHtml(m.name || "Anonymous");
      const safeContact = m.contact ? `<span style="font-size: 0.68rem; color: #64748b; font-weight: 400; margin-left: 6px;">(${escapeHtml(m.contact)})</span>` : "";
      const safeMsg = escapeHtml(m.message || "");

      return `
        <div class="guestbook-note-card">
          <div class="guestbook-note-header">
            <span class="guestbook-note-name">${safeName}${safeContact}</span>
            <span class="guestbook-note-time">${timeStr}</span>
          </div>
          <p class="guestbook-note-text">${safeMsg}</p>
        </div>
      `;
    }).join("");
  }

  function loadRecentNotes() {
    fetch("/api/messages")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (data && Array.isArray(data.messages)) {
          renderMessages(data.messages);
        }
      })
      .catch(() => {
        if (messagesList && !messagesList.children.length) {
          renderMessages([
            {
              name: "Welcome Bot",
              contact: "system",
              message: "Welcome to Adithyan's full-stack space! Leave a note or feedback above.",
              createdAt: new Date().toISOString()
            }
          ]);
        }
      });
  }

  function openGuestbook() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    loadRecentNotes();
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }

  function closeGuestbook() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  if (openBtn) openBtn.addEventListener("click", openGuestbook);
  if (closeBtn) closeBtn.addEventListener("click", closeGuestbook);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeGuestbook();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeGuestbook();
    }
  });

  if (msgInput && charsEl) {
    msgInput.addEventListener("input", () => {
      charsEl.textContent = msgInput.value.length;
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput?.value.trim();
      const contact = contactInput?.value.trim();
      const message = msgInput?.value.trim();

      if (!name || !message) {
        showToast("Please provide both your name and message.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Sending...";
      }

      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message })
      })
        .then(async (r) => {
          const res = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(res.error || "Failed to send message");
          return res;
        })
        .then(() => {
          showToast("Note published to live guestbook! 🚀");
          form.reset();
          if (charsEl) charsEl.textContent = "0";
          loadRecentNotes();
        })
        .catch((err) => {
          showToast(err.message || "Failed to post note. Please try again.");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector("span").textContent = "Send Note";
          }
        });
    });
  }

  // Pre-load on background load
  loadRecentNotes();
}
