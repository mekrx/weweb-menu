<template>
  <div class="nav-shell" :data-theme="currentTheme" :style="dimVars">

    <!-- MOBILE TOPBAR -->
    <header v-if="isMobile" class="topbar">
      <wwLayout path="menuToggleZone" direction="row" class="toggle-zone" />
      <div class="topbar-brand">
        <img v-if="currentLogo" :src="currentLogo" class="topbar-logo" :style="{ height: content.logoSize || '28px' }" />
        <span class="topbar-title" :style="{ fontSize: content.sidebarTitleSize || '16px' }">{{ content.sidebarTitle || '' }}</span>
      </div>
      <button class="tb-btn" @click="toggleTheme">
        <svg v-if="currentTheme==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
      </button>
    </header>

    <!-- OVERLAY -->
    <transition name="ov">
      <div v-if="isMobile && content.isMobileMenuOpen" class="overlay" @click="closeMobile" @touchmove.prevent @wheel.prevent />
    </transition>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="sidebarCls">
      <!-- Brand -->
      <div class="sb-brand">
        <template v-if="!isCollapsed">
          <img v-if="currentLogo" :src="currentLogo" class="sb-logo" :style="{ height: content.logoSize || '28px' }" />
          <div class="sb-title" :style="{ fontSize: content.sidebarTitleSize || '16px' }">{{ content.sidebarTitle || '' }}</div>
        </template>
        <img v-else-if="currentLogo" :src="currentLogo" class="sb-logo-mini" :style="{ height: content.logoSize || '28px' }" />
        <button v-if="!isMobile" class="sb-toggle" @click="toggleCollapse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="isCollapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'"/></svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="sb-nav">
        <template v-for="(item, i) in flatNav" :key="i">
          <!-- Separator -->
          <button v-if="item.type === 'separator' && !isCollapsed" class="nav-sep" :style="{ fontSize: content.navSepFontSize || '10px' }" @click="toggleSection(i)">
            <span class="nav-sep-text">{{ item.label }}</span>
            <svg class="nav-sep-arrow" :class="{ collapsed: isSectionCollapsed(i) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div v-else-if="item.type === 'separator' && isCollapsed && i > 0" class="nav-sep-line"></div>

          <!-- Regular item (show in collapsed too) -->
          <button v-else-if="item.type === 'item' && !isSectionHidden(i)" class="nav-btn" :class="{ active: isNavActive(item) }" @click="onNavClick(item, i)" :title="isCollapsed ? item.label : undefined" :style="{ fontSize: content.navFontSize || '13px' }">
            <span class="nav-icon" :style="{ width: content.navIconSize || '18px', height: content.navIconSize || '18px' }">
              <span v-if="resolvedIcons[i]" v-html="resolvedIcons[i]" class="icon-wrap"></span>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </span>
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </button>

          <!-- Child: show as icon-only in collapsed, full in expanded -->
          <button v-else-if="item.type === 'child' && !isSectionHidden(i)" class="nav-child" :class="{ active: isNavActive(item), 'child-collapsed': isCollapsed }" @click="onNavClick(item, i)" :title="isCollapsed ? item.label : undefined" :style="{ fontSize: isCollapsed ? undefined : (content.navChildFontSize || '12px') }">
            <span v-if="resolvedIcons[i]" class="child-icon" :style="{ width: isCollapsed ? (content.navIconSize || '18px') : (content.navChildIconSize || '14px'), height: isCollapsed ? (content.navIconSize || '18px') : (content.navChildIconSize || '14px') }"><span v-html="resolvedIcons[i]" class="icon-wrap"></span></span>
            <span v-else-if="!isCollapsed" class="child-dot"></span>
            <span v-else class="child-dot-collapsed"></span>
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </button>
        </template>
      </nav>

      <!-- Extra -->
      <div v-if="!isCollapsed" class="sb-extra"><wwLayout path="sidebarZone" direction="column" class="sb-extra-inner" /></div>
      <div class="sb-spacer"></div>

      <!-- Theme -->
      <button class="nav-btn theme-row" @click="toggleTheme" :title="isCollapsed ? (currentTheme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw') : undefined">
        <span class="nav-icon" style="width:18px;height:18px">
          <svg v-if="currentTheme==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
        </span>
        <span v-if="!isCollapsed" class="nav-label">{{ currentTheme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw' }}</span>
      </button>

      <!-- User -->
      <div v-if="content.showUserBlock !== false" class="user-block" :title="isCollapsed ? (userName || userEmail) : undefined">
        <div class="user-avatar">{{ userInitials }}</div>
        <template v-if="!isCollapsed">
          <div class="user-info">
            <div class="user-name">{{ userName || '—' }}</div>
            <div class="user-email">{{ userEmail || '—' }}</div>
          </div>
        </template>
        <button class="logout-btn" @click="doLogout" :title="content.logoutLabel || 'Wyloguj'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

export default {
  props: { content: { type: Object, required: true } },
  data() {
    return {
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
      currentTheme: 'dark',
      sidebarCollapsed: false,
      collapsedSections: {},
      supabase: null, userName: '', userEmail: '',
      resolvedIcons: {},
      _initBusy: false,
      _pagesMap: null,
    };
  },
  computed: {
    isMobile() { return this.windowWidth < 992; },
    isCollapsed() { return !this.isMobile && this.sidebarCollapsed; },
    sidebarCls() {
      return { collapsed: this.isCollapsed, mobileOpen: this.isMobile && this.content.isMobileMenuOpen, mobileHidden: this.isMobile && !this.content.isMobileMenuOpen };
    },
    flatNav() { return this.content.navItems || []; },
    currentLogo() {
      const dark = this.content.logoDark;
      const light = this.content.logoLight;
      const logo = this.currentTheme === 'light' ? (light || dark) : (dark || light);
      if (!logo) return '';
      // Handle WeWeb Image type — can be string URL or object with url
      if (typeof logo === 'string') return logo;
      return logo.url || logo.src || logo.path || '';
    },
    userInitials() {
      if (!this.userName) return '?';
      return this.userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    },
    dimVars() {
      const c = this.content;
      return { '--sw': c.sidebarWidth || '240px', '--scw': c.sidebarCollapsedWidth || '64px', '--th': c.topbarHeight || '52px', '--anim': c.animationDuration || '200ms' };
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
    'content.theme'(v) { if (v && v !== this.currentTheme) this.setTheme(v); },
    'content.navItems': { handler() { this.resolveAllIcons(); }, deep: true },
  },
  mounted() {
    this.sidebarCollapsed = !!this.content?.isSidebarCollapsed;
    this.currentTheme = localStorage.getItem('app-theme') || this.content?.theme || 'dark';
    this.applyGlobalTheme();
    localStorage.setItem('has-nav-menu', '1');
    window.addEventListener('resize', this.onResize);
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('popstate', this.onPopState);
    this.checkScroll();
    this.updateLayout();
    this.initSupa();
    this.resolveAllIcons();
    this._buildPagesMap();
    setTimeout(() => { if (!this.supabase) this.initSupa(); }, 1500);
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('storage', this.onStorage);
    window.removeEventListener('popstate', this.onPopState);
    this.unlockScroll();
    document.body.style.paddingLeft = '';
    document.body.style.paddingTop = '';
  },
  methods: {
    /* Build pageId -> path map from wwLib */
    _buildPagesMap() {
      this._pagesMap = {};
      try {
        if (typeof wwLib === 'undefined') return;
        // Try every possible location for pages data
        const sources = [
          wwLib.wwWebsiteData?.pages,
          wwLib.wwApp?.pages,
          wwLib.$store?.getters?.['websiteData/getPages'],
        ];
        for (const src of sources) {
          if (!src) continue;
          // Array of pages
          if (Array.isArray(src)) {
            for (const p of src) {
              if (p.id) this._pagesMap[p.id] = p.paths?.default || p.path || p.linkId || '';
            }
            if (Object.keys(this._pagesMap).length) return;
          }
          // Object keyed by id
          if (typeof src === 'object') {
            for (const [id, p] of Object.entries(src)) {
              if (p && typeof p === 'object') {
                this._pagesMap[id] = p.paths?.default || p.path || p.linkId || '';
              }
            }
            if (Object.keys(this._pagesMap).length) return;
          }
        }
      } catch (e) { console.warn('[Menu] _buildPagesMap:', e); }
    },
    _getPagePath(pageId) {
      if (!pageId) return null;
      // Try built map
      if (this._pagesMap && this._pagesMap[pageId]) {
        const p = this._pagesMap[pageId];
        return p.startsWith('/') ? p : '/' + p;
      }
      // Rebuild and try again
      this._buildPagesMap();
      if (this._pagesMap && this._pagesMap[pageId]) {
        const p = this._pagesMap[pageId];
        return p.startsWith('/') ? p : '/' + p;
      }
      return null;
    },

    /* Icons */
    async resolveIcon(index, val) {
      if (!val) { this.resolvedIcons = { ...this.resolvedIcons, [index]: '' }; return; }
      try {
        if (typeof wwLib !== 'undefined' && wwLib.useIcons) {
          const { getIcon } = wwLib.useIcons();
          const svg = await getIcon(val);
          this.resolvedIcons = { ...this.resolvedIcons, [index]: svg || '' };
        } else {
          const s = String(val).replace(/\//g, ':');
          if (/^[a-zA-Z0-9:\-]+$/.test(s)) {
            this.resolvedIcons = { ...this.resolvedIcons, [index]: `<img src="https://api.iconify.design/${s}.svg" style="width:100%;height:100%;object-fit:contain"/>` };
          }
        }
      } catch (e) { this.resolvedIcons = { ...this.resolvedIcons, [index]: '' }; }
    },
    resolveAllIcons() {
      const items = this.flatNav;
      for (let i = 0; i < items.length; i++) {
        if ((items[i].type === 'item' || items[i].type === 'child') && items[i].icon) this.resolveIcon(i, items[i].icon);
      }
    },

    /* Section collapse */
    toggleSection(si) { this.collapsedSections = { ...this.collapsedSections, [si]: !this.collapsedSections[si] }; },
    isSectionCollapsed(si) { return !!this.collapsedSections[si]; },
    isSectionHidden(idx) {
      for (let j = idx - 1; j >= 0; j--) {
        if (this.flatNav[j].type === 'separator') return !!this.collapsedSections[j];
      }
      return false;
    },

    /* Active state */
    isNavActive(item) {
      if (!item.link) return false;
      try {
        // Get current page id
        const curId = wwLib?.wwWebsiteData?.page?.id || wwLib?.wwApp?.page?.id || null;
        if (curId && item.link.pageId === curId) {
          const q = item.link.query;
          const itemTab = Array.isArray(q) ? q.find(x => x.name === 'adminTab')?.value : q?.adminTab;
          if (itemTab) {
            const urlTab = new URLSearchParams(window.location.search).get('adminTab');
            return urlTab === itemTab;
          }
          // Page matches and no specific tab — active only if no other item with same pageId+tab is active
          return true;
        }
        // Fallback: match by path
        const path = this._getPagePath(item.link.pageId);
        if (path) {
          const cur = window.location.pathname;
          return cur === path || cur === path + '/';
        }
      } catch (e) {}
      return false;
    },
    onPopState() { this.$forceUpdate(); },

    /* Nav click */
    onNavClick(item, i) {
      this.$emit('trigger-event', { name: 'navClick', event: { url: item.link?.href || '', label: item.label, index: i } });
      if (this.isMobile) this.closeMobile();
      const q = item.link?.query;
      const adminTab = Array.isArray(q) ? q.find(x => x.name === 'adminTab')?.value : q?.adminTab;
      if (adminTab) {
        localStorage.setItem('pendingAdminTab', adminTab);
        window.dispatchEvent(new CustomEvent('admin-set-tab', { detail: { adminTab } }));
      }
      if (item.link) this.navigateTo(item.link);
    },
    navigateTo(link) {
      if (!link) return;
      try {
        if (typeof wwLib !== 'undefined' && link.pageId) {
          let qs = '';
          if (Array.isArray(link.query) && link.query.length) {
            qs = '?' + link.query.map(q => encodeURIComponent(q.name) + '=' + encodeURIComponent(q.value)).join('&');
          }
          const goTo = wwLib.wwApp?.goTo || wwLib.goTo;
          if (goTo) {
            goTo(link.pageId);
            if (qs) setTimeout(() => { window.history.replaceState(null, '', window.location.pathname + qs); }, 150);
            return;
          }
        }
        if (link.href) {
          if (link.targetBlank) window.open(link.href, '_blank');
          else window.location.href = link.href;
        }
      } catch (e) {
        console.warn('[Menu] navigateTo error:', e);
      }
    },
    closeMobile() { this.$emit('trigger-event', { name: 'overlayClick' }); },

    toggleCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.$emit('trigger-event', { name: 'collapseToggle', event: { collapsed: this.sidebarCollapsed } });
      this.updateLayout();
    },
    toggleTheme() {
      this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
      this.$emit('trigger-event', { name: 'themeChange', event: { theme: this.currentTheme } });
    },
    setTheme(t) { this.currentTheme = t; localStorage.setItem('app-theme', t); this.applyGlobalTheme(); },
    applyGlobalTheme() {
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme: this.currentTheme } }));
    },
    onStorage(e) { if (e.key === 'app-theme' && e.newValue) this.setTheme(e.newValue); },
    updateLayout() {
      if (!document.body.style.transition.includes('padding')) {
        document.body.style.transition += (document.body.style.transition ? ', ' : '') + 'padding-left 200ms cubic-bezier(0.16,1,0.3,1)';
      }
      if (this.isMobile) {
        document.body.style.paddingLeft = '0px';
        document.body.style.paddingTop = (this.content.topbarHeight || '52px');
      } else {
        document.body.style.paddingTop = '0px';
        document.body.style.paddingLeft = this.isCollapsed ? (this.content.sidebarCollapsedWidth || '64px') : (this.content.sidebarWidth || '240px');
      }
    },
    onResize() { this.windowWidth = window.innerWidth; },
    checkScroll() { this.isMobile && this.content.isMobileMenuOpen ? this.lockScroll() : this.unlockScroll(); },
    lockScroll() { document.body.style.setProperty('overflow', 'hidden', 'important'); document.documentElement.style.setProperty('overflow', 'hidden', 'important'); },
    unlockScroll() { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; },
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
      const link = this.content.logoutRedirect;
      if (link) this.navigateTo(link);
    },
  },
};
</script>

