// ========= Meteors（機率性流星）=========
(function () {
  const layer = document.createElement('div');
  layer.id = 'meteor-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ASCII 尾巴字元：由淡到濃（左＝尾端、右＝靠近星頭）
  const TAIL_CHARS  = ['.', '·', ':', '-', '=', '≡'];
  const SPARK_CHARS = ['+', '*', '×', '·', '°'];

  function buildTail() {
    const n = 9 + Math.floor(Math.random() * 6);
    let tail = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1); // 0 尾端 → 1 頭部
      const jitter = 0.75 + Math.random() * 0.5;
      const idx = Math.min(TAIL_CHARS.length - 1, Math.floor(t * TAIL_CHARS.length * jitter));
      tail += TAIL_CHARS[Math.max(0, idx)];
    }
    return tail;
  }

  function spawnMeteor() {
    const m = document.createElement('div');
    m.className = 'meteor';
    m.textContent = buildTail();
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
    m.addEventListener('animationend', () => m.remove());
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
