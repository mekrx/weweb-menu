<template>
  <div class="nav-shell" :data-theme="currentTheme" :style="dimVars">

    <!-- MOBILE TOPBAR -->
    <header v-if="isMobile" class="topbar">
      <wwLayout path="menuToggleZone" direction="row" class="toggle-zone" />
      <div class="topbar-title" :style="{ fontSize: content.sidebarTitleSize || '16px' }">{{ content.sidebarTitle || '' }}</div>
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
        <div v-if="!isCollapsed" class="sb-title" :style="{ fontSize: content.sidebarTitleSize || '16px' }">{{ content.sidebarTitle || '' }}</div>
        <button v-if="!isMobile" class="sb-toggle" @click="toggleCollapse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="isCollapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'"/></svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="sb-nav">
        <template v-for="(item, i) in flatNav" :key="i">
          <!-- Separator -->
          <div v-if="item.type === 'separator' && !isCollapsed" class="nav-sep">{{ item.label }}</div>
          <div v-else-if="item.type === 'separator' && isCollapsed && i > 0" class="nav-sep-line"></div>

          <!-- Regular item -->
          <button v-else-if="item.type === 'item'" class="nav-btn" :class="{ active: isNavActive(item) }" @click="onNavClick(item, i)" :title="isCollapsed ? item.label : undefined">
            <span class="nav-icon" :style="{ width: content.navIconSize || '18px', height: content.navIconSize || '18px' }">
              <span v-if="resolvedIcons[i]" v-html="resolvedIcons[i]" class="icon-wrap"></span>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </span>
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </button>

          <!-- Child (sub-item) -->
          <button v-else-if="item.type === 'child' && !isCollapsed" class="nav-child" :class="{ active: isNavActive(item) }" @click="onNavClick(item, i)">
            <span class="child-dot"></span>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </template>
      </nav>

      <!-- Extra dropzone -->
      <div v-if="!isCollapsed" class="sb-extra"><wwLayout path="sidebarZone" direction="column" class="sb-extra-inner" /></div>

      <div class="sb-spacer"></div>

      <!-- Theme -->
      <button class="theme-btn" @click="toggleTheme">
        <span class="theme-icon">
          <svg v-if="currentTheme==='dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
        </span>
        <span v-if="!isCollapsed" class="nav-label">{{ currentTheme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw' }}</span>
      </button>

      <!-- User -->
      <div v-if="content.showUserBlock !== false" class="user-block">
        <div class="user-avatar">{{ userInitials }}</div>
        <template v-if="!isCollapsed">
          <div class="user-info">
            <div class="user-name">{{ userName || '—' }}</div>
            <div class="user-email">{{ userEmail || '—' }}</div>
          </div>
          <button class="logout-btn" @click="doLogout" :title="content.logoutLabel || 'Wyloguj'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </template>
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
      supabase: null, userName: '', userEmail: '',
      resolvedIcons: {},
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
    flatNav() { return this.content.navItems || []; },
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
    this.checkScroll();
    this.updateLayout();
    this.initSupa();
    this.resolveAllIcons();
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
        if (items[i].type === 'item' && items[i].icon) this.resolveIcon(i, items[i].icon);
      }
    },

    /* Nav */
    isNavActive(item) {
      if (!item.link) return false;
      try {
        if (item.link.pageId && typeof wwLib !== 'undefined') {
          const cur = wwLib?.wwWebsiteData?.page?.id;
          if (cur && item.link.pageId === cur) return true;
        }
        const p = window.location.pathname;
        if (item.link.href) return p === item.link.href || p.startsWith(item.link.href + '/');
      } catch (e) {}
      return false;
    },
    onNavClick(item, i) {
      this.$emit('trigger-event', { name: 'navClick', event: { url: item.link?.href || '', label: item.label, index: i } });
      if (this.isMobile) this.closeMobile();
      // Send adminTab via localStorage + CustomEvent before navigation
      const adminTab = item.link?.query?.adminTab;
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
          // Use wwLib.navigateTo which handles internal WeWeb navigation properly
          if (wwLib.navigateTo) { wwLib.navigateTo(link); return; }
          // Try changeRoute
          if (wwLib.changeRoute) { wwLib.changeRoute(link); return; }
          // Try goTo with full link object
          if (wwLib.goTo) { wwLib.goTo(link); return; }
          // Try Vue Router
          const router = wwLib.getRouter?.() || wwLib.getFrontRouter?.() || wwLib.$router;
          if (router) {
            // Resolve page path
            const path = this._resolvePath(link.pageId);
            if (path) {
              let url = path;
              if (link.query && Object.keys(link.query).length) url += '?' + new URLSearchParams(link.query).toString();
              router.push(url);
              return;
            }
          }
        }
        // External links
        if (link.href) {
          if (link.targetBlank) window.open(link.href, '_blank');
          else window.location.href = link.href;
        }
      } catch (e) {
        console.warn('[Menu] navigateTo error:', e, 'link:', JSON.stringify(link));
        if (link.href) window.location.href = link.href;
      }
    },
    _resolvePath(pageId) {
      try {
        const wd = wwLib?.wwWebsiteData;
        if (!wd) return null;
        // pages could be object or array
        const src = [
          wd.pages, wd.design?.pages,
          Object.values(wd.pages || {}), Object.values(wd.design?.pages || {}),
        ];
        for (const ps of src) {
          if (!ps) continue;
          const arr = Array.isArray(ps) ? ps : (typeof ps === 'object' ? [ps] : []);
          for (const p of arr) {
            if (p && p.id === pageId) {
              const path = p.paths?.default || p.path || p.linkId || p.name;
              if (path) return path.startsWith('/') ? path : '/' + path;
            }
          }
        }
      } catch (e) {}
      return null;
    },
    closeMobile() { this.$emit('trigger-event', { name: 'overlayClick' }); },

    /* Collapse */
    toggleCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.$emit('trigger-event', { name: 'collapseToggle', event: { collapsed: this.sidebarCollapsed } });
      this.updateLayout();
    },

    /* Theme */
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
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme: this.currentTheme } }));
    },
    onStorage(e) { if (e.key === 'app-theme' && e.newValue) this.setTheme(e.newValue); },

    /* Layout */
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

    /* Scroll */
    onResize() { this.windowWidth = window.innerWidth; },
    checkScroll() { this.isMobile && this.content.isMobileMenuOpen ? this.lockScroll() : this.unlockScroll(); },
    lockScroll() { document.body.style.setProperty('overflow', 'hidden', 'important'); document.documentElement.style.setProperty('overflow', 'hidden', 'important'); },
    unlockScroll() { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; },

    /* Supabase */
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
.nav-shell[data-theme="dark"]{--bg:#111113;--raised:#18181b;--card:#1c1c20;--brd:#27272a;--brd-l:rgba(255,255,255,0.04);--tx:#ececec;--tx2:#a1a1aa;--tx3:#71717a;--tx4:#52525b;--acc:#4B8765;--acc-h:rgba(75,135,101,0.10);--sb-bg:#141416;--tb-bg:rgba(20,20,22,0.88);--ov-bg:rgba(0,0,0,0.6);--n-active:#6BAA85;--n-active-bg:rgba(75,135,101,0.12);--n-hover:rgba(75,135,101,0.06);--n-muted:#71717a;--scroll:#27272a;--danger:#ef4444;--shadow:0 1px 3px rgba(0,0,0,0.3);--ease:cubic-bezier(0.16,1,0.3,1);--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color-scheme:dark}
/* ═══ LIGHT ═══ */
.nav-shell[data-theme="light"]{--bg:#f8f9fa;--raised:#fff;--card:#fff;--brd:#e4e4e7;--brd-l:#f4f4f5;--tx:#18181b;--tx2:#52525b;--tx3:#71717a;--tx4:#a1a1aa;--acc:#4B8765;--acc-h:rgba(75,135,101,0.08);--sb-bg:#fff;--tb-bg:rgba(255,255,255,0.88);--ov-bg:rgba(0,0,0,0.32);--n-active:#3d7254;--n-active-bg:rgba(75,135,101,0.09);--n-hover:rgba(75,135,101,0.05);--n-muted:#71717a;--scroll:#d4d4d8;--danger:#dc2626;--shadow:0 1px 3px rgba(0,0,0,0.06);--ease:cubic-bezier(0.16,1,0.3,1);--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color-scheme:light}

/* BASE */
.nav-shell{position:absolute;top:0;left:0;width:100vw;height:0;z-index:9000;pointer-events:none;font-family:var(--font);font-size:13px;color:var(--tx)}
.topbar,.sidebar,.overlay{pointer-events:auto}

/* TOPBAR */
.topbar{display:flex;align-items:center;position:fixed;top:0;left:0;width:100vw;height:var(--th);background:var(--tb-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--brd);box-shadow:var(--shadow);z-index:1005;box-sizing:border-box;padding:0 8px}
.toggle-zone{display:flex;align-items:stretch;min-height:100%}
.topbar-title{flex:1;font-weight:600;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
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
.sb-brand{display:flex;align-items:center;gap:8px;padding:20px 16px 16px;border-bottom:1px solid var(--brd)}
.sb-title{font-weight:700;letter-spacing:-0.4px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-toggle{width:28px;height:28px;border-radius:6px;background:transparent;border:1px solid var(--brd);color:var(--tx3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 200ms var(--ease);flex-shrink:0}
.sb-toggle:hover{border-color:var(--acc);color:var(--tx);background:var(--acc-h)}
.sidebar.collapsed .sb-brand{justify-content:center;padding:20px 8px 16px}
.sidebar.collapsed .sb-toggle{border-color:transparent}

/* NAV */
.sb-nav{padding:8px;display:flex;flex-direction:column;gap:1px}

/* Separator */
.nav-sep{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--tx4);padding:16px 12px 6px}
.nav-sep-line{height:1px;background:var(--brd);margin:8px 12px}

/* Nav button (matches admin panel) */
.nav-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:transparent;border:0;border-radius:8px;cursor:pointer;color:var(--n-muted);font-size:13px;font-family:var(--font);text-align:left;text-decoration:none;transition:all 200ms var(--ease);white-space:nowrap;overflow:hidden;box-sizing:border-box}
.nav-btn:hover{background:var(--n-hover);color:var(--tx)}
.nav-btn.active{background:var(--n-active-bg);color:var(--n-active);font-weight:600}
.nav-btn:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.sidebar.collapsed .nav-btn{justify-content:center;padding:10px}

/* Icon */
.nav-icon{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;opacity:.7;line-height:0}
.nav-btn.active .nav-icon{opacity:1}
.icon-wrap{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;line-height:0}
.icon-wrap :deep(svg){width:100%;height:100%}
.icon-wrap :deep(img){width:100%;height:100%;object-fit:contain}
.nav-label{overflow:hidden;text-overflow:ellipsis;flex:1}

/* Child (sub-item) */
.nav-child{display:flex;align-items:center;gap:8px;width:100%;padding:7px 12px 7px 40px;background:transparent;border:0;border-radius:6px;cursor:pointer;color:var(--tx4);font-size:12px;font-family:var(--font);text-align:left;text-decoration:none;transition:all 200ms var(--ease);white-space:nowrap;overflow:hidden;box-sizing:border-box}
.nav-child:hover{background:var(--n-hover);color:var(--tx)}
.nav-child.active{color:var(--n-active);font-weight:600}
.child-dot{width:4px;height:4px;border-radius:50%;background:var(--tx4);flex-shrink:0;transition:background 200ms}
.nav-child.active .child-dot{background:var(--n-active)}

/* Extra */
.sb-extra{padding:0 8px}.sb-extra-inner{display:flex;flex-direction:column;width:100%}
.sb-spacer{flex:1;min-height:8px}

/* Theme */
.theme-btn{display:flex;align-items:center;gap:10px;width:calc(100% - 16px);margin:0 8px 8px;padding:10px 12px;background:transparent;border:1px solid var(--brd);border-radius:8px;cursor:pointer;color:var(--tx3);font-size:13px;font-family:var(--font);text-align:left;transition:all 200ms var(--ease);white-space:nowrap;overflow:hidden}
.theme-btn:hover{border-color:var(--acc);color:var(--tx);background:var(--acc-h)}
.theme-icon{width:18px;height:18px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;line-height:0}
.sidebar.collapsed .theme-btn{justify-content:center;width:calc(100% - 16px);padding:10px;border-color:transparent;margin-bottom:4px}

/* User */
.user-block{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--brd)}
.sidebar.collapsed .user-block{justify-content:center;padding:12px 8px}
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
