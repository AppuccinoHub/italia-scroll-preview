(() => {
  'use strict';

  const DATA = window.ITALIA_SCROLL;
  if (!DATA) {
    console.error('Italia Scroll: data.js missing');
    return;
  }

  const UNLOCK_EVERY = DATA.unlockEvery || 15;
  // Single-tap flow: correct pick → brief "Brava/Bravo" + new-word note → auto-advance.
  const AUTO_ADVANCE_MS = 1400;
  let advanceTimer = null;
  function cancelAutoAdvance() {
    if (advanceTimer) clearTimeout(advanceTimer);
    advanceTimer = null;
  }

  const STORAGE = {
    progress: 'italiaScroll.progress.v2',
    mute: 'italiaScroll.muted',
    theme: 'italiaScroll.theme',
    student: 'italiaScroll.studentName',
    roster: 'italiaScroll.roster.v1',
  };

  const FOCUS = {
    Capri: '50% 45%',
    Tropea: '55% 48%',
    Polignano: '50% 40%',
    Alberobello: '48% 42%',
    Matera: '52% 42%',
    Amalfi: '52% 48%',
    Procida: '50% 45%',
    Ischia: '48% 36%',
    Bacoli: '50% 45%',
    'Monte di Procida': '50% 42%',
    Bologna: '50% 40%',
    Genova: '50% 42%',
    Braies: '50% 52%',
    Palermo: '50% 40%',
    Ortigia: '50% 42%',
    Torino: '50% 32%',
    Sperlonga: '50% 42%',
    Chioggia: '50% 45%',
    Ravenna: '50% 40%',
    Lecce: '50% 40%',
    Roma: '50% 55%',
  };

  const $ = (id) => document.getElementById(id);

  const state = {
    studentName: localStorage.getItem(STORAGE.student) || '',
    muted: localStorage.getItem(STORAGE.mute) !== '0',
    theme: ['light', 'fall', 'dark'].includes(localStorage.getItem(STORAGE.theme))
      ? localStorage.getItem(STORAGE.theme)
      : 'light',
    unlocked: 1,
    clearsTowardUnlock: 0,
    completed: {},
    mode: null,
    levelId: null,
    cards: [],
    index: 0,
    firstTryCorrect: 0,
    attempted: {},
    answeredOk: {},
    panelOpen: {},
  };

  let audioCtx = null;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE.progress);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.unlocked >= 1 && p.unlocked <= DATA.levels.length) state.unlocked = p.unlocked;
      if (typeof p.clearsTowardUnlock === 'number') state.clearsTowardUnlock = p.clearsTowardUnlock;
      if (p.completed && typeof p.completed === 'object') state.completed = p.completed;
    } catch (_) {}
  }

  function saveProgress() {
    localStorage.setItem(
      STORAGE.progress,
      JSON.stringify({
        unlocked: state.unlocked,
        clearsTowardUnlock: state.clearsTowardUnlock,
        completed: state.completed,
      })
    );
  }

  function loadRoster() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.roster) || '[]');
    } catch (_) {
      return [];
    }
  }

  function saveRosterEntry(entry) {
    const roster = loadRoster();
    roster.push(entry);
    while (roster.length > 200) roster.shift();
    localStorage.setItem(STORAGE.roster, JSON.stringify(roster));
  }

  function cardsForLevel(levelId) {
    return DATA.cards.filter((c) => c.level === levelId);
  }

  function cardsForQuick() {
    const byId = Object.fromEntries(DATA.cards.map((c) => [c.id, c]));
    const ids = (DATA.quickPlay && DATA.quickPlay.cardIds) || [];
    return ids.map((id) => byId[id]).filter(Boolean);
  }

  const THEMES = ['light', 'fall', 'dark'];
  const THEME_META = {
    light: { color: '#cfe8f8', nextIcon: '🍂', label: 'Theme: Sky lemon. Tap for Fall' },
    fall: { color: '#f6ebe0', nextIcon: '🌙', label: 'Theme: Fall. Tap for Dark' },
    dark: { color: '#141210', nextIcon: '🍋', label: 'Theme: Dark. Tap for Sky lemon' },
  };

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const meta = $('metaTheme');
    const info = THEME_META[state.theme];
    if (meta) meta.setAttribute('content', info.color);
    if ($('btnTheme')) {
      $('btnTheme').textContent = info.nextIcon;
      $('btnTheme').setAttribute('aria-label', info.label);
      $('btnTheme').title = info.label;
    }
  }

  function updateMuteUI() {
    if (!$('btnMute')) return;
    $('btnMute').textContent = state.muted ? '🔇' : '🔊';
    $('btnMute').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  }

  function beep(ok) {
    if (state.muted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.value = ok ? 660 : 280;
      g.gain.value = 0.04;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      o.stop(audioCtx.currentTime + 0.2);
    } catch (_) {}
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showScreen(el) {
    document.querySelectorAll('.screen').forEach((s) => {
      const on = s === el;
      s.classList.toggle('active', on);
      if (on) s.removeAttribute('hidden');
      else s.setAttribute('hidden', '');
    });
    const home = $('btnHome');
    if (home) home.hidden = el === $('screenStart') || el === $('screenName');
    const phone = $('phone');
    if (phone) phone.classList.toggle('play-mode', el === $('screenPlay'));
  }

  function showNameGate() {
    if (state.studentName) {
      showHome();
      return;
    }
    showScreen($('screenName'));
    const input = $('studentName');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 40);
    }
  }

  function commitName() {
    const input = $('studentName');
    const name = ((input && input.value) || '').trim().slice(0, 40);
    if (!name) {
      if (input) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
        input.focus();
      }
      return;
    }
    state.studentName = name;
    localStorage.setItem(STORAGE.student, name);
    showHome();
  }

  function showHome() {
    cancelAutoAdvance();
    resetOffscreenEmbeds(-1);
    const greet = $('homeGreet');
    if (greet) greet.textContent = state.studentName ? 'Ciao, ' + state.studentName : '';
    renderLevelList();
    showScreen($('screenStart'));
    if ($('headerSubtitle')) $('headerSubtitle').textContent = 'For You · Italiano 3';
  }

  function renderLevelList() {
    const list = $('levelList');
    if (!list) return;
    list.innerHTML = '';
    DATA.levels.forEach((lvl) => {
      const unlocked = lvl.id <= state.unlocked;
      const done = state.completed[String(lvl.id)];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-card' + (unlocked ? '' : ' locked');
      btn.setAttribute('role', 'listitem');
      btn.disabled = !unlocked;
      const icon = unlocked ? (lvl.id === 1 ? '🌊' : lvl.id === 2 ? '☀️' : '🏔️') : '🔒';
      btn.innerHTML =
        '<span class="level-num">' +
        icon +
        '</span><span><p class="lvl-title">' +
        escapeHtml(lvl.title) +
        '</p><p class="lvl-blurb">' +
        escapeHtml(lvl.blurb) +
        '</p></span><span class="lvl-meta">' +
        (done
          ? '★ ' + done.bestFirstTry + '/' + done.total
          : escapeHtml(lvl.minutes || '')) +
        '</span>';
      if (unlocked) btn.addEventListener('click', () => startLevel(lvl.id));
      list.appendChild(btn);
    });
  }

  function startLevel(levelId) {
    state.mode = 'level';
    state.levelId = levelId;
    state.cards = cardsForLevel(levelId);
    beginPlay();
  }

  function startQuick() {
    state.mode = 'quick';
    state.levelId = 'quick';
    state.cards = cardsForQuick();
    beginPlay();
  }

  function beginPlay() {
    cancelAutoAdvance();
    state.index = 0;
    state.firstTryCorrect = 0;
    state.attempted = {};
    state.answeredOk = {};
    state.panelOpen = {};
    const lvl = DATA.levels.find((l) => l.id === state.levelId);
    const badge =
      state.mode === 'quick'
        ? 'Quick · ' + ((DATA.quickPlay && DATA.quickPlay.minutes) || '')
        : (lvl && lvl.title) || 'Tappa ' + state.levelId;
    if ($('levelBadge')) $('levelBadge').textContent = badge;
    if ($('headerSubtitle')) {
      $('headerSubtitle').textContent = state.studentName
        ? state.studentName + ' · trip'
        : 'Italiano 3';
    }
    showScreen($('screenPlay'));
    renderFeed();
    updateSoftScore();
    updateNavLock();
    requestAnimationFrame(() => scrollToIndex(0, false));
  }

  function updateSoftScore() {
    const done = Object.keys(state.answeredOk).length;
    if ($('softScore')) {
      $('softScore').textContent =
        state.firstTryCorrect + ' · ' + done + '/' + state.cards.length;
    }
    if ($('feedPos')) {
      $('feedPos').textContent = state.index + 1 + ' / ' + state.cards.length;
    }
  }

  function renderFeed() {
    const feed = $('feed');
    feed.innerHTML = '';
    state.cards.forEach((card, i) => feed.appendChild(buildCardEl(card, i)));
    preloadNearbyImages(0);
    syncVideoMute(feed);
  }

  function pickImage(card, i) {
    if (card.image) return card.image;
    const placeImg = DATA.placeImages && DATA.placeImages[card.region];
    if (!placeImg) return '';
    if (Array.isArray(placeImg)) return placeImg[i % placeImg.length] || placeImg[0] || '';
    return placeImg;
  }


  function addPhoto(visual, imgUrl, card, i) {
    const img = document.createElement('img');
    img.className = 'card-photo';
    img.alt = card.region || '';
    img.decoding = 'async';
    img.loading = i < 3 ? 'eager' : 'lazy';
    if (i < 2) img.fetchPriority = 'high';
    img.src = imgUrl;
    img.style.objectPosition = FOCUS[card.region] || '50% 42%';
    img.addEventListener('load', () => visual.classList.add('has-photo'));
    img.addEventListener('error', () => {
      img.hidden = true;
      visual.classList.remove('has-photo');
    });
    visual.insertBefore(img, visual.querySelector('.card-shade'));
  }

  function syncVideoMute(root) {
    const muted = state.muted;
    (root || document).querySelectorAll('video.card-video').forEach((v) => {
      v.muted = true; // class autoplay always muted; sound toggle does not unmute classroom videos
      if (!muted) {
        // keep muted for school Chromebooks — sound toggle only affects beeps
      }
      try {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } catch (_) {}
    });
  }

  /* Bonus song card (v14.4): plays «Sarà perché ti amo» the way Arianna Scroll's song
     break does: the ORIGINAL 1981 recording as Apple Music's official 30-second iTunes
     preview (streamed from Apple only when the student taps Play, never rehosted), a
     spinning record, karaoke lyrics highlighted in sync (card.song.lyrics, t = seconds
     into the preview, a list when the line repeats) and tap-a-word meanings.
     Italia Scroll mechanics stay on top: pick the caption, no auto-advance, Finish, the
     song stops off-card; if the preview can't load we re-look-up the trackId (Apple can
     change preview URLs), then give up after 10 s with a note so the student can answer.
     No YouTube anywhere. */
  const songAudio = new Audio();
  songAudio.preload = 'none';
  const songState = { el: null, card: null, st: 'idle', stopAt: null, url: null, urlKey: null, triedLookup: false, timer: null, attempt: 0 };
  const SONG_LABELS = {
    idle: '▶ Tap to play · sound on',
    blocked: '▶ Tap to play · sound on',
    loading: 'Loading…',
    playing: '❚❚ Pause',
    paused: '▶ Play',
    ended: '↺ Play again',
  };
  let songRaf = 0;

  function songStatus(el, msg) {
    const s = el && el.querySelector('.song-status');
    if (s) s.textContent = msg;
  }

  function setSongState(el, st) {
    if (!el) return;
    if (el === songState.el) songState.st = st;
    el.dataset.song = st;
    el.classList.toggle('is-playing', st === 'playing');
    if (st === 'loading' || st === 'playing') {
      const box = el.querySelector('.lyrics');
      if (box) box.scrollTop = 0; // karaoke centring takes over from any manual scroll
    }
    const b = el.querySelector('.song-toggle');
    if (!b) return;
    b.textContent = SONG_LABELS[st] || SONG_LABELS.idle;
    b.setAttribute('aria-pressed', st === 'playing' ? 'true' : 'false');
    b.setAttribute('aria-label', st === 'playing' ? 'Pause the song' : 'Play the song with sound');
  }

  // Same line-picking rule as Arianna Scroll (a line starts 0.15 s early at most).
  const lyricStart = (ln, t) => {
    const ts = Array.isArray(ln.t) ? ln.t : [ln.t];
    let best = -1;
    ts.forEach((x) => {
      if (x <= t + 0.15 && x > best) best = x;
    });
    return best;
  };
  function syncLyrics(el, t) {
    const box = el && el.querySelector('.lyrics');
    const card = el === songState.el ? songState.card : null;
    if (!box || !card) return;
    let k = -1;
    if (t >= 0) {
      let best = -1;
      card.song.lyrics.forEach((ln, i) => {
        const st = lyricStart(ln, t);
        if (st >= 0 && st >= best) {
          best = st;
          k = i;
        }
      });
    }
    if (String(k) === box.dataset.on) return;
    box.dataset.on = String(k);
    const lines = box.querySelectorAll('.ly-line');
    lines.forEach((l, i) => {
      l.classList.toggle('on', i === k);
      l.classList.toggle('past', k >= 0 && i < k);
    });
    const list = box.querySelector('.ly-list');
    const cur = lines[Math.max(0, k)];
    if (list && cur) {
      const y = Math.max(0, cur.offsetTop - (box.clientHeight - cur.offsetHeight) / 2);
      list.style.transform = 'translateY(' + -y + 'px)';
    }
  }
  function lyricLoop() {
    cancelAnimationFrame(songRaf);
    if (!songState.el || songAudio.paused) return;
    syncLyrics(songState.el, songAudio.currentTime);
    songRaf = requestAnimationFrame(lyricLoop);
  }

  function stopSong() {
    songState.attempt += 1; // cancels a play that is still loading
    clearTimeout(songState.timer);
    cancelAnimationFrame(songRaf);
    const el = songState.el;
    if (el) songState.st = 'idle';
    try {
      songAudio.pause();
    } catch (_) {}
    if (el) {
      setSongState(el, 'idle');
      syncLyrics(el, -1);
      hideWordBubble(el);
      songStatus(el, 'Tap ▶ to hear the chorus. Tap any word for its meaning.');
    }
  }

  function playSong(cardEl, card) {
    const song = card.song;
    const key = String(song.trackId);
    if (songState.el && songState.el !== cardEl) stopSong();
    const resume = songState.el === cardEl && songState.st === 'paused';
    songState.el = cardEl;
    songState.card = card;
    songState.stopAt = song.lineEnd || null;
    const want = songState.url && songState.urlKey === key ? songState.url : song.preview;
    setSongState(cardEl, 'loading');
    songStatus(cardEl, 'Loading the song…');
    const go = (fromStart) => {
      const attempt = ++songState.attempt;
      clearTimeout(songState.timer);
      // A school filter can hang the request without an error: give up after 10 s.
      songState.timer = setTimeout(fail, 10000);
      const seekAndPlay = () => {
        if (attempt !== songState.attempt) return; // stopped or moved on while loading
        if (fromStart) {
          try {
            songAudio.currentTime = song.lineStart || 0;
          } catch (_) {}
        }
        const p = songAudio.play();
        if (p && p.then) {
          p.then(() => {
            clearTimeout(songState.timer);
            if (attempt !== songState.attempt || songState.el !== cardEl) {
              songAudio.pause();
              return;
            }
            setSongState(cardEl, 'playing');
            songStatus(cardEl, 'No sound? Check your volume, or just read and pick.');
            lyricLoop();
          }).catch(() => {
            if (attempt === songState.attempt) fail();
          });
        }
      };
      if (songAudio.readyState >= 1) seekAndPlay();
      else {
        songAudio.addEventListener('loadedmetadata', seekAndPlay, { once: true });
        songAudio.load();
      }
    };
    const fail = () => {
      songState.attempt += 1;
      clearTimeout(songState.timer);
      if (!songState.triedLookup) {
        songState.triedLookup = true;
        lookupPreview(song)
          .then((url) => {
            if (url && url !== songAudio.src) {
              songState.url = url;
              songState.urlKey = key;
              songAudio.src = url;
              go(true);
            } else offline();
          })
          .catch(offline);
      } else offline();
    };
    const offline = () => {
      clearTimeout(songState.timer);
      if (songState.el !== cardEl) return;
      setSongState(cardEl, 'blocked');
      songStatus(cardEl, 'The song can’t load right now (your network may block it). No problem: read the lyrics and pick.');
    };
    songAudio.onerror = () => {
      if (songState.el === cardEl && songState.st === 'loading') fail();
    };
    if (songAudio.src !== want) songAudio.src = want;
    go(!resume);
  }

  function lookupPreview(song) {
    return new Promise((res, rej) => {
      const ctl = 'AbortController' in window ? new AbortController() : null;
      const t = setTimeout(() => {
        if (ctl) ctl.abort();
        rej(new Error('timeout'));
      }, 6000);
      fetch('https://itunes.apple.com/lookup?id=' + encodeURIComponent(song.trackId) + '&country=it', ctl ? { signal: ctl.signal } : {})
        .then((r) => r.json())
        .then((j) => {
          clearTimeout(t);
          const r0 = j && j.results && j.results[0];
          res(r0 && r0.previewUrl);
        })
        .catch((e) => {
          clearTimeout(t);
          rej(e);
        });
    });
  }

  songAudio.addEventListener('timeupdate', () => {
    const el = songState.el;
    if (!el) return;
    if (songState.stopAt && songAudio.currentTime >= songState.stopAt && songState.st === 'playing') {
      songState.st = 'ended';
      songAudio.pause();
      setSongState(el, 'ended');
      syncLyrics(el, 99);
      songStatus(el, 'That was the chorus! Play it again as many times as you like.');
      return;
    }
    if (songState.st === 'playing') syncLyrics(el, songAudio.currentTime);
  });
  songAudio.addEventListener('pause', () => {
    const el = songState.el;
    if (!el || songState.st !== 'playing') return;
    setSongState(el, 'paused');
    songStatus(el, 'Paused. Tap ▶ Play to keep going.');
  });
  songAudio.addEventListener('ended', () => {
    const el = songState.el;
    if (!el) return;
    cancelAnimationFrame(songRaf);
    setSongState(el, 'ended');
    syncLyrics(el, 99);
    songStatus(el, 'That was the clip! Play it again as many times as you like.');
  });

  /* Tap a lyric word → its meaning (+ the infinitive for verbs), like Arianna's word bubble.
     The bubble stays inside the song panel and never goes above the lyrics box, so the
     title and «Ricchi e Poveri · 1981» are never covered. */
  function hideWordBubble(el) {
    const b = el && el.querySelector('.word-bubble');
    if (b) b.hidden = true;
  }
  function showWordBubble(inner, btn, entry) {
    const b = inner.querySelector('.word-bubble');
    if (!b) return;
    const [word, en, from] = entry;
    const w = word.replace(/^[…"«]+|[,.!?;:…»]+$/g, '');
    const strong = document.createElement('strong');
    strong.textContent = w;
    b.replaceChildren(strong, document.createTextNode(' = ' + en));
    if (from) {
      const s = document.createElement('span');
      s.className = 'wb-from';
      s.textContent = 'from ' + from;
      b.appendChild(s);
    }
    b.hidden = false;
    const ir = inner.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    const lr = inner.querySelector('.lyrics').getBoundingClientRect();
    const bw = Math.min(250, ir.width - 16);
    b.style.width = bw + 'px';
    let x = r.left + r.width / 2 - ir.left - bw / 2;
    x = Math.max(8, Math.min(x, ir.width - bw - 8));
    b.style.left = x + 'px';
    const h = b.offsetHeight;
    let y = r.bottom - ir.top + 6; // below the word
    if (y + h > ir.height - 4) y = r.top - ir.top - h - 6; // no room: above it…
    y = Math.max(y, lr.top - ir.top); // …but never above the lyrics box (title stays clear)
    b.style.top = y + 'px';
    clearTimeout(showWordBubble._t);
    showWordBubble._t = setTimeout(() => (b.hidden = true), 4500);
  }

  function buildSongFacade(visual, card) {
    const song = card.song;
    const mk = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };
    const inner = mk('div', 'song-inner');
    const disc = mk('div', 'disc-wrap');
    disc.setAttribute('aria-hidden', 'true');
    const rec = mk('div', 'record');
    const label = mk('img', 'record-label');
    label.src = card.image; // the app's own title card (gradient + music notes, no people, no place)
    label.alt = '';
    label.decoding = 'async';
    rec.appendChild(label);
    disc.appendChild(rec);
    const eq = mk('div', 'eq');
    for (let k = 0; k < 7; k++) eq.appendChild(mk('span'));
    disc.appendChild(eq);
    disc.appendChild(mk('span', 'note n1', '♪'));
    disc.appendChild(mk('span', 'note n2', '♫'));
    disc.appendChild(mk('span', 'note n3', '♪'));
    const head = mk('div', 'song-head');
    head.appendChild(mk('h3', 'song-title', song.title));
    head.appendChild(mk('p', 'song-artist', song.artist + ' · ' + song.year));
    const box = mk('div', 'lyrics');
    box.setAttribute('aria-label', 'Lyrics: tap a word to see what it means');
    box.dataset.on = '-2';
    const list = mk('div', 'ly-list');
    song.lyrics.forEach((ln) => {
      const line = mk('p', 'ly-line');
      line.lang = 'it';
      ln.w.forEach((entry, i) => {
        const b = mk('button', 'w', entry[0]);
        b.type = 'button';
        b.setAttribute('aria-label', entry[0] + ': ' + entry[1]);
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          showWordBubble(inner, b, entry);
        });
        line.appendChild(b);
        if (i < ln.w.length - 1) line.appendChild(document.createTextNode(' '));
      });
      list.appendChild(line);
    });
    box.appendChild(list);
    const btn = mk('button', 'song-toggle', SONG_LABELS.idle);
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Play the song with sound');
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const cardEl = visual.closest('.feed-card');
      if (songState.el === cardEl && songState.st === 'playing') {
        songAudio.pause();
        return;
      }
      if (songState.el === cardEl && songState.st === 'loading') return;
      playSong(cardEl, card);
    });
    const foot = mk('div', 'song-foot');
    const status = mk('p', 'song-status', 'Tap ▶ to hear the chorus. Tap any word for its meaning.');
    status.setAttribute('role', 'status');
    const credit = mk('p', 'song-credit');
    credit.innerHTML =
      'Preview courtesy of Apple Music · <a href="' +
      escapeHtml(song.view) +
      '" target="_blank" rel="noopener">Open in Apple Music</a>';
    credit.addEventListener('click', (ev) => ev.stopPropagation());
    foot.append(status, credit);
    const bubble = mk('div', 'word-bubble');
    bubble.setAttribute('role', 'status');
    bubble.hidden = true;
    inner.append(disc, head, box, btn, foot, bubble);
    inner.addEventListener('click', () => (bubble.hidden = true));
    visual.classList.add('has-song');
    visual.appendChild(inner);
  }

  // Stop the bonus song when its card is not the current one (no sound off-screen).
  function resetOffscreenEmbeds(activeIdx) {
    if (!songState.el) return;
    if (Number(songState.el.dataset.index) === activeIdx && document.contains(songState.el)) return;
    stopSong();
  }

  function buildCardEl(card, i) {
    const art = document.createElement('article');
    art.className = 'feed-card' + (card.hook ? ' hook-card' : '');
    art.dataset.index = String(i);
    art.dataset.id = card.id;

    const visual = document.createElement('div');
    visual.className = 'card-visual ' + (card.bg || 'bg-cinque');
    visual.innerHTML =
      '<div class="glow"></div>' +
      '<div class="card-emoji" aria-hidden="true">' +
      escapeHtml(card.emoji || '🇮🇹') +
      '</div><div class="card-shade"></div>';

    const imgUrl = pickImage(card, i);
    const vidUrl = card.video || '';
    if (card.song && card.song.trackId) {
      buildSongFacade(visual, card); // song panel (record + title + lyrics), no full-bleed photo
    } else if (vidUrl) {
      const vid = document.createElement('video');
      vid.className = 'card-video';
      if (imgUrl) vid.poster = imgUrl; // verified still = poster / fallback
      vid.src = vidUrl;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.loop = true;
      vid.autoplay = true;
      vid.preload = i < 2 ? 'auto' : 'metadata';
      vid.setAttribute('aria-label', (card.region || 'Italy') + ' clip');
      vid.addEventListener('loadeddata', () => visual.classList.add('has-photo', 'has-video'));
      vid.addEventListener('error', () => {
        vid.remove();
        visual.classList.remove('has-video');
        if (imgUrl) addPhoto(visual, imgUrl, card, i);
      });
      visual.insertBefore(vid, visual.querySelector('.card-shade'));
      // poster-ish fallback photo under video if provided
      if (imgUrl) {
        const img = document.createElement('img');
        img.className = 'card-photo card-photo--under';
        img.alt = '';
        img.decoding = 'async';
        img.src = imgUrl;
        img.style.objectPosition = FOCUS[card.region] || '50% 42%';
        visual.insertBefore(img, vid);
      }
      try {
        const p = vid.play();
        if (p && p.catch) p.catch(() => {});
      } catch (_) {}
    } else if (imgUrl) {
      addPhoto(visual, imgUrl, card, i);
    }

    const body = document.createElement('div');
    body.className = 'card-body';
    const tag = card.tag
      ? '<span class="region-sub">' + escapeHtml(card.tag) + '</span>'
      : '';
    const statement = card.prompt || card.statement || '';
    body.innerHTML =
      '<div class="region-row"><span class="region-tag">' +
      escapeHtml(card.region) +
      '</span>' +
      tag +
      '</div>' +
      (card.culture
        ? '<p class="culture">' + escapeHtml(card.culture) + '</p>'
        : '') +
      '<p class="statement">' +
      escapeHtml(statement) +
      '</p>' +
      '<p class="pick-label">Pick the Italian that says this</p>';

    const tools = document.createElement('div');
    tools.className = 'card-tools';
    const btnHelp = document.createElement('button');
    btnHelp.type = 'button';
    btnHelp.className = 'tool-btn';
    btnHelp.textContent = 'Help';
    btnHelp.setAttribute('aria-expanded', 'false');
    const btnExplain = document.createElement('button');
    btnExplain.type = 'button';
    btnExplain.className = 'tool-btn';
    btnExplain.textContent = 'Explanation';
    btnExplain.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.className = 'card-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'region');

    btnHelp.addEventListener('click', () =>
      togglePanel(card, 'help', btnHelp, btnExplain, panel)
    );
    btnExplain.addEventListener('click', () =>
      togglePanel(card, 'explain', btnHelp, btnExplain, panel)
    );
    tools.appendChild(btnHelp);
    tools.appendChild(btnExplain);
    body.appendChild(tools);
    body.appendChild(panel);

    const row = document.createElement('div');
    row.className = 'caption-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Pick the Italian that matches the English');
    card.captions.forEach((text, ci) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'caption-btn';
      b.textContent = text;
      b.dataset.idx = String(ci);
      b.addEventListener('click', () => onCaption(card, ci, art));
      row.appendChild(b);
    });

    const fb = document.createElement('div');
    fb.className = 'feedback';
    fb.hidden = true;
    fb.setAttribute('role', 'status');
    fb.setAttribute('aria-live', 'polite');

    const dock = document.createElement('div');
    dock.className = 'card-dock';
    dock.appendChild(body);
    dock.appendChild(row);
    dock.appendChild(fb);

    art.appendChild(visual);
    art.appendChild(dock);

    if (state.answeredOk[card.id]) {
      lockCardCorrect(art, card);
      showLockIn(art, card);
    }

    return art;
  }

  function togglePanel(card, kind, btnHelp, btnExplain, panel) {
    const cur = state.panelOpen[card.id];
    if (cur === kind) {
      state.panelOpen[card.id] = null;
      panel.hidden = true;
      panel.innerHTML = '';
      btnHelp.setAttribute('aria-expanded', 'false');
      btnExplain.setAttribute('aria-expanded', 'false');
      btnHelp.classList.remove('on');
      btnExplain.classList.remove('on');
      return;
    }
    state.panelOpen[card.id] = kind;
    panel.hidden = false;
    btnHelp.classList.toggle('on', kind === 'help');
    btnExplain.classList.toggle('on', kind === 'explain');
    btnHelp.setAttribute('aria-expanded', kind === 'help' ? 'true' : 'false');
    btnExplain.setAttribute('aria-expanded', kind === 'explain' ? 'true' : 'false');

    if (kind === 'help') {
      panel.innerHTML =
        '<p class="panel-label">Help</p><p>' +
        escapeHtml(
          card.help ||
            'Read the English line. Pick the Italian that says the same thing.'
        ) +
        '</p>';
    } else {
      const answered = !!state.answeredOk[card.id];
      const text = answered
        ? (card.explain || '').trim() ||
          'This caption matches the moment on the card.'
        : card.softExplain ||
          'Read the English line first. One Italian matches it; the other is the same person at the wrong time.';
      panel.innerHTML =
        '<p class="panel-label">Explanation</p><p>' + escapeHtml(text) + '</p>';
    }
  }

  function refreshExplainIfOpen(card, art) {
    if (state.panelOpen[card.id] !== 'explain') return;
    const panel = art.querySelector('.card-panel');
    if (!panel) return;
    const why =
      (card.explain || '').trim() ||
      'This caption matches the moment on the card.';
    panel.innerHTML =
      '<p class="panel-label">Explanation</p><p>' + escapeHtml(why) + '</p>';
    panel.hidden = false;
  }

  function lockCardCorrect(art, card) {
    art.querySelectorAll('.caption-btn').forEach((b, i) => {
      b.disabled = true;
      if (i === card.correct) b.classList.add('correct-flash');
    });
    const fb = art.querySelector('.feedback');
    if (fb) {
      fb.hidden = false;
      fb.className = 'feedback ok';
      fb.textContent = 'Brava/Bravo! ✓';
    }
  }

  function showLockIn(art, card) {
    const dock = art.querySelector('.card-dock') || art;
    let el = art.querySelector('.lock-in');
    if (!el) {
      el = document.createElement('div');
      el.className = 'lock-in';
      el.setAttribute('role', 'status');
      const fb = art.querySelector('.feedback');
      if (fb && fb.parentNode) fb.parentNode.insertBefore(el, fb.nextSibling);
      else dock.appendChild(el);
    }
    const li = card.lockIn;
    if (!li || !(li.it || li.en)) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.hidden = false;
    el.innerHTML =
      '<p class="lock-label">You locked in</p>' +
      '<p class="lock-it">' +
      escapeHtml(li.it || '') +
      '</p>' +
      '<p class="lock-en">' +
      escapeHtml(li.en || '') +
      '</p>';
  }

  function maybeSilentUnlock() {
    if (state.unlocked >= DATA.levels.length) return;
    state.clearsTowardUnlock += 1;
    if (state.clearsTowardUnlock >= UNLOCK_EVERY) {
      state.unlocked = Math.min(DATA.levels.length, state.unlocked + 1);
      state.clearsTowardUnlock = 0;
    }
    saveProgress();
  }

  function clearCard(art, card) {
    const already = !!state.answeredOk[card.id];
    state.answeredOk[card.id] = true;
    lockCardCorrect(art, card);
    refreshExplainIfOpen(card, art);
    if (!already) maybeSilentUnlock();
    updateSoftScore();
    updateNavLock();

    const allDone = state.cards.every((c) => state.answeredOk[c.id]);
    if (card.song) {
      // Let the song keep playing: no auto-advance. Student moves on when ready.
      cancelAutoAdvance();
      if (allDone) showFinishButton(art);
      return;
    }
    const cardIdx = state.cards.indexOf(card);
    cancelAutoAdvance();
    advanceTimer = setTimeout(() => {
      advanceTimer = null;
      if (!$('screenPlay').classList.contains('active')) return;
      if (allDone) {
        finishLevel();
        return;
      }
      // Only advance if she is still on this card (Next / arrow keys may have moved on already).
      if (state.index === cardIdx && state.index < state.cards.length - 1) goTo(state.index + 1);
    }, AUTO_ADVANCE_MS);
  }

  // On phones the dock scrolls: make sure the feedback / new-word note is actually visible.
  function revealFeedback(art) {
    const dock = art.querySelector('.card-dock');
    if (!dock) return;
    const li = art.querySelector('.lock-in');
    const target = li && !li.hidden ? li : art.querySelector('.feedback');
    if (!target || target.hidden) return;
    const over = target.getBoundingClientRect().bottom - dock.getBoundingClientRect().bottom + 8;
    if (over > 0) {
      try {
        dock.scrollBy({ top: over, behavior: 'smooth' });
      } catch (_) {
        dock.scrollTop += over;
      }
    }
  }

  function showFinishButton(art) {
    const fb = art.querySelector('.feedback');
    if (!fb || fb.querySelector('.finish-btn')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'finish-btn';
    b.textContent = 'Finish →';
    b.addEventListener('click', () => {
      resetOffscreenEmbeds(-1);
      finishLevel();
    });
    fb.appendChild(document.createTextNode(' '));
    fb.appendChild(b);
  }

  function onCaption(card, choiceIdx, art) {
    if (state.answeredOk[card.id]) return;
    const firstTry = !state.attempted[card.id];
    state.attempted[card.id] = true;
    const fb = art.querySelector('.feedback');
    const btns = art.querySelectorAll('.caption-btn');

    if (choiceIdx === card.correct) {
      if (firstTry) state.firstTryCorrect += 1;
      beep(true);
      btns.forEach((b) => b.classList.remove('miss'));
      showLockIn(art, card);
      clearCard(art, card); // one answer per card: lock, score, auto-advance
      revealFeedback(art);
    } else {
      beep(false);
      btns.forEach((b, i) => b.classList.toggle('miss', i === choiceIdx));
      fb.hidden = false;
      fb.className = 'feedback';
      fb.textContent =
        (card.why && card.why[choiceIdx]) ||
        'Not quite — same person, different time feel. Try again.';
      revealFeedback(art);
      updateSoftScore();
      updateNavLock();
    }
  }

  function finishLevel() {
    cancelAutoAdvance();
    resetOffscreenEmbeds(-1);
    const total = state.cards.length;
    const key = String(state.levelId);
    const prev = state.completed[key] || { bestFirstTry: 0, total: total, plays: 0 };
    state.completed[key] = {
      bestFirstTry: Math.max(prev.bestFirstTry || 0, state.firstTryCorrect),
      total: total,
      plays: (prev.plays || 0) + 1,
    };
    saveProgress();

    saveRosterEntry({
      name: state.studentName || 'Anonimo',
      mode: state.mode,
      levelId: state.levelId,
      levelTitle:
        state.mode === 'quick'
          ? 'Quick Play'
          : (DATA.levels.find((l) => l.id === state.levelId) || {}).title || key,
      firstTry: state.firstTryCorrect,
      total: total,
      at: new Date().toISOString(),
    });

    showScreen($('screenEnd'));
    const title =
      state.mode === 'quick'
        ? 'Quick Play fatto!'
        : ((DATA.levels.find((l) => l.id === state.levelId) || {}).title ||
            'Tappa') + ' — fatto!';
    if ($('endTitle')) $('endTitle').textContent = title;
    if ($('endScore')) {
      $('endScore').textContent =
        (state.studentName ? state.studentName + ' · ' : '') +
        state.firstTryCorrect +
        '/' +
        total +
        ' first try';
    }
    let note = '';
    if (state.mode === 'level' && state.unlocked > state.levelId) {
      const next = DATA.levels.find((l) => l.id === state.levelId + 1);
      if (next) note = '→ ' + next.title;
    }
    if ($('endNote')) {
      $('endNote').textContent = note;
      $('endNote').hidden = !note;
    }
    const nextBtn = $('btnNextLevel');
    if (nextBtn) {
      if (
        state.mode === 'level' &&
        state.levelId < DATA.levels.length &&
        state.unlocked >= state.levelId + 1
      ) {
        nextBtn.hidden = false;
        const next = DATA.levels.find((l) => l.id === state.levelId + 1);
        nextBtn.textContent = (next ? next.title : 'Next') + ' →';
      } else {
        nextBtn.hidden = true;
      }
    }
  }

  function canVisit(i) {
    if (i < 0 || i >= state.cards.length) return false;
    if (i === 0) return true;
    for (let j = 0; j < i; j++) {
      if (!state.answeredOk[state.cards[j].id]) return false;
    }
    return true;
  }

  function maxReachableIndex() {
    let max = 0;
    for (let j = 0; j < state.cards.length; j++) {
      if (state.answeredOk[state.cards[j].id]) max = j + 1;
      else {
        max = j;
        break;
      }
    }
    return Math.min(max, state.cards.length - 1);
  }

  function updateNavLock() {
    const prev = $('btnPrev');
    const next = $('btnNext');
    if (!prev || !next) return;
    prev.disabled = state.index <= 0;
    const nextIdx = state.index + 1;
    next.disabled = nextIdx >= state.cards.length || !canVisit(nextIdx);
  }


  function preloadNearbyImages(centerIdx) {
    const feed = $('feed');
    if (!feed) return;
    [centerIdx + 1, centerIdx + 2].forEach((j) => {
      const el = feed.querySelector('.feed-card[data-index="' + j + '"] .card-photo');
      if (!el || !el.src) return;
      if (el.complete) return;
      const warm = new Image();
      warm.decoding = 'async';
      warm.src = el.src;
    });
  }

  function scrollToIndex(i, smooth) {
    if (!canVisit(i)) i = maxReachableIndex();
    const feed = $('feed');
    const el = feed.querySelector('.feed-card[data-index="' + i + '"]');
    if (!el) return;
    el.scrollIntoView({
      behavior: smooth === false ? 'auto' : 'smooth',
      block: 'start',
    });
    state.index = i;
    resetOffscreenEmbeds(i);
    updateSoftScore();
    updateNavLock();
    preloadNearbyImages(i);
  }

  function goTo(i) {
    if (i < 0 || i >= state.cards.length) return;
    if (!canVisit(i)) return;
    scrollToIndex(i, true);
    syncVideoMute($('feed'));
  }

  function syncIndexFromScroll() {
    const feed = $('feed');
    const cards = [...feed.querySelectorAll('.feed-card')];
    if (!cards.length) return;
    const top = feed.scrollTop;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetTop - top);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (!canVisit(best)) {
      scrollToIndex(maxReachableIndex(), true);
      return;
    }
    if (best !== state.index) {
      state.index = best;
      resetOffscreenEmbeds(best);
      updateSoftScore();
      updateNavLock();
      preloadNearbyImages(best);
    }
  }

  function wire() {
    $('btnMute').addEventListener('click', () => {
      state.muted = !state.muted;
      localStorage.setItem(STORAGE.mute, state.muted ? '1' : '0');
      updateMuteUI();
    });
    $('btnTheme').addEventListener('click', () => {
      const i = THEMES.indexOf(state.theme);
      state.theme = THEMES[(i + 1) % THEMES.length];
      localStorage.setItem(STORAGE.theme, state.theme);
      applyTheme();
    });
    $('btnHome').addEventListener('click', showHome);
    $('btnQuick').addEventListener('click', startQuick);
    $('btnPrev').addEventListener('click', () => goTo(state.index - 1));
    $('btnNext').addEventListener('click', () => goTo(state.index + 1));

    const feed = $('feed');
    let scrollTimer = null;
    feed.addEventListener(
      'scroll',
      () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(syncIndexFromScroll, 80);
      },
      { passive: true }
    );

    document.addEventListener('keydown', (e) => {
      if ($('screenName') && $('screenName').classList.contains('active')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitName();
        }
        return;
      }
      if (!$('screenPlay').classList.contains('active')) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(state.index + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(state.index - 1);
      }
    });

    $('btnReplay').addEventListener('click', () => {
      if (state.mode === 'quick') startQuick();
      else startLevel(state.levelId);
    });
    $('btnNextLevel').addEventListener('click', () => {
      if (
        state.mode === 'level' &&
        state.levelId < DATA.levels.length &&
        state.unlocked >= state.levelId + 1
      ) {
        startLevel(state.levelId + 1);
      }
    });
    $('btnBackHome').addEventListener('click', showHome);

    const btnGo = $('btnNameGo');
    if (btnGo) btnGo.addEventListener('click', commitName);
    const btnChange = $('btnChangeName');
    if (btnChange) {
      btnChange.addEventListener('click', () => {
        state.studentName = '';
        localStorage.removeItem(STORAGE.student);
        showNameGate();
      });
    }
  }

  loadProgress();
  if (state.unlocked > DATA.levels.length) state.unlocked = DATA.levels.length;
  applyTheme();
  updateMuteUI();
  wire();
  showNameGate();
})();
