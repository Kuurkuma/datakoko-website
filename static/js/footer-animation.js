/**
 * Footer Giant Logo Animation using Lenis
 * Subtle parallax effect on the footer giant title
 */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAnimation);
} else {
    initFooterAnimation();
}

function initFooterAnimation() {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Get the footer giant title element
    const footerGiantTitle = document.querySelector('.footer-giantTitle');
    if (!footerGiantTitle) return;

    const footer = document.querySelector('footer');
    if (!footer) return;

    // Animation loop for Lenis with parallax
    function raf(time) {
        lenis.raf(time);

        // Get footer position
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress relative to footer
        // Start animating when footer is 200px from bottom of viewport
        const footerTop = footerRect.top;
        const startTrigger = windowHeight - 200;
        const scrollProgress = Math.max(0, Math.min(1, (startTrigger - footerTop) / 400));

        // Animate from bottom (100px down) to top (0px)
        const translateY = 100 - (scrollProgress * 100);

        // Subtle horizontal parallax
        const translateX = Math.sin(scrollProgress * Math.PI) * 2;

        // Fade in from 0 to 1
        const opacity = scrollProgress;

        // Apply GPU-accelerated transforms
        footerGiantTitle.style.translate = 'none';
        footerGiantTitle.style.rotate = 'none';
        footerGiantTitle.style.scale = 'none';
        footerGiantTitle.style.opacity = opacity;
        footerGiantTitle.style.transform = `translate(-50%, 0%) translate3d(${translateX}px, ${translateY}px, 0px)`;

        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}
