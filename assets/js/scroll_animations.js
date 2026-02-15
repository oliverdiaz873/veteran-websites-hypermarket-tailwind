// Scroll-Driven Scale Animation progresiva para sección Sobre Nosotros
document.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.about-us-section');
    if (!section) return;

    function isMobile() {
        return window.innerWidth <= 767.98;
    }

    function updateScale() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const sectionHeight = rect.height;

        let progress = 0;

        if (sectionTop <= windowHeight && sectionBottom >= 0) {
            if (isMobile()) {
                // Móvil: progreso según posición del borde superior en el viewport.
                // Así la animación termina en un scroll predecible (cuando la sección "llega" al tope).
                // progress = 1 cuando sectionTop <= 0, progress = 0 cuando sectionTop >= windowHeight
                progress = 1 - (sectionTop / windowHeight);
                progress = Math.max(0, Math.min(1, progress));
            } else {
                if (sectionTop >= 0) {
                    const visibleHeight = Math.min(sectionHeight, windowHeight - sectionTop);
                    progress = visibleHeight / sectionHeight;
                } else {
                    progress = 1;
                }
                progress = Math.max(0, Math.min(1, progress));
            }
        }

        if (isMobile()) {
            section.classList.remove('scale-50', 'scale-100');
            if (progress >= 0.25) section.classList.add('scale-50');
            if (progress >= 0.65) section.classList.add('scale-100');
        } else {
            section.classList.remove('scale-33', 'scale-66', 'scale-100');
            if (progress >= 0.33) section.classList.add('scale-33');
            if (progress >= 0.66) section.classList.add('scale-66');
            if (progress >= 1) section.classList.add('scale-100');
        }
    }

    let ticking = false;
    function onScrollOrResize() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function() {
            updateScale();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    updateScale();
});