<style scoped>
/* ═══ DARK ═══ */
.nav-shell[data-theme="dark"]{--bg:#111113;--raised:#18181b;--card:#1c1c20;--brd:#27272a;--brd-l:rgba(255,255,255,0.04);--tx:#f0f0f0;--tx2:#c4c4cc;--tx3:#8e8e96;--tx4:#6e6e78;--acc:#4B8765;--acc-h:rgba(75,135,101,0.10);--sb-bg:#141416;--tb-bg:rgba(20,20,22,0.88);--ov-bg:rgba(0,0,0,0.6);--n-color:#c4c4cc;--n-active:#6BAA85;--n-active-bg:rgba(75,135,101,0.12);--n-hover:rgba(75,135,101,0.06);--n-muted:#8e8e96;--scroll:#27272a;--danger:#ef4444;--shadow:0 1px 3px rgba(0,0,0,0.3);--ease:cubic-bezier(0.16,1,0.3,1);--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color-scheme:dark}
/* ═══ LIGHT ═══ */
.nav-shell[data-theme="light"]{--bg:#f8f9fa;--raised:#fff;--card:#fff;--brd:#e4e4e7;--brd-l:#f4f4f5;--tx:#1a1a1e;--tx2:#3a3a42;--tx3:#5a5a64;--tx4:#8a8a94;--acc:#4B8765;--acc-h:rgba(75,135,101,0.08);--sb-bg:#fff;--tb-bg:rgba(255,255,255,0.88);--ov-bg:rgba(0,0,0,0.32);--n-color:#3a3a42;--n-active:#3d7254;--n-active-bg:rgba(75,135,101,0.09);--n-hover:rgba(75,135,101,0.05);--n-muted:#5a5a64;--scroll:#d4d4d8;--danger:#dc2626;--shadow:0 1px 3px rgba(0,0,0,0.06);--ease:cubic-bezier(0.16,1,0.3,1);--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color-scheme:light}

.nav-shell{position:absolute;top:0;left:0;width:100vw;height:0;z-index:9000;pointer-events:none;font-family:var(--font);font-size:13px;color:var(--tx)}
.topbar,.sidebar,.overlay{pointer-events:auto}

/* TOPBAR */
.topbar{display:flex;align-items:center;position:fixed;top:0;left:0;width:100vw;height:var(--th);background:var(--tb-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--brd);box-shadow:var(--shadow);z-index:1005;box-sizing:border-box;padding:0 8px}
.toggle-zone{display:flex;align-items:stretch;min-height:100%}
.topbar-brand{flex:1;display:flex;align-items:center;gap:8px;padding:0 8px;overflow:hidden}
.topbar-logo{object-fit:contain;flex-shrink:0}
.topbar-title{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-btn{width:36px;height:36px;border-radius:8px;background:transparent;border:1px solid var(--brd);color:var(--tx3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 200ms var(--ease);flex-shrink:0}
.tb-btn:hover{border-color:var(--acc);color:var(--tx);background:var(--acc-h)}

/* OVERLAY */
.overlay{position:fixed;inset:0;background:var(--ov-bg);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:999;cursor:pointer}
.ov-enter-active{animation:fadeIn var(--anim) var(--ease)}.ov-leave-active{animation:fadeOut 180ms ease forwards}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}

/* SIDEBAR */
.sidebar{display:flex;flex-direction:column;position:fixed;top:0;left:0;width:var(--sw);height:100vh;height:100dvh;background:var(--sb-bg);border-right:1px solid var(--brd);z-index:1000;box-sizing:border-box;transition:width var(--anim) var(--ease),transform var(--anim) var(--ease);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}
.sidebar.collapsed{width:var(--scw)}
.sidebar.mobileHidden{top:var(--th);height:calc(100dvh - var(--th));transform:translateX(-100%)}
.sidebar.mobileOpen{top:var(--th);height:calc(100dvh - var(--th));transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,0.18)}

/* Brand */
.sb-brand{display:flex;align-items:center;gap:10px;padding:20px 16px 16px;border-bottom:1px solid var(--brd)}
.sb-logo,.sb-logo-mini{object-fit:contain;flex-shrink:0}
.sb-title{font-weight:700;letter-spacing:-0.4px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--tx)}
.sb-toggle{width:28px;height:28px;border-radius:6px;background:transparent;border:1px solid var(--brd);color:var(--tx3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 200ms var(--ease);flex-shrink:0}
.sb-toggle:hover{border-color:var(--acc);color:var(--tx);background:var(--acc-h)}
.sidebar.collapsed .sb-brand{justify-content:center;padding:20px 8px 16px}
.sidebar.collapsed .sb-toggle{border-color:transparent}

/* NAV */
.sb-nav{padding:8px;display:flex;flex-direction:column;gap:1px}

/* Separator */
.nav-sep{display:flex;align-items:center;gap:4px;width:100%;padding:16px 12px 6px;background:none;border:0;cursor:pointer;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--tx4);font-family:var(--font);text-align:left;transition:color 150ms}
.nav-sep:hover{color:var(--tx3)}
.nav-sep-text{flex:1}
.nav-sep-arrow{flex-shrink:0;transition:transform 200ms var(--ease);opacity:.5}
.nav-sep-arrow.collapsed{transform:rotate(-90deg)}
.nav-sep-line{height:1px;background:var(--brd);margin:8px 12px}

/* ALL buttons same base effect (fix #6) */
.nav-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:transparent;border:0;border-radius:8px;cursor:pointer;color:var(--n-color);font-family:var(--font);text-align:left;text-decoration:none;transition:all 200ms var(--ease);white-space:nowrap;overflow:hidden;box-sizing:border-box}
.nav-btn:hover{background:var(--n-hover);color:var(--tx)}
.nav-btn.active{background:var(--n-active-bg);color:var(--n-active);font-weight:600}
.nav-btn:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.sidebar.collapsed .nav-btn{justify-content:center;padding:10px}

