<template>
  <div class="nav-shell" :data-theme="currentTheme" :style="dimVars">

    <!-- MOBILE TOPBAR (only on mobile) -->
    <header v-if="isMobile" class="topbar">
      <wwLayout path="menuToggleZone" direction="row" class="toggle-zone" />
      <div class="topbar-title">{{ content.sidebarTitle || '' }}</div>
      <button class="tb-btn" @click="toggleTheme">
        <svg v-if="currentTheme==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
      </button>
    </header>

    <!-- MOBILE OVERLAY -->
    <transition name="ov">
      <div v-if="isMobile && content.isMobileMenuOpen" class="overlay" @click="closeMobile" @touchmove.prevent @wheel.prevent />
    </transition>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="sidebarCls">
      <!-- Brand -->
      <div class="sb-brand">
        <div v-if="!isCollapsed" class="sb-title">{{ content.sidebarTitle || '' }}</div>
        <button v-if="!isMobile" class="sb-toggle" @click="toggleCollapse" :title="isCollapsed ? 'Развернуть' : 'Свернуть'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="isCollapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'"/></svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="sb-nav">
        <button v-for="(item, i) in navItems" :key="i" class="nav-btn" :class="{ active: isNavActive(item) }" @click="onNavClick(item, i)" :title="isCollapsed ? item.label : undefined">
          <span class="nav-icon" v-html="svgIcon(autoIcon(item.label), 18)"></span>
          <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Extra dropzone -->
      <div v-if="!isCollapsed" class="sb-extra"><wwLayout path="sidebarZone" direction="column" class="sb-extra-inner" /></div>

      <div class="sb-spacer"></div>

      <!-- Theme toggle -->
      <button class="theme-btn" @click="toggleTheme">
        <svg v-if="currentTheme==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
        <span v-if="!isCollapsed" class="nav-label">{{ currentTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема' }}</span>
      </button>

      <!-- User -->
      <div v-if="content.showUserBlock !== false" class="user-block">
        <div class="user-avatar">{{ userInitials }}</div>
        <template v-if="!isCollapsed">
          <div class="user-info">
            <div class="user-name">{{ userName || '—' }}</div>
            <div class="user-email">{{ userEmail || '—' }}</div>
          </div>
          <button class="logout-btn" @click="doLogout" :title="content.logoutLabel || 'Выйти'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </template>
      </div>
    </aside>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

const SVG = {
  dashboard:'<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.66.003-1.25.396-1.51 1z"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  calendar:'<path d="M8 2v4m8-4v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  chart:'<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
  database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  list:'<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  circle:'<circle cx="12" cy="12" r="10"/>',
};

function matchIcon(label) {
  const l = (label || '').toLowerCase();
  if (/dashboard|панель|обзор|главн/.test(l)) return 'dashboard';
  if (/admin|админ|настрой|setting|управлен/.test(l)) return 'settings';
  if (/user|пользовател|клиент|client|менеджер|сотрудн/.test(l)) return 'users';
  if (/file|файл|документ|doc/.test(l)) return 'file';
  if (/mail|почт|письм|email|сообщен/.test(l)) return 'mail';
  if (/calendar|календар|расписан/.test(l)) return 'calendar';
  if (/chart|график|статистик|аналитик|отчет|отчёт/.test(l)) return 'chart';
  if (/folder|папк|каталог|архив/.test(l)) return 'folder';
  if (/search|поиск/.test(l)) return 'search';
  if (/bell|уведомл|оповещ/.test(l)) return 'bell';
  if (/shield|безопас|защит/.test(l)) return 'shield';
  if (/database|база|данн/.test(l)) return 'database';
  if (/star|избран|важн|закладк/.test(l)) return 'star';
  if (/list|список|задач|todo/.test(l)) return 'list';
  if (/globe|мир|сайт|web/.test(l)) return 'globe';
  if (/lock|блокир|доступ|пароль/.test(l)) return 'lock';
  if (/clock|врем|час|истор|журнал|лог|аудит/.test(l)) return 'clock';
  if (/home|дом|начал|стартов/.test(l)) return 'home';
  if (/zap|быстр|молни|энерг/.test(l)) return 'zap';
  return 'circle';
}

export default {
  props: { content: { type: Object, required: true } },
  data() {
    return {
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
      currentTheme: 'dark',
      sidebarCollapsed: false,
      supabase: null, userName: '', userEmail: '',
      _initBusy: false,
    };
  },
  computed: {
    isMobile() { return this.windowWidth < 992; },
    isCollapsed() { return !this.isMobile && this.sidebarCollapsed; },
    sidebarCls() {
      return {
        collapsed: this.isCollapsed,
        mobileOpen: this.isMobile && this.content.isMobileMenuOpen,
        mobileHidden: this.isMobile && !this.content.isMobileMenuOpen,
      };
    },
    navItems() {
      const items = [];
      for (let i = 1; i <= 8; i++) {
        const label = this.content[`nav${i}Label`];
        if (label) items.push({ label, url: this.content[`nav${i}Url`] || '' });
      }
      return items;
    },
    userInitials() {
      if (!this.userName) return '?';
      return this.userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    },
    dimVars() {
      const c = this.content;
      return {
        '--sw': c.sidebarWidth || '240px',
        '--scw': c.sidebarCollapsedWidth || '64px',
        '--th': c.topbarHeight || '52px',
        '--anim': c.animationDuration || '200ms',
      };
    },
  },
  watch: {
    'content.isMobileMenuOpen'() { this.checkScroll(); },
    'content.isSidebarCollapsed'(v) { this.sidebarCollapsed = !!v; },
    isMobile() { this.updateLayout(); this.checkScroll(); },
    isCollapsed() { this.updateLayout(); },
    'content.sidebarWidth'() { this.updateLayout(); },
    'content.sidebarCollapsedWidth'() { this.updateLayout(); },
    'content.supabaseUrl'() { this.initSupa(); },
    'content.supabaseAnonKey'() { this.initSupa(); },
    'content.theme'(v) { if (v && v !== this.currentTheme) { this.setTheme(v); } },
  },
  mounted() {
    this.sidebarCollapsed = !!this.content?.isSidebarCollapsed;
    this.currentTheme = localStorage.getItem('app-theme') || this.content?.theme || 'dark';
    this.applyGlobalTheme();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('storage', this.onStorage);
    this.checkScroll();
    this.updateLayout();
    this.initSupa();
    setTimeout(() => { if (!this.supabase) this.initSupa(); }, 1500);
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('storage', this.onStorage);
    this.unlockScroll();
    document.body.style.paddingLeft = '';
    document.body.style.paddingTop = '';
  },
  methods: {
    /* ── Icons ── */
    svgIcon(name, size) {
      const d = SVG[name];
      if (!d) return '';
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    },
    autoIcon(label) { return matchIcon(label); },

    /* ── Navigation ── */
    isNavActive(item) {
      if (!item.url) return false;
      try {
        const p = window.location.pathname;
        return p === item.url || p.startsWith(item.url + '/');
      } catch (e) { return false; }
    },
    onNavClick(item, i) {
      this.$emit('trigger-event', { name: 'navClick', event: { url: item.url, label: item.label, index: i } });
      if (this.isMobile) this.closeMobile();
      // Navigate
      if (item.url) {
        try { if (typeof wwLib !== 'undefined' && wwLib.goTo) { wwLib.goTo(item.url); return; } } catch (e) {}
        try { window.location.href = item.url; } catch (e) {}
      }
    },
    closeMobile() { this.$emit('trigger-event', { name: 'overlayClick' }); },

    /* ── Collapse ── */
    toggleCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.$emit('trigger-event', { name: 'collapseToggle', event: { collapsed: this.sidebarCollapsed } });
    },

    /* ── Theme ── */
    toggleTheme() {
      this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
      this.$emit('trigger-event', { name: 'themeChange', event: { theme: this.currentTheme } });
    },
    setTheme(t) {
      this.currentTheme = t;
      localStorage.setItem('app-theme', t);
      this.applyGlobalTheme();
    },
    applyGlobalTheme() {
      // Propagate theme to entire page so admin panel and other sections pick it up
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme: this.currentTheme } }));
    },
    onStorage(e) { if (e.key === 'app-theme' && e.newValue) this.setTheme(e.newValue); },

    /* ── Layout push ── */
    updateLayout() {
      if (!document.body.style.transition.includes('padding')) {
        document.body.style.transition += (document.body.style.transition ? ', ' : '') + 'padding-left 200ms cubic-bezier(0.16,1,0.3,1)';
      }
      if (this.isMobile) {
        document.body.style.paddingLeft = '0px';
        document.body.style.paddingTop = (this.content.topbarHeight || '52px');
      } else {
        document.body.style.paddingTop = '0px';
        document.body.style.paddingLeft = this.isCollapsed
          ? (this.content.sidebarCollapsedWidth || '64px')
          : (this.content.sidebarWidth || '240px');
      }
    },

    /* ── Scroll lock ── */
    onResize() { this.windowWidth = window.innerWidth; },
    checkScroll() { this.isMobile && this.content.isMobileMenuOpen ? this.lockScroll() : this.unlockScroll(); },
    lockScroll() { document.body.style.setProperty('overflow', 'hidden', 'important'); document.documentElement.style.setProperty('overflow', 'hidden', 'important'); },
    unlockScroll() { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; },

    /* ── Supabase ── */
    async initSupa() {
      if (this._initBusy) return; this._initBusy = true;
      try {
        if (typeof wwLib !== 'undefined') {
          const i = wwLib?.wwPlugins?.supabase?.instance || wwLib?.wwPlugins?.supabaseAuth?.publicInstance;
          if (i) { this.supabase = i; await this.loadUser(); return; }
        }
        const u = this.content.supabaseUrl, k = this.content.supabaseAnonKey;
        if (u && k) { this.supabase = createClient(u, k); await this.loadUser(); }
      } catch (e) { console.warn('[Menu]', e.message); }
      finally { this._initBusy = false; }
    },
    async loadUser() {
      if (!this.supabase) return;
      try {
        const { data } = await this.supabase.auth.getUser();
        const u = data?.user;
        if (u) { this.userName = u.user_metadata?.full_name || u.email?.split('@')[0] || ''; this.userEmail = u.email || ''; }
      } catch (e) {}
    },
    async doLogout() {
      this.$emit('trigger-event', { name: 'logout' });
      if (this.supabase) try { await this.supabase.auth.signOut(); } catch (e) {}
    },
  },
};
</script>

