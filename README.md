 📚 StudyBuddy (Sistema inteligente de productividad y enfoque para estudiantes)


El presente SISTEMA es el desarrollo de una aplicación
web llamada StudyBuddy, la cual busca no solo apoyar la organización de tareas, sino también analizar el comportamiento del usuario durante sus sesiones de estudio. El sistema permitirá identificar patrones de productividad, medir el tiempo de estudio,trabajo desarrollo de actividades y proporcionar retroalimentación útil donde podrá ver su comportamiento de aprendizaje.
Como valor agregado, la aplicación incorporará elementos de gamificación, como un sistema de rachas y una mascota virtual que interactúa con el usuario, con el objetivo de incentivar la constancia y generar una experiencia más dinámica y motivadora.
---

🚀 Descripción del proyecto

StudyBuddy permite a los usuarios:

* Crear tareas
* Visualizar tareas
* Actualizar tareas
* Eliminar tareas

El sistema implementa una arquitectura cliente-servidor donde el frontend consume una API REST desarrollada con FastAPI.


 🧩 Arquitectura del proyecto

El proyecto está dividido en dos componentes principales:

StudyBuddy/
│
├── backend/
│   ├── main.py        # Definición de endpoints
│   ├── models.py      # Modelo de datos (Task)
│   ├── database.py    # Conexión a PostgreSQL
│
├── frontend/
│   ├── index.html     # Interfaz de usuario
│   ├── app.js         # Lógica de interacción
│
├── requirements.txt   # Dependencias del backend
└── README.md


 ⚙️ Tecnologías utilizadas

* FastAPI
* PostgreSQL
* SQLAlchemy
* JavaScript 
* HTML / CSS

 🗄️ Base de datos

Se utiliza PostgreSQL como sistema de gestión de base de datos.

 🔹 Configuración de conexión

```python
DATABASE_URL = "postgresql://admin:1004533363@localhost:5432/studybuddy"
```
 🔹 Modelo principal

Entidad: **Task**

* id (Integer, PK)
* title (String)

---

 ▶️ Cómo ejecutar el proyecto
 🔹 1. Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd StudyBuddy
```

🔹 2. Crear entorno virtual

```bash
python -m venv .venv
```

🔹 3. Activar entorno

**Linux / Mac**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```
🔹 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

 🔹 5. Ejecutar backend

```bash
fastapi dev backend/main.py
```

Servidor disponible en:

👉 http://localhost:8000

---
 🔌 Endpoints principales

| Método | Ruta        | Descripción              |
| ------ | ----------- | ------------------------ |
| GET    | /tasks      | Obtener todas las tareas |
| POST   | /tasks      | Crear una nueva tarea    |
| GET    | /tasks/{id} | Obtener tarea por ID     |
| PUT    | /tasks/{id} | Actualizar tarea         |
| DELETE | /tasks/{id} | Eliminar tarea           |

---
 🔁 Ejemplo de uso

🔹 Crear tarea

```json
POST /tasks
{
  "title": "Estudiar álgebra"
}
```

 🔹 Respuesta

```json
{
  "message": "Tarea creada",
  "task": {
    "id": 1,
    "title": "Estudiar álgebra"
  }
}
```

 🌐 Frontend

El frontend se encuentra en la carpeta `/frontend` y permite:

* Visualizar tareas
* Crear nuevas tareas
* Navegar entre vistas

Para ejecutarlo:

👉 Abrir `index.html` en el navegador
o usar Live Server en VS Code

 🔗 Integración

El frontend consume el backend mediante peticiones HTTP usando `fetch`, permitiendo una integración completa entre:

1. Interfaz de usuario
2. API REST
3. Base de datos

---
 ⚠️ Manejo de errores

El sistema implementa manejo básico de errores:

* 404 → Recurso no encontrado
* Validación de datos en frontend
* Respuestas controladas en backend

---

📌 Estado del proyecto

✔ Backend funcional
✔ CRUD completo
✔ Base de datos conectada
✔ Frontend funcional
✔ Integración end-to-end

---

👨‍💻 Autor : CARLOS DAVID CHARFUELAN

Proyecto desarrollado como parte de un trabajo académico.
