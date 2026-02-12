document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileDropdownBtn = document.querySelector('.mobile-dropdown-btn');
    const subDropdownBtns = document.querySelectorAll('.mobile-sub-dropdown-btn');
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    // Toggle Mobile Menu
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Toggle Mobile Dropdown (Categorías principales)
    if (mobileDropdownBtn) {
        mobileDropdownBtn.addEventListener('click', () => {
            const submenu = mobileDropdownBtn.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('hidden');
                submenu.classList.toggle('opacity-0');
                submenu.classList.toggle('opacity-100');
            }
        });
    }

    // Toggle Mobile Sub-Dropdowns (Subcategorías)
    subDropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const submenu = btn.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('hidden');
                // Rotar flecha si existe
                const icon = btn.querySelector('span');
                if (icon) icon.classList.toggle('rotate-90');
            }
        });
    });

    // Toggle Search Input
    if (btnBuscar && inputBuscar) {
        btnBuscar.addEventListener('click', () => {
            inputBuscar.classList.toggle('hidden');
            if (!inputBuscar.classList.contains('hidden')) {
                inputBuscar.focus();
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
});
