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
            ['sidebarTitle', 'sidebarTitleSize'],
            ['logoDark', 'logoLight', 'logoSize'],
            ['showUserBlock', 'logoutLabel', 'logoutRedirect'],
            ['navIconSize', 'navChildIconSize', 'navFontSize', 'navChildFontSize', 'navSepFontSize'],
            ['navItems'],
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

        theme: { label: { en: 'Theme' }, type: 'TextSelect', options: { options: [{ value: 'dark', label: { en: 'Dark' } }, { value: 'light', label: { en: 'Light' } }] }, defaultValue: 'dark', bindable: true, responsive: true },
        supabaseUrl: { label: { en: 'Supabase URL' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },
        supabaseAnonKey: { label: { en: 'Supabase Anon Key' }, type: 'Text', defaultValue: '', bindable: true, section: 'settings' },

        isSidebarCollapsed: { label: { en: 'Sidebar collapsed (PC)' }, type: 'OnOff', defaultValue: false, bindable: true },
        isMobileMenuOpen: { label: { en: 'Mobile menu open' }, type: 'OnOff', defaultValue: false, bindable: true },

        sidebarWidth: { label: { en: 'Sidebar width' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 180, max: 320 }] }, defaultValue: '240px', bindable: true, responsive: true },
        sidebarCollapsedWidth: { label: { en: 'Collapsed width' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 48, max: 100 }] }, defaultValue: '64px', bindable: true, responsive: true },
        topbarHeight: { label: { en: 'Mobile topbar height' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 40, max: 80 }] }, defaultValue: '52px', bindable: true, responsive: true },
        animationDuration: { label: { en: 'Animation speed' }, type: 'Length', options: { unitChoices: [{ value: 'ms', label: 'ms', min: 0, max: 800 }] }, defaultValue: '200ms', bindable: true },

        sidebarTitle: { label: { en: 'Sidebar title' }, type: 'Text', defaultValue: 'CRM Panel', bindable: true },
        sidebarTitleSize: { label: { en: 'Title font size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 10, max: 32 }] }, defaultValue: '16px', bindable: true, responsive: true },

        logoDark: { label: { en: 'Logo (dark theme)' }, type: 'Image', bindable: true },
        logoLight: { label: { en: 'Logo (light theme)' }, type: 'Image', bindable: true },
        logoSize: { label: { en: 'Logo size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 16, max: 64 }] }, defaultValue: '28px', bindable: true, responsive: true },

        showUserBlock: { label: { en: 'Show user block' }, type: 'OnOff', defaultValue: true, bindable: true },
        logoutLabel: { label: { en: 'Logout text' }, type: 'Text', defaultValue: 'Wyloguj', bindable: true },
        logoutRedirect: { label: { en: 'Logout redirect page' }, type: 'Link', bindable: true },

        navIconSize: { label: { en: 'Nav icon size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 10, max: 32 }] }, defaultValue: '18px', bindable: true, responsive: true },
        navChildIconSize: { label: { en: 'Sub-item icon size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 8, max: 24 }] }, defaultValue: '14px', bindable: true, responsive: true },
        navFontSize: { label: { en: 'Nav font size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 10, max: 20 }] }, defaultValue: '13px', bindable: true, responsive: true },
        navChildFontSize: { label: { en: 'Sub-item font size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 9, max: 18 }] }, defaultValue: '12px', bindable: true, responsive: true },
        navSepFontSize: { label: { en: 'Section label font size' }, type: 'Length', options: { unitChoices: [{ value: 'px', label: 'px', min: 8, max: 16 }] }, defaultValue: '10px', bindable: true, responsive: true },

        navItems: {
            label: { en: 'Navigation items' },
            type: 'Array',
            bindable: true,
            options: {
                movable: true,
                expandable: true,
                getItemLabel(item, index) {
                    if (item.type === 'separator') return '── ' + (item.label || 'Separator');
                    if (item.type === 'child') return '  · ' + (item.label || 'Sub-item');
                    return item.label || `Item ${index + 1}`;
                },
                item: {
                    type: 'Object',
                    defaultValue: { type: 'item', label: '', icon: null, link: null },
                    options: {
                        item: {
                            type: {
                                label: { en: 'Type' },
                                type: 'TextSelect',
                                options: { options: [
                                    { value: 'item', label: { en: 'Nav item' } },
                                    { value: 'separator', label: { en: 'Section separator' } },
                                    { value: 'child', label: { en: 'Sub-item' } },
                                ]},
                            },
                            label: { label: { en: 'Label' }, type: 'Text' },
                            icon: { label: { en: 'Icon' }, type: 'SystemIcon', hidden: (content) => content.type === 'separator' },
                            link: { label: { en: 'Link' }, type: 'Link', hidden: (content) => content.type === 'separator' },
                        },
                    },
                },
            },
            defaultValue: [
                { type: 'item', label: 'Dashboard', icon: null, link: null },
                { type: 'separator', label: 'Administracja', icon: null, link: null },
                { type: 'item', label: 'Panel admina', icon: null, link: null },
                { type: 'child', label: 'Dashboard', icon: null, link: null },
                { type: 'child', label: 'Użytkownicy', icon: null, link: null },
                { type: 'child', label: 'Role', icon: null, link: null },
                { type: 'child', label: 'Audyt', icon: null, link: null },
                { type: 'separator', label: 'CRM', icon: null, link: null },
                { type: 'item', label: 'Klienci', icon: null, link: null },
            ],
        },
    }
};
