let currentView = '2d';
window.simulationData = null;

function updateValue(id) {
    const input = document.getElementById(id);
    const display = document.getElementById(id + 'Value');
    display.textContent = input.value;
    validateInputs();
}

function runKMeans() {
    const m = parseInt(document.getElementById('rows').value);
    const n = parseInt(document.getElementById('cols').value);
    const houses = parseInt(document.getElementById('houses').value);
    const hospitals = parseInt(document.getElementById('hospitals').value);
    const maxIter = parseInt(document.getElementById('iterations').value);

    if (!validate(m, n, houses, hospitals)) return;

    document.getElementById('loadingOverlay').classList.remove('hidden');

    setTimeout(() => {
        const city = new KMeansCity(m, n, houses, hospitals);
        city.kmeans(maxIter);

        window.simulationData = {
            m, n,
            houses: city.houses,
            hospitals: city.hospitals,
            clusters: city.clusters,
            metrics: city.calculateMetrics()
        };

        updateVisualization();
        updateStats();
        updateClusterInfo();
        document.getElementById('loadingOverlay').classList.add('hidden');
        showAlert('✓ Convergencia en ' + window.simulationData.metrics.iterations + ' iteraciones', 'success');
    }, 500);
}

function validate(m, n, houses, hospitals) {
    if (houses + hospitals > m * n) {
        showAlert('⚠️ Espacio insuficiente', 'warning');
        return false;
    }
    return true;
}

function validateInputs() {
    const m = parseInt(document.getElementById('rows').value);
    const n = parseInt(document.getElementById('cols').value);
    const houses = parseInt(document.getElementById('houses').value);
    const hospitals = parseInt(document.getElementById('hospitals').value);

    const alerts = document.getElementById('alertContainer');
    if (houses + hospitals > m * n) {
        alerts.innerHTML = '<div class="alert alert-warning">⚠️ Sin espacio suficiente</div>';
    } else {
        alerts.innerHTML = '';
    }
}

function showAlert(message, type) {
    const alerts = document.getElementById('alertContainer');
    alerts.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => alerts.innerHTML = '', 5000);
}

function updateStats() {
    if (!window.simulationData) return;
    const m = window.simulationData.metrics;
    document.getElementById('statIterations').textContent = m.iterations;
    document.getElementById('statAvgDist').textContent = m.avgDistance.toFixed(2);
    document.getElementById('statMaxDist').textContent = m.maxDistance.toFixed(2);
    document.getElementById('statCoverage').textContent = m.coverage.toFixed(0) + '%';
}

function updateClusterInfo() {
    if (!window.simulationData) return;
    const container = document.getElementById('clusterInfo');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#00b894'];
    let html = '';

    for (let i = 0; i < window.simulationData.hospitals.length; i++) {
        const clusterSize = window.simulationData.clusters[i].length;
        const hospital = window.simulationData.hospitals[i];
        let distances = [];
        for (const house of window.simulationData.clusters[i]) {
            const dx = house[0] - hospital[0];
            const dy = house[1] - hospital[1];
            distances.push(Math.sqrt(dx * dx + dy * dy));
        }
        const avgDist = distances.length > 0 ? 
            (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(2) : '0.00';

        html += `
            <div class="cluster-item" style="border-left-color: ${colors[i % colors.length]}">
                <div class="cluster-item-title">Hospital ${i + 1}</div>
                <div class="cluster-item-info">
                    📍 Pos: (${hospital[0]}, ${hospital[1]}) | 🏠 ${clusterSize} | 📏 ${avgDist}
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function updateVisualization() {
    if (currentView === '2d') {
        draw2D();
    } else {
        draw3D();
    }
}

function switchView(view) {
    currentView = view;
    
    document.getElementById('btn2d').classList.toggle('active', view === '2d');
    document.getElementById('btn3d').classList.toggle('active', view === '3d');
    
    document.getElementById('container2d').classList.toggle('hidden', view !== '2d');
    document.getElementById('container3d').classList.toggle('hidden', view !== '3d');

    if (view === '2d') {
        document.getElementById('viewTitle').textContent = 'Visualización 2D';
        document.getElementById('controlsTitle').textContent = 'Controles 2D';
        document.getElementById('controlsText').innerHTML = '🖱️ Zoom automático<br>⌨️ Enter: Ejecutar<br>⌨️ R: Reiniciar';
    } else {
        document.getElementById('viewTitle').textContent = 'Visualización 3D Interactiva';
        document.getElementById('controlsTitle').textContent = 'Controles 3D';
        document.getElementById('controlsText').innerHTML = '🖱️ Click + Arrastrar: Rotar<br>🖱️ Scroll: Zoom<br>⌨️ Enter: Ejecutar<br>⌨️ R: Reiniciar';
    }

    if (window.simulationData) {
        updateVisualization();
    }
}

function resetSimulation() {
    window.simulationData = null;
    
    const canvas2d = document.getElementById('canvas2d');
    const ctx = canvas2d.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);

    if (scene) {
        while(scene.children.length > 3) { 
            scene.remove(scene.children[3]); 
        }
    }

    document.getElementById('statIterations').textContent = '-';
    document.getElementById('statAvgDist').textContent = '-';
    document.getElementById('statMaxDist').textContent = '-';
    document.getElementById('statCoverage').textContent = '-';

    document.getElementById('clusterInfo').innerHTML = `
        <p style="text-align: center; color: #8b8b9a; font-size: 12px; padding: 20px;">
            Ejecuta el algoritmo para ver resultados
        </p>
    `;

    document.getElementById('alertContainer').innerHTML = '';
}

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runKMeans();
    if (e.key === 'r' || e.key === 'R') resetSimulation();
    if (e.key === '2') switchView('2d');
    if (e.key === '3') switchView('3d');
});

// Redimensionamiento
window.addEventListener('resize', () => {
    if (renderer && camera) {
        const canvas = document.getElementById('canvas3d');
        camera.aspect = canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    }
    if (window.simulationData && currentView === '2d') {
        draw2D();
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    updateValue('rows');
    updateValue('cols');
    updateValue('houses');
    updateValue('hospitals');
    updateValue('iterations');

    const canvas2d = document.getElementById('canvas2d');
    canvas2d.width = 800;
    canvas2d.height = 600;
    const ctx = canvas2d.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
    ctx.fillStyle = '#667eea';
    ctx.font = '18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('👈 Configura parámetros y ejecuta K-Means', canvas2d.width / 2, canvas2d.height / 2);
});

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🏥 K-MEANS HOSPITAL OPTIMIZER - 2D & 3D              ║
║                                                              ║
║  Atajos de Teclado:                                         ║
║  • Enter: Ejecutar K-Means                                  ║
║  • R: Reiniciar simulación                                  ║
║  • 2: Vista 2D                                              ║
║  • 3: Vista 3D                                              ║
║                                                              ║
║  Vista 2D:                                                  ║
║  ✓ Grid interactivo con colores por cluster                ║
║  ✓ Casas y hospitales diferenciados                        ║
║  ✓ Líneas de conexión                                      ║
║  ✓ Zoom automático                                         ║
║                                                              ║
║  Vista 3D:                                                  ║
║  ✓ Edificios 3D con ventanas iluminadas                   ║
║  ✓ Hospitales con cruces 3D                               ║
║  ✓ Rotación 360° con mouse                                ║
║  ✓ Zoom con scroll                                         ║
║  ✓ Iluminación profesional                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);