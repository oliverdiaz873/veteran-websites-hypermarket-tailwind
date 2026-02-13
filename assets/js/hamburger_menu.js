
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.nav-links-mobile');
    const mobileMenuNew = document.getElementById('mobile-menu'); // Para el nuevo HTML
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBuscar = document.getElementById('input-buscar');

    // ========== FUNCIONALIDAD PARA MENÚ LEGACY (.nav-links-mobile) ==========
    if (menuBtn && mobileMenu) {
        // Función para agregar botones "Ver todos los productos" en móvil
        function agregarVerTodosLosProductosMovil() {
            console.log('=== Agregando "Ver todos los productos" en móvil ===');

            // Encontrar todos los enlaces de nivel 2 que tienen submenús de nivel 3
            const nivel2Links = mobileMenu.querySelectorAll('.nav-links-mobile > ul > li > ul > li:has(ul) > a');
            console.log('Enlaces de nivel 2 con submenús encontrados en móvil:', nivel2Links.length);

            nivel2Links.forEach((nivel2Link, index) => {
                const parentLi = nivel2Link.parentElement;
                const submenu = parentLi.querySelector('ul'); // Este es el submenú de nivel 3
                const href = nivel2Link.getAttribute('href') || '#';
                const parentText = nivel2Link.textContent.trim();

                console.log(`Procesando móvil nivel 2 ${index}: ${parentText} -> ${href}`);

                if (!submenu) {
                    console.log(`✗ No se encontró submenú de nivel 3 para ${parentText} en móvil`);
                    return;
                }

                // Verificar si ya existe el botón para evitar duplicados
                const existingBtn = submenu.querySelector('.ver-todos-btn-movil');
                if (existingBtn) {
                    console.log(`Botón ya existe para ${parentText} en móvil, omitiendo`);
                    return;
                }

                // Crear el botón "Ver todos los productos" para esta sección
                const verTodosLi = document.createElement('li');
                verTodosLi.className = 'ver-todos-btn-movil';
                verTodosLi.innerHTML = `
                    <a href="${href}" style="
                        border-top: 1px solid rgba(255,255,255,0.2); 
                        margin-top: 5px; 
                        padding-top: 8px; 
                        color: #ffcc00; 
                        font-weight: bold;
                        text-align: left;
                        display: block;
                        width: 100%;
                    ">
                        Ver todos los productos ▸
                    </a>
                `;

                // Agregar al final del submenú de nivel 3
                submenu.appendChild(verTodosLi);

                console.log(`✓ Botón "Ver todos los productos" agregado para móvil: ${parentText}`);
            });

            console.log('=== Botones "Ver todos los productos" agregados en móvil ===');
        }

        // Llamar a la función para agregar los botones
        agregarVerTodosLosProductosMovil();

        // Abrir / cerrar menú móvil
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('show');

            // Forzar visibilidad directa
            if (mobileMenu.classList.contains('show')) {
                mobileMenu.style.display = 'block';
            } else {
                mobileMenu.style.display = 'none';
            }
        });

        // Evitar cierre al hacer click dentro del menú
        mobileMenu.addEventListener('click', (e) => e.stopPropagation());

        // Submenús móviles - manejo simplificado
        // Encontrar todos los enlaces que tienen submenús inmediatamente después
        const allLinksWithSubmenu = mobileMenu.querySelectorAll('a + ul');

        allLinksWithSubmenu.forEach(ul => {
            const parentLink = ul.previousElementSibling; // El enlace justo antes del UL

            if (parentLink && parentLink.tagName === 'A') {
                parentLink.addEventListener('click', function (e) {
                    e.preventDefault(); // Siempre prevenir navegación para enlaces con submenú

                    const parentLi = this.parentElement;

                    // Alterna submenú actual
                    parentLi.classList.toggle('show');

                    // Solo cerrar submenús hermanos que también tienen submenús (no los elementos del nivel 2)
                    const parentContainer = parentLi.parentElement;
                    const siblingSubmenus = Array.from(parentContainer.children)
                        .filter(li => li !== parentLi && li.querySelector('ul'));

                    siblingSubmenus.forEach(sib => sib.classList.remove('show'));
                });
            }
        });

        // Cierra menú si se hace click fuera
        document.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            const openSubs = mobileMenu.querySelectorAll('li.show');
            openSubs.forEach(li => li.classList.remove('show'));
        });
    }

    // ========== FUNCIONALIDAD PARA NUEVO MENÚ (#mobile-menu) ==========
    if (menuBtn && mobileMenuNew) {
        // Función para agregar botones "Ver todos los productos" en el nuevo móvil
        function agregarVerTodosLosProductosNuevoMovil() {
            const subDropdownBtns = mobileMenuNew.querySelectorAll('.mobile-sub-dropdown-btn');

            subDropdownBtns.forEach(btn => {
                const submenu = btn.nextElementSibling;

                if (submenu && submenu.tagName === 'UL') {
                    // Evitar duplicados
                    if (submenu.querySelector('.ver-todos-btn-movil-nuevo')) return;

                    // Intentar obtener el href base del primer enlace del submenú
                    const firstLink = submenu.querySelector('a');
                    let hrefBase = '#';

                    if (firstLink) {
                        const fullHref = firstLink.getAttribute('href');
                        if (fullHref) {
                            // Extraer la parte antes del # (ej: categorias/Alimentos.html#frutas -> categorias/Alimentos.html)
                            hrefBase = fullHref.split('#')[0];
                        }
                    }

                    // Crear el botón "Ver todos los productos"
                    const verTodosLi = document.createElement('li');
                    verTodosLi.className = 'ver-todos-btn-movil-nuevo';
                    verTodosLi.innerHTML = `
                        <a href="${hrefBase}" class="block py-3 mt-1" style="
                            border-top: 1px solid rgba(255,255,255,0.1); 
                            color: #ffcc00; 
                            font-weight: bold;
                        ">
                            Ver todos los productos ▸
                        </a>
                    `;

                    // Agregar al final del submenú
                    submenu.appendChild(verTodosLi);
                }
            });
        }

        // Llamar a la función inmediatamente
        agregarVerTodosLosProductosNuevoMovil();

        // Toggle Mobile Menu
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuNew.classList.toggle('hidden');
        });

        // Toggle Mobile Dropdown (Categorías principales)
        const mobileDropdownBtn = document.querySelector('.mobile-dropdown-btn');
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
        const subDropdownBtns = document.querySelectorAll('.mobile-sub-dropdown-btn');
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

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuNew && !mobileMenuNew.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenuNew.classList.add('hidden');
            }
        });
    }
});
