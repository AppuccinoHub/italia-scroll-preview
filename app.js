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

  /* Bonus YouTube card: tap-to-play only (never autoplay, sound is opt-in).
     Uses the privacy-enhanced youtube-nocookie.com embed. If the school network
     blocks YouTube, the local still stays visible and a "Watch on YouTube" link is
     always shown, so the card never breaks. */
  function buildYouTubeFacade(visual, card) {
    const yt = card.youtube;
    const wrap = document.createElement('div');
    wrap.className = 'yt-wrap';
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'yt-play';
    play.setAttribute('aria-label', 'Play the video with sound');
    play.innerHTML = '<span class="yt-play-icon" aria-hidden="true">▶</span><span>Tap to play · sound on</span>';
    const link = document.createElement('a');
    link.className = 'yt-link';
    link.href = yt.url || 'https://www.youtube.com/watch?v=' + encodeURIComponent(yt.id);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Watch on YouTube ↗';
    const note = document.createElement('p');
    note.className = 'yt-note';
    note.hidden = true;
    note.textContent = 'The video didn’t load (YouTube may be blocked here). Use “Watch on YouTube”.';
    play.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (wrap.querySelector('iframe') || wrap.dataset.probing) return;
      // Probe first: if the network blocks YouTube, keep the local still + link.
      wrap.dataset.probing = '1';
      play.disabled = true;
      probeYouTube(yt.id, (ok) => {
        delete wrap.dataset.probing;
        play.disabled = false;
        if (!ok) {
          note.hidden = false;
          return;
        }
        insertFrame();
      });
    });
    function insertFrame() {
      const f = document.createElement('iframe');
      f.className = 'yt-frame';
      f.title = yt.title || 'YouTube video';
      f.src =
        'https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(yt.id) +
        '?autoplay=1&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=' +
        encodeURIComponent(yt.id); // loop = no end-screen suggestions
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.setAttribute('allowfullscreen', '');
      let loaded = false;
      const timer = setTimeout(() => {
        if (loaded) return;
        f.remove();
        play.hidden = false;
        note.hidden = false;
      }, 9000);
      f.addEventListener('load', () => {
        loaded = true;
        clearTimeout(timer);
      });
      f.addEventListener('error', () => {
        clearTimeout(timer);
        f.remove();
        play.hidden = false;
        note.hidden = false;
      });
      play.hidden = true;
      note.hidden = true;
      wrap.insertBefore(f, wrap.firstChild);
    }
    wrap.appendChild(play);
    wrap.appendChild(note);
    wrap.appendChild(link);
    visual.classList.add('has-yt');
    visual.insertBefore(wrap, visual.querySelector('.card-shade'));
  }

  // Both the embed host and the video's thumbnail must load (a school filter's
  // block page is not an image, so it fails). 5 s budget.
  function probeYouTube(id, cb) {
    const urls = [
      'https://www.youtube-nocookie.com/favicon.ico',
      'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/default.jpg',
    ];
    let left = urls.length;
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      cb(ok);
    };
    const timer = setTimeout(() => finish(false), 5000);
    urls.forEach((u) => {
      const im = new Image();
      im.onload = () => {
        left -= 1;
        if (left === 0) {
          clearTimeout(timer);
          finish(true);
        }
      };
      im.onerror = () => {
        clearTimeout(timer);
        finish(false);
      };
      im.src = u + (u.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now();
    });
  }

  // Stop any bonus YouTube player that is not on the current card (no sound off-screen).
  function resetOffscreenEmbeds(activeIdx) {
    const feed = $('feed');
    if (!feed) return;
    feed.querySelectorAll('.feed-card').forEach((cardEl) => {
      if (Number(cardEl.dataset.index) === activeIdx) return;
      const f = cardEl.querySelector('iframe.yt-frame');
      if (!f) return;
      f.remove();
      const play = cardEl.querySelector('.yt-play');
      if (play) play.hidden = false;
    });
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
    if (card.youtube && card.youtube.id) {
      if (imgUrl) addPhoto(visual, imgUrl, card, i);
      buildYouTubeFacade(visual, card);
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
    if (card.youtube) {
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
