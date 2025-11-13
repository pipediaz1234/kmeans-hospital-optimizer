let scene, camera, renderer;
let cameraRotation = { x: 0.5, y: 0 };
let cameraDistance = 40;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function draw2D() {
    if (!window.simulationData) return;

    const canvas = document.getElementById('canvas2d');
    const ctx = canvas.getContext('2d');
    const { m, n, houses, hospitals, clusters } = window.simulationData;

    const maxSize = Math.min(window.innerWidth - 500, window.innerHeight - 150);
    const cellSize = Math.min(maxSize / Math.max(m, n), 50);
    
    canvas.width = n * cellSize;
    canvas.height = m * cellSize;

    // Fondo
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= m; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(n * cellSize, i * cellSize);
        ctx.stroke();
    }
    for (let i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, m * cellSize);
        ctx.stroke();
    }

    // Clusters (áreas coloreadas)
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#00b894'];
    for (let i = 0; i < hospitals.length; i++) {
        ctx.fillStyle = colors[i % colors.length] + '30';
        for (const house of clusters[i]) {
            ctx.fillRect(house[1] * cellSize, house[0] * cellSize, cellSize, cellSize);
        }
    }

    // Líneas de conexión
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < hospitals.length; i++) {
        for (const house of clusters[i]) {
            ctx.beginPath();
            ctx.moveTo(house[1] * cellSize + cellSize/2, house[0] * cellSize + cellSize/2);
            ctx.lineTo(hospitals[i][1] * cellSize + cellSize/2, hospitals[i][0] * cellSize + cellSize/2);
            ctx.stroke();
        }
    }

    // Casas
    houses.forEach(house => {
        const x = house[1] * cellSize + cellSize / 2;
        const y = house[0] * cellSize + cellSize / 2;

        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Hospitales
    hospitals.forEach((hospital, idx) => {
        const x = hospital[1] * cellSize + cellSize / 2;
        const y = hospital[0] * cellSize + cellSize / 2;

        // Círculo rojo
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cruz blanca
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - cellSize * 0.25, y);
        ctx.lineTo(x + cellSize * 0.25, y);
        ctx.moveTo(x, y - cellSize * 0.25);
        ctx.lineTo(x, y + cellSize * 0.25);
        ctx.stroke();

        // Número
        ctx.fillStyle = 'white';
        ctx.font = `bold ${cellSize * 0.35}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(idx + 1, x, y);
    });
}

function init3D() {
    const canvas = document.getElementById('canvas3d');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f23);
    scene.fog = new THREE.Fog(0x0f0f23, 50, 150);

    camera = new THREE.PerspectiveCamera(60, canvas.parentElement.clientWidth / canvas.parentElement.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    setupLights();
    setupControls();
    animate3D();
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 40, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x667eea, 0x764ba2, 0.3);
    scene.add(hemisphereLight);
}

function setupControls() {
    const canvas = document.getElementById('canvas3d');

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            cameraRotation.y += deltaX * 0.005;
            cameraRotation.x += deltaY * 0.005;
            cameraRotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRotation.x));

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        cameraDistance += e.deltaY * 0.05;
        cameraDistance = Math.max(10, Math.min(100, cameraDistance));
    });
}

function animate3D() {
    requestAnimationFrame(animate3D);

    const x = cameraDistance * Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x);
    const y = cameraDistance * Math.sin(cameraRotation.x);
    const z = cameraDistance * Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x);

    camera.position.set(x, y + 15, z);
    camera.lookAt(0, 0, 0);

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function draw3D() {
    if (!window.simulationData) return;

    while(scene.children.length > 3) { 
        scene.remove(scene.children[3]); 
    }

    const { m, n, houses, hospitals, clusters } = window.simulationData;
    const scale = 1.5;

    // Plano base
    const planeGeometry = new THREE.PlaneGeometry(n * scale * 1.2, m * scale * 1.2);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a2e,
        roughness: 0.8,
        metalness: 0.2
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    plane.receiveShadow = true;
    scene.add(plane);

    // Grid
    const gridHelper = new THREE.GridHelper(
        Math.max(m, n) * scale * 1.2, 
        Math.max(m, n), 
        0x667eea, 
        0x2a2a3e
    );
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7, 0xa29bfe, 0xfd79a8, 0xfdcb6e, 0x00b894];

    // Áreas de clusters
    for (let i = 0; i < hospitals.length; i++) {
        for (const house of clusters[i]) {
            const x = (house[1] - n/2) * scale;
            const z = (house[0] - m/2) * scale;

            const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 16);
            const material = new THREE.MeshStandardMaterial({ 
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.25,
                emissive: colors[i % colors.length],
                emissiveIntensity: 0.1
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(x, 0.08, z);
            cylinder.castShadow = true;
            scene.add(cylinder);
        }
    }

    // Líneas de conexión
    for (let i = 0; i < hospitals.length; i++) {
        for (const house of clusters[i]) {
            const houseX = (house[1] - n/2) * scale;
            const houseZ = (house[0] - m/2) * scale;
            const hospX = (hospitals[i][1] - n/2) * scale;
            const hospZ = (hospitals[i][0] - m/2) * scale;

            const points = [
                new THREE.Vector3(houseX, 1, houseZ),
                new THREE.Vector3(hospX, 2, hospZ)
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.15
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        }
    }

    // Casas 3D
    houses.forEach(house => {
        const x = (house[1] - n/2) * scale;
        const z = (house[0] - m/2) * scale;

        const baseGeometry = new THREE.BoxGeometry(0.9, 1.5, 0.9);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3498db,
            roughness: 0.7,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, 0.75, z);
        base.castShadow = true;
        scene.add(base);

        // Ventanas
        const windowGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.5
        });
        
        [-0.25, 0.25].forEach(offsetX => {
            const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
            window1.position.set(x + offsetX, 0.9, z + 0.46);
            scene.add(window1);
        });

        // Techo
        const roofGeometry = new THREE.ConeGeometry(0.7, 0.7, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2980b9,
            roughness: 0.8
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(x, 1.85, z);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        scene.add(roof);
    });

    // Hospitales 3D
    hospitals.forEach((hospital, idx) => {
        const x = (hospital[1] - n/2) * scale;
        const z = (hospital[0] - m/2) * scale;

        // Base cilíndrica
        const baseGeometry = new THREE.CylinderGeometry(0.7, 0.7, 2.5, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe74c3c,
            roughness: 0.5,
            metalness: 0.4
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, 1.25, z);
        base.castShadow = true;
        scene.add(base);

        // Anillo superior
        const ringGeometry = new THREE.TorusGeometry(0.75, 0.1, 16, 32);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(x, 2.5, z);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        // Cruz 3D
        const crossMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });

        const crossH = new THREE.BoxGeometry(1.2, 0.25, 0.25);
        const crossHMesh = new THREE.Mesh(crossH, crossMaterial);
        crossHMesh.position.set(x, 2.8, z);
        crossHMesh.castShadow = true;
        scene.add(crossHMesh);

        const crossV = new THREE.BoxGeometry(0.25, 1.2, 0.25);
        const crossVMesh = new THREE.Mesh(crossV, crossMaterial);
        crossVMesh.position.set(x, 2.8, z);
        crossVMesh.castShadow = true;
        scene.add(crossVMesh);

        // Número sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 1)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);

        context.fillStyle = '#ffffff';
        context.font = 'Bold 120px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 10;
        context.fillText(idx + 1, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, 3.8, z);
        sprite.scale.set(1.5, 1.5, 1);
        scene.add(sprite);
    });

    const maxDim = Math.max(m, n) * scale;
    cameraDistance = maxDim * 1.5;
}