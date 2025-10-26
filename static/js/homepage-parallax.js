/**
 * Homepage Parallax Effects
 * Simple, meaningful scroll animations
 */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}

function initParallax() {
    // Simple fade-in animation for individual elements
    const animationConfigs = {
        // Intro section - simple fade up
        '.intro-section': { distance: 50, stagger: 0 },

        // Solutions section - staggered fade up
        '.solutions-section h2': { distance: 40, stagger: 0 },
        '.solutions-section .section-subtitle': { distance: 30, stagger: 100 },
        '.solution-item': { distance: 40, stagger: 150 },

        // Approach section - fade up
        '.approach-section': { distance: 0, stagger: 0 },
        '.approach-section h2': { distance: 40, stagger: 0 },
        '.approach-section .approach-text': { distance: 30, stagger: 100 },
        '.approach-section .feature-link': { distance: 20, stagger: 200 },

        // Services section - staggered cards
        '.services-section h2': { distance: 0, stagger: 0 },
        '.feature': { distance: 40, stagger: 100 },

        // Benefits section - simple fade
        '.benefits h2': { distance: 20, stagger: 0 },
        '.benefit-item': { distance: 20, stagger: 20 },

        // CTA section
        '.service-cta h2': { distance: 40, stagger: 0 },
        '.service-cta .cta-button': { distance: 30, stagger: 100 },
    };

    // Convert configs to elements
    const elementsToAnimate = [];
    Object.keys(animationConfigs).forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            const config = animationConfigs[selector];

            // Calculate stagger delay based on index within selector
            const staggerDelay = config.stagger * index;

            elementsToAnimate.push({
                element: el,
                distance: config.distance,
                staggerDelay: staggerDelay,
                progress: 0
            });
        });
    });

    // Set initial hidden state
    elementsToAnimate.forEach(item => {
        item.element.style.opacity = '0';
        item.element.style.transform = `translate3d(0, ${item.distance}px, 0)`;
    });

    let ticking = false;

    // Main animation loop
    function animate() {
        const windowHeight = window.innerHeight;

        // Animate elements based on scroll position
        elementsToAnimate.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;

            // Calculate visibility progress
            const startPoint = windowHeight * 0.85;
            const endPoint = windowHeight * 0.4;

            let progress;
            if (elementCenter > startPoint) {
                progress = 0;
            } else if (elementCenter < endPoint) {
                progress = 1;
            } else {
                progress = (startPoint - elementCenter) / (startPoint - endPoint);
            }

            // Smooth easing
            progress = easeOutCubic(progress);

            // Store progress
            item.progress = progress;

            // Calculate transform
            const translateY = item.distance * (1 - progress);
            const opacity = progress;

            // Apply with smooth transition
            item.element.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            item.element.style.opacity = opacity;
            item.element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });

        ticking = false;
    }

    // Easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Optimized scroll handler
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(animate);
            ticking = true;
        }
    }

    // Initial animation on page load
    setTimeout(() => {
        animate();
    }, 100);

    // Listen to scroll
    window.addEventListener('scroll', onScroll, { passive: true });

    // Continuous subtle parallax
    function continuousParallax() {
        const windowHeight = window.innerHeight;

        elementsToAnimate.forEach((item, index) => {
            if (item.progress < 0.9) return;

            const rect = item.element.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Very subtle continuous parallax
                let speed = 0.02;

                if (item.element.classList.contains('solution-item') ||
                    item.element.classList.contains('feature') ||
                    item.element.classList.contains('benefit-item')) {
                    speed = 0.03 + (index % 3) * 0.01;
                }

                const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) * -speed;
                item.element.style.transform = `translate3d(0, ${centerOffset}px, 0)`;
            }
        });

        requestAnimationFrame(continuousParallax);
    }

    continuousParallax();
}
