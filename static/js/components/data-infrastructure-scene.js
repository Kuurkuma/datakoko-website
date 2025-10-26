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

        // Theme colors
        this.colors = {
            light: {
                primary: 0x4a9eff,
                secondary: 0x00d4aa,
                accent: 0xff6b6b,
                particles: 0x4a9eff,
                ambientLight: 0xffffff,
                directionalLight: 0xffffff,
                backLight: 0x4a9eff
            },
            dark: {
                primary: 0x6bb6ff,
                secondary: 0x00ffcc,
                accent: 0xff8888,
                particles: 0x6bb6ff,
                ambientLight: 0xffffff,
                directionalLight: 0xffffff,
                backLight: 0x6bb6ff
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

        // Create scene objects for each homepage section
        // this.createHeroNetwork();        // Section 0: Hero - Infrastructure Network
        // this.createSolutionsViz();       // Section 1: Solutions - Organizing Chaos
        // this.createApproachFlow();       // Section 2: Approach - Methodology Flow
        // this.createServicesModules();    // Section 3: Services - Service Blocks
        // this.createTechStack();          // Section 4: Tech Stack - Technology Layers
        // this.createBenefitsGrowth();     // Section 5: Benefits - Growth Visualization
        // this.createCTAMomentum();        // Section 6: Footer CTA - Forward Momentum

        // Create particles
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

    // Section 0: Hero - Data Flowing Through Infrastructure
    createHeroNetwork() {
        const group = new THREE.Group();
        const nodeCount = this.isMobile() ? 5 : 7;

        // Central data warehouse (larger, distinctive)
        const warehouse = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.5, 0),
            this.materials.accent
        );
        warehouse.userData.isWarehouse = true;
        group.add(warehouse);

        // Data sources (smaller spheres with pulsing data flow)
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = this.isMobile() ? 1.5 : 1.8;

            // Data source node
            const source = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 12, 12),
                this.materials.primary
            );
            source.position.x = Math.cos(angle) * radius;
            source.position.z = Math.sin(angle) * radius;
            source.userData.angle = angle;
            source.userData.radius = radius;
            source.userData.phase = i / nodeCount;

            // Data packet (small sphere that will move along connection)
            const packet = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                this.materials.secondary
            );
            packet.userData.sourceIndex = i;
            packet.userData.angle = angle;
            packet.userData.radius = radius;

            group.add(source);
            group.add(packet);
        }

        group.position.x = this.isMobile() ? 0 : 2;
        group.position.y = -this.objectsDistance * 0;
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

        group.position.x = this.isMobile() ? 0 : 2;
        group.position.y = -this.objectsDistance * 2;
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

        group.position.x = this.isMobile() ? 0 : -2;
        group.position.y = -this.objectsDistance * 3;
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

        group.position.x = this.isMobile() ? 0 : 2;
        group.position.y = -this.objectsDistance * 4;
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

        // Spread particles across all 7 sections
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * 7; // 7 sections
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
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
        // Reduce object distance for better mobile viewing
        this.objectsDistance = 3.5;

        // Update all section positions
        this.sectionMeshes.forEach((mesh, index) => {
            mesh.position.y = -this.objectsDistance * index;
        });

        // Adjust camera for more sections
        if (this.camera) {
            this.camera.position.z = 7;
        }

        // Re-create particles with updated distance
        if (this.particles) {
            const particlePositions = this.particles.geometry.attributes.position.array;
            const particleCount = particlePositions.length / 3;

            for (let i = 0; i < particleCount; i++) {
                particlePositions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * 7;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    setupScrollListener() {
        this.handleScroll = () => {
            this.scrollY = window.scrollY;
            const newSection = Math.round(this.scrollY / this.sizes.height);

            if (newSection !== this.currentSection && newSection < this.sectionMeshes.length) {
                this.currentSection = newSection;
                this.animateSectionEntry(this.currentSection);
            }
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

        // Parallax effect (reduced on mobile)
        if (this.cameraGroup && !this.isMobile()) {
            const parallaxX = this.cursor.x * 0.5;
            const parallaxY = -this.cursor.y * 0.5;
            this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime;
            this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime;
        }

        const rotationSpeed = this.isReducedMotion() ? 0 : (this.isMobile() ? 0.015 : 0.02);

        // Calculate section visibility for scroll-based animations with smooth easing
        const getSectionVisibility = (sectionIndex) => {
            const sectionY = -this.objectsDistance * sectionIndex;
            const cameraY = this.camera ? this.camera.position.y : 0;
            const distance = Math.abs(cameraY - sectionY);
            const rawVisibility = Math.max(0, 1 - distance / (this.objectsDistance * 1.8));

            // Apply smooth easing curve for more natural transitions
            const eased = rawVisibility < 0.5
                ? 2 * rawVisibility * rawVisibility
                : 1 - Math.pow(-2 * rawVisibility + 2, 2) / 2;

            return eased;
        };

        // Animate each section with unique behaviors
        this.sectionMeshes.forEach((group, sectionIndex) => {
            // Very slow rotation - reduced by 70%
            group.rotation.y += deltaTime * rotationSpeed * 0.3;

            const visibility = getSectionVisibility(sectionIndex);

            // Section-specific animations
            switch(sectionIndex) {
                case 0: // Hero - Data flowing through infrastructure
                    group.children.forEach((child) => {
                        if (child.userData.isWarehouse) {
                            // Central warehouse pulses
                            child.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.1 * visibility);
                            child.rotation.y += deltaTime * rotationSpeed;
                        } else if (child.userData.sourceIndex !== undefined) {
                            // Data packets flow from sources to center
                            const phase = (elapsedTime + child.userData.sourceIndex) % 3;
                            const progress = (phase / 3);
                            const angle = child.userData.angle;
                            const radius = child.userData.radius * (1 - progress) * visibility;

                            child.position.x = Math.cos(angle) * radius;
                            child.position.z = Math.sin(angle) * radius;
                            child.scale.setScalar(visibility * (1 - progress * 0.5));
                        } else {
                            // Source nodes pulse with data activity
                            const pulse = Math.sin(elapsedTime * 3 + child.userData.phase * Math.PI * 2) * 0.15;
                            child.scale.setScalar((1 + pulse) * visibility);
                            child.rotation.y += deltaTime * rotationSpeed;
                        }
                    });
                    break;

                case 1: // Solutions - Fragmented sources unifying
                    group.children.forEach((child) => {
                        if (child.userData.isCore) {
                            // Central DB pulses when receiving data
                            child.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.1 * visibility);
                            child.rotation.z += deltaTime * rotationSpeed * 0.5;
                        } else if (child.userData.fragmentIndex !== undefined) {
                            // Fragments pull toward unified positions
                            child.position.x = child.userData.scatteredX + (child.userData.unifiedX - child.userData.scatteredX) * visibility;
                            child.position.y = child.userData.scatteredY + (child.userData.unifiedY - child.userData.scatteredY) * visibility;
                            child.position.z = child.userData.scatteredZ + (child.userData.unifiedZ - child.userData.scatteredZ) * visibility;

                            // Rotate faster when scattered (chaotic), slower when unified
                            const rotationFactor = 1 - visibility * 0.7;
                            child.rotation.x += deltaTime * rotationSpeed * 2 * rotationFactor;
                            child.rotation.y += deltaTime * rotationSpeed * 1.5 * rotationFactor;
                        }
                    });
                    break;

                case 2: // Approach - Transformation pipeline with flowing data
                    const stages = this.isMobile() ? 3 : 4;
                    group.children.forEach((child) => {
                        if (child.userData.stageIndex !== undefined) {
                            // Pipeline stages process data
                            const stageIndex = child.userData.stageIndex;
                            const pulse = Math.sin(elapsedTime * 2 - stageIndex * 0.5) * 0.1 * visibility;
                            child.scale.setScalar(1 + pulse);
                            child.rotation.y += deltaTime * rotationSpeed * 0.4;
                        } else if (child.userData.fromStage !== undefined) {
                            // Particles flow between stages
                            const progress = (elapsedTime * 0.5 + child.userData.particleIndex * 0.3) % 1;
                            const fromX = (child.userData.fromStage - stages / 2) * 1.2;
                            const toX = (child.userData.toStage - stages / 2) * 1.2;

                            child.position.x = fromX + (toX - fromX) * progress;
                            child.position.y = Math.sin(progress * Math.PI) * 0.3;
                            child.scale.setScalar(visibility * (0.5 + Math.sin(progress * Math.PI) * 0.5));
                        }
                    });
                    break;

                case 3: // Services - Interconnected ecosystem
                    group.children.forEach((child) => {
                        if (child.userData.isHub) {
                            // Hub pulses with activity
                            child.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.15 * visibility);
                        } else if (child.userData.moduleIndex !== undefined && !child.userData.isConnector) {
                            // Modules orbit and communicate
                            const angle = child.userData.angle + elapsedTime * 0.3;
                            const radius = child.userData.radius;
                            child.position.x = Math.cos(angle) * radius * visibility + (1 - visibility) * 2;
                            child.position.z = Math.sin(angle) * radius * visibility;
                            child.rotation.y += deltaTime * rotationSpeed * 0.5;
                            child.rotation.x += deltaTime * rotationSpeed * 0.3;
                        } else if (child.userData.isConnector) {
                            // Connectors travel between hub and modules
                            const moduleIndex = child.userData.moduleIndex;
                            const progress = (elapsedTime + moduleIndex * 0.5) % 2 / 2;
                            const angle = (moduleIndex / (this.isMobile() ? 4 : 6)) * Math.PI * 2 + elapsedTime * 0.3;
                            const radius = child.userData.radius || (this.isMobile() ? 1.1 : 1.3);

                            child.position.x = Math.cos(angle) * radius * progress * visibility;
                            child.position.z = Math.sin(angle) * radius * progress * visibility;
                            child.scale.setScalar(visibility * Math.sin(progress * Math.PI));
                        }
                    });
                    break;

                case 4: // Tech Stack - Building blocks
                    group.children.forEach((child) => {
                        if (child.userData.layerIndex !== undefined && !child.userData.isIndicator) {
                            // Layers stack when visible
                            const baseY = child.userData.baseY;
                            const spreadY = baseY * (1 - visibility) * 3;
                            const breathe = Math.sin(elapsedTime * 1.5 + child.userData.layerIndex * 0.5) * 0.04 * visibility;

                            child.position.y = baseY + spreadY + breathe;
                            child.scale.set(1, 1, 1); // Reset scale
                            child.rotation.y += deltaTime * rotationSpeed * 0.2;
                        } else if (child.userData.isIndicator) {
                            // Active indicators pulse
                            const pulse = (Math.sin(elapsedTime * 3 + child.userData.indicatorIndex) + 1) / 2;
                            child.scale.setScalar(visibility * pulse);
                        }
                    });
                    break;

                case 5: // Benefits - Before/After improvement
                    group.children.forEach((child) => {
                        if (child.userData.isBefore) {
                            // Before state stays small
                            child.scale.y = 1;
                        } else if (child.userData.isAfter) {
                            // After state grows with visibility
                            child.scale.y = Math.max(0.01, visibility);
                        } else if (child.userData.isIndicator) {
                            // Indicators rise from before to after
                            const metricIndex = child.userData.metricIndex;
                            const xPos = (metricIndex - (this.isMobile() ? 4 : 6) / 2) * 0.5;
                            const yProgress = visibility;

                            child.position.x = xPos;
                            child.position.y = -0.3 + yProgress * 0.5;
                            child.scale.setScalar(visibility * (0.8 + Math.sin(elapsedTime * 2 - metricIndex * 0.3) * 0.2));
                        }
                    });
                    break;

                case 6: // CTA - Accelerating forward
                    group.children.forEach((child) => {
                        if (child.userData.layerIndex !== undefined && !child.userData.isTrail) {
                            // Arrows accelerate forward
                            const layerIndex = child.userData.layerIndex;
                            const baseZ = child.userData.baseZ;
                            const forward = Math.sin(elapsedTime * 2 - layerIndex * 0.2) * 0.25 * visibility;

                            child.position.z = baseZ + forward;
                            child.scale.setScalar(0.7 + visibility * 0.3);
                        } else if (child.userData.isTrail) {
                            // Motion trails follow arrows
                            const arrowIndex = child.userData.arrowIndex;
                            const progress = (elapsedTime * 2 + arrowIndex * 0.3) % 1;
                            const layerCount = this.isMobile() ? 4 : 6;

                            child.position.x = (arrowIndex - layerCount / 2) * 0.4;
                            child.position.z = -arrowIndex * 0.15 - progress * 0.4;
                            child.scale.setScalar(visibility * (1 - progress));
                        }
                    });
                    break;
            }
        });

        // Animate particles
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
        // Adjust for mobile/desktop
        if (this.isMobile() && this.sectionMeshes.length > 0) {
            this.sectionMeshes.forEach((mesh) => {
                mesh.position.x = 0;
            });
        } else if (this.sectionMeshes.length > 0) {
            // Alternate left/right positioning for desktop
            const positions = [2, -2, 2, -2, 2, -2, 2];
            this.sectionMeshes.forEach((mesh, index) => {
                if (positions[index] !== undefined) {
                    mesh.position.x = positions[index];
                }
            });
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
