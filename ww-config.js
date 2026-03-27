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
        { name: 'overlayClick', label: { en: 'On overlay click (close mobile menu)' }, event: {} },
        { name: 'themeChange', label: { en: 'On theme toggle' }, event: { theme: '' } },
        { name: 'logout', label: { en: 'On logout click' }, event: {} },
        { name: 'navClick', label: { en: 'On nav item click' }, event: { url: '', label: '', index: 0 } },
        { name: 'collapseToggle', label: { en: 'On sidebar collapse/expand' }, event: { collapsed: false } },
    ],
    properties: {
        menuToggleZone: { type: 'Array', hidden: true, defaultValue: [] },
        sidebarZone: { type: 'Array', hidden: true, defaultValue: [] },

        theme: { label: { en: 'Тема' }, type: 'TextSelect', options: { options: [{ value: 'dark', label: { en: 'Тёмная' } }, { value: 'light', label: { en: 'Светлая' } }] }, defaultValue: 'dark', bindable: true, responsive: true },
        supabaseUrl: { label: { en: 'Supabase URL' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },
        supabaseAnonKey: { label: { en: 'Supabase Anon Key' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },

        isSidebarCollapsed: { label: { en: 'Свернуть сайдбар (ПК)' }, type: 'OnOff', defaultValue: false, bindable: true },
        isMobileMenuOpen: { label: { en: 'Открыть меню (мобильное)' }, type: 'OnOff', defaultValue: false, bindable: true },

        sidebarWidth: { label: { en: 'Ширина сайдбара' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 180, max: 320 }] }, defaultValue: '240px', bindable: true, responsive: true },
        sidebarCollapsedWidth: { label: { en: 'Ширина в свёрнутом виде' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 48, max: 100 }] }, defaultValue: '64px', bindable: true, responsive: true },
        topbarHeight: { label: { en: 'Высота панели (моб.)' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 40, max: 80 }] }, defaultValue: '52px', bindable: true, responsive: true },
        animationDuration: { label: { en: 'Скорость анимации' }, type: 'Length', options: { unitChoices: [{ value: 'ms', label: 'ms', min: 0, max: 800 }] }, defaultValue: '200ms', bindable: true },

        sidebarTitle: { label: { en: 'Заголовок сайдбара' }, type: 'Text', defaultValue: 'CRM Panel', bindable: true },
        showUserBlock: { label: { en: 'Блок пользователя' }, type: 'OnOff', defaultValue: true, bindable: true },
        logoutLabel: { label: { en: 'Текст выхода' }, type: 'Text', defaultValue: 'Выйти', bindable: true },

        nav1Label: { label: { en: 'Навигация 1 — Название' }, type: 'Text', defaultValue: 'Dashboard', bindable: true },
        nav1Url: { label: { en: 'Навигация 1 — URL' }, type: 'Text', defaultValue: '/dashboard', bindable: true },
        nav2Label: { label: { en: 'Навигация 2 — Название' }, type: 'Text', defaultValue: 'Админ панель', bindable: true },
        nav2Url: { label: { en: 'Навигация 2 — URL' }, type: 'Text', defaultValue: '/admin', bindable: true },
        nav3Label: { label: { en: 'Навигация 3 — Название' }, type: 'Text', defaultValue: 'Клиенты', bindable: true },
        nav3Url: { label: { en: 'Навигация 3 — URL' }, type: 'Text', defaultValue: '/clients', bindable: true },
        nav4Label: { label: { en: 'Навигация 4 — Название' }, type: 'Text', defaultValue: '', bindable: true },
        nav4Url: { label: { en: 'Навигация 4 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav5Label: { label: { en: 'Навигация 5 — Название' }, type: 'Text', defaultValue: '', bindable: true },
        nav5Url: { label: { en: 'Навигация 5 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav6Label: { label: { en: 'Навигация 6 — Название' }, type: 'Text', defaultValue: '', bindable: true },
        nav6Url: { label: { en: 'Навигация 6 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav7Label: { label: { en: 'Навигация 7 — Название' }, type: 'Text', defaultValue: '', bindable: true },
        nav7Url: { label: { en: 'Навигация 7 — URL' }, type: 'Text', defaultValue: '', bindable: true },
        nav8Label: { label: { en: 'Навигация 8 — Название' }, type: 'Text', defaultValue: '', bindable: true },
        nav8Url: { label: { en: 'Навигация 8 — URL' }, type: 'Text', defaultValue: '', bindable: true },
    }
};
