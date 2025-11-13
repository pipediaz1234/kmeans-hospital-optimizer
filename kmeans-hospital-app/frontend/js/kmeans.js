class KMeansCity {
    constructor(m, n, numHouses, kHospitals) {
        this.m = m;
        this.n = n;
        this.numHouses = numHouses;
        this.k = kHospitals;
        this.houses = [];
        this.hospitals = [];
        this.clusters = {};
        this.iterationCount = 0;
    }

    generateCity() {
        this.houses = [];
        this.hospitals = [];
        const usedPositions = new Set();

        while (this.houses.length < this.numHouses) {
            const x = Math.floor(Math.random() * this.m);
            const y = Math.floor(Math.random() * this.n);
            const key = `${x},${y}`;
            if (!usedPositions.has(key)) {
                this.houses.push([x, y]);
                usedPositions.add(key);
            }
        }

        while (this.hospitals.length < this.k) {
            const x = Math.floor(Math.random() * this.m);
            const y = Math.floor(Math.random() * this.n);
            const key = `${x},${y}`;
            if (!usedPositions.has(key)) {
                this.hospitals.push([x, y]);
                usedPositions.add(key);
            }
        }
    }

    euclideanDistance(p1, p2) {
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    assignClusters() {
        this.clusters = {};
        for (let i = 0; i < this.k; i++) this.clusters[i] = [];

        for (const house of this.houses) {
            let minDist = Infinity;
            let closestHospital = 0;
            for (let i = 0; i < this.hospitals.length; i++) {
                const dist = this.euclideanDistance(house, this.hospitals[i]);
                if (dist < minDist) {
                    minDist = dist;
                    closestHospital = i;
                }
            }
            this.clusters[closestHospital].push(house);
        }
    }

    updateHospitals() {
        const newHospitals = [];
        for (let i = 0; i < this.k; i++) {
            if (this.clusters[i].length > 0) {
                const sumX = this.clusters[i].reduce((s, p) => s + p[0], 0);
                const sumY = this.clusters[i].reduce((s, p) => s + p[1], 0);
                const n = this.clusters[i].length;
                const newX = Math.max(0, Math.min(this.m - 1, Math.round(sumX / n)));
                const newY = Math.max(0, Math.min(this.n - 1, Math.round(sumY / n)));
                newHospitals.push([newX, newY]);
            } else {
                newHospitals.push(this.hospitals[i]);
            }
        }
        return newHospitals;
    }

    kmeans(maxIterations = 100) {
        this.generateCity();
        this.iterationCount = 0;
        for (let iter = 0; iter < maxIterations; iter++) {
            const oldHospitals = JSON.stringify(this.hospitals);
            this.assignClusters();
            this.hospitals = this.updateHospitals();
            this.iterationCount = iter + 1;
            if (oldHospitals === JSON.stringify(this.hospitals)) break;
        }
    }

    calculateMetrics() {
        const allDistances = [];
        for (let i = 0; i < this.k; i++) {
            for (const house of this.clusters[i]) {
                const dist = this.euclideanDistance(house, this.hospitals[i]);
                allDistances.push(dist);
            }
        }
        const avg = allDistances.reduce((a, b) => a + b, 0) / allDistances.length;
        const max = Math.max(...allDistances);
        return {
            iterations: this.iterationCount,
            avgDistance: avg,
            maxDistance: max,
            coverage: 100
        };
    }
}