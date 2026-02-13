// Menú multinivel por clic para tablets (768px - 1199px)
// Rango: Tablets estándar incluyendo iPad en modo retrato y landscape
// Cubre: iPad Mini (768-1024px), iPad Air (820-1180px), iPad Pro 11" (834-1194px)
// También cubre Surface Go (768-1366px), Samsung Galaxy Tab (800-1280px), Google Nest Hub (1024-1280px)
document.addEventListener('DOMContentLoaded', function () {
    // Detectar si está en el rango de tablets
    function isTablet() {
        const width = window.innerWidth;
        return width >= 768 && width <= 1199;
    }

    if (!isTablet()) return;

    console.log('Modo tablet detectado - Menú por clic activado');

    // Encontrar todos los enlaces que tienen submenús
    // Nivel 2: Categorías (dentro del ul principal)
    const nivel2Links = document.querySelectorAll('nav[aria-label="Menú principal"] > ul > li.relative.group > a');
    // Nivel 3: Alimentos, Electrodomésticos, etc (dentro de Categorías)
    const nivel3Links = document.querySelectorAll('nav[aria-label="Menú principal"] > ul > li > ul > li.relative > a');

    console.log('Enlaces nivel 2 encontrados:', nivel2Links.length);
    console.log('Enlaces nivel 3 encontrados:', nivel3Links.length);

    // Función para manejar el "Ver todos los productos"
    function agregarVerTodosLosProductos() {
        nivel3Links.forEach((nivel3Link) => {
            const parentLi = nivel3Link.parentElement;
            const submenu = parentLi.querySelector('ul');
            const href = nivel3Link.getAttribute('href');

            if (submenu && href && href !== '#') {
                if (submenu.querySelector('.ver-todos-btn')) return;

                const verTodosLi = document.createElement('li');
                verTodosLi.className = 'ver-todos-btn';
                verTodosLi.innerHTML = `
                    <a href="${href}" style="
                        border-top: 1px solid rgba(255,255,255,0.1); 
                        margin-top: 5px; 
                        padding-top: 8px; 
                        color: #ffcc00; 
                        font-weight: bold;
                        text-align: center;
                        display: block;
                        font-size: 14px;
                    ">
                        Ver todo en esta sección ▸
                    </a>
                `;
                submenu.appendChild(verTodosLi);
            }
        });
    }

    agregarVerTodosLosProductos();

    // Manejar clics nivel 2 (Categorías)
    nivel2Links.forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth > 1199) return;

            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('ul');

            if (submenu) {
                e.preventDefault();
                e.stopPropagation();

                const isActive = submenu.classList.contains('tablet-active');

                // Cerrar todo
                document.querySelectorAll('nav[aria-label="Menú principal"] ul').forEach(ul => {
                    ul.classList.remove('tablet-active');
                });

                if (!isActive) {
                    submenu.classList.add('tablet-active');
                }
            }
        });
    });

    // Manejar clics nivel 3 (Alimentos, etc)
    nivel3Links.forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth > 1199) return;

            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('ul');

            if (submenu) {
                e.preventDefault();
                e.stopPropagation();

                const isActive = submenu.classList.contains('tablet-active');

                // Cerrar otros niveles 3 del mismo padre
                parentLi.parentElement.querySelectorAll('ul').forEach(ul => {
                    ul.classList.remove('tablet-active');
                });

                if (!isActive) {
                    submenu.classList.add('tablet-active');
                }
            }
        });
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-links')) {
            document.querySelectorAll('.nav-links ul').forEach(submenu => {
                submenu.classList.remove('tablet-active');
            });
        }
    });

    // Prevenir navegación en enlaces que no tienen submenús pero están en el contenedor
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (!link.closest('li:has(ul)')) {
            // Enlaces sin submenús navegan normalmente
            console.log('Enlace sin submenú:', link.textContent.trim());
        }
    });
});
