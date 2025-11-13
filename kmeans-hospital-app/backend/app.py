from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os

# Agregar el directorio actual al path para importar kmeans_city
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from kmeans_city import KMeansCity, validate_inputs
import json

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

@app.route('/api/run-kmeans', methods=['POST'])
def run_kmeans():
    try:
        data = request.get_json()
        
        m = data.get('m', 15)
        n = data.get('n', 15)
        num_houses = data.get('num_houses', 30)
        k_hospitals = data.get('k_hospitals', 5)
        max_iterations = data.get('max_iterations', 100)
        
        # Validar entradas
        is_valid, error_msg = validate_inputs(m, n, num_houses, k_hospitals)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Ejecutar K-Means
        city = KMeansCity(m, n, num_houses, k_hospitals)
        city.kmeans(max_iterations=max_iterations, verbose=False)
        
        # Calcular métricas
        metrics = city.calculate_metrics()
        
        # Preparar respuesta
        response = {
            'm': m,
            'n': n,
            'houses': city.houses,
            'hospitals': city.hospitals,
            'clusters': {str(k): v for k, v in city.clusters.items()},
            'metrics': metrics,
            'iteration_count': city.iteration_count
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'K-Means API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)