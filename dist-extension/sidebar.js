const API = 'http://localhost:3000';

const App = {
  locale: localStorage.getItem("nb-locale") || "it",

  __(key) {
    let l = EXT[this.locale];
    if (!l) { this.locale = "it"; l = EXT.it; }
    return l[key] || EXT.it[key] || key;
  },

  setLocale(code) {
    this.locale = code;
    localStorage.setItem("nb-locale", code);
    this.renderApp();
  },

  toggleNotif(enabled) {
    this.notif = enabled;
    localStorage.setItem("nb-notif", enabled ? "1" : "0");
  },

  user: null,
  token: null,
  analytics: null,
  chatHistory: [],
  tab: 'dashboard',
  chartType: 'followers',

  async init() {
    this.initListeners();
    const s = await chrome.storage.local.get(['token', 'user', 'pendingAnalysis']);
    if (s.locale) this.locale = s.locale;
    if (s.token && s.user) {
      this.token = s.token;
      this.user = s.user;
      await this.loadAnalytics();
      this.renderApp();
      
      // Sync user data with the server in the background
      this.refreshUser();

      if (s.pendingAnalysis) {
        this.handleAnalysis(s.pendingAnalysis);
      }
    } else {
      this.renderAuth();
    }
  },

  async refreshUser() {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${this.token}`,
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.user = data.user;
          await chrome.storage.local.set({ user: this.user, locale: this.locale });
          this.renderApp();
        }
      }
    } catch (e) {
      console.error('Failed to sync user state:', e);
    }
  },

  initListeners() {
    // Listen for changes (e.g. from injected button)
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.pendingAnalysis?.newValue) {
        this.handleAnalysis(changes.pendingAnalysis.newValue);
      }
    });

    // Global event delegation for dynamically rendered content
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');

      if (action === 'connect') {
        this.connect(id);
      } else if (action === 'subscribe') {
        this.subscribe(id);
      } else if (action === 'logout') {
        this.logout();
      } else if (action === 'set-lang') {
        const code = target.getAttribute('data-lang');
        if (code) this.setLocale(code);
      } else if (action === 'switch-tab') {
        const tab = target.getAttribute('data-tab');
        this.switchTab(tab);
      } else if (action === 'pass-toggle') {
        this.togglePass();
      } else if (action === 'auth-tab') {
        this.switchAuthTab(id);
      } else if (action === 'chart-toggle') {
        this.switchChartType(target.getAttribute('data-type'));
      } else if (action === 'go-chat') {
        this.switchTab('chat');
      } else if (action === 'suggest-prompt') {
        const prompt = target.getAttribute('data-prompt');
        if (prompt) { this.switchTab('chat'); this.sendMsg(prompt); }
      }
    });

    // Change events for select and checkbox
    document.addEventListener('change', (e) => {
      const el = e.target;
      if (el.matches('.setting-select')) {
        this.setLocale(el.value);
      } else if (el.matches('.toggle input')) {
        this.toggleNotif(el.checked);
      }
    });

    // Account dropdown toggle
    document.addEventListener('click', (e) => {
      const dropdownTrigger = e.target.closest('[data-action="toggle-acct-dropdown"]');
      const dropdownMenu = document.getElementById('acct-dropdown-menu');

      if (dropdownTrigger && dropdownMenu) {
        const isVisible = dropdownMenu.style.display !== 'none';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
        const arrow = dropdownTrigger.querySelector('.acct-arrow');
        if (arrow) {
          arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        }
        return;
      }

      // Close dropdown when clicking outside
      if (!e.target.closest('.acct-dropdown') && dropdownMenu) {
        dropdownMenu.style.display = 'none';
        const arrow = dropdownMenu.parentElement?.querySelector('.acct-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });
  },

  handleAnalysis(data) {
    this.tab = 'chat';
    this.renderApp();
    const prompt = `Analyze this ${data.platform} profile: ${data.username}`;
    this.sendMsg(prompt);
    chrome.storage.local.remove('pendingAnalysis');
  },

  // â”€â”€ Auth â”€â”€

  renderAuth() {
    document.getElementById('root').innerHTML = `
      <div class="auth">
          <div class="auth-logo">
            <img src="nextbrand.png" alt="NextBrand">
            <h1>NextBrand</h1>
            <p>${this.__("subtitle")}</p>
</div>
      <div class="acct-footer">${this.__("footer")}</div>
    `;
    this.authMode = 'login';
    this.codeStep = 'init';
    document.getElementById('form').addEventListener('submit', (e) => this.handleAuthSubmit(e));
  },

  switchAuthTab(mode) {
    this.authMode = mode;
    this.codeStep = 'init';
    document.querySelectorAll('[data-action="auth-tab"]').forEach(x => x.classList.remove('active'));
    document.querySelector(`[data-action="auth-tab"][data-id="${mode}"]`).classList.add('active');
    document.getElementById('name-f').style.display = mode === 'register' ? 'block' : 'none';
    document.getElementById('pass-f').style.display = mode === 'code' ? 'none' : 'block';
    document.getElementById('code-f').style.display = 'none';
    document.getElementById('sub').textContent = mode === 'login' ? this.__("login") : mode === 'code' ? this.__("sendCode") : this.__("createAccount");
    document.getElementById('err').style.display = 'none';
    document.getElementById('err').style.color = '#ef4444';
    const email = document.getElementById('i-email');
    if (email) { email.readOnly = false; email.value = ''; }
    const pass = document.getElementById('i-pass');
    if (pass) pass.value = '';
    const code = document.getElementById('i-code');
    if (code) code.value = '';
  },

  togglePass() {
    const passInput = document.getElementById('i-pass');
    const passToggle = document.querySelector('[data-action="pass-toggle"]');
    const show = passInput.type === 'password';
    passInput.type = show ? 'text' : 'password';
    passToggle.querySelector('.eye-on').style.display = show ? 'none' : 'block';
    passToggle.querySelector('.eye-off').style.display = show ? 'block' : 'none';
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('sub');
    btn.disabled = true;
    btn.textContent = this.__("loading");
    document.getElementById('err').style.display = 'none';
    document.getElementById('err').style.color = '#ef4444';
    try {
      if (this.authMode === 'code') {
        if (this.codeStep === 'init') {
          await this.handleSendCode();
        } else {
          await this.handleVerifyCode();
        }
        return;
      }
      const email = document.getElementById('i-email').value;
      const pass = document.getElementById('i-pass').value;
      const name = document.getElementById('i-name').value;
      const endpoint = this.authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = this.authMode === 'register' ? { name, email, password: pass } : { email, password: pass };
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      this.token = data.token;
      this.user = data.user;
      await chrome.storage.local.set({ token: this.token, user: this.user });
      await this.loadAnalytics();
      this.renderApp();
    } catch (err) {
      const el = document.getElementById('err');
      el.textContent = err.message;
      el.style.display = 'block';
      btn.disabled = false;
      btn.textContent = this.authMode === 'login' ? this.__("login") : this.authMode === 'code' ? (this.codeStep === 'init' ? this.__("sendCode") : this.__("verify")) : this.__("createAccount");
    }
  },

  async handleSendCode() {
    const email = document.getElementById('i-email').value;
    if (!email) throw new Error(this.__("errorEmail"));
    const res = await fetch(`${API}/api/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    this.codeStep = 'sent';
    document.getElementById('code-f').style.display = 'block';
    document.getElementById('pass-f').style.display = 'none';
    document.getElementById('i-email').readOnly = true;
    const btn = document.getElementById('sub');
    btn.textContent = this.__("verify");
    btn.disabled = false;
    const el = document.getElementById('err');
    el.textContent = 'Codice inviato! Controlla la tua email.';
    el.style.display = 'block';
    el.style.color = '#34d399';
  },

  async handleVerifyCode() {
    const email = document.getElementById('i-email').value;
    const code = document.getElementById('i-code').value;
    if (!code) throw new Error('Inserisci il codice di verifica');
    const res = await fetch(`${API}/api/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    this.token = data.token;
    this.user = data.user;
    this.codeStep = 'init';
    await chrome.storage.local.set({ token: this.token, user: this.user });
    await this.loadAnalytics();
    this.renderApp();
  },

  async logout() {
    try { await fetch(`${API}/api/auth/logout`, { method: 'POST' }); } catch {}
    this.user = null; this.token = null; this.analytics = null; this.chatHistory = [];
    await chrome.storage.local.remove(['token', 'user']);
    this.renderAuth();
  },

  // â”€â”€ Analytics â”€â”€

  async loadAnalytics() {
    try {
      const res = await fetch(`${API}/api/analytics`, { headers: { Authorization: `Bearer ${this.token}` } });
      if (res.ok) this.analytics = await res.json();
    } catch (e) { console.error(e); }
  },

  fmt(n) {
    if (!n) return '0';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
  },

  // â”€â”€ App shell â”€â”€

  renderApp() {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div class="shell">
        <div class="header">
          <div class="header-left">
            <img src="nextbrand.png" alt="">
            <h2>NextBrand</h2>
          </div>
        </div>
        <div class="shell-body">
        <div class="nav">
          <button class="nav-btn ${this.tab === 'dashboard' ? 'active' : ''}" data-action="switch-tab" data-tab="dashboard" title="${this.__("dashboard")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button class="nav-btn ${this.tab === 'chat' ? 'active' : ''}" data-action="switch-tab" data-tab="chat" title="${this.__("chat")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </button>
          <button class="nav-btn ${this.tab === 'connect' ? 'active' : ''}" data-action="switch-tab" data-tab="connect" title="${this.__("connect")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button class="nav-btn ${this.tab === 'account' ? 'active' : ''}" data-action="switch-tab" data-tab="account" title="${this.__("account")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button class="nav-btn ${this.tab === 'settings' ? 'active' : ''}" data-action="switch-tab" data-tab="settings" title="${this.__("settings")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
        </div>
        <div class="content">
          <div class="panel ${this.tab === 'dashboard' ? 'active' : ''}" id="p-dashboard">${this.htmlDashboard()}</div>
          <div class="panel ${this.tab === 'chat' ? 'active' : ''}" id="p-chat">${this.htmlChat()}</div>
          <div class="panel ${this.tab === 'connect' ? 'active' : ''}" id="p-connect">${this.htmlConnect()}</div>
          <div class="panel ${this.tab === 'account' ? 'active' : ''}" id="p-account">${this.htmlAccount()}</div>
          <div class="panel ${this.tab === 'settings' ? 'active' : ''}" id="p-settings">${this.htmlSettings()}</div>
        </div>
        </div>
      </div>
    `;
    if (this.tab === 'chat') this.bindChat();
  },

  switchTab(tab) {
    this.tab = tab;
    this.renderApp();
  },

  // â”€â”€ Dashboard â”€â”€

  switchChartType(type) {
    this.chartType = type;
    this.renderApp();
  },

  htmlDashboard() {
    const a = this.analytics || {};
    const plats = a.platforms || {};
    const plan = this.user?.plan || 'free';
    const name = (this.user?.name || 'Utente').split(' ')[0];

    const pDefs = [
      { k: 'instagram', n: 'Instagram', c: '#E4405F', ic: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><path d="M12 7.376A4.624 4.624 0 1016.624 12 4.624 4.624 0 0012 7.376zm0 7.648A3.024 3.024 0 1115.024 12 3.024 3.024 0 0112 15.024zm6.52-8.56a1.08 1.08 0 11-1.08-1.08 1.08 1.08 0 011.08 1.08z"/>' },
      { k: 'tiktok', n: 'TikTok', c: '#333', ic: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.59 1.49 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.09 0 .18.01.27.02V9.4a6.63 6.63 0 00-.34-.02 6.34 6.34 0 100 12.68c3.5 0 6.34-2.84 6.34-6.34v-7.2a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>' },
      { k: 'youtube', n: 'YouTube', c: '#FF0000', ic: '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>' },
    ];

    const stats = [
      { label: this.__("followers"), value: this.fmt(a.totalFollowers), color: '#f09433', bgColor: 'rgba(240,148,51,.15)', icon: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>' },
      { label: this.__("views"), value: this.fmt(a.totalViews), color: '#69C9D0', bgColor: 'rgba(105,201,208,.15)', icon: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>' },
      { label: this.__("engagement"), value: (a.avgEngagement || 0) + '%', color: '#bc1888', bgColor: 'rgba(188,24,136,.15)', icon: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' },
      { label: this.__("videos"), value: this.fmt(a.totalVideos), color: '#FF0000', bgColor: 'rgba(255,0,0,.15)', icon: '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z"/>' },
    ];

    const platforms = pDefs.map(p => {
      const on = plats[p.k]?.connected || false;
      return `<div class="p-row">
        <div class="p-row-left">
          <div class="p-ico" style="background:${p.c}"><svg viewBox="0 0 24 24">${p.ic}</svg></div>
          <div>
            <div class="p-name">${p.n}</div>
            <div class="p-sub">${on ? this.__("sync") : this.__("notConnected")}</div>
          </div>
        </div>
        <span class="p-status ${on ? 'on' : 'off'}">${on ? this.__("connected") : this.__("notConnectedF")}</span>
      </div>`;
    }).join('');

    const quickActions = [
      { label: this.__("analyzeGrowth"), icon: '<path d="M12 3l1.5 3.5H17l-2.8 2.1 1 3.4L12 10.1l-3.2 1.9 1-3.4L7 6.5h3.5z"/>' },
      { label: this.__("connect") + ' ' + this.__("connectPg"), icon: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>', tab: 'connect' },
      { label: this.__("dashboard"), icon: '<path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/>', tab: 'dashboard' },
    ].map(aa => `<div class="qa-item" data-action="${aa.tab ? 'switch-tab' : 'go-chat'}" ${aa.tab ? `data-tab="${aa.tab}"` : ''}>
      <div class="qa-item-left">
        <div class="qa-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${aa.icon}</svg></div>
        <span class="qa-item-label">${aa.label}</span>
      </div>
      <div class="qa-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></div>
    </div>`).join('');

    return `
      <div class="dash-top">
        <div>
          <div class="badge-live">${this.__("dashboard")}</div>
          <h1>${this.__("account")}, <span>${this.esc(name)}!</span></h1>
          <p>${this.__("monitorDesc")}</p>
        </div>
        <div class="plan-pill">
          <div class="plan-pill-icon">${plan === 'pro' ? 'P' : 'F'}</div>
          <div>
            <div class="plan-pill-label">${this.__("currentPlan")}</div>
            <div class="plan-pill-name">${plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
          </div>
        </div>
      </div>

      <div class="stats">
        ${stats.map(s => `<div class="stat">
          <div class="stat-icon" style="background:${s.bgColor}"><svg viewBox="0 0 24 24" fill="${s.color}">${s.icon}</svg></div>
          <div class="stat-lbl">${s.label}</div>
          <div class="stat-val">${s.value}</div>
        </div>`).join('')}
      </div>

      <div class="glass-card">
        <div class="chart-header">
          <h3><span class="chart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg></span> Analisi Performance</h3>
          <div class="chart-toggles">
            <button class="chart-toggle ${this.chartType === 'followers' ? 'active' : ''}" data-action="chart-toggle" data-type="followers">${this.__("followers")}</button>
            <button class="chart-toggle ${this.chartType === 'views' ? 'active' : ''}" data-action="chart-toggle" data-type="views">${this.__("views")}</button>
          </div>
        </div>
        <div class="chart-body" id="chart-body">${this.htmlChart()}</div>
      </div>

      <div class="dash-cols">
        <div class="glass-card">
          <div class="dash-card-header">
            <h3>${this.__("connectPg")}</h3>
            <button class="dash-link" data-action="switch-tab" data-tab="connect">${this.__("connect")}</button>
          </div>
          <div class="p-list">${platforms}</div>
        </div>

        <div class="glass-card">
          <h3 style="font-size:13px;font-weight:700;margin-bottom:12px">${this.__("quickActions")}</h3>
          <div class="qa-list">${quickActions}</div>
        </div>
      </div>

      ${plan === 'free' ? `
      <div class="upgrade-banner">
        <div class="upgrade-bg"></div>
        <div class="upgrade-bg2"></div>
        <div class="upgrade-content">
          <h3>${this.__("subscriptionPlans")}</h3>
          <p>${this.__("freeDesc")}</p>
          <button class="upgrade-btn" data-action="subscribe" data-id="pro">${this.__("startTrial")}</button>
        </div>
      </div>` : ''}
    `;
  },

  htmlChart() {
    const data = this.analytics?.history || [];
    if (!data.length) {
      const hasPlatforms = Object.values(this.analytics?.platforms || {}).some(p => p?.connected);
      if (!hasPlatforms) {
        return `<div class="chart-empty">
          <div style="font-size:32px;opacity:.3">ðŸ“Š</div>
          <div>${this.__("noData")}</div>
          <button class="btn btn-p btn-sm" style="width:auto;margin-top:8px" data-action="switch-tab" data-tab="connect">${this.__("connect")} ${this.__("connectPg")}</button>
        </div>`;
      }
      return '<div class="chart-empty">Nessun dato storico disponibile</div>';
    }

    const key = this.chartType === 'views' ? 'views' : 'followers';
    const values = data.map(d => d[key]);
    const max = Math.max(...values, 1);
    const w = 320, h = 120;
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    }).join(' ');
    const polyPoints = points + ` ${w},${h} 0,${h}`;

    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;overflow:visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E4405F" stop-opacity=".25"/>
            <stop offset="100%" stop-color="#E4405F" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polyline points="${points}" fill="none" stroke="#E4405F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polygon points="${polyPoints}" fill="url(#chartGrad)"/>
      </svg>
      <div style="display:flex;justify-content:space-between;margin-top:6px;padding:0 4px">
        ${data.map(d => `<span style="font-size:9px;color:var(--text3)">${this.esc(d.name)}</span>`).join('')}
      </div>
    `;
  },

  // â”€â”€ Chat â”€â”€

  htmlChat() {
    if (this.chatHistory.length === 0) {
      return `
      <div class="chat-wrap">
        <div class="chat-empty-state">
          <div class="ces-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 3.5H17l-2.8 2.1 1 3.4L12 10.1l-3.2 1.9 1-3.4L7 6.5h3.5z"/></svg></div>
          <h2>${this.__("howCanIHelp")}</h2>
          <p>${this.__("askAnything")}</p>
          <div class="suggested-prompts">
            <button data-action="suggest-prompt" data-prompt="${this.__("analyzeGrowth")}">${this.__("analyzeGrowth")}</button>
            <button data-action="suggest-prompt" data-prompt="${this.__("increaseEngagement")}">${this.__("increaseEngagement")}</button>
            <button data-action="suggest-prompt" data-prompt="${this.__("bestTimes")}">${this.__("bestTimes")}</button>
          </div>
        </div>
        <div class="chat-bar">
          <textarea class="chat-in" id="cin" placeholder="${this.__("chatPlaceholder")}" rows="1"></textarea>
          <button class="chat-send" id="csend"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
        </div>
        <p class="chat-footnote">${this.__("chatFootnote")}</p>
      </div>`;
    }

    const msgs = this.chatHistory.map(m => `<div class="msg ${m.role === 'user' ? 'u' : m.isError ? 'err' : 'a'}">${m.role === 'user' ? this.esc(m.content) : this.renderMd(m.content)}</div>`).join('');
    return `
      <div class="chat-wrap">
        <div class="chat-msgs" id="msgs">${msgs}</div>
        <div class="chat-bar">
          <textarea class="chat-in" id="cin" placeholder="${this.__("chatPlaceholder")}" rows="1"></textarea>
          <button class="chat-send" id="csend"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
        </div>
        <p class="chat-footnote">${this.__("chatFootnote")}</p>
      </div>
    `;
  },

  bindChat() {
    const inp = document.getElementById('cin');
    const btn = document.getElementById('csend');
    if (!inp || !btn) return;

    const send = () => {
      const m = inp.value.trim();
      if (!m) return;
      inp.value = '';
      inp.style.height = 'auto';
      this.sendMsg(m);
    };

    btn.onclick = send;
    inp.onkeydown = e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };
    inp.oninput = () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
    };
  },

  async sendMsg(message) {
    this.chatHistory.push({ role: 'user', content: message });
    this.renderApp();
    this.bindChat();

    const box = document.getElementById('msgs');
    if (box) {
      box.insertAdjacentHTML('beforeend', '<div class="typing"><span></span><span></span><span></span></div>');
      box.scrollTop = box.scrollHeight;
    }
    const btn = document.getElementById('csend');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
        body: JSON.stringify({ message, model: 'llama3', history: this.chatHistory.slice(0, -1) }),
      });
      const data = await res.json();
      const response = data.response || data.error || 'No response';
      const isError = !!data.error && !data.response;

      this.chatHistory.push({ role: 'assistant', content: '', fullContent: response, isError, isTyping: true });
      this.renderApp();
      this.bindChat();

      let idx = 0;
      const speed = 6;
      const timer = setInterval(() => {
        const msgs = document.querySelectorAll('.msg.a, .msg.err');
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg) {
          lastMsg.textContent = response.slice(0, idx);
        }
        const nb = document.getElementById('msgs');
        if (nb) nb.scrollTop = nb.scrollHeight;
        if (++idx > response.length) {
          clearInterval(timer);
          const stored = this.chatHistory[this.chatHistory.length - 1];
          stored.content = response;
          stored.fullContent = null;
          stored.isTyping = false;
        }
      }, speed);
    } catch {
      this.chatHistory.push({ role: 'assistant', content: this.__("connectionError"), isError: true });
      this.renderApp();
      this.bindChat();
      const nbtn = document.getElementById('csend');
      if (nbtn) nbtn.disabled = false;
      const nbox = document.getElementById('msgs');
      if (nbox) nbox.scrollTop = nbox.scrollHeight;
    }
  },

  // â”€â”€ Connect â”€â”€

  htmlConnect() {
    const plats = this.analytics?.platforms || {};
    const defs = [
      { k: 'instagram', n: 'Instagram', c: '#E4405F', ic: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/>', d: this.__("monitorDesc"), sn: [this.__("followers"), this.__("views"), this.__("engagement"), this.__("posts")] },
      { k: 'tiktok', n: 'TikTok', c: '#333', ic: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.59 1.49 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.09 0 .18.01.27.02V9.4a6.63 6.63 0 00-.34-.02 6.34 6.34 0 100 12.68c3.5 0 6.34-2.84 6.34-6.34v-7.2a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>', d: this.__("monitorDescTT"), sn: [this.__("followers"), this.__("views"), this.__("engagement"), this.__("videos")] },
      { k: 'youtube', n: 'YouTube', c: '#FF0000', ic: '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>', d: this.__("monitorDescYT"), sn: [this.__("subs"), this.__("views"), this.__("engagement"), this.__("videos")] },
    ];

    return `<div class="c-list">
      ${defs.map(p => {
        const pd = plats[p.k] || {};
        const on = pd.connected || false;
        const st = pd.stats || {};
        const vals = p.k === 'youtube'
          ? [st.subscribers, st.views, st.engagement, st.videos]
          : [st.followers, st.views, st.engagement, st.videos];
        const statsHtml = on ? `<div class="c-stats">${p.sn.map((l, i) => `<div class="c-stat"><div class="c-stat-v">${i === 2 ? (vals[i]||0)+'%' : this.fmt(vals[i])}</div><div class="c-stat-l">${l}</div></div>`).join('')}</div>` : '';
        return `
          <div class="c-card">
            <div class="c-head">
              <div class="c-info">
                <div class="c-ico" style="background:${p.c}"><svg viewBox="0 0 24 24">${p.ic}</svg></div>
                <div><div class="c-name">${p.n}</div><div class="c-desc">${p.d}</div></div>
              </div>
              ${on
                ? `<span class="p-status on">${this.__("connected")}</span>`
                : `<button class="btn btn-p btn-sm" data-action="connect" data-id="${p.k}">${this.__("connect")}</button>`
              }
            </div>
            ${statsHtml}
          </div>`;
      }).join('')}
    </div>`;
  },

  connect(platform) {
    chrome.tabs.create({ url: `${API}/dashboard/connect?platform=${platform}` });
  },

  // â”€â”€ Account â”€â”€

  htmlAccount() {
    const plan = this.user?.plan || 'free';
    const plans = [
      {
        id: 'free', name: this.__("free"), price: 0, interval: this.__("forever"),
        desc: this.__("freeDesc"),
        features: this.__('freeFeat'),
        notIncluded: this.__('freeNot'),
        popular: false,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 3.5H17l-2.8 2.1 1 3.4L12 10.1l-3.2 1.9 1-3.4L7 6.5h3.5z"/></svg>',
      },
      {
        id: 'pro', name: 'Pro', price: 9.99, interval: this.__("month"),
        desc: this.__("proDesc"),
        features: this.__('proFeat'),
        notIncluded: this.__('proNot'),
        popular: true,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      },
      {
        id: 'enterprise', name: 'Enterprise', price: 29.99, interval: this.__("month"),
        desc: this.__("entDesc"),
        features: this.__('entFeat'),
        notIncluded: [],
        popular: false,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>',
      },
    ];

const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    const xSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    return `
      <div class="acct-dropdown">
        <div class="acct-profile" data-action="toggle-acct-dropdown">
          <div class="acct-avatar">${(this.user?.name || 'U').charAt(0).toUpperCase()}</div>
          <div class="acct-info">
            <div class="acct-name">${this.esc(this.user?.name || this.__('account'))}</div>
            <div class="acct-email">${this.esc(this.user?.email || '')}</div>
          </div>
          <div class="acct-badge ${plan === 'free' ? 'badge-free' : 'badge-pro'}">${plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
          <svg class="acct-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="acct-dropdown-menu" id="acct-dropdown-menu" style="display:none">
          <button class="acct-dropdown-item" data-action="switch-tab" data-tab="dashboard">${this.__('dashboard')}</button>
          <button class="acct-dropdown-item" data-action="switch-tab" data-tab="connect">${this.__('connectPg')}</button>
          <button class="acct-dropdown-item" data-action="switch-tab" data-tab="settings">${this.__('settings')}</button>
          <button class="acct-logout acct-dropdown-item" data-action="logout">${this.__("logout")}</button>
        </div>
      </div>

      <div class="acct-section">${this.__("subscriptionPlans")}</div>

      <div class="plans-list">
        ${plans.map(p => `
          <div class="plan-card ${p.popular ? 'plan-popular' : ''}">
            ${p.popular ? `<div class="plan-popular-tag">${this.__("popular")}</div>` : ''}
            <div class="plan-card-top">
              <div class="plan-card-icon ${p.popular ? 'popular' : 'normal'}">${p.icon}</div>
              <div>
                <div class="plan-card-name">${p.name}</div>
                <div class="plan-card-desc">${p.desc}</div>
              </div>
            </div>
            <div class="plan-price-row">
              ${p.price === 0 ? `<span class="plan-price-val">${this.__("free")}</span>` : `<span class="plan-price-val">&euro;${p.price}</span><span class="plan-price-int"> / ${p.interval}</span>`}
            </div>
            <button class="plan-btn ${p.popular ? 'plan-btn-primary' : 'plan-btn-secondary'}" data-action="subscribe" data-id="${p.id}" ${plan === p.id ? 'disabled' : ''}>
              ${plan === p.id ? this.__("currentPlan") : p.price === 0 ? this.__("startFree") : this.__("startTrial")}
            </button>
            <div class="plan-features">
              ${p.features.map(f => `<div class="plan-feat"><span class="plan-feat-icon">${checkSvg}</span>${f}</div>`).join('')}
              ${p.notIncluded.map(f => `<div class="plan-feat plan-feat-off"><span class="plan-feat-icon" style="color:var(--text3)">${xSvg}</span>${f}</div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="acct-footer">${this.__("footer")}</div>
      <button class="acct-logout" data-action="logout">${this.__("logout")}</button>
    `;
  },

  htmlSettings() {
    const langLabels = { it: 'Italiano', en: 'English', fr: 'Français', es: 'Español' };
    const currentLang = this.locale || 'it';
    return `
      <div class="settings-panel">
        <div class="setting-group">
          <h3>${this.__("settings")}</h3>
          <div class="setting-row">
            <label>${this.__("language")}</label>
            <select class="setting-select">
              ${Object.entries(langLabels).map(([code, label]) =>
                `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="setting-row">
            <label>${this.__("connect")}</label>
            <button class="setting-btn" data-action="switch-tab" data-tab="connect">${this.__("connectPg")}</button>
          </div>
          <div class="setting-row">
            <label>${this.__("account")}</label>
            <button class="setting-btn" data-action="switch-tab" data-tab="account">${this.__("manage")}</button>
          </div>
        </div>
      </div>
    `;
  },

  subscribe(planId) {
    if (planId === 'free') {
      chrome.tabs.create({ url: `${API}/dashboard` });
      return;
    }
    chrome.tabs.create({ url: `${API}/pricing` });
  },

  renderMd(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    const lines = html.split('\n');
    const result = [];
    let inUl = false, inOl = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const ulMatch = line.match(/^[-*]\s+(.+)/);
      const olMatch = line.match(/^\d+[.)]\s+(.+)/);
      if (ulMatch) {
        if (inOl) { result.push('</ol>'); inOl = false; }
        if (!inUl) { result.push('<ul>'); inUl = true; }
        result.push('<li>' + ulMatch[1] + '</li>');
      } else if (olMatch) {
        if (inUl) { result.push('</ul>'); inUl = false; }
        if (!inOl) { result.push('<ol>'); inOl = true; }
        result.push('<li>' + olMatch[1] + '</li>');
      } else {
        if (inUl) { result.push('</ul>'); inUl = false; }
        if (inOl) { result.push('</ol>'); inOl = false; }
        if (line.trim() === '') { result.push('<br>'); }
        else { result.push('<p>' + line + '</p>'); }
      }
    }
    if (inUl) result.push('</ul>');
    if (inOl) result.push('</ol>');
    return result.join('\n');
  },

  esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; },
};

document.addEventListener('DOMContentLoaded', () => App.init());


