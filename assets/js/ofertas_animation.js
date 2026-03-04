// AnimaciÃ³n para las secciones con clase .reveal que se activa con scroll
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las secciones con la clase .reveal
    const revealSections = document.querySelectorAll('.reveal');
    
    if (revealSections.length === 0) return;
    
    // Configurar Intersection Observer para cada secciÃ³n
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando la secciÃ³n es visible, agregar la clase 'active'
                entry.target.classList.add('active');
            } else {
                // Cuando la secciÃ³n no es visible, quitar la clase 'active'
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2 // Activar cuando 20% de la secciÃ³n sea visible
    });
    
    // Empezar a observar todas las secciones
    revealSections.forEach(section => {
        observer.observe(section);
    });
});