/* Theme row uses nav-btn class — same effects as all buttons */
.theme-row{margin:0 0 4px;border:1px solid var(--brd);color:var(--tx3)}
.theme-row:hover{border-color:var(--acc);color:var(--tx);background:var(--acc-h)}
.sidebar.collapsed .theme-row{border-color:transparent}

/* Icon */
.nav-icon{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;opacity:.75;line-height:0}
.nav-btn.active .nav-icon{opacity:1}
.icon-wrap{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;line-height:0}
.icon-wrap :deep(svg){width:100%;height:100%}
.icon-wrap :deep(img){width:100%;height:100%;object-fit:contain}
.nav-label{overflow:hidden;text-overflow:ellipsis;flex:1}

/* Child — same hover/active effects as nav-btn */
.nav-child{display:flex;align-items:center;gap:8px;width:100%;padding:7px 12px 7px 40px;background:transparent;border:0;border-radius:6px;cursor:pointer;color:var(--n-muted);font-family:var(--font);text-align:left;text-decoration:none;transition:all 200ms var(--ease);white-space:nowrap;overflow:hidden;box-sizing:border-box}
.nav-child:hover{background:var(--n-hover);color:var(--tx)}
.nav-child.active{background:var(--n-active-bg);color:var(--n-active);font-weight:600}
.nav-child:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
/* Collapsed child — icon only, centered */
.nav-child.child-collapsed{padding:8px;justify-content:center}
.child-icon{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;opacity:.6;line-height:0}
.nav-child.active .child-icon{opacity:1}
.child-dot{width:4px;height:4px;border-radius:50%;background:var(--tx4);flex-shrink:0;transition:background 200ms}
.child-dot-collapsed{width:4px;height:4px;border-radius:50%;background:var(--tx4);flex-shrink:0}
.nav-child.active .child-dot,.nav-child.active .child-dot-collapsed{background:var(--n-active)}

