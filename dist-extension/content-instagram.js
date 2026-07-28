// NextBrand Instagram Content Script
(() => {
  function createBtn(text, bg, hoverBg) {
    const btn = document.createElement('button');
    btn.className = 'nextbrand-btn';
    btn.innerHTML = `<span style="font-weight:700">${text}</span>`;
    btn.style.cssText = `
      background:${bg};color:white;border:none;border-radius:10px;padding:6px 14px;
      font-weight:bold;margin-left:8px;cursor:pointer;font-size:13px;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      box-shadow:0 4px 15px rgba(220,39,67,0.3);
      transition:all .2s cubic-bezier(.175,.885,.32,1.275);
      display:inline-flex;align-items:center;height:32px;white-space:nowrap;
    `;
    btn.onmouseover = () => { btn.style.transform = 'translateY(-2px) scale(1.02)'; btn.style.boxShadow = hoverBg || '0 6px 20px rgba(220,39,67,0.4)'; };
    btn.onmouseout = () => { btn.style.transform = 'translateY(0) scale(1)'; btn.style.boxShadow = '0 4px 15px rgba(220,39,67,0.3)'; };
    return btn;
  }

  function injectNextBrandButtons() {
    if (document.getElementById('nextbrand-container')) return;

    const selectors = [
      'header section h2',
      'header section ._ap3a',
      'header section div:first-child',
      'h2[dir="auto"]',
    ];

    let target = null;
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) { target = el; break; }
    }
    if (!target) return;

    const container = document.createElement('div');
    container.id = 'nextbrand-container';
    container.style.cssText = 'display:inline-flex;align-items:center;vertical-align:middle;margin-left:10px;';

    const username = window.location.pathname.replace(/\//g, '') || 'unknown';

    const analyzeBtn = createBtn('Analizza con IA', 'linear-gradient(45deg,#f09433,#dc2743)');
    analyzeBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_POPUP', platform: 'instagram', username });

    const connectBtn = createBtn('Collega', 'linear-gradient(45deg,#444,#222)', '0 6px 20px rgba(0,0,0,0.4)');
    connectBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_DASHBOARD', path: '/dashboard/connect' });

    container.appendChild(analyzeBtn);
    container.appendChild(connectBtn);

    if (target.parentElement) {
      target.parentElement.style.display = 'flex';
      target.parentElement.style.alignItems = 'center';
      target.parentElement.appendChild(container);
    }
  }

  let injectTimer = null;
  function scheduleInject() {
    if (injectTimer) clearTimeout(injectTimer);
    injectTimer = setTimeout(() => { injectNextBrandButtons(); injectTimer = null; }, 1500);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) { lastUrl = url; scheduleInject(); }
  }).observe(document, { subtree: true, childList: true });

  scheduleInject();
  console.log('NextBrand: Instagram integration active.');
})();