import pandas as pd
import random

class KMeansCity:
    def __init__(self, m, n, num_houses, k_hospitals):
        self.m = m
        self.n = n
        self.num_houses = num_houses
        self.k = k_hospitals
        self.houses = []
        self.hospitals = []
        self.clusters = {}
        self.iteration_count = 0

    def generate_city(self):
        self.houses = []
        used_positions = set()

        while len(self.houses) < self.num_houses:
            x = random.randint(0, self.m - 1)
            y = random.randint(0, self.n - 1)
            position = (x, y)

            if position not in used_positions:
                self.houses.append([x, y])
                used_positions.add(position)

        self.hospitals = []
        while len(self.hospitals) < self.k:
            x = random.randint(0, self.m - 1)
            y = random.randint(0, self.n - 1)
            position = (x, y)

            if position not in used_positions:
                self.hospitals.append([x, y])
                used_positions.add(position)

    def euclidean_distance(self, point1, point2):
        dx = point1[0] - point2[0]
        dy = point1[1] - point2[1]
        return (dx**2 + dy**2)**0.5

    def assign_clusters(self):
        self.clusters = {i: [] for i in range(self.k)}

        for house in self.houses:
            min_distance = float('inf')
            closest_hospital = 0

            for i, hospital in enumerate(self.hospitals):
                distance = self.euclidean_distance(house, hospital)
                if distance < min_distance:
                    min_distance = distance
                    closest_hospital = i

            self.clusters[closest_hospital].append(house)

    def update_hospitals(self):
        new_hospitals = []

        for i in range(self.k):
            if self.clusters[i]:
                cluster_points = self.clusters[i]
                sum_x = sum(point[0] for point in cluster_points)
                sum_y = sum(point[1] for point in cluster_points)
                n_points = len(cluster_points)

                new_x = max(0, min(self.m - 1, round(sum_x / n_points)))
                new_y = max(0, min(self.n - 1, round(sum_y / n_points)))

                new_hospitals.append([new_x, new_y])
            else:
                new_hospitals.append(self.hospitals[i])

        return new_hospitals

    def kmeans(self, max_iterations=100, verbose=True):
        self.generate_city()
        self.iteration_count = 0

        for iteration in range(max_iterations):
            old_hospitals = [h[:] for h in self.hospitals]

            self.assign_clusters()
            self.hospitals = self.update_hospitals()

            self.iteration_count = iteration + 1

            if old_hospitals == self.hospitals:
                if verbose:
                    print(f"✓ Convergencia alcanzada en iteración {self.iteration_count}")
                break
        else:
            if verbose:
                print(f"Máximo de {max_iterations} iteraciones alcanzado")

    def calculate_metrics(self):
        all_distances = []

        for i in range(self.k):
            for house in self.clusters[i]:
                distance = self.euclidean_distance(house, self.hospitals[i])
                all_distances.append(distance)

        distances_series = pd.Series(all_distances)

        return {
            'iterations': self.iteration_count,
            'avg_distance': float(distances_series.mean()) if len(distances_series) > 0 else 0,
            'max_distance': float(distances_series.max()) if len(distances_series) > 0 else 0,
            'min_distance': float(distances_series.min()) if len(distances_series) > 0 else 0,
            'std_distance': float(distances_series.std()) if len(distances_series) > 0 else 0,
            'coverage': 100.0
        }

def validate_inputs(m, n, num_houses, k_hospitals):
    if m < 2:
        return False, "El número de filas debe ser al menos 2"

    if n < 2:
        return False, "El número de columnas debe ser al menos 2"

    if num_houses < 1:
        return False, "Debe haber al menos 1 casa"

    if k_hospitals < 1:
        return False, "Debe haber al menos 1 hospital"

    max_houses = m * n
    if num_houses > max_houses:
        return False, f"Máximo {max_houses} casas para matriz {m}×{n}"

    if k_hospitals > num_houses:
        return False, f"No puede haber más hospitales ({k_hospitals}) que casas ({num_houses})"

    return True, ""