/* Extra */
.sb-extra{padding:0 8px}.sb-extra-inner{display:flex;flex-direction:column;width:100%}
.sb-spacer{flex:1;min-height:8px}

/* User — always show logout button */
.user-block{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--brd)}
.sidebar.collapsed .user-block{flex-direction:column;gap:6px;padding:10px 8px}
.user-avatar{width:32px;height:32px;border-radius:50%;background:var(--acc);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;letter-spacing:.5px}
.user-info{flex:1;min-width:0;overflow:hidden}
.user-name{font-size:13px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-email{font-size:11px;color:var(--tx3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.logout-btn{width:28px;height:28px;border-radius:6px;background:transparent;border:1px solid transparent;color:var(--tx3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 200ms var(--ease);flex-shrink:0}
.logout-btn:hover{border-color:var(--danger);color:var(--danger);background:rgba(239,68,68,0.08)}

/* Scrollbar */
.sidebar::-webkit-scrollbar{width:4px}.sidebar::-webkit-scrollbar-track{background:transparent}.sidebar::-webkit-scrollbar-thumb{background:var(--scroll);border-radius:2px}

/* Light */
.nav-shell[data-theme="light"] .sidebar{box-shadow:1px 0 2px rgba(0,0,0,0.04)}
.nav-shell[data-theme="light"] .topbar{box-shadow:0 1px 2px rgba(0,0,0,0.05)}

/* Mobile */
@media(max-width:991px){.sidebar.mobileOpen .nav-label,.sidebar.mobileOpen .user-info,.sidebar.mobileOpen .sb-extra{opacity:1!important;width:auto!important}}
</style>
