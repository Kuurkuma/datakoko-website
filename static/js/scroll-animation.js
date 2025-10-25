import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/**
 * Data Infrastructure Scroll-Based 3D Animation
 * Represents abstract data pipelines, nodes, and flowing data
 */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
} else {
    initAnimation();
}

function initAnimation() {
    // Check if we're on the homepage
    const canvas = document.querySelector('canvas.webgl-data');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Parameters for data infrastructure theme
    const parameters = {
        primaryColor: 0x4a9eff,    // Data blue
        secondaryColor: 0x00d4aa,  // Pipeline green
        accentColor: 0xff6b6b      // Alert red
    };

    /**
     * Create Data Infrastructure Objects
     */
    const objectsDistance = 4;

    // Material with a tech/data feel - using standard material for better lighting
    const primaryMaterial = new THREE.MeshStandardMaterial({
        color: parameters.primaryColor,
        metalness: 0.7,
        roughness: 0.3
    });

    const secondaryMaterial = new THREE.MeshStandardMaterial({
        color: parameters.secondaryColor,
        metalness: 0.6,
        roughness: 0.4
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
        color: parameters.accentColor,
        metalness: 0.5,
        roughness: 0.5
    });

    // Section 1: Raw Data Sources (scattered cubes representing databases)
    const dataSourceGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const size = 0.2 + Math.random() * 0.3;
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            primaryMaterial
        );
        cube.position.x = (Math.random() - 0.5) * 2;
        cube.position.y = (Math.random() - 0.5) * 1;
        cube.position.z = (Math.random() - 0.5) * 2;
        dataSourceGroup.add(cube);
    }
    dataSourceGroup.position.x = 2;
    dataSourceGroup.position.y = -objectsDistance * 0;
    scene.add(dataSourceGroup);

    // Section 2: Data Pipeline (octahedrons representing transformation)
    const pipelineGroup = new THREE.Group();
    const pipelineMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1, 0),
        secondaryMaterial
    );
    pipelineGroup.add(pipelineMesh);

    // Add smaller nodes connected to main pipeline
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const nodeMesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.3, 0),
            secondaryMaterial
        );
        nodeMesh.position.x = Math.cos(angle) * 1.5;
        nodeMesh.position.z = Math.sin(angle) * 1.5;
        pipelineGroup.add(nodeMesh);
    }
    pipelineGroup.position.x = -2;
    pipelineGroup.position.y = -objectsDistance * 1;
    scene.add(pipelineGroup);

    // Section 3: Data Warehouse (organized structure)
    const warehouseGroup = new THREE.Group();
    const warehouseMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 0),
        accentMaterial
    );
    warehouseGroup.add(warehouseMesh);

    // Add orbital elements
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const orbitMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            accentMaterial
        );
        orbitMesh.position.x = Math.cos(angle) * 1.8;
        orbitMesh.position.y = Math.sin(angle) * 0.5;
        orbitMesh.position.z = Math.sin(angle) * 1.8;
        warehouseGroup.add(orbitMesh);
    }
    warehouseGroup.position.x = 2;
    warehouseGroup.position.y = -objectsDistance * 2;
    scene.add(warehouseGroup);

    const sectionMeshes = [dataSourceGroup, pipelineGroup, warehouseGroup];

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x4a9eff, 0.5);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);

    /**
     * Data Flow Particles
     */
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: parameters.primaryColor,
        sizeAttenuation: true,
        size: 0.03,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 6;
    cameraGroup.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Scroll
     */
    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        const newSection = Math.round(scrollY / sizes.height);

        if (newSection !== currentSection && newSection < sectionMeshes.length) {
            currentSection = newSection;

            // Animate the section mesh when it comes into view
            // Using basic animation since GSAP requires import
            const mesh = sectionMeshes[currentSection];
            const originalRotation = {
                x: mesh.rotation.x,
                y: mesh.rotation.y,
                z: mesh.rotation.z
            };

            // Simple rotation animation
            const animateRotation = () => {
                const targetX = originalRotation.x + Math.PI * 2;
                const targetY = originalRotation.y + Math.PI;
                const duration = 1000; // ms
                const startTime = Date.now();

                const rotate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

                    mesh.rotation.x = originalRotation.x + (targetX - originalRotation.x) * eased;
                    mesh.rotation.y = originalRotation.y + (targetY - originalRotation.y) * eased;

                    if (progress < 1) {
                        requestAnimationFrame(rotate);
                    }
                };
                rotate();
            };

            animateRotation();
        }
    });

    /**
     * Cursor for parallax effect
     */
    const cursor = { x: 0, y: 0 };

    window.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX / sizes.width - 0.5;
        cursor.y = event.clientY / sizes.height - 0.5;
    });

    /**
     * Animation Loop
     */
    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Animate camera based on scroll
        camera.position.y = -scrollY / sizes.height * objectsDistance;

        // Parallax effect
        const parallaxX = cursor.x * 0.5;
        const parallaxY = -cursor.y * 0.5;
        cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
        cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

        // Animate mesh groups
        sectionMeshes.forEach((group, index) => {
            // Gentle rotation for all objects
            group.rotation.y += deltaTime * 0.1;

            // Animate children
            group.children.forEach((child, childIndex) => {
                child.rotation.x += deltaTime * 0.15;
                child.rotation.y += deltaTime * 0.1;

                // Orbital motion for child elements
                if (childIndex > 0 && group === warehouseGroup) {
                    const angle = elapsedTime * 0.3 + childIndex;
                    const radius = 1.8;
                    child.position.x = Math.cos(angle) * radius;
                    child.position.z = Math.sin(angle) * radius;
                }
            });
        });

        // Animate particles (data flow effect)
        const particlePositions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            // Gentle floating motion
            particlePositions[i3 + 1] += Math.sin(elapsedTime + i) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = elapsedTime * 0.05;

        // Render
        renderer.render(scene, camera);

        // Next frame
        window.requestAnimationFrame(tick);
    };

    tick();
}
