// Scroll suave con ajuste de posiciÃ³n ideal para secciones
document.addEventListener('DOMContentLoaded', function() {
    
    // FunciÃ³n para hacer scroll suave a una secciÃ³n con ajuste de altura
    function smoothScrollToSection(sectionId, offset = 80) {
        const section = document.getElementById(sectionId);
        
        if (section) {
            // Calcular la posiciÃ³n ideal
            const sectionTop = section.offsetTop - offset;
            
            // Hacer scroll suave
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            
            // Agregar clase temporal para resaltar la secciÃ³n
            section.classList.add('section-highlighted');
            
            // Remover la clase despuÃ©s de la animaciÃ³n
            setTimeout(() => {
                section.classList.remove('section-highlighted');
            }, 2000);
        }
    }
    
    // Manejar clicks en enlaces que apuntan a anclas
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#"]');
        
        if (link) {
            const href = link.getAttribute('href');
            
            // Verificar si es un enlace interno a una secciÃ³n
            if (href.includes('#')) {
                const sectionId = href.split('#')[1];
                
                // Evitar comportamiento default si encontramos la secciÃ³n
                if (sectionId && document.getElementById(sectionId)) {
                    e.preventDefault();
                    
                    // PequeÃ±a pausa para asegurar que la pÃ¡gina cargue
                    setTimeout(() => {
                        smoothScrollToSection(sectionId);
                    }, 100);
                }
            }
        }
    });
    
    // Manejar el caso especÃ­fico de venir de otra pÃ¡gina con hash en la URL
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        
        // Esperar a que la pÃ¡gina cargue completamente
        setTimeout(() => {
            smoothScrollToSection(sectionId);
        }, 500);
    }
});

