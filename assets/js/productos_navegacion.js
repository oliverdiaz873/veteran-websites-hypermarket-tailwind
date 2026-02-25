// Botones del carrusel para la navegación de productos destacados y ofertas 
document.addEventListener('DOMContentLoaded', function () {
    // Configurar para productos destacados (id de sección: productos-destacados)
    setupCarousel('productos-destacados');

    // Configurar para ofertas
    setupCarousel('ofertas');

    // Configurar para secciones de Alimentos
    setupCarousel('frutas_y_verduras');
    setupCarousel('carnes_pescados_mariscos');
    setupCarousel('despensa');
    setupCarousel('lacteos_y_huevos');
    setupCarousel('bebidas');
    setupCarousel('enlatados');

    // Configurar para secciones de Electrodomésticos
    setupCarousel('cocina');
    setupCarousel('lavado');
    setupCarousel('climatizacion');

    // Configurar para secciones de Farmacia
    setupCarousel('analgesicos');
    setupCarousel('dermocosmetica');
    setupCarousel('vitaminas_y_minerales');
    setupCarousel('antigripales_y_resfriado');

    // Configurar para secciones de Ferretería
    setupCarousel('herramientas_manuales');
    setupCarousel('pinturas');
    setupCarousel('electricidad');
    setupCarousel('plomeria');

    // Configurar para secciones de Juguetes
    setupCarousel('juguetes_para_ninos');
    setupCarousel('juguetes_para_ninas');

    // Configurar para secciones de Muebles y Decoración
    setupCarousel('sofas');
    setupCarousel('sillones');
    setupCarousel('mesas');
    setupCarousel('floreros');

    // Configurar para secciones de Ropa
    setupCarousel('pantalones_para_hombres');
    setupCarousel('pantalones_para_mujeres');
    setupCarousel('pantalones_para_niños');
    setupCarousel('trajes_para_hombres');
    setupCarousel('vestidos');

    // Configurar para secciones de Tecnología
    setupCarousel('televisores');
    setupCarousel('laptops');
    setupCarousel('tablets');
    setupCarousel('celulares');
    setupCarousel('bocinas');

    function setupCarousel(type) {
        const container = document.querySelector(`#${type} .productos-container`);
        const prevBtn = document.getElementById(`${type}-prev`);
        const nextBtn = document.getElementById(`${type}-next`);

        console.log(`Setup carousel for ${type}:`, {
            container: !!container,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            containerWidth: container ? container.clientWidth : 'N/A',
            scrollWidth: container ? container.scrollWidth : 'N/A',
            maxScroll: container ? container.scrollWidth - container.clientWidth : 'N/A'
        });

        if (!container || !prevBtn || !nextBtn) return;

        // Make container focusable for keyboard support
        container.setAttribute('tabindex', '0');
        container.setAttribute('aria-label', `Carrusel de ${type}`);

        // Update button states with professional opacity transitions and visibility
        function updateButtonStates() {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            const atStart = scrollLeft <= 5;
            const atEnd = scrollLeft >= maxScroll - 5;

            console.log(`Update buttons for ${type}:`, {
                scrollLeft,
                maxScroll,
                atStart,
                atEnd,
                containerWidth: container.clientWidth,
                scrollWidth: container.scrollWidth
            });

            // smooth opacity Transitions via style (handled by CSS transitions if present)
            prevBtn.style.opacity = atStart ? '0' : '1';
            prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
            prevBtn.style.visibility = atStart ? 'hidden' : 'visible';

            nextBtn.style.opacity = atEnd ? '0' : '1';
            nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
            nextBtn.style.visibility = atEnd ? 'hidden' : 'visible';
        }

        // Calculate shift: Item width + gap
        function getScrollAmount() {
            const firstItem = container.querySelector('.producto') || container.querySelector('.shrink-0');
            if (!firstItem) return 300;
            const gap = parseInt(window.getComputedStyle(container).gap) || 0;
            // Move 2 items at a time on desktop, 1 on mobile
            const multiplier = window.innerWidth > 768 ? 2 : 1;
            return (firstItem.offsetWidth + gap) * multiplier;
        }

        function scroll(direction) {
            const amount = getScrollAmount();
            container.scrollBy({
                left: direction === 'prev' ? -amount : amount,
                behavior: 'smooth'
            });
        }

        // Event listeners
        prevBtn.addEventListener('click', () => scroll('prev'));
        nextBtn.addEventListener('click', () => scroll('next'));

        // Listen for scroll events to update button states (performance optimized)
        container.addEventListener('scroll', () => {
            requestAnimationFrame(updateButtonStates);
        });

        // Keyboard support
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                scroll('prev');
            } else if (e.key === 'ArrowRight') {
                scroll('next');
            }
        });

        // Initial state check
        updateButtonStates();

        // Resize optimization
        window.addEventListener('resize', updateButtonStates);

        // Fallback for dynamic content
        setTimeout(updateButtonStates, 500);
    }
});
