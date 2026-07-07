// ========= Meteors（機率性流星）=========
(function () {
  const layer = document.createElement('div');
  layer.id = 'meteor-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 字元網格風格：尾巴依位置分三層——尾端暗雜訊 → 中段記號 → 頭部亮方塊
  const TIER_CHARS = [
    ['.', ':', '-', '0', '1'],   // 暗（尾端）
    ['+', '×', '*', '0', '1'],   // 中
    ['■', '▲', '#'],             // 亮（近星頭）
  ];
  const SPARK_CHARS = ['▲', '■', '+', '×', '0', '1'];

  function pickChar(tier) {
    const set = TIER_CHARS[tier];
    return set[Math.floor(Math.random() * set.length)];
  }

  function buildTail(m) {
    const n = 9 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1); // 0 尾端 → 1 頭部
      const tier = t > 0.72 ? 2 : (t > 0.4 ? 1 : 0);
      const c = document.createElement('span');
      c.className = 'tail-ch';
      c.dataset.tier = tier;
      c.textContent = pickChar(tier);
      c.style.opacity = (0.35 + t * 0.65).toFixed(2);
      c.style.setProperty('--tf-dur', (0.3 + Math.random() * 0.5).toFixed(2) + 's');
      c.style.setProperty('--tf-delay', (Math.random() * 0.5).toFixed(2) + 's');
      c.style.setProperty('--tf-low', (0.25 + Math.random() * 0.35).toFixed(2));
      m.appendChild(c);
    }
  }

  function spawnMeteor() {
    const m = document.createElement('div');
    m.className = 'meteor';
    buildTail(m);
    // 起點：偏畫面上半部、中間偏右，往左下劃過
    m.style.top  = (Math.random() * 55) + 'vh';
    m.style.left = (25 + Math.random() * 75) + 'vw';
    m.style.setProperty('--meteor-dur', (3.2 + Math.random() * 2.0).toFixed(2) + 's');
    m.style.setProperty('--meteor-star', Math.round(10 + Math.random() * 6) + 'px');

    // ASCII 光粒子：沿著尾巴散佈，各自帶隨機延遲與飄移量
    const sparkCount = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < sparkCount; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = SPARK_CHARS[Math.floor(Math.random() * SPARK_CHARS.length)];
      s.style.left = (15 + Math.random() * 80) + '%';
      s.style.setProperty('--spark-delay', (Math.random() * 0.6).toFixed(2) + 's');
      s.style.setProperty('--spark-dur', (0.5 + Math.random() * 0.5).toFixed(2) + 's');
      s.style.setProperty('--spark-y', ((Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 8)).toFixed(0) + 'px');
      m.appendChild(s);
    }

    // 好運訊息（hover 時由 CSS 顯示在圓形範圍下方）
    const msg = document.createElement('span');
    msg.className = 'meteor-msg';
    msg.textContent = '你抓到了流星，你會獲得好運ᴗ̈！';
    m.appendChild(msg);

    layer.appendChild(m);

    // 字元突變：仿影片中雜訊場不斷變化的效果，每拍隨機換掉 1～2 個尾巴字元
    const chars = m.querySelectorAll('.tail-ch');
    const mutate = setInterval(() => {
      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        c.textContent = pickChar(+c.dataset.tier);
      }
    }, 130);

    m.addEventListener('animationend', (e) => {
      if (e.target === m) { clearInterval(mutate); m.remove(); }
    });
  }

  (function loop() {
    const wait = 4000 + Math.random() * 10000; // 每 4～14 秒抽一次
    setTimeout(() => {
      if (!document.hidden && !reduceMotion.matches) {
        spawnMeteor();
        // 30% 機率緊接著補一顆，像小流星群
        if (Math.random() < 0.3) {
          setTimeout(spawnMeteor, 250 + Math.random() * 400);
        }
      }
      loop();
    }, wait);
  })();
})();
