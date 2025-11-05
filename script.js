// ===== Animated Background Particles =====
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);

    // Create floating particles with varying intensity
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size between 1-6px
        const size = Math.random() * 5 + 1;

        // Random animation duration between 10-25 seconds
        const duration = Math.random() * 15 + 10;

        // Random delay
        const delay = Math.random() * 10;

        // Random starting position
        const startX = Math.random() * 100;

        // Random intensity
        const intensity = Math.random() * 0.6 + 0.2;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 255, 94, ${intensity}) 0%, rgba(16, 235, 138, ${intensity * 0.5}) 50%, transparent 70%);
            border-radius: 50%;
            left: ${startX}%;
            bottom: -10px;
            box-shadow: 0 0 ${size * 3}px rgba(0, 255, 94, ${intensity}), 0 0 ${size * 6}px rgba(16, 235, 138, ${intensity * 0.3});
            animation: floatUp ${duration}s ${delay}s infinite ease-in-out;
        `;

        particlesContainer.appendChild(particle);
    }

    // Create larger floating orbs
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';

        const size = Math.random() * 100 + 50;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 10;

        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(16, 235, 138, 0.15) 0%, transparent 60%);
            border-radius: 50%;
            filter: blur(2px);
            animation: floatAround ${duration}s ${delay}s infinite ease-in-out;
        `;

        particlesContainer.appendChild(orb);
    }
}

// CSS for particle animations
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: translateY(-50vh) translateX(30px) scale(1.2);
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(-30px) scale(0.8);
            opacity: 0;
        }
    }

    @keyframes floatAround {
        0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
        }
        25% {
            transform: translate(30vw, -20vh) scale(1.2) rotate(90deg);
        }
        50% {
            transform: translate(-20vw, 30vh) scale(0.8) rotate(180deg);
        }
        75% {
            transform: translate(40vw, 10vh) scale(1.1) rotate(270deg);
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', createParticles);

// ===== Navegación móvil =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animar el botón hamburguesa
    navToggle.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Navegación con scroll suave =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Compensar altura del navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar con efecto al hacer scroll =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Añadir sombra al navbar cuando se hace scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Efecto parallax en hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero::before');
    if (parallax) {
        const speed = 0.5;
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// ===== Animación de números en estadísticas =====
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        
        updateNumber();
    });
};

// ===== Intersection Observer para animaciones =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animar números cuando la sección hero sea visible
            if (entry.target.classList.contains('hero-stats')) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll('.timeline-item, .project-card, .skill-category, .cert-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Observar estadísticas del hero
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// ===== Animación de roles =====
const roles = document.querySelectorAll('.role');
let currentRole = 0;

const changeRole = () => {
    // Ocultar todos los roles
    roles.forEach(role => {
        role.style.opacity = '0';
        role.style.transform = 'translateY(20px)';
    });
    
    // Mostrar el rol actual
    setTimeout(() => {
        roles[currentRole].style.opacity = '1';
        roles[currentRole].style.transform = 'translateY(0)';
    }, 300);
    
    // Pasar al siguiente rol
    currentRole = (currentRole + 1) % roles.length;
};

// Iniciar animación de roles
if (roles.length > 0) {
    changeRole();
    setInterval(changeRole, 3000);
}

// ===== Efecto de hover en proyectos =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== Lazy loading para imágenes (si se añaden en el futuro) =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== Copiar email al portapapeles =====
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('href').replace('mailto:', '');
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(email).then(() => {
            // Mostrar notificación temporal
            const notification = document.createElement('div');
            notification.textContent = '¡Email copiado al portapapeles!';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    });
});

// ===== Animaciones CSS adicionales =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// ===== Detección de tema del sistema =====
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Por defecto, el portfolio usa tema oscuro, pero podríamos añadir un toggle en el futuro
if (prefersDarkScheme.matches) {
    document.body.classList.add('dark-theme');
}

// ===== Precarga de fuentes =====
const preloadFont = (href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
};

// ===== Rendimiento: Debounce para eventos de scroll =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Aplicar debounce al evento de scroll
const debouncedScroll = debounce(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// ===== Accesibilidad: Navegación por teclado =====
document.addEventListener('keydown', (e) => {
    // Cerrar menú móvil con Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.focus();
    }
});

// ===== Validación de formulario de contacto (para futuras implementaciones) =====
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar loader si existe
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Activar animaciones
    document.body.classList.add('loaded');
    
    // Log para debugging
    console.log('Portfolio de Alex Henríquez cargado correctamente');
    console.log('Para oportunidades laborales: alexhen.work@gmail.com');
});

// ===== Service Worker para PWA =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('[APP] ServiceWorker registrado exitosamente:', registration.scope);

                // Verificar actualizaciones cada hora
                setInterval(() => {
                    registration.update();
                }, 3600000);

                // Manejar actualizaciones del Service Worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Hay una nueva versión disponible
                            if (confirm('¡Hay una nueva versión del sitio disponible! ¿Quieres actualizarlo?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(err => {
                console.error('[APP] Error al registrar ServiceWorker:', err);
            });

        // Recargar la página cuando el Service Worker tome control
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}

// Detectar si la app está instalada como PWA
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir el prompt automático
    e.preventDefault();

    // Guardar el evento para mostrarlo más tarde
    window.deferredPrompt = e;

    console.log('[APP] PWA instalación disponible');

    // Aquí podrías mostrar un botón de "Instalar App" personalizado
});