<style scoped>
/* ═══ DARK ═══ */
.nav-shell[data-theme="dark"] {
  --bg:#111113; --raised:#18181b; --card:#1c1c20;
  --brd:#27272a; --brd-l:rgba(255,255,255,0.04);
  --tx:#ececec; --tx2:#a1a1aa; --tx3:#71717a;
  --acc:#4B8765; --acc-h:rgba(75,135,101,0.10);
  --sb-bg:#141416; --tb-bg:rgba(20,20,22,0.88);
  --ov-bg:rgba(0,0,0,0.6);
  --n-active:#6BAA85; --n-active-bg:rgba(75,135,101,0.12);
  --n-hover:rgba(75,135,101,0.06); --n-muted:#71717a;
  --scroll:#27272a; --danger:#ef4444;
  --shadow:0 1px 3px rgba(0,0,0,0.3);
  --anim-ease:cubic-bezier(0.16,1,0.3,1);
  --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  color-scheme:dark;
}
/* ═══ LIGHT ═══ */
.nav-shell[data-theme="light"] {
  --bg:#f8f9fa; --raised:#fff; --card:#fff;
  --brd:#e4e4e7; --brd-l:#f4f4f5;
  --tx:#18181b; --tx2:#52525b; --tx3:#71717a;
  --acc:#4B8765; --acc-h:rgba(75,135,101,0.08);
  --sb-bg:#fff; --tb-bg:rgba(255,255,255,0.88);
  --ov-bg:rgba(0,0,0,0.32);
  --n-active:#3d7254; --n-active-bg:rgba(75,135,101,0.09);
  --n-hover:rgba(75,135,101,0.05); --n-muted:#71717a;
  --scroll:#d4d4d8; --danger:#dc2626;
  --shadow:0 1px 3px rgba(0,0,0,0.06);
  --anim-ease:cubic-bezier(0.16,1,0.3,1);
  --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  color-scheme:light;
}

