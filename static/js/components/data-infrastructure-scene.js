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

        // Create additional scroll-triggered scenes
        // this.createApproachFlow();       // Section 1: Approach - Methodology Flow
        // this.createServicesModules();    // Section 2: Services - Service Blocks
        // this.createTechStack();          // Section 3: Tech Stack - Technology Layers

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
        const hubGeometry = new THREE.IcosahedronGeometry(0.6, 1);
        const hub = new THREE.Mesh(hubGeometry, this.materials.accent);
        hub.userData.isWarehouse = true;
        group.add(hub);

        // Add inner core for depth
        const innerCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.4, 0),
            this.materials.primary
        );
        innerCore.userData.isCore = true;
        group.add(innerCore);

        // Outer ring of data nodes with varied positioning
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = this.isMobile() ? 1.8 : 2.2;
            const heightOffset = Math.sin(i * Math.PI / nodeCount) * 0.4;

            // Data source node (octahedrons for visual variety)
            const source = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.3, 0),
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
                    new THREE.SphereGeometry(0.1, 8, 8),
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
            const ringGeometry = new THREE.TorusGeometry(1, 0.02, 8, 32);
            const ring1 = new THREE.Mesh(ringGeometry, this.materials.secondary);
            ring1.rotation.x = Math.PI / 2;
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

    // Section 1: Solutions - Fragmented Data Sources Unifying
    createSolutionsViz() {
        const group = new THREE.Group();
        const fragmentCount = this.isMobile() ? 6 : 9;

        // Central unified database
        const unifiedDB = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8),
            this.materials.primary
        );
        unifiedDB.rotation.x = Math.PI / 2;
        unifiedDB.userData.isCore = true;
        group.add(unifiedDB);

        // Fragmented data sources
        for (let i = 0; i < fragmentCount; i++) {
            // Random shapes representing different data sources
            const shapes = [
                new THREE.BoxGeometry(0.25, 0.25, 0.25),
                new THREE.TetrahedronGeometry(0.2, 0),
                new THREE.OctahedronGeometry(0.2, 0),
            ];
            const shape = shapes[i % shapes.length];

            const fragment = new THREE.Mesh(shape, this.materials.secondary);

            // Scattered initial positions
            const scatteredRadius = this.isMobile() ? 2 : 2.5;
            const scatteredAngle = (i / fragmentCount) * Math.PI * 2 + Math.random() * 0.5;
            fragment.userData.scatteredX = Math.cos(scatteredAngle) * scatteredRadius;
            fragment.userData.scatteredY = (Math.random() - 0.5) * 1.2;
            fragment.userData.scatteredZ = Math.sin(scatteredAngle) * scatteredRadius;

            // Unified positions (closer to center, in rings)
            const ringRadius = 0.9;
            const unifiedAngle = (i / fragmentCount) * Math.PI * 2;
            fragment.userData.unifiedX = Math.cos(unifiedAngle) * ringRadius;
            fragment.userData.unifiedY = Math.sin(i * 0.7) * 0.15;
            fragment.userData.unifiedZ = Math.sin(unifiedAngle) * ringRadius;

            fragment.position.x = fragment.userData.scatteredX;
            fragment.position.y = fragment.userData.scatteredY;
            fragment.position.z = fragment.userData.scatteredZ;

            fragment.userData.fragmentIndex = i;
            group.add(fragment);
        }

        group.position.x = this.isMobile() ? 0 : -2;
        group.position.y = -this.objectsDistance * 1;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    // Section 2: Approach - Data Transformation Pipeline
    createApproachFlow() {
        const group = new THREE.Group();
        const stages = this.isMobile() ? 3 : 4;

        // Pipeline stages with increasing refinement
        for (let i = 0; i < stages; i++) {
            const progress = i / (stages - 1);

            // Stage container - evolves from raw to refined
            const stage = new THREE.Mesh(
                // Start with rough geometry, end with refined
                i === 0 ? new THREE.BoxGeometry(0.5, 0.5, 0.5) :
                i === stages - 1 ? new THREE.IcosahedronGeometry(0.35, 1) :
                new THREE.OctahedronGeometry(0.35, 0),
                this.materials.primary
            );

            stage.position.x = (i - stages / 2) * 1.2;
            stage.userData.stageIndex = i;
            stage.userData.baseX = stage.position.x;
            group.add(stage);

            // Transformation particles flowing between stages
            if (i < stages - 1) {
                for (let p = 0; p < 3; p++) {
                    const particle = new THREE.Mesh(
                        new THREE.SphereGeometry(0.08, 8, 8),
                        this.materials.secondary
                    );
                    particle.userData.fromStage = i;
                    particle.userData.toStage = i + 1;
                    particle.userData.particleIndex = p;
                    group.add(particle);
                }
            }
        }

        group.position.x = this.isMobile() ? 0 : 1.5;
        group.position.y = -this.objectsDistance * 1;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    // Section 3: Services - Interconnected Service Ecosystem
    createServicesModules() {
        const group = new THREE.Group();
        const moduleCount = this.isMobile() ? 4 : 6;

        // Central integration hub
        const hub = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            this.materials.accent
        );
        hub.userData.isHub = true;
        group.add(hub);

        // Service modules orbiting the hub
        for (let i = 0; i < moduleCount; i++) {
            const angle = (i / moduleCount) * Math.PI * 2;
            const radius = this.isMobile() ? 1.1 : 1.3;

            // Service module
            const module = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.4, 0.4),
                this.materials.secondary
            );

            module.position.x = Math.cos(angle) * radius;
            module.position.z = Math.sin(angle) * radius;
            module.userData.angle = angle;
            module.userData.radius = radius;
            module.userData.moduleIndex = i;

            // Connection indicator (small sphere that shows data exchange)
            const connector = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                this.materials.primary
            );
            connector.userData.moduleIndex = i;
            connector.userData.isConnector = true;

            group.add(module);
            group.add(connector);
        }

        group.position.x = this.isMobile() ? 0 : -1.5;
        group.position.y = -this.objectsDistance * 2;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    // Section 4: Tech Stack - Crystalline Lattice Structure
    createTechStack() {
        const group = new THREE.Group();
        const gridSize = this.isMobile() ? 3 : 4;

        // Create a 3D crystal lattice representing interconnected technologies
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    // Skip some positions for visual variety
                    if ((x + y + z) % 2 === 0) continue;

                    const node = new THREE.Mesh(
                        new THREE.OctahedronGeometry(0.15, 0),
                        // Alternate materials for visual interest
                        (x + y + z) % 3 === 0 ? this.materials.accent :
                        (x + y + z) % 3 === 1 ? this.materials.primary :
                        this.materials.secondary
                    );

                    const spacing = 0.6;
                    node.position.x = (x - gridSize / 2) * spacing;
                    node.position.y = (y - gridSize / 2) * spacing;
                    node.position.z = (z - gridSize / 2) * spacing;

                    node.userData.gridPos = { x, y, z };
                    node.userData.basePos = node.position.clone();
                    node.userData.isNode = true;

                    group.add(node);
                }
            }
        }

        // Add connecting beams between adjacent nodes
        if (!this.isMobile()) {
            group.children.forEach((node1, i) => {
                if (!node1.userData.isNode) return;

                group.children.forEach((node2, j) => {
                    if (i >= j || !node2.userData.isNode) return;

                    const dist = node1.position.distanceTo(node2.position);
                    if (dist > 0.5 && dist < 0.7) {
                        const dir = new THREE.Vector3().subVectors(node2.position, node1.position);
                        const length = dir.length();

                        const beam = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.02, 0.02, length, 4),
                            this.materials.primary
                        );

                        beam.position.copy(node1.position).add(dir.multiplyScalar(0.5));
                        beam.quaternion.setFromUnitVectors(
                            new THREE.Vector3(0, 1, 0),
                            dir.normalize()
                        );

                        beam.userData.isBeam = true;
                        group.add(beam);
                    }
                });
            });
        }

        group.position.x = this.isMobile() ? 0 : 1.5;
        group.position.y = -this.objectsDistance * 3;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    // Section 5: Benefits - Performance Metrics Improvement
    createBenefitsGrowth() {
        const group = new THREE.Group();
        const metrics = this.isMobile() ? 4 : 6;

        // Before/After comparison showing improvement
        for (let i = 0; i < metrics; i++) {
            const xPos = (i - metrics / 2) * 0.5;

            // "Before" state (smaller, dimmer)
            const before = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8),
                this.materials.secondary
            );
            before.position.x = xPos;
            before.position.y = -0.3;
            before.userData.isBefore = true;
            before.userData.metricIndex = i;
            group.add(before);

            // "After" state (taller, brighter)
            const targetHeight = 0.5 + i * 0.12;
            const after = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.12, targetHeight, 8),
                this.materials.accent
            );
            after.position.x = xPos;
            after.position.y = targetHeight / 2 - 0.3;
            after.userData.isAfter = true;
            after.userData.metricIndex = i;
            after.userData.targetHeight = targetHeight;
            after.scale.y = 0.01; // Start small
            group.add(after);

            // Improvement indicator (rises from before to after)
            const indicator = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                this.materials.primary
            );
            indicator.userData.metricIndex = i;
            indicator.userData.isIndicator = true;
            group.add(indicator);
        }

        group.position.x = this.isMobile() ? 0 : -2;
        group.position.y = -this.objectsDistance * 5;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    // Section 6: Footer CTA - Accelerating Forward
    createCTAMomentum() {
        const group = new THREE.Group();
        const layerCount = this.isMobile() ? 4 : 6;

        // Cascading arrows showing acceleration
        for (let i = 0; i < layerCount; i++) {
            const arrow = new THREE.Mesh(
                new THREE.ConeGeometry(0.15 + i * 0.03, 0.5, 3),
                this.materials.accent
            );
            arrow.rotation.z = -Math.PI / 2;
            arrow.rotation.y = Math.PI / 2;

            arrow.position.x = (i - layerCount / 2) * 0.4;
            arrow.position.z = -i * 0.15; // Stack depth
            arrow.userData.layerIndex = i;
            arrow.userData.baseZ = arrow.position.z;
            group.add(arrow);

            // Motion trails
            if (i % 2 === 0) {
                const trail = new THREE.Mesh(
                    new THREE.SphereGeometry(0.06, 8, 8),
                    this.materials.primary
                );
                trail.userData.arrowIndex = i;
                trail.userData.isTrail = true;
                group.add(trail);
            }
        }

        group.position.x = this.isMobile() ? 0 : 2;
        group.position.y = -this.objectsDistance * 6;
        this.scene.add(group);
        this.sectionMeshes.push(group);
    }

    createParticles(colors) {
        const particlesCount = this.isMobile() ? 200 : 400;
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
