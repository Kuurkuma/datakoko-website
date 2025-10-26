/**
 * Base WebGL Component
 * A reusable web component for Three.js animations
 * Features: transparent background, responsive, theme-aware
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class BaseWebGLComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Core Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Animation state
        this.animationId = null;
        this.isAnimating = false;

        // Responsive state
        this.sizes = {
            width: 0,
            height: 0
        };

        // Theme state
        this.theme = 'light';

        // Resize observer
        this.resizeObserver = null;
        this.resizeTimeout = null;
    }

    connectedCallback() {
        this.render();
        this.init();
        this.setupThemeObserver();
        this.setupResizeObserver();
        this.startAnimation();
    }

    disconnectedCallback() {
        this.stopAnimation();
        this.cleanup();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }

    render() {
        // Create canvas element
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0;
                }

                canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    outline: none;
                }

                /* Mobile optimizations */
                @media (max-width: 768px) {
                    :host {
                        /* Reduce complexity on mobile if needed */
                    }
                }
            </style>
            <canvas></canvas>
        `;
    }

    init() {
        const canvas = this.shadowRoot.querySelector('canvas');

        // Setup sizes
        this.updateSizes();

        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = this.createCamera();

        // Create renderer with transparency
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: window.innerWidth > 768, // Disable antialias on mobile for performance
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
        });

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background

        // Setup scene (to be overridden by child classes)
        this.setupScene();

        // Detect initial theme
        this.detectTheme();
    }

    createCamera() {
        // Mobile-first: wider FOV for mobile devices
        const fov = window.innerWidth < 768 ? 45 : 35;
        const camera = new THREE.PerspectiveCamera(
            fov,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        camera.position.z = 6;
        return camera;
    }

    updateSizes() {
        this.sizes.width = this.offsetWidth || window.innerWidth;
        this.sizes.height = this.offsetHeight || window.innerHeight;
    }

    setupThemeObserver() {
        // Watch for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleThemeChange = (e) => {
            this.theme = e.matches ? 'dark' : 'light';
            this.onThemeChange(this.theme);
        };

        mediaQuery.addEventListener('change', handleThemeChange);

        // Also watch for manual theme changes via attribute or class
        const observer = new MutationObserver(() => {
            this.detectTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });
    }

    detectTheme() {
        // Check multiple sources for theme
        const htmlElement = document.documentElement;

        // Check data-theme attribute
        if (htmlElement.hasAttribute('data-theme')) {
            this.theme = htmlElement.getAttribute('data-theme');
        }
        // Check class
        else if (htmlElement.classList.contains('dark') || htmlElement.classList.contains('dark-theme')) {
            this.theme = 'dark';
        }
        else if (htmlElement.classList.contains('light') || htmlElement.classList.contains('light-theme')) {
            this.theme = 'light';
        }
        // Check system preference
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }

        this.onThemeChange(this.theme);
    }

    setupResizeObserver() {
        // Use ResizeObserver for better performance
        this.resizeObserver = new ResizeObserver((entries) => {
            // Debounce resize events
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }

            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        this.resizeObserver.observe(this);

        // Also listen to window resize as fallback
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }

    handleResize() {
        this.updateSizes();

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;

        // Update FOV based on screen size
        this.camera.fov = window.innerWidth < 768 ? 45 : 35;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update antialias based on device
        if (window.innerWidth <= 768 && this.renderer.capabilities.antialias) {
            // Can't change antialias after creation, but we track it
        }

        // Call resize hook for child classes
        this.onResize();
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.clock.start();
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }

    animate() {
        if (!this.isAnimating) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = this.clock.getDelta();

        // Call update hook for child classes
        this.update(elapsedTime, deltaTime);

        // Render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    cleanup() {
        // Clean up Three.js resources
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }

        if (this.renderer) {
            this.renderer.dispose();
        }
    }

    // Hooks to be overridden by child classes
    setupScene() {
        // Override in child class
    }

    update(elapsedTime, deltaTime) {
        // Override in child class
    }

    onResize() {
        // Override in child class
    }

    onThemeChange(theme) {
        // Override in child class
    }

    // Utility methods
    isMobile() {
        return window.innerWidth < 768;
    }

    isReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}
