document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ИНТЕГРАЦИЯ VK BRIDGE & РЕКЛАМА
  // ==========================================
  let isVkReady = false;

  if (typeof vkBridge !== 'undefined') {
    vkBridge.send('VKWebAppInit')
      .then(() => {
        isVkReady = true;
        console.log('VK Bridge успешно инициализирован');
        showVkFullscreen();
      })
      .catch(err => {
        console.warn('VK Bridge не удалось инициализировать (возможно локальный запуск):', err);
      });
  } else {
    console.warn('VK Bridge не обнаружен в window');
  }

  // Межстраничный полноэкранный баннер
  function showVkFullscreen() {
    if (!isVkReady || typeof vkBridge === 'undefined') return;
    vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
      .then(data => console.log('VK Interstitial показан:', data.result))
      .catch(err => console.warn('Ошибка показа межстраничной рекламы VK:', err));
  }

  // Реклама за вознаграждение (Rewarded Video)
  function showVkRewarded(onRewardedCallback) {
    if (!isVkReady || typeof vkBridge === 'undefined') {
      // Фоллбэк: если запуск вне VK (локально), сразу выдаем награду
      if (typeof onRewardedCallback === 'function') onRewardedCallback();
      return;
    }

    vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' })
      .then(data => {
        if (data.result && typeof onRewardedCallback === 'function') {
          onRewardedCallback();
        }
      })
      .catch(err => {
        console.error('Ошибка или отмена показа Rewarded Video VK:', err);
      });
  }

  // Автопоказ межстраничной рекламы каждые 3 минуты (180 000 мс)
  setInterval(() => {
    showVkFullscreen();
  }, 180000);

  // ==========================================
  // 2. БАЗА ДАННЫХ И 5 КЕЙСОВ
  // ==========================================
  const AVATARS = [
    'img/user/user-ct.webp',
    'img/user/user-t.jpg',
    'img/user/user-3.jpg',
    'img/user/user-4.jpg',
    'img/user/user-5.jpg',
    'img/user/user-6.jpg',
    'img/user/user-7.jpg'
  ];

  const RANKS = [
    { level: 1, minCases: 0, name: 'Silver I' },
    { level: 2, minCases: 4, name: 'Silver Elite' },
    { level: 3, minCases: 10, name: 'Gold Nova I' },
    { level: 4, minCases: 20, name: 'Gold Nova Master' },
    { level: 5, minCases: 35, name: 'Master Guardian I' },
    { level: 6, minCases: 55, name: 'Master Guardian Elite' },
    { level: 7, minCases: 80, name: 'Distinguished Master Guardian' },
    { level: 8, minCases: 120, name: 'Legendary Eagle' },
    { level: 9, minCases: 170, name: 'Supreme Master First Class' },
    { level: 10, minCases: 240, name: 'The Global Elite' }
  ];

  const CASES = [
    {
      id: 'case_cheap',
      name: 'БОМЖ КЕЙС',
      desc: 'Дешевый кейс для фарма',
      price: 10.00,
      icon: 'img/skins/p250 песчаные дюны.png',
      items: [
        { id: 'p250_sand', name: 'P250 | Песчаные дюны', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.20, chance: 40, img: 'img/skins/p250 песчаные дюны.png' },
        { id: 'mp9_feather', name: 'MP9 | Пушинка', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.60, chance: 35, img: 'img/skins/МР9 Пушинка.png' },
        { id: 'sg553_cyber', name: 'SG 553 | Киберсила', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.90, chance: 15, img: 'img/skins/SG 553 Киберсила.png' },
        { id: 'm4a4_magnesium', name: 'M4A4 | Magnesium', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 14.00, chance: 8, img: 'img/skins/M4A4 Magnesium.png' },
        { id: 'glock_umbra', name: 'Glock-18 | Umbral Rabbit', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 18.00, chance: 2, img: 'img/skins/Glock-18 Umbral Rabbit.png' }
      ]
    },
    {
      id: 'case_recoil',
      name: 'ОТДАЧА КЕЙС',
      desc: 'Сбалансированный кейс',
      price: 25.00,
      icon: 'img/skins/M4A4 Magnesium.png',
      items: [
        { id: 'r8_banana', name: 'R8 | Banana Cannon', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 3.20, chance: 35, img: 'img/skins/R8 Banana Cannon.png' },
        { id: 'ak47_slate', name: 'AK-47 | Сланец', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 4.50, chance: 30, img: 'img/skins/Ak-47 сланец.png' },
        { id: 'mac10_sakkaku', name: 'MAC-10 | Sakkaku', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 16.50, chance: 20, img: 'img/skins/MAC-10 Sakkaku.png' },
        { id: 'm4a1s_night', name: 'M4A1-S | Night Terror', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 22.00, chance: 10, img: 'img/skins/M4A1-S Night Terror.png' },
        { id: 'awp_atheris', name: 'AWP | Atheris', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 75.00, chance: 5, img: 'img/skins/AWP Atheris.png' }
      ]
    },
    {
      id: 'case_revolution',
      name: 'РЕВОЛЮЦИЯ КЕЙС',
      desc: 'Классика с ножами и AK-47',
      price: 50.00,
      icon: 'img/skins/AK-47 Head Shot.png',
      items: [
        { id: 'p250_sand', name: 'P250 | Песчаные дюны', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.20, chance: 12, img: 'img/skins/p250 песчаные дюны.png' },
        { id: 'mp9_feather', name: 'MP9 | Пушинка', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.60, chance: 11, img: 'img/skins/МР9 Пушинка.png' },
        { id: 'sg553_cyber', name: 'SG 553 | Киберсила', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 2.90, chance: 11, img: 'img/skins/SG 553 Киберсила.png' },
        { id: 'r8_banana', name: 'R8 | Banana Cannon', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 3.20, chance: 11, img: 'img/skins/R8 Banana Cannon.png' },
        { id: 'ak47_slate', name: 'AK-47 | Сланец', rarity: 'milspec', rarityTitle: 'АРМЕЙСКОЕ', price: 4.50, chance: 10, img: 'img/skins/Ak-47 сланец.png' },
        { id: 'm4a4_magnesium', name: 'M4A4 | Magnesium', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 14.00, chance: 6, img: 'img/skins/M4A4 Magnesium.png' },
        { id: 'mac10_sakkaku', name: 'MAC-10 | Sakkaku', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 16.50, chance: 5, img: 'img/skins/MAC-10 Sakkaku.png' },
        { id: 'glock_umbra', name: 'Glock-18 | Umbral Rabbit', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 18.00, chance: 5, img: 'img/skins/Glock-18 Umbral Rabbit.png' },
        { id: 'm4a1s_night', name: 'M4A1-S | Night Terror', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 22.00, chance: 5, img: 'img/skins/M4A1-S Night Terror.png' },
        { id: 'usp_ticket', name: 'USP-S | Ticket to Hell', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 26.00, chance: 4, img: 'img/skins/USP-S Ticket to Hell.png' },
        { id: 'awp_atheris', name: 'AWP | Atheris', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 75.00, chance: 3.5, img: 'img/skins/AWP Atheris.png' },
        { id: 'ak47_ice', name: 'AK-47 | Ice Coaled', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 88.00, chance: 3, img: 'img/skins/AK-47 Ice Coaled.png' },
        { id: 'p90_neoqueen', name: 'P90 | Neoqueen', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 92.00, chance: 3, img: 'img/skins/P90 Neoqueen.png' },
        { id: 'deagle_trigger', name: 'Deagle | Trigger Discipline', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 110.00, chance: 2.5, img: 'img/skins/Desert Eagle Trigger Discipline.png' },
        { id: 'ak47_headshot', name: 'AK-47 | Head Shot', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 340.00, chance: 2.2, img: 'img/skins/AK-47 Head Shot.png' },
        { id: 'm4a4_temukau', name: 'M4A4 | Temukau', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 390.00, chance: 2, img: 'img/skins/M4A4 Temukau.png' },
        { id: 'awp_chromatic', name: 'AWP | Chromatic Aberration', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 420.00, chance: 1.8, img: 'img/skins/AWP Chromatic Aberration.png' },
        { id: 'knife_karambit', name: '★ Karambit | Doppler', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 1850.00, chance: 0.4, img: 'img/skins/Karambit Doppler.png' },
        { id: 'knife_m9', name: '★ M9 Bayonet | Fade', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 2100.00, chance: 0.3, img: 'img/skins/M9 Bayonet Fade.png' },
        { id: 'knife_butterfly', name: '★ Butterfly | Marble Fade', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 2600.00, chance: 0.3, img: 'img/skins/Butterfly Knife Marble Fade.png' }
      ]
    },
    {
      id: 'case_covert',
      name: 'ТАЙНЫЙ КЕЙС',
      desc: 'Повышенный шанс на редкие скины',
      price: 100.00,
      icon: 'img/skins/AWP Chromatic Aberration.png',
      items: [
        { id: 'usp_ticket', name: 'USP-S | Ticket to Hell', rarity: 'restricted', rarityTitle: 'ЗАПРЕЩЕННОЕ', price: 26.00, chance: 30, img: 'img/skins/USP-S Ticket to Hell.png' },
        { id: 'awp_atheris', name: 'AWP | Atheris', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 75.00, chance: 25, img: 'img/skins/AWP Atheris.png' },
        { id: 'ak47_ice', name: 'AK-47 | Ice Coaled', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 88.00, chance: 20, img: 'img/skins/AK-47 Ice Coaled.png' },
        { id: 'ak47_headshot', name: 'AK-47 | Head Shot', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 340.00, chance: 15, img: 'img/skins/AK-47 Head Shot.png' },
        { id: 'm4a4_temukau', name: 'M4A4 | Temukau', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 390.00, chance: 8, img: 'img/skins/M4A4 Temukau.png' },
        { id: 'knife_karambit', name: '★ Karambit | Doppler', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 1850.00, chance: 2, img: 'img/skins/Karambit Doppler.png' }
      ]
    },
    {
      id: 'case_knife_only',
      name: 'НОЖЕВОЙ КЕЙС ★',
      desc: 'Только ножи и лучшее оружие',
      price: 250.00,
      icon: 'img/skins/Karambit Doppler.png',
      items: [
        { id: 'deagle_trigger', name: 'Deagle | Trigger Discipline', rarity: 'classified', rarityTitle: 'ЗАСЕКРЕЧЕННОЕ', price: 110.00, chance: 40, img: 'img/skins/Desert Eagle Trigger Discipline.png' },
        { id: 'ak47_headshot', name: 'AK-47 | Head Shot', rarity: 'covert', rarityTitle: 'ТАЙНОЕ', price: 340.00, chance: 30, img: 'img/skins/AK-47 Head Shot.png' },
        { id: 'knife_karambit', name: '★ Karambit | Doppler', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 1850.00, chance: 12, img: 'img/skins/Karambit Doppler.png' },
        { id: 'knife_m9', name: '★ M9 Bayonet | Fade', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 2100.00, chance: 10, img: 'img/skins/M9 Bayonet Fade.png' },
        { id: 'knife_butterfly', name: '★ Butterfly | Marble Fade', rarity: 'gold', rarityTitle: 'РЕЗЕРВНЫЙ НОЖ ★', price: 2600.00, chance: 8, img: 'img/skins/Butterfly Knife Marble Fade.png' }
      ]
    }
  ];

  function getAllUniqueSkins() {
    const list = [];
    CASES.forEach(c => {
      c.items.forEach(it => {
        if (!list.some(x => x.id === it.id)) list.push(it);
      });
    });
    return list;
  }

  // ==========================================
  // 3. ИГРОВОЕ СОСТОЯНИЕ
  // ==========================================
  let state = {
    playerName: 'Player',
    balance: 250.00,
    casesOpened: 0,
    currentCaseIndex: 0,
    avatarUrl: AVATARS[0],
    inventory: [],
    quests: {
      open5: { current: 0, target: 5, reward: 80, done: false, title: 'Открой 5 кейсов' },
      upgrade1: { current: 0, target: 1, reward: 120, done: false, title: 'Выиграй 1 Апгрейд' },
      contract1: { current: 0, target: 1, reward: 100, done: false, title: 'Подпиши 1 Контракт' }
    }
  };

  const saved = localStorage.getItem('cs2_case_save');
  if (saved) {
    try {
      const p = JSON.parse(saved);
      state = { ...state, ...p, quests: { ...state.quests, ...(p.quests || {}) } };
    } catch (e) {}
  }

  function save() {
    localStorage.setItem('cs2_case_save', JSON.stringify(state));
  }

  function getActiveCase() {
    return CASES[state.currentCaseIndex] || CASES[0];
  }

  // ==========================================
  // 4. ЗВУКИ (WEB AUDIO)
  // ==========================================
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  const Sound = {
    tick() {
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    },
    shoot() {
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.09);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    },
    hit() {
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    },
    win() {
      try {
        const ctx = getAudioCtx();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.07);
          osc.stop(ctx.currentTime + idx * 0.07 + 0.38);
        });
      } catch (e) {}
    }
  };

  // ==========================================
  // 5. ИНТЕРФЕЙС КЕЙСОВ
  // ==========================================
  let isRolling = false;
  let pendingWonItem = null;

  const elBalance = document.getElementById('balance');
  const elCasesOpened = document.getElementById('cases-opened');
  const elPlayerRank = document.getElementById('player-rank');
  const elPlayerName = document.getElementById('player-name');
  const elCurrentAvatar = document.getElementById('current-avatar');
  const elInvTotalValue = document.getElementById('inv-total-value');
  const elInvCount = document.getElementById('inv-count');
  const elInvItemsCount = document.getElementById('inv-items-count');
  const elInvValueHeader = document.getElementById('inv-value-header');

  const elCaseSelector = document.getElementById('case-selector');
  const elCaseTitle = document.getElementById('current-case-title');
  const elCaseDesc = document.getElementById('current-case-desc');
  const elCasePrice = document.getElementById('current-case-price');
  const elCasePreview = document.getElementById('case-items-preview');

  const elTape = document.getElementById('tape');
  const elBtnOpen = document.getElementById('btn-open');
  const elBtnDailyCase = document.getElementById('btn-daily-case');
  const elBtnFastOpen = document.getElementById('btn-fast-open');
  const elBtnFarmAd = document.getElementById('btn-farm-ad');
  const elInventory = document.getElementById('inventory');
  const elInvEmptyMsg = document.getElementById('inv-empty-msg');
  const elBtnSellAll = document.getElementById('btn-sell-all');

  function createSkinCard(item) {
    const card = document.createElement('div');
    card.className = `skin-card rarity-${item.rarity}`;
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="skin-img" loading="lazy">
      <div class="skin-name" title="${item.name}">${item.name}</div>
      <div class="skin-price">${item.price.toFixed(2)} $</div>
    `;
    return card;
  }

  function updateUI() {
    const curCase = getActiveCase();
    elBalance.textContent = state.balance.toFixed(2);
    elCasesOpened.textContent = state.casesOpened;

    let curRank = RANKS[0];
    for (const r of RANKS) if (state.casesOpened >= r.minCases) curRank = r;
    elPlayerRank.textContent = curRank.name;
    elPlayerName.textContent = state.playerName;
    elCurrentAvatar.src = state.avatarUrl;

    elCaseTitle.textContent = curCase.name;
    elCaseDesc.textContent = curCase.desc;
    elCasePrice.textContent = `${curCase.price.toFixed(2)} $`;
    elBtnOpen.disabled = state.balance < curCase.price || isRolling;

    const totalVal = state.inventory.reduce((sum, i) => sum + i.price, 0);
    elInvTotalValue.textContent = totalVal.toFixed(2);
    elInvValueHeader.textContent = totalVal.toFixed(2);
    elInvCount.textContent = state.inventory.length;
    elInvItemsCount.textContent = state.inventory.length;

    renderCaseSelector();
    renderInventory();
    renderQuests();
  }

  function renderCaseSelector() {
    elCaseSelector.innerHTML = '';
    CASES.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = `case-select-btn ${idx === state.currentCaseIndex ? 'active' : ''}`;
      btn.innerHTML = `<img src="${c.icon}" alt="case"> <span>${c.name} (${c.price}$)</span>`;
      btn.onclick = () => {
        state.currentCaseIndex = idx;
        updateUI();
        renderCasePreview();
      };
      elCaseSelector.appendChild(btn);
    });
  }

  function renderCasePreview() {
    elCasePreview.innerHTML = '';
    getActiveCase().items.forEach(item => {
      const card = createSkinCard(item);
      card.onclick = () => openInspect(item, null);
      elCasePreview.appendChild(card);
    });
  }

  function renderInventory() {
    elInventory.innerHTML = '';
    if (state.inventory.length === 0) {
      elInvEmptyMsg.style.display = 'block';
      return;
    }
    elInvEmptyMsg.style.display = 'none';
    state.inventory.forEach((item, idx) => {
      const card = createSkinCard(item);
      card.onclick = () => openInspect(item, idx);
      elInventory.appendChild(card);
    });
  }

  function rollItem() {
    const items = getActiveCase().items;
    const rand = Math.random() * 100;
    let acc = 0;
    for (const it of items) {
      acc += it.chance;
      if (rand <= acc) return it;
    }
    return items[0];
  }

  function openCase(isFast = false) {
    const curCase = getActiveCase();
    if (state.balance < curCase.price || isRolling) return;

    state.balance -= curCase.price;
    state.casesOpened += 1;
    isRolling = true;

    if (state.quests.open5 && !state.quests.open5.done) state.quests.open5.current += 1;
    updateUI();

    if (isFast) {
      const won = rollItem();
      isRolling = false;
      showWin(won);
      return;
    }

    elTape.style.transition = 'none';
    elTape.style.transform = 'translateX(0px)';
    elTape.innerHTML = '';

    const tapeItems = [];
    for (let i = 0; i < 45; i++) {
      const it = rollItem();
      tapeItems.push(it);
      elTape.appendChild(createSkinCard(it));
    }

    pendingWonItem = tapeItems[35];

    let ticks = 0;
    const tickInt = setInterval(() => {
      Sound.tick();
      ticks++;
      if (ticks > 32) clearInterval(tickInt);
    }, 140);

    const containerWidth = elTape.parentElement.offsetWidth;
    const targetX = (35 * 138) - (containerWidth / 2) + 50;

    elTape.offsetHeight;
    elTape.style.transition = 'transform 5s cubic-bezier(0.12, 0.95, 0.25, 1)';
    elTape.style.transform = `translateX(-${targetX}px)`;

    setTimeout(() => {
      isRolling = false;
      showWin(pendingWonItem);
    }, 5100);
  }

  const elWinModal = document.getElementById('win-modal');
  const elWinTitle = document.getElementById('win-title');
  const elWinImg = document.getElementById('win-img');
  const elWinRarity = document.getElementById('win-rarity-text');
  const elWinPrice = document.getElementById('win-price');

  function showWin(item) {
    Sound.win();
    pendingWonItem = item;
    elWinTitle.textContent = item.name;
    elWinImg.src = item.img;
    elWinRarity.textContent = item.rarityTitle;
    elWinPrice.textContent = `+${item.price.toFixed(2)} $`;
    elWinModal.classList.add('active');
    if (item.rarity === 'covert' || item.rarity === 'gold') launchConfetti();
    save(); updateUI();
  }

  document.getElementById('btn-modal-keep').onclick = () => {
    state.inventory.unshift(pendingWonItem);
    elWinModal.classList.remove('active');
    save(); updateUI();
  };
  document.getElementById('btn-modal-sell').onclick = () => {
    state.balance += pendingWonItem.price;
    elWinModal.classList.remove('active');
    save(); updateUI();
  };
  document.getElementById('btn-modal-inspect').onclick = () => {
    elWinModal.classList.remove('active');
    openInspect(pendingWonItem, null);
  };

  elBtnOpen.onclick = () => openCase(false);
  elBtnFastOpen.onclick = () => openCase(true);

  // Бесплатный кейс за рекламу VK
  elBtnDailyCase.onclick = () => {
    showVkRewarded(() => {
      state.balance += getActiveCase().price;
      openCase(false);
    });
  };

  // Фарм валюты: +250$ за просмотр видео VK
  elBtnFarmAd.onclick = () => {
    showVkRewarded(() => {
      state.balance += 250.00;
      save(); updateUI(); launchConfetti();
    });
  };

  elBtnSellAll.onclick = () => {
    state.balance += state.inventory.reduce((sum, i) => sum + i.price, 0);
    state.inventory = [];
    save(); updateUI();
  };

  // ==========================================
  // 6. 2D АРЕНА ВЫЖИВАНИЯ
  // ==========================================
  const aCanvas = document.getElementById('arena-canvas');
  const aCtx = aCanvas ? aCanvas.getContext('2d') : null;
  let arenaRunning = false;
  let arenaAnimId = null;

  let enemyBaseSpeed = 1.3;
  let arenaRewardMult = 1.5;

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      enemyBaseSpeed = parseFloat(btn.dataset.speed);
      arenaRewardMult = parseFloat(btn.dataset.reward);
      resetArena();
    };
  });

  let aPlayer = { x: 400, y: 230, r: 16, hp: 100, speed: 3.5, angle: 0 };
  let aBalls = [], aBullets = [], aDrops = [];
  let aKeys = {}, aMouse = { x: 400, y: 200 };
  let aScore = 0, aAmmo = 30, aReloading = false;
  let aLoot = { money: 0, skins: 0 };

  window.addEventListener('keydown', e => {
    aKeys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === 'r' && !aReloading && aAmmo < 30) reloadArena();
  });
  window.addEventListener('keyup', e => aKeys[e.key.toLowerCase()] = false);

  if (aCanvas) {
    aCanvas.addEventListener('mousemove', e => {
      const rect = aCanvas.getBoundingClientRect();
      const scaleX = aCanvas.width / rect.width;
      const scaleY = aCanvas.height / rect.height;
      aMouse.x = (e.clientX - rect.left) * scaleX;
      aMouse.y = (e.clientY - rect.top) * scaleY;
    });
    aCanvas.addEventListener('mousedown', () => {
      if (arenaRunning) shootArena();
    });
  }

  function resetArena() {
    aPlayer = { x: 400, y: 230, r: 16, hp: 100, speed: 3.5, angle: 0 };
    aBalls = []; aBullets = []; aDrops = [];
    aScore = 0; aAmmo = 30; aReloading = false;
    aLoot = { money: 0, skins: 0 };
    document.getElementById('arena-gameover').style.display = 'none';
    updateArenaHUD();
    arenaRunning = true;
    loopArena();
  }

  function reloadArena() {
    aReloading = true;
    document.getElementById('arena-ammo').textContent = 'ПЕРЕЗАРЯДКА...';
    setTimeout(() => {
      aAmmo = 30; aReloading = false;
      updateArenaHUD();
    }, 1100);
  }

  function shootArena() {
    if (aReloading || aAmmo <= 0) {
      if (aAmmo <= 0) reloadArena();
      return;
    }
    aAmmo--;
    updateArenaHUD();
    Sound.shoot();

    const angle = Math.atan2(aMouse.y - aPlayer.y, aMouse.x - aPlayer.x);
    aBullets.push({
      x: aPlayer.x, y: aPlayer.y,
      vx: Math.cos(angle) * 12, vy: Math.sin(angle) * 12,
      r: 4
    });
  }

  function updateArenaHUD() {
    document.getElementById('arena-hp').textContent = Math.max(0, Math.floor(aPlayer.hp));
    document.getElementById('arena-score').textContent = aScore;
    if (!aReloading) document.getElementById('arena-ammo').textContent = `${aAmmo} / 30`;
  }

  function spawnBall() {
    if (aBalls.length > 20) return;
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -20 : aCanvas.width + 20;
      y = Math.random() * aCanvas.height;
    } else {
      x = Math.random() * aCanvas.width;
      y = Math.random() < 0.5 ? -20 : aCanvas.height + 20;
    }

    const isBig = Math.random() < 0.2;
    aBalls.push({
      x, y,
      r: isBig ? 18 : 13,
      hp: isBig ? 3 : 1,
      speed: (enemyBaseSpeed + Math.random() * 0.4),
      color: isBig ? '#ef4444' : '#f97316'
    });
  }

  function loopArena() {
    if (!arenaRunning || !aCtx) return;
    arenaAnimId = requestAnimationFrame(loopArena);

    let dx = 0, dy = 0;
    if (aKeys['w'] || aKeys['ц'] || aKeys['arrowup']) dy -= 1;
    if (aKeys['s'] || aKeys['ы'] || aKeys['arrowdown']) dy += 1;
    if (aKeys['a'] || aKeys['ф'] || aKeys['arrowleft']) dx -= 1;
    if (aKeys['d'] || aKeys['в'] || aKeys['arrowright']) dx += 1;
    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
    aPlayer.x = Math.max(aPlayer.r, Math.min(aCanvas.width - aPlayer.r, aPlayer.x + dx * aPlayer.speed));
    aPlayer.y = Math.max(aPlayer.r, Math.min(aCanvas.height - aPlayer.r, aPlayer.y + dy * aPlayer.speed));
    aPlayer.angle = Math.atan2(aMouse.y - aPlayer.y, aMouse.x - aPlayer.x);

    if (Math.random() < 0.03) spawnBall();

    for (let i = aBullets.length - 1; i >= 0; i--) {
      const b = aBullets[i];
      b.x += b.vx; b.y += b.vy;
      if (b.x < 0 || b.x > aCanvas.width || b.y < 0 || b.y > aCanvas.height) {
        aBullets.splice(i, 1);
        continue;
      }
      for (let j = aBalls.length - 1; j >= 0; j--) {
        const ball = aBalls[j];
        if (Math.hypot(b.x - ball.x, b.y - ball.y) < b.r + ball.r) {
          ball.hp--;
          aBullets.splice(i, 1);
          Sound.hit();
          if (ball.hp <= 0) {
            aBalls.splice(j, 1);
            aScore++;
            updateArenaHUD();

            const gain = Math.floor((Math.random() * 15 + 5) * arenaRewardMult);
            if (Math.random() < 0.4) {
              aDrops.push({ x: ball.x, y: ball.y, type: 'money', val: gain });
            } else if (Math.random() < 0.15 * arenaRewardMult) {
              aDrops.push({ x: ball.x, y: ball.y, type: 'skin' });
            }
          }
          break;
        }
      }
    }

    for (let i = aBalls.length - 1; i >= 0; i--) {
      const ball = aBalls[i];
      const angle = Math.atan2(aPlayer.y - ball.y, aPlayer.x - ball.x);
      ball.x += Math.cos(angle) * ball.speed;
      ball.y += Math.sin(angle) * ball.speed;

      if (Math.hypot(aPlayer.x - ball.x, aPlayer.y - ball.y) < aPlayer.r + ball.r) {
        aPlayer.hp -= 0.5;
        updateArenaHUD();
        if (aPlayer.hp <= 0) {
          arenaRunning = false;
          document.getElementById('loot-summary').textContent = `+${aLoot.money}$ и ${aLoot.skins} скинов`;
          document.getElementById('arena-gameover').style.display = 'flex';
          return;
        }
      }
    }

    for (let i = aDrops.length - 1; i >= 0; i--) {
      const d = aDrops[i];
      if (Math.hypot(aPlayer.x - d.x, aPlayer.y - d.y) < aPlayer.r + 14) {
        if (d.type === 'money') {
          aLoot.money += d.val;
          state.balance += d.val;
        } else {
          aLoot.skins++;
          const all = getAllUniqueSkins();
          state.inventory.unshift(all[Math.floor(Math.random() * all.length)]);
        }
        aDrops.splice(i, 1);
        save(); updateUI();
      }
    }

    aCtx.clearRect(0, 0, aCanvas.width, aCanvas.height);

    aCtx.strokeStyle = '#181f2a';
    for (let x = 0; x < aCanvas.width; x += 35) {
      aCtx.beginPath(); aCtx.moveTo(x, 0); aCtx.lineTo(x, aCanvas.height); aCtx.stroke();
    }
    for (let y = 0; y < aCanvas.height; y += 35) {
      aCtx.beginPath(); aCtx.moveTo(0, y); aCtx.lineTo(aCanvas.width, y); aCtx.stroke();
    }

    aDrops.forEach(d => {
      aCtx.fillStyle = d.type === 'money' ? '#4ade80' : '#de9b35';
      aCtx.beginPath(); aCtx.arc(d.x, d.y, 8, 0, Math.PI * 2); aCtx.fill();
    });

    aCtx.fillStyle = '#fef08a';
    aBullets.forEach(b => {
      aCtx.beginPath(); aCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2); aCtx.fill();
    });

    aBalls.forEach(ball => {
      aCtx.fillStyle = ball.color;
      aCtx.beginPath(); aCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); aCtx.fill();
    });

    aCtx.save();
    aCtx.translate(aPlayer.x, aPlayer.y);
    aCtx.rotate(aPlayer.angle);
    aCtx.fillStyle = '#475569';
    aCtx.fillRect(8, -3, 14, 6);
    aCtx.fillStyle = '#3b82f6';
    aCtx.beginPath(); aCtx.arc(0, 0, aPlayer.r, 0, Math.PI * 2); aCtx.fill();
    aCtx.restore();
  }

  document.getElementById('btn-restart-arena').onclick = resetArena;
  document.getElementById('btn-arena-respawn').onclick = resetArena;

  // Виртуальный джойстик и тач-управление для смартфонов
  const stick = document.getElementById('touch-stick');
  const thumb = document.getElementById('touch-stick-thumb');

  if (stick && thumb) {
    let touchActive = false;
    let startX = 0, startY = 0;

    stick.addEventListener('touchstart', (e) => {
      touchActive = true;
      const rect = stick.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!touchActive) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 30;
      const clampedDist = Math.min(dist, maxRadius);
      const angle = Math.atan2(dy, dx);

      const tx = Math.cos(angle) * clampedDist;
      const ty = Math.sin(angle) * clampedDist;

      thumb.style.transform = `translate(${tx}px, ${ty}px)`;

      aKeys['w'] = ty < -8;
      aKeys['s'] = ty > 8;
      aKeys['a'] = tx < -8;
      aKeys['d'] = tx > 8;
    }, { passive: false });

    const resetStick = () => {
      touchActive = false;
      thumb.style.transform = 'translate(0px, 0px)';
      aKeys['w'] = false;
      aKeys['s'] = false;
      aKeys['a'] = false;
      aKeys['d'] = false;
    };

    window.addEventListener('touchend', resetStick);
    window.addEventListener('touchcancel', resetStick);
  }

  const btnTouchShoot = document.getElementById('btn-touch-shoot');
  const btnTouchReload = document.getElementById('btn-touch-reload');

  if (btnTouchShoot) {
    btnTouchShoot.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (arenaRunning) shootArena();
    });
  }

  if (btnTouchReload) {
    btnTouchReload.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!aReloading && aAmmo < 30) reloadArena();
    });
  }

  // ==========================================
  // 7. АПГРЕЙДЕР (UPGRADE)
  // ==========================================
  let selectedUpgradeMyIndex = null;
  let selectedUpgradeTarget = null;
  let isUpgrading = false;

  const elUpgradeMySlot = document.getElementById('upgrade-my-slot');
  const elUpgradeTargetSlot = document.getElementById('upgrade-target-slot');
  const elUpgradeWheelFill = document.getElementById('upgrade-wheel-fill');
  const elUpgradeArrow = document.getElementById('upgrade-arrow');
  const elUpgradeChanceText = document.getElementById('upgrade-chance-text');
  const elBtnStartUpgrade = document.getElementById('btn-start-upgrade');
  const elUpgradeResultMsg = document.getElementById('upgrade-result-msg');
  const elUpgradeInvList = document.getElementById('upgrade-inv-list');
  const elUpgradeTargetList = document.getElementById('upgrade-target-list');

  function renderUpgradeView() {
    elUpgradeInvList.innerHTML = '';
    if (state.inventory.length === 0) {
      elUpgradeInvList.innerHTML = '<div style="color:#aaa; font-size:0.8rem; padding:10px;">Инвентарь пуст</div>';
    } else {
      state.inventory.forEach((item, idx) => {
        const card = createSkinCard(item);
        if (selectedUpgradeMyIndex === idx) card.style.borderColor = '#4ade80';
        card.onclick = () => {
          selectedUpgradeMyIndex = idx;
          updateUpgradeSlots();
          renderUpgradeView();
        };
        elUpgradeInvList.appendChild(card);
      });
    }

    elUpgradeTargetList.innerHTML = '';
    const allSkins = getAllUniqueSkins();
    allSkins.forEach(item => {
      const card = createSkinCard(item);
      if (selectedUpgradeTarget && selectedUpgradeTarget.id === item.id) card.style.borderColor = '#de9b35';
      card.onclick = () => {
        selectedUpgradeTarget = item;
        updateUpgradeSlots();
        renderUpgradeView();
      };
      elUpgradeTargetList.appendChild(card);
    });
  }

  function updateUpgradeSlots() {
    const myItem = (selectedUpgradeMyIndex !== null && state.inventory[selectedUpgradeMyIndex]) 
      ? state.inventory[selectedUpgradeMyIndex] 
      : null;

    if (myItem) {
      elUpgradeMySlot.innerHTML = '';
      elUpgradeMySlot.appendChild(createSkinCard(myItem));
    } else {
      selectedUpgradeMyIndex = null;
      elUpgradeMySlot.innerHTML = '<span class="slot-placeholder">Выбери скин слева</span>';
    }

    if (selectedUpgradeTarget) {
      elUpgradeTargetSlot.innerHTML = '';
      elUpgradeTargetSlot.appendChild(createSkinCard(selectedUpgradeTarget));
    } else {
      elUpgradeTargetSlot.innerHTML = '<span class="slot-placeholder">Выбери цель справа</span>';
    }

    if (myItem && selectedUpgradeTarget) {
      let chance = (myItem.price / selectedUpgradeTarget.price) * 100;
      if (chance > 80) chance = 80;
      if (chance < 2) chance = 2;
      chance = Math.round(chance * 10) / 10;

      elUpgradeChanceText.textContent = `${chance}%`;
      const circumference = 251.2;
      const offset = circumference - (chance / 100) * circumference;
      elUpgradeWheelFill.style.strokeDashoffset = offset;
      elBtnStartUpgrade.disabled = false;
    } else {
      elUpgradeChanceText.textContent = '0%';
      elUpgradeWheelFill.style.strokeDashoffset = 251.2;
      elBtnStartUpgrade.disabled = true;
    }
  }

  elBtnStartUpgrade.onclick = () => {
    if (isUpgrading || selectedUpgradeMyIndex === null || !selectedUpgradeTarget) return;
    const myItem = state.inventory[selectedUpgradeMyIndex];
    if (!myItem) return;

    isUpgrading = true;
    elBtnStartUpgrade.disabled = true;
    elUpgradeResultMsg.textContent = 'Крутится...';

    let chance = (myItem.price / selectedUpgradeTarget.price) * 100;
    if (chance > 80) chance = 80;
    if (chance < 2) chance = 2;

    const isWin = Math.random() * 100 <= chance;
    const finalDeg = 1800 + (isWin ? (Math.random() * (chance / 100) * 360) : ((chance / 100) * 360 + Math.random() * (360 - (chance / 100) * 360)));

    elUpgradeArrow.style.transition = 'transform 3.5s cubic-bezier(0.12, 0.95, 0.25, 1)';
    elUpgradeArrow.style.transform = `rotate(${finalDeg}deg)`;

    setTimeout(() => {
      isUpgrading = false;
      state.inventory.splice(selectedUpgradeMyIndex, 1);

      if (isWin) {
        elUpgradeResultMsg.textContent = 'УСПЕХ! Скин получен!';
        elUpgradeResultMsg.style.color = '#4ade80';
        state.inventory.unshift(selectedUpgradeTarget);
        Sound.win();
        launchConfetti();
        if (state.quests.upgrade1 && !state.quests.upgrade1.done) state.quests.upgrade1.current += 1;
      } else {
        elUpgradeResultMsg.textContent = 'НЕУДАЧА! Скин сгорел.';
        elUpgradeResultMsg.style.color = '#ef4444';
      }

      selectedUpgradeMyIndex = null;
      save(); updateUI();
      renderUpgradeView();
      updateUpgradeSlots();

      setTimeout(() => {
        elUpgradeArrow.style.transition = 'none';
        elUpgradeArrow.style.transform = 'rotate(0deg)';
      }, 1000);
    }, 3600);
  };

  // ==========================================
  // 8. КОНТРАКТЫ (CONTRACTS)
  // ==========================================
  let contractSelectedItems = [];
  const elContractSlots = document.querySelectorAll('.contract-slot');
  const elBtnSignContract = document.getElementById('btn-sign-contract');
  const elContractInvList = document.getElementById('contract-inv-list');

  function renderContractsView() {
    elContractInvList.innerHTML = '';
    if (state.inventory.length === 0) {
      elContractInvList.innerHTML = '<div style="color:#aaa; font-size:0.8rem; padding:10px;">Инвентарь пуст</div>';
      return;
    }
    state.inventory.forEach((item, idx) => {
      if (item.rarity !== 'gold') {
        const card = createSkinCard(item);
        if (contractSelectedItems.some(x => x.invIdx === idx)) card.style.borderColor = '#4ade80';
        card.onclick = () => toggleContractItem(item, idx);
        elContractInvList.appendChild(card);
      }
    });
    updateContractSlots();
  }

  function toggleContractItem(item, idx) {
    const existingIdx = contractSelectedItems.findIndex(x => x.invIdx === idx);
    if (existingIdx !== -1) {
      contractSelectedItems.splice(existingIdx, 1);
    } else {
      if (contractSelectedItems.length >= 3) return;
      if (contractSelectedItems.length > 0 && contractSelectedItems[0].item.rarity !== item.rarity) {
        alert('Все 3 скина в контракте должны быть одной редкости!');
        return;
      }
      contractSelectedItems.push({ item, invIdx: idx });
    }
    updateContractSlots();
    renderContractsView();
  }

  function updateContractSlots() {
    elContractSlots.forEach((slot, index) => {
      slot.innerHTML = '';
      if (contractSelectedItems[index]) {
        slot.appendChild(createSkinCard(contractSelectedItems[index].item));
      } else {
        slot.innerHTML = '<span>+</span>';
      }
    });
    elBtnSignContract.disabled = contractSelectedItems.length < 3;
  }

  elBtnSignContract.onclick = () => {
    if (contractSelectedItems.length < 3) return;
    const curRarity = contractSelectedItems[0].item.rarity;
    const order = ['milspec', 'restricted', 'classified', 'covert', 'gold'];
    const nextRarity = order[order.indexOf(curRarity) + 1] || 'gold';
    const allSkins = getAllUniqueSkins();
    const possible = allSkins.filter(s => s.rarity === nextRarity);
    const rewardSkin = possible[Math.floor(Math.random() * possible.length)] || allSkins[0];

    const indicesToRemove = contractSelectedItems.map(x => x.invIdx).sort((a, b) => b - a);
    indicesToRemove.forEach(idx => state.inventory.splice(idx, 1));
    contractSelectedItems = [];
    state.inventory.unshift(rewardSkin);

    if (state.quests.contract1 && !state.quests.contract1.done) state.quests.contract1.current += 1;
    save(); updateUI(); renderContractsView(); showWin(rewardSkin);
  };

  // ==========================================
  // 9. ОСМОТР ОРУЖИЯ
  // ==========================================
  const elInspectModal = document.getElementById('inspect-modal');
  const elInspectImg = document.getElementById('inspect-img');
  const elInspectName = document.getElementById('inspect-name');
  const elInspectRarity = document.getElementById('inspect-rarity');
  const elInspectPrice = document.getElementById('inspect-price');
  const elInspectRarityLine = document.getElementById('inspect-rarity-line');
  const elInspectActions = document.getElementById('inspect-actions');

  function openInspect(item, invIndex) {
    elInspectImg.src = item.img;
    elInspectName.textContent = item.name;
    elInspectRarity.textContent = item.rarityTitle;
    elInspectPrice.textContent = `${item.price.toFixed(2)} $`;

    let color = '#4b69ff';
    if (item.rarity === 'restricted') color = '#8847ff';
    if (item.rarity === 'classified') color = '#d32ce6';
    if (item.rarity === 'covert') color = '#eb4b4b';
    if (item.rarity === 'gold') color = '#ffd700';
    elInspectRarity.style.color = color;
    elInspectRarityLine.style.background = color;

    elInspectActions.innerHTML = '';
    if (invIndex !== null) {
      const btn = document.createElement('button');
      btn.className = 'cs-btn cs-btn-danger';
      btn.textContent = `ПРОДАТЬ ЗА ${item.price.toFixed(2)} $`;
      btn.onclick = () => {
        state.balance += item.price;
        state.inventory.splice(invIndex, 1);
        save(); updateUI();
        elInspectModal.classList.remove('active');
      };
      elInspectActions.appendChild(btn);
    }

    elInspectModal.classList.add('active');
  }

  document.getElementById('btn-close-inspect').onclick = () => elInspectModal.classList.remove('active');

  // ==========================================
  // 10. КВЕСТЫ, АВАТАРКИ И ТАБЫ
  // ==========================================
  const elQuestsContainer = document.getElementById('quests-container');
  function renderQuests() {
    elQuestsContainer.innerHTML = '';
    for (const k in state.quests) {
      const q = state.quests[k];
      const isDone = q.current >= q.target;
      const card = document.createElement('div');
      card.className = `quest-card ${isDone && !q.done ? 'ready' : ''}`;
      card.innerHTML = `
        <div>
          <h4>${q.title}</h4>
          <p>Прогресс: ${q.current}/${q.target}</p>
          <div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${Math.min(100, (q.current/q.target)*100)}%"></div></div>
        </div>
        <button class="cs-btn cs-btn-primary" ${!isDone || q.done ? 'disabled' : ''}>
          ${q.done ? 'ВЫПОЛНЕНО' : `+${q.reward}$`}
        </button>
      `;
      card.querySelector('button').onclick = () => {
        if (isDone && !q.done) {
          q.done = true;
          state.balance += q.reward;
          save(); updateUI(); launchConfetti();
        }
      };
      elQuestsContainer.appendChild(card);
    }
  }

  const elAvatarModal = document.getElementById('avatar-modal');
  const elAvatarsList = document.getElementById('avatars-list');
  function initAvatars() {
    elAvatarsList.innerHTML = '';
    AVATARS.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.className = `avatar-choice-item ${url === state.avatarUrl ? 'selected' : ''}`;
      img.onclick = () => {
        state.avatarUrl = url;
        save(); updateUI();
        elAvatarModal.classList.remove('active');
      };
      elAvatarsList.appendChild(img);
    });
  }
  document.getElementById('profile-avatar-btn').onclick = () => {
    initAvatars();
    elAvatarModal.classList.add('active');
  };
  document.getElementById('btn-close-avatar-modal').onclick = () => elAvatarModal.classList.remove('active');

  elPlayerName.onclick = () => {
    const n = prompt('Новый ник:', state.playerName);
    if (n && n.trim()) {
      state.playerName = n.trim().slice(0, 16);
      save(); updateUI();
    }
  };

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById(target).classList.add('active');

      if (target === 'upgrade-view') {
        renderUpgradeView();
        updateUpgradeSlots();
      } else if (target === 'contracts-view') {
        renderContractsView();
      } else if (target === 'arena-view') {
        resetArena();
      } else {
        arenaRunning = false;
        if (arenaAnimId) cancelAnimationFrame(arenaAnimId);
      }
    };
  });

  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function launchConfetti() {
    particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.7) * 20,
        color: ['#ffd700','#eb4b4b','#4ade80','#fff'][Math.floor(Math.random()*4)],
        alpha: 1
      });
    }
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.alpha -= 0.012;
        if (p.alpha > 0) {
          ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
          ctx.fillRect(p.x, p.y, 6, 6);
        } else particles.splice(idx, 1);
      });
      if (particles.length > 0) requestAnimationFrame(frame);
    }
    frame();
  }
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  renderCasePreview();
  updateUI();
});