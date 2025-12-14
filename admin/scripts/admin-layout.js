// Admin Layout Shared JavaScript
// Matches Next.js DashboardLayout functionality

(function() {
    'use strict';

    // Menu sections matching Next.js structure
    const menuSections = [
        {
            title: "IT ADMIN AREA",
            items: [{ href: "it-admin/index.html", label: "IT Admin", icon: "settings" }]
        },
        {
            title: "ADVOCATE ADMIN",
            items: [{ href: "advocates/index.html", label: "Advocate Admin", icon: "user-check" }]
        },
        {
            title: "CLIENT",
            items: [{ href: "clients/index.html", label: "Client", icon: "user-circle" }]
        },
        {
            title: "MARKETING",
            items: [{ href: "marketing/index.html", label: "Marketing", icon: "trending-up" }]
        },
        {
            title: "OPERATIONS",
            items: [{ href: "#operations", label: "Operations", icon: "settings" }]
        },
        {
            title: "ADENGINE",
            items: [{ href: "adengine/index.html", label: "AdEngine", icon: "file-text" }]
        },
        {
            title: "BLOGS",
            items: [{ href: "#blogs", label: "Blogs", icon: "file-text" }]
        },
        {
            title: "LAW SCHOOL",
            items: [{ href: "law-school/index.html", label: "Law School", icon: "graduation-cap" }]
        },
        {
            title: "WEB SITE",
            items: [{ href: "website/index.html", label: "Web Site", icon: "globe" }]
        },
        {
            title: "NEWSLETTER",
            items: [{ href: "newsletter/index.html", label: "Newsletter", icon: "mail" }]
        },
        {
            title: "USERS",
            items: [{ href: "users/index.html", label: "Users", icon: "user-circle" }]
        }
    ];

    // Icon SVG paths matching Lucide icons
    const icons = {
        settings: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
        "user-check": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        "user-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        "trending-up": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
        "file-text": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
        "graduation-cap": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>',
        globe: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>',
        mail: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
        "log-out": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>',
        menu: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>',
        x: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
    };

    // Get current page path relative to admin folder
    function getCurrentPath() {
        const path = window.location.pathname;
        const adminIndex = path.indexOf('/admin/');
        if (adminIndex !== -1) {
            const relativePath = path.substring(adminIndex + 7); // '/admin/'.length
            return relativePath || 'dashboard/index.html';
        }
        // Fallback: check if we're in a subdirectory
        const pathParts = path.split('/').filter(p => p);
        const adminFolderIndex = pathParts.indexOf('admin');
        if (adminFolderIndex !== -1 && pathParts.length > adminFolderIndex + 1) {
            return pathParts.slice(adminFolderIndex + 1).join('/');
        }
        return 'dashboard/index.html';
    }

    // Get base path for links (../ if in subdirectory, empty if at root)
    function getBasePath() {
        const currentPath = getCurrentPath();
        if (currentPath.includes('/')) {
            // We're in a subdirectory, need to go up one level
            return '../';
        }
        return '';
    }

    // Get assets path (../../assets/ if in subdirectory, ../assets/ if at admin root)
    function getAssetsPath() {
        const currentPath = getCurrentPath();
        if (currentPath.includes('/')) {
            // We're in a subdirectory, need to go up two levels
            return '../../assets/';
        }
        return '../assets/';
    }

    // Check if link is active
    function isActiveLink(href) {
        const currentPath = getCurrentPath();
        // Remove leading '../' or './' and normalize
        let normalizedHref = href.replace(/^\.\.\//, '').replace(/^\.\//, '');
        // Remove hash if present
        normalizedHref = normalizedHref.split('#')[0];
        return currentPath === normalizedHref || currentPath.endsWith('/' + normalizedHref);
    }

    // Initialize admin layout
    function initAdminLayout() {
        // Check if admin is logged in
        if (!localStorage.getItem('admin')) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize sidebar
        initSidebar();
        
        // Initialize top bar
        initTopBar();
        
        // Set active navigation
        setActiveNavigation();
    }

    // Initialize sidebar
    function initSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        if (!sidebar) return;

        const basePath = getBasePath();
        const assetsPath = getAssetsPath();
        let navHTML = `
            <div class="mb-6 pb-6 border-b">
                <a href="${basePath}dashboard/index.html" class="flex items-center gap-3 hover:opacity-85 transition-opacity">
                    <img src="${assetsPath}logo.svg" alt="AdvocateKhoj" class="h-8 w-auto">
                    <div>
                        <span class="text-lg font-bold text-gray-900">AdvocateKhoj</span>
                        <p class="text-xs text-gray-500">Admin Panel</p>
                    </div>
                </a>
            </div>
        `;
        navHTML += '<nav class="space-y-6">';
        
        menuSections.forEach(section => {
            navHTML += `
                <div>
                    <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                        ${section.title}
                    </h3>
                    <div class="space-y-1">
            `;
            
            section.items.forEach(item => {
                // Skip hash links for now
                if (item.href.startsWith('#')) {
                    navHTML += `
                        <a 
                            href="${item.href}" 
                            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${icons[item.icon] || icons.settings}
                            </svg>
                            ${item.label}
                        </a>
                    `;
                } else {
                    const fullHref = basePath + item.href;
                    const active = isActiveLink(item.href);
                    const iconPath = icons[item.icon] || icons.settings;
                    navHTML += `
                        <a 
                            href="${fullHref}" 
                            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                active 
                                    ? 'bg-[#00377b] text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${iconPath}
                            </svg>
                            ${item.label}
                        </a>
                    `;
                }
            });
            
            navHTML += '</div></div>';
        });
        
        navHTML += '</nav>';
        navHTML += `
            <div class="mt-6 pt-6 border-t">
                <button 
                    id="logout-btn"
                    class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${icons['log-out']}
                    </svg>
                    LOG OUT
                </button>
            </div>
        `;
        
        sidebar.innerHTML = navHTML;
        
        // Add logout handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }

    // Initialize top bar
    function initTopBar() {
        const topBar = document.getElementById('admin-top-bar');
        if (!topBar) return;

        const assetsPath = getAssetsPath();
        topBar.innerHTML = `
            <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-4">
                    <button 
                        id="sidebar-toggle"
                        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg id="menu-icon" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${icons.menu}
                        </svg>
                        <svg id="close-icon" class="w-5 h-5 text-gray-600 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${icons.x}
                        </svg>
                    </button>
                    <img src="${assetsPath}logo.svg" alt="AdvocateKhoj" class="h-10 w-auto">
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600 hidden sm:block">Admin Portal</span>
                </div>
            </div>
        `;

        // Add sidebar toggle handler
        const toggleBtn = document.getElementById('sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleSidebar);
        }
    }

    // Toggle sidebar
    function toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar-container');
        const overlay = document.getElementById('sidebar-overlay');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (!sidebar) return;
        
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        
        if (isOpen) {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        } else {
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('hidden');
            if (menuIcon) menuIcon.classList.add('hidden');
            if (closeIcon) closeIcon.classList.remove('hidden');
        }
    }

    // Set active navigation
    function setActiveNavigation() {
        const links = document.querySelectorAll('#admin-sidebar a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (isActiveLink(href)) {
                link.classList.add('bg-[#00377b]', 'text-white');
                link.classList.remove('text-gray-700', 'hover:bg-gray-100');
            }
        });
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_user');
        const basePath = getBasePath();
        window.location.href = basePath + 'index.html';
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminLayout);
    } else {
        initAdminLayout();
    }

    // Close sidebar when clicking overlay
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('sidebar-overlay');
        if (e.target === overlay) {
            toggleSidebar();
        }
    });

    // Export for use in other scripts
    window.AdminLayout = {
        toggleSidebar: toggleSidebar,
        handleLogout: handleLogout,
        setActiveNavigation: setActiveNavigation
    };
})();
