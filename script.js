/* =====================================================
   GALERÍA DE BOTONES - INTERACTIVIDAD MEJORADA
   Bootstrap vs Tailwind CSS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCopyButtons();
    initScrollAnimations();
    initButtonEffects();
    initConsoleWelcome();
    initSectionObserver();
});

/* ==================== NAVIGATION ==================== */
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.framework-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const framework = tab.dataset.framework;
            
            // Update active tab
            navTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${framework}-section`) {
                    section.classList.add('active');
                    section.setAttribute('aria-hidden', 'false');
                    
                    // Animate section
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        section.style.opacity = '1';
                        section.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    section.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Play sound effect
            playNavigationSound();
            
            // Update URL hash
            history.pushState(null, null, `#${framework}`);
            
            // Log navigation
            console.log(`%c📍 Navegado a: ${framework.toUpperCase()}`, 
                'color: #9d5bff; font-weight: bold;');
        });
    });
    
    // Initialize first tab
    if (!window.location.hash) {
        navTabs[0].click();
    } else {
        const targetTab = document.querySelector(`.nav-tab[data-framework="${window.location.hash.substring(1)}"]`);
        if (targetTab) {
            targetTab.click();
        } else {
            navTabs[0].click();
        }
    }
}

/* ==================== COPY BUTTONS ==================== */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.demo-code').querySelector('code');
            const text = codeBlock.textContent;
            
            copyToClipboard(text).then(() => {
                showCopyFeedback(this);
            }).catch(err => {
                console.error('Error al copiar:', err);
                showCopyError(this);
            });
        });
        
        // Add tooltip
        button.setAttribute('title', 'Copiar código al portapapeles');
        button.setAttribute('aria-label', 'Copiar código');
    });
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return await navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

function showCopyFeedback(button) {
    const originalHTML = button.innerHTML;
    const originalText = button.textContent;
    
    // Change button appearance
    button.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
    button.classList.add('copied');
    
    // Play success sound
    playCopySound();
    
    // Show floating notification
    showNotification('✅ Código copiado al portapapeles');
    
    // Restore button after delay
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
        button.blur();
    }, 2000);
}

function showCopyError(button) {
    const originalHTML = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-times"></i> Error';
    button.style.background = 'var(--color-danger)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initScrollAnimations() {
    // Intersection Observer for section animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const childElements = entry.target.querySelectorAll('.demo-card, .section-header');
                childElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ==================== BUTTON EFFECTS ==================== */
function initButtonEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn, .nav-tab, .pill, .copy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
    
    // Add hover effects
    document.querySelectorAll('.btn-glow, [class*="tw-bg-"]').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/* ==================== KEYBOARD NAVIGATION ==================== */
function handleKeyboardNavigation(e) {
    const navTabs = document.querySelectorAll('.nav-tab');
    const activeIndex = Array.from(navTabs).findIndex(tab => 
        tab.classList.contains('active')
    );
    
    // Tab navigation with arrow keys
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
        e.preventDefault();
        navTabs[activeIndex - 1].click();
        playNavigationSound();
    } else if (e.key === 'ArrowRight' && activeIndex < navTabs.length - 1) {
        e.preventDefault();
        navTabs[activeIndex + 1].click();
        playNavigationSound();
    }
    
    // Number shortcuts for sections
    if (e.key >= '1' && e.key <= '6') {
        const sectionIndex = parseInt(e.key) - 1;
        const sections = document.querySelectorAll('.content-section');
        
        if (sectionIndex < sections.length) {
            e.preventDefault();
            sections[sectionIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the section
            sections[sectionIndex].classList.add('highlight-section');
            setTimeout(() => {
                sections[sectionIndex].classList.remove('highlight-section');
            }, 2000);
        }
    }
    
    // Copy current code with Ctrl/Cmd + C
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const activeCode = document.querySelector('.framework-section.active .demo-code');
        if (activeCode) {
            const code = activeCode.querySelector('code');
            if (code) {
                copyToClipboard(code.textContent);
                showNotification('📋 Código copiado (atajo de teclado)');
            }
        }
    }
}

/* ==================== SECTION OBSERVER ==================== */
function initSectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active section indicator
                const sectionId = entry.target.id;
                const correspondingTab = document.querySelector(`.nav-tab[data-framework="${sectionId.replace('-section', '')}"]`);
                
                if (correspondingTab) {
                    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active-indicator'));
                    correspondingTab.classList.add('active-indicator');
                }
                
                // Log section view
                console.log(`%c👁️  Vista: ${sectionId.replace('-section', '').toUpperCase()}`, 
                    'color: #00d4ff; font-weight: bold;');
            }
        });
    }, {
        threshold: 0.3
    });
    
    document.querySelectorAll('.framework-section').forEach(section => {
        observer.observe(section);
    });
}

/* ==================== NOTIFICATIONS ==================== */
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-bootstrap-gradient);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-glow);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    document.body.appendChild(notification);
    
    // Add keyframes for animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }
            
            .highlight-section {
                animation: highlightPulse 2s ease;
            }
            
            @keyframes highlightPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(157, 91, 255, 0);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(157, 91, 255, 0.3);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ==================== SOUND EFFECTS ==================== */
function playNavigationSound() {
    // Create a simple sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio no disponible en este entorno');
    }
}

function playCopySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 659.25; // E5
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

/* ==================== CONSOLE WELCOME ==================== */
function initConsoleWelcome() {
    console.clear();
    
    const styles = [
        'font-size: 16px; font-weight: bold; color: #9d5bff; text-shadow: 0 0 10px #9d5bff;',
        'font-size: 14px; font-weight: bold; color: #00d4ff;',
        'font-size: 12px; color: #b3b8d4;',
        'font-size: 11px; color: #7a82a6; font-style: italic;'
    ];
    
    console.log(
        `%c🎨 GALERÍA DE BOTONES - Bootstrap vs Tailwind CSS\n` +
        `%c✨ Versión Mejorada con Efectos Modernos\n\n` +
        `%c📖 Características incluidas:\n` +
        `   • 25+ ejemplos de botones\n` +
        `   • Comparación lado a lado\n` +
        `   • Animaciones y efectos\n` +
        `   • Navegación por teclado\n` +
        `   • Código copiable\n\n` +
        `%c🎯 Usa las flechas ← → para navegar entre secciones\n` +
        `   Presiona 1-6 para ir directamente a ejemplos\n` +
        `   Ctrl/Cmd + C copia el código visible\n\n` +
        `¡Disfruta aprendiendo! 🚀`,
        ...styles
    );
}

/* ==================== PERFORMANCE OPTIMIZATION ==================== */
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Update active section based on scroll
        updateActiveSection();
    }, 100);
});

function updateActiveSection() {
    const sections = document.querySelectorAll('.framework-section');
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const framework = section.id.replace('-section', '');
            const correspondingTab = document.querySelector(`.nav-tab[data-framework="${framework}"]`);
            
            if (correspondingTab && !correspondingTab.classList.contains('active')) {
                correspondingTab.click();
            }
        }
    });
}

/* ==================== ADDITIONAL FEATURES ==================== */
// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .nav-tab, .pill, .copy-btn {
        position: relative;
        overflow: hidden;
    }
    
    .active-indicator {
        position: relative;
    }
    
    .active-indicator::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: var(--gradient-rainbow);
        border-radius: 2px;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(rippleStyles);

// Initialize tooltips
document.querySelectorAll('[title]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('title');
    
    const rect = this.getBoundingClientRect();
    tooltip.style.cssText = `
        position: fixed;
        top: ${rect.top - 40}px;
        left: ${rect.left + rect.width / 2}px;
        transform: translateX(-50%);
        background: var(--color-bootstrap-gradient);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 9999;
        pointer-events: none;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: var(--shadow-glow);
    `;
    
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
}

// Add theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('title', 'Cambiar tema');
    themeToggle.setAttribute('aria-label', 'Cambiar tema');
    
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-bootstrap-gradient);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 1000;
        box-shadow: var(--shadow-glow);
        transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            themeToggle.style.background = 'var(--gradient-fire)';
            console.log('%c🌙 Tema oscuro activado', 'color: #ffcc00; font-weight: bold;');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.style.background = 'var(--color-bootstrap-gradient)';
            console.log('%c☀️ Tema claro activado', 'color: #00d4ff; font-weight: bold;');
        }
    });
    
    document.body.appendChild(themeToggle);
}

// Initialize theme toggle
setTimeout(initThemeToggle, 1000);

// Add CSS for dark theme
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .dark-theme {
        --color-bg-dark: #0a0a0a;
        --color-bg-card: #1a1a1a;
        --color-text-primary: #f0f0f0;
        --color-text-secondary: #aaaaaa;
        filter: brightness(0.9) contrast(1.1);
    }
    
    .dark-theme .hero-header {
        background: rgba(10, 10, 10, 0.8);
    }
    
    .dark-theme .particle {
        opacity: 0.2;
    }
`;
document.head.appendChild(themeStyles);

// Export functions for debugging
window.debugGallery = {
    copyAllCode: function() {
        const allCode = Array.from(document.querySelectorAll('.demo-code code'))
            .map(code => code.textContent)
            .join('\n\n');
        
        copyToClipboard(allCode);
        showNotification('📚 Todo el código copiado');
        console.log('%c📋 Todo el código copiado al portapapeles', 
            'color: #00ff9d; font-weight: bold;');
    },
    
    showStats: function() {
        const stats = {
            buttons: document.querySelectorAll('.btn, [class*="tw-bg-"]').length,
            examples: document.querySelectorAll('.demo-card').length,
            codeBlocks: document.querySelectorAll('.demo-code').length,
            sections: document.querySelectorAll('.content-section').length
        };
        
        console.table(stats);
        showNotification(`📊 ${stats.buttons} botones, ${stats.examples} ejemplos`);
    },
    
    resetTheme: function() {
        document.body.classList.remove('dark-theme');
        const toggle = document.querySelector('.theme-toggle i');
        if (toggle) toggle.className = 'fas fa-moon';
        console.log('%c🎨 Tema restablecido', 'color: #9d5bff; font-weight: bold;');
    }
};

// Add performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                console.log(`%c⚡ FCP: ${Math.round(entry.startTime)}ms`, 
                    'color: #00ff9d; font-weight: bold;');
            }
        }
    });
    
    observer.observe({ entryTypes: ['paint'] });
}