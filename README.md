# Optimizador Hospitalario con K-Means

<img width="955" height="868" alt="banner" src="https://github.com/user-attachments/assets/215f4f06-34cd-4ab8-aa01-a3adf114200d" />

---

##  Página del Proyecto  
🔗 [Visita la aplicación en línea aquí](https://k-meanshospital.netlify.app/)

---

## Descripción General

El **Optimizador Hospitalario con K-Means** es un sistema diseñado para **mejorar la eficiencia operativa en hospitales** mediante técnicas de **análisis de datos y aprendizaje automático no supervisado**.  
A través del algoritmo **K-Means Clustering**, se identifican **patrones y agrupaciones** que permiten optimizar la **distribución de recursos**, **reducir tiempos de espera** y **mejorar la atención al paciente**.

Este proyecto combina **ciencia de datos, visualización interactiva y análisis predictivo**, ofreciendo una herramienta práctica para la **toma de decisiones estratégicas** en entornos hospitalarios modernos.

---

##  Objetivos del Proyecto

- Analizar datos hospitalarios para identificar grupos o comportamientos relevantes.  
- Optimizar la gestión de recursos mediante **machine learning no supervisado**.  
- Presentar resultados visuales en entornos **2D y 3D** de forma clara y comprensible.  
- Facilitar la interpretación de clústeres a través de **gráficas interactivas**.  

---

##  Tecnologías Utilizadas

| Área | Herramientas |
|------|---------------|
| **Lenguaje** | Python 🐍 |
| **Librerías principales** | Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, Plotly |
| **Visualización web** | HTML5, CSS3, JavaScript, Streamlit / Flask |
| **Despliegue** | Netlify 🌐(Web) |Docker (local) 🐳|
| **Control de versiones** | Git + GitHub 🧩 |

---
## Despliegue Local con Docker

El proyecto puede ejecutarse de manera local mediante contenedores Docker, lo que facilita la portabilidad, la escalabilidad y la replicación del entorno de desarrollo.

 Pasos para ejecutar localmente

Clonar el repositorio:

git clone https://github.com/pipediaz1234/kmeans-hospital.git
cd kmeans-hospital


Crear y ejecutar el contenedor:

docker build -t hospital-optimizer .
docker run -p 8501:8501 hospital-optimizer


Abrir en el navegador:

http://localhost:8501


 Esto iniciará la aplicación desarrollada en Streamlit o Flask, totalmente funcional en un entorno aislado y reproducible, ideal para pruebas o demostraciones locales.
Esto levantará la aplicación con Streamlit o Flask, según la versión, totalmente funcional en un entorno aislado.

<img width="1591" height="772" alt="image" src="https://github.com/user-attachments/assets/a82b825e-71a7-43f9-b26c-784d7ff9e1c4" />

---
##  Configuración y Parámetros del Sistema

Esta sección define los valores iniciales del algoritmo y el entorno de simulación.  
Cada parámetro influye directamente en el comportamiento del **Optimizador Hospitalario con K-Means**.

| Parámetro | Descripción |
|------------|-------------|
| **Filas (m)** | Define el tamaño **vertical** de la cuadrícula o mapa 2D donde se ubicarán las casas y los hospitales. Ejemplo: `15`. |
| **Columnas (n)** | Define el tamaño **horizontal** de la cuadrícula. El área total de la simulación se calcula como:  $$Área = m \times n = 15 \times 15 = 225 \text{ celdas}$$ |
| **Casas** | Número total de puntos de datos que representan viviendas o pacientes a ser agrupados. Ejemplo: `30`. |
| **Hospitales (k)** | Número de **centros o clústeres** que el algoritmo formará (el valor de *K*). Ejemplo: `5`. |
| **Iteraciones Máx.** | Número máximo de repeticiones del algoritmo para ajustar los centros (hospitales). Por defecto: `100`. |

>  **Objetivo:** encontrar la ubicación óptima de los hospitales que minimice la distancia total o promedio entre las casas y su hospital asignado.

---

##  Funcionamiento del Algoritmo

El sistema implementa el algoritmo **K-Means Clustering**, un método de aprendizaje no supervisado que agrupa puntos (casas) en torno a centros (hospitales).  
El proceso sigue las siguientes etapas:

1. **Inicialización:**  
   Se generan aleatoriamente las posiciones iniciales de los hospitales (centroides).

2. **Asignación:**  
   Cada casa se asigna al hospital más cercano calculando la **distancia euclidiana**.

3. **Actualización:**  
   Cada hospital (centroide) se reubica en la posición promedio de las casas asignadas a su grupo.

4. **Iteración:**  
   Se repiten los pasos 2 y 3 hasta que los centroides no cambien significativamente o se alcance el número máximo de iteraciones.

5. **Convergencia:**  
   El modelo alcanza la estabilidad, y se calculan las métricas finales de rendimiento: distancia promedio, máxima y cobertura total.

>  *Matemáticamente, K-Means busca minimizar la suma de las distancias cuadráticas entre los puntos y su centro asignado.*

---

##  Ejecución del Algoritmo

Esta sección controla la simulación del sistema:

### 🔹 **Ejecutar Algoritmo**
Inicia la ejecución del proceso con los parámetros definidos.  
El modelo buscará posicionar los **5 hospitales (K=5)** de forma que minimicen las distancias promedio a las **30 casas**.

### 🔹 **Reiniciar**
Limpia la cuadrícula, borra resultados y devuelve todos los parámetros a sus valores iniciales para una nueva simulación.

---

##  Visualización

###  **Vista 2D**
Permite observar la distribución espacial de los hospitales y viviendas en un plano cartesiano.

- 🔵 **Casas:** puntos de demanda o zonas habitacionales.  
- 🔴 **Hospitales:** centroides calculados por el algoritmo.  
- 🟣 **Clústeres:** zonas de influencia asignadas a cada hospital.  

>  Esta vista facilita la interpretación visual de la cobertura y la eficiencia del sistema.

---

### **Vista 3D**
Ofrece una visualización tridimensional con un eje **Z** que representa factores como la densidad de población o la capacidad hospitalaria.  
Permite comprender la cobertura de manera más profunda y realista.

---

##  Métricas del Modelo

| Métrica | Descripción |
|----------|-------------|
| **Iteraciones** | Número real de pasos que tomó el algoritmo para converger. |
| **Dist. Prom (Promedio)** | Promedio de las distancias entre cada casa y su hospital asignado. |
| **Dist. Máx (Máxima)** | Distancia más grande registrada en el modelo, útil para identificar zonas alejadas. |
| **Cobertura** | Porcentaje de casas correctamente asignadas a un hospital. Idealmente: **100%**. |

>  Una buena simulación busca una **baja distancia promedio**, una **baja distancia máxima** y **cobertura total**.

---

##  Resultados Visuales

### 🔹 Visualización 2D
<img width="949" height="826" alt="2D" src="https://github.com/user-attachments/assets/b7a1e8b8-9921-4128-bf64-1036b966035c" />

> **Descripción:**  
> En la representación 2D se observa la **distribución espacial de los hospitales y las viviendas (casas)** dentro de una cuadrícula de 15x15 unidades.  
> El algoritmo **K-Means** agrupa las viviendas en torno a los hospitales más cercanos, optimizando la **cobertura geográfica** y minimizando la **distancia promedio** de atención.
>
> - 🔵 Casas: puntos a atender o zonas de demanda.  
> - 🔴 Hospitales: centros de atención asignados como centroides.  
> - 🟣 Clústeres: zonas delimitadas según cercanía y eficiencia de servicio.  
>
> En este ejemplo, se alcanzó una **cobertura del 100%** con una **distancia promedio de 2.43** y una **distancia máxima de 5.00**, demostrando la efectividad del modelo para equilibrar la atención hospitalaria.

---

### 🔹 Visualización 3D
<img width="958" height="921" alt="3D" src="https://github.com/user-attachments/assets/9486e34c-1bdc-471c-900b-574323c53eff" />

> **Descripción:**  
> En la visualización 3D, el sistema añade una tercera dimensión que representa **factores adicionales** como la **capacidad hospitalaria**, el **nivel de atención** o la **densidad de población**.  
> 
> Esta perspectiva tridimensional permite analizar la distribución de clústeres en profundidad, ofreciendo una visión más completa de cómo los hospitales cubren la demanda en distintos niveles del sistema de salud.
>
> Gracias a las gráficas 3D interactivas, se puede:
> - Observar el comportamiento del algoritmo en diferentes iteraciones.  
> - Evaluar la convergencia de los centroides en el espacio tridimensional.  
> - Comparar métricas de distancia, cobertura y eficiencia general.  

---

##  Interpretación de Resultados

Cada **clúster** identificado representa un **grupo homogéneo de pacientes o recursos**.  
Estos resultados son clave para la toma de decisiones en áreas como:

- Optimización del flujo de pacientes.  
- Mejora en la asignación del personal médico.  
- Reducción de la carga en áreas críticas.  
- Detección de patrones de atención por especialidad o turno.

---

##  Conclusiones

El uso de **K-Means** en la gestión hospitalaria demuestra el valor del **análisis de datos en la toma de decisiones**.  
Este tipo de modelos permite obtener **información accionable** para optimizar procesos, distribuir recursos de forma más eficiente y mejorar la calidad del servicio hospitalario.

> En conclusión, los algoritmos de agrupamiento representan una herramienta clave para la **planificación inteligente y sostenible de los sistemas de salud.**

---

## 👨‍💻 Autor

**Andrés Felipe Díaz Campos**  
📍 Ingeniero de Sistemas  
💼 Análisis de Datos | Redes | Desarrollo Web  
🔗 [LinkedIn](https://linkedin.com/in/andres-felipe-diaz-campos-398245207)  
🔗 [GitHub](https://github.com/pipediaz1234)

---

##  Futuras Mejoras

- Integración de datos en tiempo real desde sistemas hospitalarios.  
- Implementación de modelos híbridos con algoritmos jerárquicos.  
- Creación de dashboards interactivos en **Power BI** o **Streamlit**.  
- Inclusión de métricas de desempeño hospitalario y predicción de demanda.  
- Exportación de resultados a reportes automatizados en PDF o CSV.

---

>  *“Los datos no son solo números; son historias que pueden salvar vidas.”*
