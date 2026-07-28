// NextBrand TikTok Content Script
(() => {
  function createBtn(text, bg) {
    const btn = document.createElement('button');
    btn.className = 'nextbrand-btn';
    btn.innerHTML = `<span style="font-weight:700">${text}</span>`;
    btn.style.cssText = `
      background:${bg};color:white;border:none;border-radius:4px;padding:0 12px;
      font-weight:700;margin-left:8px;cursor:pointer;font-size:14px;
      font-family:"TikTokFont",Arial,Tahoma,PingFangSC,sans-serif;
      box-shadow:0 2px 8px rgba(0,0,0,0.1);
      transition:all .2s ease;display:inline-flex;align-items:center;height:32px;white-space:nowrap;
    `;
    btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
    return btn;
  }

  function injectTikTokButtons() {
    if (document.getElementById('nextbrand-container')) return;

    const selectors = [
      '[data-e2e="user-title"]',
      'h1[data-e2e="user-subtitle"]',
      'h2[data-e2e="user-title"]',
    ];

    let target = null;
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) { target = el; break; }
    }
    if (!target) return;

    const container = document.createElement('div');
    container.id = 'nextbrand-container';
    container.style.cssText = 'display:inline-flex;align-items:center;vertical-align:middle;margin-left:12px;';

    const username = window.location.pathname.replace(/\//g, '') || 'unknown';

    const analyzeBtn = createBtn('Analizza IA', 'linear-gradient(45deg,#69C9D0,#EE1D52)');
    analyzeBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_POPUP', platform: 'tiktok', username });

    const connectBtn = createBtn('Collega', '#161823');
    connectBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_DASHBOARD', path: '/dashboard/connect' });

    container.appendChild(analyzeBtn);
    container.appendChild(connectBtn);

    if (target.parentElement) target.parentElement.appendChild(container);
  }

  let injectTimer = null;
  function scheduleInject() {
    if (injectTimer) clearTimeout(injectTimer);
    injectTimer = setTimeout(() => { injectTikTokButtons(); injectTimer = null; }, 1500);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) { lastUrl = url; scheduleInject(); }
  }).observe(document, { subtree: true, childList: true });

  scheduleInject();
})();