/* ═══ BASE ═══ */
.nav-shell { position:absolute; top:0; left:0; width:100vw; height:0; z-index:9000; pointer-events:none; font-family:var(--font); font-size:13px; color:var(--tx); }
.topbar,.sidebar,.overlay { pointer-events:auto; }

/* ═══ MOBILE TOPBAR ═══ */
.topbar { display:flex; align-items:center; position:fixed; top:0; left:0; width:100vw; height:var(--th); background:var(--tb-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid var(--brd); box-shadow:var(--shadow); z-index:1005; box-sizing:border-box; padding:0 8px; }
.toggle-zone { display:flex; align-items:stretch; min-height:100%; }
.topbar-title { flex:1; font-weight:600; font-size:15px; padding:0 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tb-btn { width:36px; height:36px; border-radius:8px; background:transparent; border:1px solid var(--brd); color:var(--tx3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 200ms var(--anim-ease); flex-shrink:0; }
.tb-btn:hover { border-color:var(--acc); color:var(--tx); background:var(--acc-h); }

/* ═══ OVERLAY ═══ */
.overlay { position:fixed; inset:0; background:var(--ov-bg); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:999; cursor:pointer; }
.ov-enter-active { animation:fadeIn var(--anim) var(--anim-ease); }
.ov-leave-active { animation:fadeOut 180ms ease forwards; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeOut { from{opacity:1} to{opacity:0} }

/* ═══ SIDEBAR ═══ */
.sidebar { display:flex; flex-direction:column; position:fixed; top:0; left:0; width:var(--sw); height:100vh; height:100dvh; background:var(--sb-bg); border-right:1px solid var(--brd); z-index:1000; box-sizing:border-box; transition:width var(--anim) var(--anim-ease),transform var(--anim) var(--anim-ease); overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; }
.sidebar.collapsed { width:var(--scw); }
.sidebar.mobileHidden { top:var(--th); height:calc(100dvh - var(--th)); transform:translateX(-100%); }
.sidebar.mobileOpen { top:var(--th); height:calc(100dvh - var(--th)); transform:translateX(0); box-shadow:4px 0 24px rgba(0,0,0,0.18); }

/* ── Brand ── */
.sb-brand { display:flex; align-items:center; gap:8px; padding:20px 16px 16px; border-bottom:1px solid var(--brd); }
.sb-title { font-size:16px; font-weight:700; letter-spacing:-0.4px; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sb-toggle { width:28px; height:28px; border-radius:6px; background:transparent; border:1px solid var(--brd); color:var(--tx3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 200ms var(--anim-ease); flex-shrink:0; }
.sb-toggle:hover { border-color:var(--acc); color:var(--tx); background:var(--acc-h); }
.sidebar.collapsed .sb-brand { justify-content:center; padding:20px 8px 16px; }
.sidebar.collapsed .sb-toggle { border-color:transparent; }

/* ── Nav (matches admin panel exactly) ── */
.sb-nav { padding:8px; display:flex; flex-direction:column; gap:1px; flex:1; }
.nav-btn { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; background:transparent; border:0; border-radius:8px; cursor:pointer; color:var(--n-muted); font-size:13px; font-family:var(--font); text-align:left; transition:all 200ms var(--anim-ease); white-space:nowrap; overflow:hidden; }
.nav-btn:hover { background:var(--n-hover); color:var(--tx); }
.nav-btn.active { background:var(--n-active-bg); color:var(--n-active); font-weight:600; }
.nav-btn:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }
.sidebar.collapsed .nav-btn { justify-content:center; padding:10px; }
.nav-icon { width:18px; height:18px; flex-shrink:0; display:inline-flex; align-items:center; justify-content:center; opacity:.7; }
.nav-btn.active .nav-icon { opacity:1; }
.nav-label { overflow:hidden; text-overflow:ellipsis; }

/* ── Extra ── */
.sb-extra { padding:0 8px; }
.sb-extra-inner { display:flex; flex-direction:column; width:100%; }
.sb-spacer { flex:1; min-height:8px; }

/* ── Theme button ── */
.theme-btn { display:flex; align-items:center; gap:10px; width:calc(100% - 16px); margin:0 8px 8px; padding:10px 12px; background:transparent; border:1px solid var(--brd); border-radius:8px; cursor:pointer; color:var(--tx3); font-size:13px; font-family:var(--font); text-align:left; transition:all 200ms var(--anim-ease); white-space:nowrap; overflow:hidden; }
.theme-btn:hover { border-color:var(--acc); color:var(--tx); background:var(--acc-h); }
.sidebar.collapsed .theme-btn { justify-content:center; width:calc(100% - 16px); padding:10px; border-color:transparent; margin-bottom:4px; }

/* ── User ── */
.user-block { display:flex; align-items:center; gap:10px; padding:12px 16px; border-top:1px solid var(--brd); }
.sidebar.collapsed .user-block { justify-content:center; padding:12px 8px; }
.user-avatar { width:32px; height:32px; border-radius:50%; background:var(--acc); color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; letter-spacing:.5px; }
.user-info { flex:1; min-width:0; overflow:hidden; }
.user-name { font-size:13px; font-weight:600; color:var(--tx); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-email { font-size:11px; color:var(--tx3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px; }
.logout-btn { width:28px; height:28px; border-radius:6px; background:transparent; border:1px solid transparent; color:var(--tx3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 200ms var(--anim-ease); flex-shrink:0; }
.logout-btn:hover { border-color:var(--danger); color:var(--danger); background:rgba(239,68,68,0.08); }

/* ═══ SCROLLBAR ═══ */
.sidebar::-webkit-scrollbar { width:4px; }
.sidebar::-webkit-scrollbar-track { background:transparent; }
.sidebar::-webkit-scrollbar-thumb { background:var(--scroll); border-radius:2px; }

/* ═══ LIGHT overrides ═══ */
.nav-shell[data-theme="light"] .sidebar { box-shadow:1px 0 2px rgba(0,0,0,0.04); }
.nav-shell[data-theme="light"] .topbar { box-shadow:0 1px 2px rgba(0,0,0,0.05); }

/* ═══ RESPONSIVE ═══ */
@media(max-width:991px) {
  .sidebar.mobileOpen .nav-label, .sidebar.mobileOpen .user-info, .sidebar.mobileOpen .sb-extra { opacity:1!important; width:auto!important; }
}
</style>
