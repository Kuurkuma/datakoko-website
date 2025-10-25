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

        // Create scene objects
        this.createDataSources();
        this.createDataPipeline();
        this.createDataWarehouse();

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

    createDataSources() {
        // Section 1: Raw Data Sources (scattered cubes representing databases)
        const dataSourceGroup = new THREE.Group();
        const cubeCount = this.isMobile() ? 3 : 5;

        for (let i = 0; i < cubeCount; i++) {
            const size = 0.2 + Math.random() * 0.3;
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(size, size, size),
                this.materials.primary
            );
            cube.position.x = (Math.random() - 0.5) * 2;
            cube.position.y = (Math.random() - 0.5) * 1;
            cube.position.z = (Math.random() - 0.5) * 2;
            dataSourceGroup.add(cube);
        }

        dataSourceGroup.position.x = this.isMobile() ? 0 : 2;
        dataSourceGroup.position.y = -this.objectsDistance * 0;
        this.scene.add(dataSourceGroup);
        this.sectionMeshes.push(dataSourceGroup);
    }

    createDataPipeline() {
        // Section 2: Data Pipeline (octahedrons representing transformation)
        const pipelineGroup = new THREE.Group();
        const pipelineMesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(1, 0),
            this.materials.secondary
        );
        pipelineGroup.add(pipelineMesh);

        // Add smaller nodes connected to main pipeline
        const nodeCount = this.isMobile() ? 2 : 3;
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const nodeMesh = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.3, 0),
                this.materials.secondary
            );
            const radius = this.isMobile() ? 1.2 : 1.5;
            nodeMesh.position.x = Math.cos(angle) * radius;
            nodeMesh.position.z = Math.sin(angle) * radius;
            pipelineGroup.add(nodeMesh);
        }

        pipelineGroup.position.x = this.isMobile() ? 0 : -2;
        pipelineGroup.position.y = -this.objectsDistance * 1;
        this.scene.add(pipelineGroup);
        this.sectionMeshes.push(pipelineGroup);
    }

    createDataWarehouse() {
        // Section 3: Data Warehouse (organized structure)
        const warehouseGroup = new THREE.Group();
        const warehouseMesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1, 0),
            this.materials.accent
        );
        warehouseGroup.add(warehouseMesh);

        // Add orbital elements
        const orbitCount = this.isMobile() ? 4 : 8;
        for (let i = 0; i < orbitCount; i++) {
            const angle = (i / orbitCount) * Math.PI * 2;
            const orbitMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.15, 0.15),
                this.materials.accent
            );
            const radius = this.isMobile() ? 1.5 : 1.8;
            orbitMesh.position.x = Math.cos(angle) * radius;
            orbitMesh.position.y = Math.sin(angle) * 0.5;
            orbitMesh.position.z = Math.sin(angle) * radius;
            orbitMesh.userData.orbitIndex = i;
            warehouseGroup.add(orbitMesh);
        }

        warehouseGroup.position.x = this.isMobile() ? 0 : 2;
        warehouseGroup.position.y = -this.objectsDistance * 2;
        this.scene.add(warehouseGroup);
        this.sectionMeshes.push(warehouseGroup);
    }

    createParticles(colors) {
        const particlesCount = this.isMobile() ? 150 : 300;
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * this.sectionMeshes.length;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.materials.particles = new THREE.PointsMaterial({
            color: colors.particles,
            sizeAttenuation: true,
            size: this.isMobile() ? 0.04 : 0.03,
            transparent: true,
            opacity: 0.8
        });

        this.particles = new THREE.Points(particlesGeometry, this.materials.particles);
        this.scene.add(this.particles);
    }

    adjustForMobile() {
        // Reduce object distance for better mobile viewing
        this.objectsDistance = 3.5;

        // Update positions
        this.sectionMeshes.forEach((mesh, index) => {
            mesh.position.y = -this.objectsDistance * index;
        });

        // Adjust camera
        if (this.camera) {
            this.camera.position.z = 7;
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

        // Animate mesh groups
        const rotationSpeed = this.isReducedMotion() ? 0 : (this.isMobile() ? 0.05 : 0.1);
        this.sectionMeshes.forEach((group, index) => {
            group.rotation.y += deltaTime * rotationSpeed;

            group.children.forEach((child, childIndex) => {
                child.rotation.x += deltaTime * rotationSpeed * 1.5;
                child.rotation.y += deltaTime * rotationSpeed;

                // Orbital motion for warehouse children
                if (index === 2 && childIndex > 0) {
                    const angle = elapsedTime * 0.3 + childIndex;
                    const radius = this.isMobile() ? 1.5 : 1.8;
                    child.position.x = Math.cos(angle) * radius;
                    child.position.z = Math.sin(angle) * radius;
                }
            });
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
            this.sectionMeshes[0].position.x = 2;
            this.sectionMeshes[1].position.x = -2;
            this.sectionMeshes[2].position.x = 2;
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
