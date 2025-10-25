# WebGL Components Documentation

## Overview

The datakoko website uses custom web components for 3D WebGL animations. These components are built with Three.js and follow modern web standards for encapsulation, reusability, and performance.

## Architecture

### Base Component: `BaseWebGLComponent`

Location: `static/js/components/base-webgl-component.js`

A reusable base class for all WebGL animations with the following features:

#### Features

1. **Shadow DOM Encapsulation**
   - Uses Shadow DOM for style isolation
   - Prevents CSS conflicts with the main page
   - Self-contained rendering context

2. **Transparent Background**
   - Alpha channel enabled by default
   - Renders over page content without blocking
   - Configurable clear color

3. **Responsive Design (Mobile-First)**
   - ResizeObserver for efficient resize handling
   - Debounced resize events (100ms)
   - Adaptive FOV: 45° on mobile, 35° on desktop
   - Conditional antialias (disabled on mobile for performance)
   - Pixel ratio capped at 2x for performance

4. **Theme Support**
   - Detects system theme preference via `prefers-color-scheme`
   - Watches for theme changes in real-time
   - Supports manual theme via `data-theme` attribute or class
   - Calls `onThemeChange()` hook when theme updates

5. **Performance Optimizations**
   - requestAnimationFrame for smooth 60fps animations
   - Proper cleanup of Three.js resources
   - Reduced particle count on mobile
   - Optional reduced motion support via `prefers-reduced-motion`

6. **Lifecycle Management**
   - `connectedCallback()`: Initialize when added to DOM
   - `disconnectedCallback()`: Cleanup when removed
   - Proper disposal of geometries and materials

#### Hooks for Child Classes

```javascript
setupScene()       // Create scene objects, lights, materials
update(elapsedTime, deltaTime)  // Animation loop
onResize()         // Handle viewport changes
onThemeChange(theme)  // Handle theme changes (theme = 'light' | 'dark')
```

#### Utility Methods

```javascript
isMobile()         // Returns true if viewport width < 768px
isReducedMotion()  // Returns true if user prefers reduced motion
```

---

### Data Infrastructure Scene: `DataInfrastructureScene`

Location: `static/js/components/data-infrastructure-scene.js`

A scroll-based 3D animation with a single evolving element that morphs through different stages, representing the journey from raw data to analytics.

#### HTML Usage

```html
<data-infrastructure-scene></data-infrastructure-scene>
```

#### Features

1. **Single Morphing Element (Three Stages)**
   - **Stage 0 (0-33% scroll)**: Chaotic scattered particles representing raw, unorganized data sources
   - **Stage 1 (33-66% scroll)**: Organized spherical structure representing data infrastructure
   - **Stage 2 (66-100% scroll)**: Helical network pattern representing analytics and insights
   - Smooth interpolation between stages based on scroll progress
   - Central core that appears and scales with the stages

2. **Interactive Effects**
   - Continuous smooth morphing tied to scroll position
   - Mouse parallax (disabled on mobile)
   - Flowing data particles that spiral around the scene
   - Gentle rotation of all elements

3. **Particle System**
   - Main structure: 200 particles on desktop, 100 on mobile
   - Flowing data: 100 particles on desktop, 50 on mobile
   - Real-time position interpolation for smooth morphing
   - Spiraling motion simulating data flow

4. **Theme Adaptation**
   - Light theme: Blue (#4a9eff), Green (#00d4aa)
   - Dark theme: Brighter variants for better contrast (#6bb6ff, #00ffcc)
   - Smooth color transitions when theme changes
   - Separate colors for structure particles and flowing data

5. **Mobile Optimizations**
   - Reduced particle counts (100 vs 200 for structure, 50 vs 100 for flow)
   - Reduced rotation speed
   - Larger particle sizes for visibility
   - Disabled parallax effect
   - Optimized morph calculations

6. **Accessibility**
   - Respects `prefers-reduced-motion` (stops animations)
   - Passive event listeners for better scroll performance
   - No pointer events (allows interaction with page content)
   - Smooth camera movement tied to scroll

---

## Integration

### Loading the Components

In `layouts/_default/baseof.html`:

```html
{{ if .IsHome }}
<script type="module" src="{{ "js/webgl-components.js" | relURL }}"></script>
{{ end }}
```

### Entry Point

File: `static/js/webgl-components.js`

```javascript
import { DataInfrastructureScene } from './components/data-infrastructure-scene.js';
// Components auto-register when imported
```

### CSS Integration

File: `static/css/modules/scroll-animation.css`

- Ensures web component is displayed as block
- Adds gradient overlays for text readability
- Mobile-specific backdrop filters
- Theme-aware contrast adjustments

---

## Creating New WebGL Components

To create a new WebGL scene component:

1. **Extend BaseWebGLComponent**

```javascript
import { BaseWebGLComponent } from './base-webgl-component.js';

export class MyCustomScene extends BaseWebGLComponent {
    constructor() {
        super();
        // Initialize your custom properties
    }

    setupScene() {
        // Create your 3D objects, lights, materials
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: this.theme === 'dark' ? 0xffffff : 0x000000
        });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }

    update(elapsedTime, deltaTime) {
        // Animate your scene
        // Called every frame
    }

    onResize() {
        // Handle viewport changes
        // Update object positions, camera settings, etc.
    }

    onThemeChange(theme) {
        // Update colors based on theme
        // theme is 'light' or 'dark'
    }
}

// Register the custom element
customElements.define('my-custom-scene', MyCustomScene);
```

2. **Import in webgl-components.js**

```javascript
import { MyCustomScene } from './components/my-custom-scene.js';
```

3. **Use in HTML**

```html
<my-custom-scene></my-custom-scene>
```

---

## Browser Support

- Modern browsers with ES6 module support
- Custom Elements v1
- Shadow DOM v1
- ResizeObserver API
- Three.js r160+

### Fallback

For older browsers, consider adding polyfills for:
- Custom Elements
- Shadow DOM
- ResizeObserver

---

## Performance Considerations

1. **Mobile Devices**
   - Reduced object counts automatically
   - Disabled antialias for better performance
   - Simplified animations

2. **Reduced Motion**
   - All animations stop if user prefers reduced motion
   - Respects accessibility preferences

3. **Resource Cleanup**
   - Geometries and materials properly disposed
   - Animation loops stopped when component unmounted
   - Event listeners removed on disconnect

---

## Theme Detection Priority

1. `data-theme` attribute on `<html>`
2. `.dark` or `.light` class on `<html>`
3. System preference (`prefers-color-scheme`)
4. Default to `light`

To manually set theme:

```html
<html data-theme="dark">
```

or

```html
<html class="dark-theme">
```

---

## Debugging

Enable console logging:

```javascript
console.log('WebGL components loaded');
```

Check component registration:

```javascript
console.log(customElements.get('data-infrastructure-scene'));
```

Inspect Shadow DOM in browser DevTools:
- Chrome: Enable "Show user agent shadow DOM"
- Firefox: Supports Shadow DOM inspection natively

---

## Future Enhancements

Potential improvements:

1. **Intersection Observer**
   - Pause animation when component is off-screen
   - Further performance optimization

2. **WebGL Context Loss Recovery**
   - Handle context loss gracefully
   - Automatic scene rebuild

3. **Loading States**
   - Show placeholder while Three.js loads
   - Progressive enhancement

4. **Configurable Attributes**
   - Color schemes via attributes
   - Animation speed control
   - Particle density settings

---

## Credits

- Built with [Three.js](https://threejs.org/)
- Inspired by Three.js Journey scroll-based animation examples
- Uses Web Components standard (Custom Elements + Shadow DOM)
