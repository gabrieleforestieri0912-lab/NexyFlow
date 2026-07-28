// NextBrand YouTube Content Script
(() => {
  function createBtn(text, bg) {
    const btn = document.createElement('button');
    btn.className = 'nextbrand-btn';
    btn.innerHTML = `<span style="font-weight:500">${text}</span>`;
    btn.style.cssText = `
      background:${bg};color:white;border:none;border-radius:18px;padding:0 16px;
      font-weight:500;margin-left:6px;cursor:pointer;font-size:14px;
      font-family:"Roboto","Arial",sans-serif;
      transition:all .2s ease;display:inline-flex;align-items:center;height:36px;white-space:nowrap;
    `;
    btn.onmouseover = () => btn.style.filter = 'brightness(1.15)';
    btn.onmouseout = () => btn.style.filter = 'brightness(1)';
    return btn;
  }

  function getChannelIdentifier() {
    const p = window.location.pathname;
    if (p.startsWith('/channel/')) return p.split('/')[2];
    if (p.startsWith('/@')) return p.slice(1);
    return null;
  }

  function injectYouTubeButtons() {
    const existing = document.getElementById('nextbrand-container');
    if (existing) existing.remove();

    const isChannel = /^\/(channel\/|@)/.test(window.location.pathname);
    if (!isChannel) return;

    const subscribeBtn = document.querySelector('#subscribe-button');
    if (!subscribeBtn) return;

    const container = document.createElement('div');
    container.id = 'nextbrand-container';
    container.style.cssText = 'display:inline-flex;align-items:center;gap:4px;margin-left:8px;';

    const channelId = getChannelIdentifier() || 'unknown';

    const analyzeBtn = createBtn('Analizza con IA', '#FF0000');
    analyzeBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_POPUP', platform: 'youtube', username: channelId });

    const connectBtn = createBtn('Collega Canale', '#0f0f0f');
    connectBtn.onclick = () => chrome.runtime.sendMessage({ action: 'OPEN_DASHBOARD', path: '/dashboard/connect' });

    container.appendChild(analyzeBtn);
    container.appendChild(connectBtn);

    const parent = subscribeBtn.closest('ytd-subscribe-button-renderer') || subscribeBtn;
    if (parent && parent.parentElement) {
      parent.parentElement.insertBefore(container, parent.nextSibling);
    }
  }

  let injectTimer = null;
  function scheduleInject() {
    if (injectTimer) clearTimeout(injectTimer);
    injectTimer = setTimeout(() => { injectYouTubeButtons(); injectTimer = null; }, 1500);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) { lastUrl = url; scheduleInject(); }
  }).observe(document, { subtree: true, childList: true });

  scheduleInject();
})();