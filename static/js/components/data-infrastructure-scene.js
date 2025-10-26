/**
 * Data Infrastructure Scene Component
 * A scroll-based 3D animation representing data infrastructure
 * Features: data sources, pipelines, and warehouses
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { BaseWebGLComponent } from './base-webgl-component.js';

export class DataInfrastructureScene extends BaseWebGLComponent {
    constructor() {
        super();

        // Scene objects
        this.sectionMeshes = [];
        this.particles = null;
        this.cameraGroup = null;

        // Scroll state
        this.scrollY = 0;
        this.currentSection = 0;

        // Mouse state for parallax
        this.cursor = { x: 0, y: 0 };

        // Animation configuration
        this.objectsDistance = 4;

        // Theme colors - matching Datakoko brand
        this.colors = {
            light: {
                primary: 0x008d33,      // Datakoko green
                secondary: 0x06b6d4,    // Accent cyan
                accent: 0xa855f7,       // Purple accent
                particles: 0x22c55e,    // Lighter green
                ambientLight: 0xffffff,
                directionalLight: 0xffffff,
                backLight: 0x22c55e
            },
            dark: {
                primary: 0x22c55e,      // Bright green for dark mode
                secondary: 0x06b6d4,    // Accent cyan
                accent: 0xa855f7,       // Purple accent
                particles: 0x4ade80,    // Even brighter green
                ambientLight: 0xffffff,
                directionalLight: 0xffffff,
                backLight: 0x4ade80
            }
        };

        // Materials (will be created in setupScene)
        this.materials = {
            primary: null,
            secondary: null,
            accent: null,
            particles: null
        };

        // Lights
        this.lights = {
            ambient: null,
            directional: null,
            back: null
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupScrollListener();
        this.setupMouseListener();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('mousemove', this.handleMouseMove);
    }

    setupScene() {
        const currentColors = this.colors[this.theme];

        // Create camera group for parallax
        this.cameraGroup = new THREE.Group();
        this.scene.add(this.cameraGroup);

        // Move camera to group
        if (this.camera) {
            this.cameraGroup.add(this.camera);
        }

        // Create materials
        this.createMaterials(currentColors);

        // Create lights
        this.createLights(currentColors);

        // Create hero animation for intro
        this.createHeroNetwork();

        // Create particles that persist throughout scroll
        this.createParticles(currentColors);

        // Adjust for mobile
        if (this.isMobile()) {
            this.adjustForMobile();
        }
    }

    createMaterials(colors) {
        this.materials.primary = new THREE.MeshStandardMaterial({
            color: colors.primary,
            metalness: 0.7,
            roughness: 0.3
        });

        this.materials.secondary = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            metalness: 0.6,
            roughness: 0.4
        });

        this.materials.accent = new THREE.MeshStandardMaterial({
            color: colors.accent,
            metalness: 0.5,
            roughness: 0.5
        });
    }

    createLights(colors) {
        // Ambient light
        this.lights.ambient = new THREE.AmbientLight(colors.ambientLight, 0.5);
        this.scene.add(this.lights.ambient);

        // Main directional light
        this.lights.directional = new THREE.DirectionalLight(colors.directionalLight, 1);
        this.lights.directional.position.set(1, 1, 2);
        this.scene.add(this.lights.directional);

        // Back light for depth
        this.lights.back = new THREE.DirectionalLight(colors.backLight, 0.5);
        this.lights.back.position.set(-1, -1, -1);
        this.scene.add(this.lights.back);
    }

    // Section 0: Hero - Data Flowing Through Infrastructure (Enhanced)
    createHeroNetwork() {
        const group = new THREE.Group();
        const nodeCount = this.isMobile() ? 6 : 8;

        // Central data hub (larger, rotating polyhedron with glow)
        const hubGeometry = new THREE.IcosahedronGeometry(0.2, 1);
        const hub = new THREE.Mesh(hubGeometry, this.materials.accent);
        hub.userData.isWarehouse = true;
        group.add(hub);

        // Add inner core for depth
        const innerCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.3, 0),
            this.materials.primary
        );
        innerCore.userData.isCore = true;
        group.add(innerCore);

        // Outer ring of data nodes with varied positioning
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 1.2;
            const radius = this.isMobile() ? 1.2 : 1.8;
            const heightOffset = Math.sin(i * Math.PI / nodeCount) * 0.4;

            // Data source node (octahedrons for visual variety)
            const source = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.1, 0),
                this.materials.primary
            );
            source.position.x = Math.cos(angle) * radius;
            source.position.y = heightOffset;
            source.position.z = Math.sin(angle) * radius;
            source.userData.angle = angle;
            source.userData.radius = radius;
            source.userData.phase = i / nodeCount;
            source.userData.baseY = heightOffset;

            // Multiple data packets per connection for richer animation
            for (let p = 0; p < 2; p++) {
                const packet = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    p === 0 ? this.materials.secondary : this.materials.accent
                );
                packet.userData.sourceIndex = i;
                packet.userData.packetIndex = p;
                packet.userData.angle = angle;
                packet.userData.radius = radius;
                packet.userData.heightOffset = heightOffset;
                group.add(packet);
            }

            group.add(source);
        }

        // Add orbital rings for visual interest
        if (!this.isMobile()) {
            const ringGeometry = new THREE.TorusGeometry(1, 0.02, 32, 32);
            const ring1 = new THREE.Mesh(ringGeometry, this.materials.secondary);
            ring1.rotation.x = Math.PI / 1.3;
            ring1.userData.isRing = true;
            ring1.userData.ringIndex = 0;
            group.add(ring1);

            const ring2 = new THREE.Mesh(ringGeometry.clone(), this.materials.primary);
            ring2.rotation.x = Math.PI / 4;
            ring2.rotation.z = Math.PI / 3;
            ring2.userData.isRing = true;
            ring2.userData.ringIndex = 1;
            group.add(ring2);
        }

        // Position for hero section
        group.position.x = 0;
        group.position.y = 0;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    createParticles(colors) {
        const particlesCount = this.isMobile() ? 500 : 800;
        const positions = new Float32Array(particlesCount * 3);

        // Spread particles throughout entire scroll height
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Larger vertical spread for scroll
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.materials.particles = new THREE.PointsMaterial({
            color: colors.particles,
            sizeAttenuation: true,
            size: this.isMobile() ? 0.04 : 0.03,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(particlesGeometry, this.materials.particles);
        this.scene.add(this.particles);
    }

    adjustForMobile() {
        // Adjust camera for mobile
        if (this.camera) {
            this.camera.position.z = 7;
        }
    }

    setupScrollListener() {
        this.handleScroll = () => {
            this.scrollY = window.scrollY;
        };

        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    setupMouseListener() {
        this.handleMouseMove = (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5;
            this.cursor.y = event.clientY / this.sizes.height - 0.5;
        };

        window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    }

    animateSectionEntry(sectionIndex) {
        if (this.isReducedMotion()) return;

        const mesh = this.sectionMeshes[sectionIndex];
        if (!mesh) return;

        const originalRotation = {
            x: mesh.rotation.x,
            y: mesh.rotation.y,
            z: mesh.rotation.z
        };

        const targetX = originalRotation.x + Math.PI * 2;
        const targetY = originalRotation.y + Math.PI;
        const duration = 1000;
        const startTime = Date.now();

        const rotate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            mesh.rotation.x = originalRotation.x + (targetX - originalRotation.x) * eased;
            mesh.rotation.y = originalRotation.y + (targetY - originalRotation.y) * eased;

            if (progress < 1) {
                requestAnimationFrame(rotate);
            }
        };

        rotate();
    }

    update(elapsedTime, deltaTime) {
        // Animate camera based on scroll
        if (this.camera) {
            this.camera.position.y = -this.scrollY / this.sizes.height * this.objectsDistance;
        }

        // Mouse parallax effect (reduced on mobile)
        if (this.cameraGroup && !this.isMobile()) {
            const parallaxX = this.cursor.x * 0.5;
            const parallaxY = -this.cursor.y * 0.5;
            this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime;
            this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime;
        }

        const rotationSpeed = this.isReducedMotion() ? 0 : (this.isMobile() ? 0.015 : 0.02);

        // Calculate section visibility based on scroll position
        const getSectionVisibility = (sectionIndex) => {
            const sectionY = -this.objectsDistance * sectionIndex;
            const cameraY = this.camera ? this.camera.position.y : 0;
            const distance = Math.abs(cameraY - sectionY);
            const rawVisibility = Math.max(0, 1 - distance / (this.objectsDistance * 1.2));

            // Smooth easing
            const eased = rawVisibility < 0.5
                ? 2 * rawVisibility * rawVisibility
                : 1 - Math.pow(-2 * rawVisibility + 2, 2) / 2;

            return eased;
        };

        // Animate each section based on visibility
        this.sectionMeshes.forEach((group, sectionIndex) => {
            // Gentle rotation
            group.rotation.y += deltaTime * rotationSpeed * 0.3;

            const visibility = getSectionVisibility(sectionIndex);

            // Animate based on section type
            if (sectionIndex === 0) {
                // Hero section
                group.children.forEach((child) => {
                    if (child.userData.isWarehouse) {
                        child.scale.setScalar((1 + Math.sin(elapsedTime * 1.5) * 0.12) * visibility);
                        child.rotation.y += deltaTime * rotationSpeed * 1.5;
                        child.rotation.x += deltaTime * rotationSpeed * 0.5;
                    } else if (child.userData.isCore) {
                        child.rotation.y -= deltaTime * rotationSpeed * 2;
                        child.rotation.z += deltaTime * rotationSpeed;
                        child.scale.setScalar((1 + Math.sin(elapsedTime * 2 + Math.PI) * 0.08) * visibility);
                    } else if (child.userData.isRing) {
                        const ringSpeed = child.userData.ringIndex === 0 ? 0.3 : 0.5;
                        child.rotation.z += deltaTime * rotationSpeed * ringSpeed;
                        child.material.opacity = 0.7 * visibility;
                        child.material.transparent = true;
                    } else if (child.userData.sourceIndex !== undefined) {
                        const sourceIndex = child.userData.sourceIndex;
                        const packetIndex = child.userData.packetIndex;
                        const phase = (elapsedTime * 0.7 + sourceIndex * 0.4 + packetIndex * 1.5) % 3;
                        const progress = (phase / 3);
                        const angle = child.userData.angle;
                        const heightOffset = child.userData.heightOffset || 0;
                        const radius = child.userData.radius * (1 - progress);
                        const heightProgress = Math.sin(progress * Math.PI) * 0.3;

                        child.position.x = Math.cos(angle) * radius;
                        child.position.y = heightOffset * (1 - progress) + heightProgress;
                        child.position.z = Math.sin(angle) * radius;
                        child.scale.setScalar((0.8 + Math.sin(progress * Math.PI) * 0.4) * visibility);
                    } else if (child.userData.phase !== undefined) {
                        const pulse = Math.sin(elapsedTime * 2.5 + child.userData.phase * Math.PI * 2) * 0.2;
                        child.scale.setScalar((1 + pulse) * visibility);
                        child.rotation.y += deltaTime * rotationSpeed * 0.8;
                        child.rotation.x += deltaTime * rotationSpeed * 0.3;
                        const bob = Math.sin(elapsedTime + child.userData.phase * Math.PI) * 0.05;
                        child.position.y = (child.userData.baseY || 0) + bob;
                    }
                });
            } else if (sectionIndex === 1) {
                // Approach section
                const stages = this.isMobile() ? 3 : 4;
                group.children.forEach((child) => {
                    if (child.userData.stageIndex !== undefined) {
                        const stageIndex = child.userData.stageIndex;
                        const pulse = Math.sin(elapsedTime * 2 - stageIndex * 0.5) * 0.1 * visibility;
                        child.scale.setScalar((1 + pulse) * visibility);
                        child.rotation.y += deltaTime * rotationSpeed * 0.4;
                    } else if (child.userData.fromStage !== undefined) {
                        const progress = (elapsedTime * 0.5 + child.userData.particleIndex * 0.3) % 1;
                        const fromX = (child.userData.fromStage - stages / 2) * 1.2;
                        const toX = (child.userData.toStage - stages / 2) * 1.2;
                        child.position.x = fromX + (toX - fromX) * progress;
                        child.position.y = Math.sin(progress * Math.PI) * 0.3;
                        child.scale.setScalar(visibility * (0.5 + Math.sin(progress * Math.PI) * 0.5));
                    }
                });
            } else if (sectionIndex === 2) {
                // Services section
                group.children.forEach((child) => {
                    if (child.userData.isHub) {
                        child.scale.setScalar((1 + Math.sin(elapsedTime * 2) * 0.15) * visibility);
                    } else if (child.userData.moduleIndex !== undefined && !child.userData.isConnector) {
                        const angle = child.userData.angle + elapsedTime * 0.3;
                        const radius = child.userData.radius;
                        child.position.x = Math.cos(angle) * radius * visibility + (1 - visibility) * 2;
                        child.position.z = Math.sin(angle) * radius * visibility;
                        child.rotation.y += deltaTime * rotationSpeed * 0.5;
                        child.rotation.x += deltaTime * rotationSpeed * 0.3;
                    } else if (child.userData.isConnector) {
                        const moduleIndex = child.userData.moduleIndex;
                        const progress = (elapsedTime + moduleIndex * 0.5) % 2 / 2;
                        const angle = (moduleIndex / (this.isMobile() ? 4 : 6)) * Math.PI * 2 + elapsedTime * 0.3;
                        const radius = child.userData.radius || (this.isMobile() ? 1.1 : 1.3);
                        child.position.x = Math.cos(angle) * radius * progress * visibility;
                        child.position.z = Math.sin(angle) * radius * progress * visibility;
                        child.scale.setScalar(visibility * Math.sin(progress * Math.PI));
                    }
                });
            } else if (sectionIndex === 3) {
                // Tech Stack section
                group.children.forEach((child) => {
                    if (child.userData.isNode) {
                        const basePos = child.userData.basePos;
                        const spreadFactor = (1 - visibility) * 2;
                        child.position.x = basePos.x * (1 + spreadFactor);
                        child.position.y = basePos.y * (1 + spreadFactor);
                        child.position.z = basePos.z * (1 + spreadFactor);
                        child.scale.setScalar(visibility);
                        child.rotation.y += deltaTime * rotationSpeed * 0.5;
                    } else if (child.userData.isBeam) {
                        child.material.opacity = 0.6 * visibility;
                        child.material.transparent = true;
                    }
                });
            }
        });

        // Animate particles - ALWAYS VISIBLE (no fade)
        if (this.particles && !this.isReducedMotion()) {
            const particlePositions = this.particles.geometry.attributes.position.array;
            const particleCount = particlePositions.length / 3;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                particlePositions[i3 + 1] += Math.sin(elapsedTime + i) * 0.001;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.rotation.y = elapsedTime * 0.05;
        }
    }

    onResize() {
        // Adjust positioning for mobile/desktop
        if (this.sectionMeshes.length > 0) {
            if (this.isMobile()) {
                this.sectionMeshes.forEach((mesh) => {
                    mesh.position.x = 0;
                });
            } else {
                const positions = [0, 1.5, -1.5, 1.5];
                this.sectionMeshes.forEach((mesh, index) => {
                    if (positions[index] !== undefined) {
                        mesh.position.x = positions[index];
                    }
                });
            }
        }
    }

    onThemeChange(theme) {
        const colors = this.colors[theme];

        // Update materials
        if (this.materials.primary) {
            this.materials.primary.color.setHex(colors.primary);
        }
        if (this.materials.secondary) {
            this.materials.secondary.color.setHex(colors.secondary);
        }
        if (this.materials.accent) {
            this.materials.accent.color.setHex(colors.accent);
        }
        if (this.materials.particles) {
            this.materials.particles.color.setHex(colors.particles);
        }

        // Update lights
        if (this.lights.back) {
            this.lights.back.color.setHex(colors.backLight);
        }
    }
}

// Register the custom element
customElements.define('data-infrastructure-scene', DataInfrastructureScene);
