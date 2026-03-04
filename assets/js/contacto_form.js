document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-contacto');
    const toast = document.getElementById('mi-toast');

    // FunciÃ³n para mostrar toast (Usando la clase .mostrar del CSS)
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('mostrar');

        setTimeout(() => {
            toast.classList.remove('mostrar');
        }, 4000);
    };

    // ValidaciÃ³n detallada (Usando clases .invalid-value del CSS)
    const validateField = (id, value) => {
        let errorMsg = '';
        const trimmedValue = value.trim();

        switch (id) {
            case 'nombre':
                if (!trimmedValue) errorMsg = 'El nombre es obligatorio.';
                else if (trimmedValue.length < 2 || trimmedValue.length > 50) errorMsg = 'El nombre debe tener entre 2 y 50 caracteres.';
                else if (!/^[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\s]+$/.test(trimmedValue)) errorMsg = 'El nombre solo puede contener letras y espacios.';
                break;
            case 'email':
                if (!trimmedValue) errorMsg = 'El correo es obligatorio.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) errorMsg = 'El formato del correo no es vÃ¡lido.';
                break;
            case 'telefono':
                if (trimmedValue) {
                    const cleanPhone = trimmedValue.replace(/[\s\-\(\)]/g, '');
                    if (!/^[0-9]{8,15}$/.test(cleanPhone)) errorMsg = 'El telÃ©fono debe tener entre 8 y 15 dÃ­gitos.';
                }
                break;
            case 'mensaje':
                if (!trimmedValue) errorMsg = 'El mensaje es obligatorio.';
                else if (trimmedValue.length < 10 || trimmedValue.length > 500) errorMsg = 'El mensaje debe tener entre 10 y 500 caracteres.';
                break;
        }
        return errorMsg;
    };

    if (form) {
        // Validar en tiempo real
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
            const input = document.getElementById(id);
            const error = document.getElementById(`error${id.charAt(0).toUpperCase() + id.slice(1)}`);

            if (input) {
                input.addEventListener('input', () => {
                    const msg = validateField(id, input.value);
                    if (msg) {
                        error.textContent = msg;
                        input.classList.add('invalid-value');
                    } else {
                        error.textContent = '';
                        input.classList.remove('invalid-value');
                    }
                });
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            ['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
                const input = document.getElementById(id);
                const error = document.getElementById(`error${id.charAt(0).toUpperCase() + id.slice(1)}`);
                if (input) {
                    const msg = validateField(id, input.value);

                    if (msg) {
                        error.textContent = msg;
                        input.classList.add('invalid-value');
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Enviando...';

                setTimeout(() => {
                    showToast('âœ“ Â¡Mensaje enviado con Ã©xito!');
                    form.reset();
                    // Limpiar clases de validaciÃ³n
                    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid-value'));
                    btn.disabled = false;
                    btn.textContent = originalText;
                }, 1500);
            } else {
                // Los mensajes de error inline ya indican quÃ© corregir
                // Se hace scroll al primer campo invÃ¡lido para mejor UX
                const firstInvalid = form.querySelector('.invalid-value');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    }
});

