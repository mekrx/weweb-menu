export default {
    editor: {
        label: { en: 'CRM Navigation Menu' },
        icon: 'layout',
        customStylePropertiesOrder: [
            ['theme'],
            ['supabaseUrl', 'supabaseAnonKey'],
            ['isSidebarCollapsed', 'isMobileMenuOpen'],
            ['sidebarWidth', 'sidebarCollapsedWidth', 'topbarHeight'],
            ['animationDuration'],
            ['sidebarTitle'],
            ['showUserBlock', 'logoutLabel'],
            ['nav1Label', 'nav1Url'],
            ['nav2Label', 'nav2Url'],
            ['nav3Label', 'nav3Url'],
            ['nav4Label', 'nav4Url'],
            ['nav5Label', 'nav5Url'],
            ['nav6Label', 'nav6Url'],
            ['nav7Label', 'nav7Url'],
            ['nav8Label', 'nav8Url'],
        ]
    },
    triggerEvents: [
        { name: 'overlayClick', label: { en: 'Kliknięcie overlay (zamknij menu mob.)' }, event: {} },
        { name: 'themeChange', label: { en: 'Zmiana motywu' }, event: { theme: '' } },
        { name: 'logout', label: { en: 'Kliknięcie wylogowania' }, event: {} },
        { name: 'navClick', label: { en: 'Kliknięcie nawigacji' }, event: { url: '', label: '', index: 0 } },
        { name: 'collapseToggle', label: { en: 'Zwinięcie/rozwinięcie sidebara' }, event: { collapsed: false } },
    ],
    properties: {
        menuToggleZone: { type: 'Array', hidden: true, defaultValue: [] },
        sidebarZone: { type: 'Array', hidden: true, defaultValue: [] },

        theme: { label: { en: 'Motyw' }, type: 'TextSelect', options: { options: [{ value: 'dark', label: { en: 'Ciemny' } }, { value: 'light', label: { en: 'Jasny' } }] }, defaultValue: 'dark', bindable: true, responsive: true },
        supabaseUrl: { label: { en: 'Supabase URL' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },
        supabaseAnonKey: { label: { en: 'Supabase Anon Key' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },

        isSidebarCollapsed: { label: { en: 'Zwiń sidebar (PC)' }, type: 'OnOff', defaultValue: false, bindable: true },
        isMobileMenuOpen: { label: { en: 'Otwórz menu (mob.)' }, type: 'OnOff', defaultValue: false, bindable: true },

        sidebarWidth: { label: { en: 'Szerokość sidebara' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 180, max: 320 }] }, defaultValue: '240px', bindable: true, responsive: true },
        sidebarCollapsedWidth: { label: { en: 'Szerokość zwiniętego' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 48, max: 100 }] }, defaultValue: '64px', bindable: true, responsive: true },
        topbarHeight: { label: { en: 'Wysokość paska (mob.)' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 40, max: 80 }] }, defaultValue: '52px', bindable: true, responsive: true },
        animationDuration: { label: { en: 'Czas animacji' }, type: 'Length', options: { unitChoices: [{ value: 'ms', label: 'ms', min: 0, max: 800 }] }, defaultValue: '200ms', bindable: true },

        sidebarTitle: { label: { en: 'Tytuł sidebara' }, type: 'Text', defaultValue: 'CRM Panel', bindable: true },
        showUserBlock: { label: { en: 'Blok użytkownika' }, type: 'OnOff', defaultValue: true, bindable: true },
        logoutLabel: { label: { en: 'Tekst wylogowania' }, type: 'Text', defaultValue: 'Wyloguj', bindable: true },

        nav1Label: { label: { en: 'Nav 1 — Nazwa' }, type: 'Text', defaultValue: 'Dashboard', bindable: true },
        nav1Url: { label: { en: 'Nav 1 — URL' }, type: 'Text', defaultValue: '/dashboard', bindable: true },
        nav2Label: { label: { en: 'Nav 2 — Nazwa' }, type: 'Text', defaultValue: 'Panel admina', bindable: true },
        nav2Url: { label: { en: 'Nav 2 — URL' }, type: 'Text', defaultValue: '/admin', bindable: true },
        nav3Label: { label: { en: 'Nav 3 — Nazwa' }, type: 'Text', defaultValue: 'Klienci', bindable: true },
        nav3Url: { label: { en: 'Nav 3 — URL' }, type: 'Text', defaultValue: '/clients', bindable: true },
        nav4Label: { label: { en: 'Nav 4 — Nazwa' }, type: 'Text', defaultValue: '', bindable: true },
        nav4Url: { label: { en: 'Nav 4 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav5Label: { label: { en: 'Nav 5 — Nazwa' }, type: 'Text', defaultValue: '', bindable: true },
        nav5Url: { label: { en: 'Nav 5 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav6Label: { label: { en: 'Nav 6 — Nazwa' }, type: 'Text', defaultValue: '', bindable: true },
        nav6Url: { label: { en: 'Nav 6 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav7Label: { label: { en: 'Nav 7 — Nazwa' }, type: 'Text', defaultValue: '', bindable: true },
        nav7Url: { label: { en: 'Nav 7 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav8Label: { label: { en: 'Nav 8 — Nazwa' }, type: 'Text', defaultValue: '', bindable: true },
        nav8Url: { label: { en: 'Nav 8 — URL' }, type: 'Text', defaultValue: '', bindable: true },
    }
};
