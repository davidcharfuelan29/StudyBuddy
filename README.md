# StudyBuddy

Sistema inteligente de productividad y enfoque para estudiantes, con gamificación y mascota virtual.

## Funciones

| Función | Descripción |
|---------|-------------|
| **Tareas** | CRUD completo con prioridades (alta/media/baja), fechas, duración estimada y filtro por día |
| **Pomodoro** | Temporizador de enfoque (25 min) y descanso (5 min) con barra de progreso animada |
| **Sesiones** | Historial de sesiones completadas almacenado en backend |
| **Estadísticas** | Total de sesiones, horas, racha actual, XP y nivel |
| **Calendario** | Vista mensual con navegación y tareas marcadas por día |
| **Mascota Buddy** | Compañero virtual con 6 estados de ánimo según tu actividad (primera sesión, racha, pausa, etc.) |
| **Gamificación** | Sistema de XP (50 por sesión), niveles (cada 350 XP) y racha de días consecutivos |
| **Gráfico de productividad** | Dona de Chart.js con distribución enfoque/descanso |
| **Autenticación** | Registro e inicio de sesión con JWT (24 h de expiración) |

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL |
| Frontend | HTML, CSS, JavaScript vanilla (sin frameworks) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Gráficos | Chart.js |
| Iconos | Remix Icons |

## Requisitos

- Python 3.11 o superior
- PostgreSQL
- Navegador moderno

## Inicio rápido

1.  Clonar el repositorio:

    ```bash
    git clone <URL>
    cd studybuddy_agentes
    ```

2.  Crear y activar entorno virtual:

    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```

3.  Instalar dependencias:

    ```bash
    pip install -r requirements.txt
    ```

4.  Configurar variables de entorno: copiar `.env.example` a `.env` y ajustar credenciales:

    ```bash
    cp .env.example .env
    ```

    Variables requeridas en `.env`:

    | Variable | Descripción |
    |----------|-------------|
    | `DATABASE_URL` | URL de conexión a PostgreSQL |
    | `SECRET_KEY` | Clave secreta para firmar JWT |
    | `CORS_ORIGINS` | Orígenes permitidos (separados por coma) |

5.  Iniciar backend:

    ```bash
    fastapi dev backend/main.py
    ```

    Servidor en `http://localhost:8000`

6.  Abrir frontend: navegar a `http://localhost:8000/frontend/index.html`

## Arquitectura

```
studybuddy_agentes/
├── backend/
│   ├── main.py        -- Endpoints de la API REST
│   ├── models.py      -- Modelos SQLAlchemy (User, Task, Session)
│   ├── schemas.py     -- Esquemas Pydantic con validaciones
│   ├── auth.py        -- JWT, dependencia get_current_user
│   └── database.py    -- Conexión a PostgreSQL, declarative Base
├── frontend/
│   ├── index.html     -- Splash animado con partículas
│   ├── splash.css     -- Estilos del splash
│   ├── splash.js      -- Animación y redirección
│   ├── login.html     -- Página de login/registro
│   ├── login.css      -- Estilos del login
│   ├── login.js       -- Lógica de autenticación
│   ├── dashboard.html -- Panel principal con todas las vistas
│   ├── dashboard.css  -- Estilos del dashboard
│   ├── dashboard.js   -- Lógica del dashboard (Pomodoro, tareas, etc.)
│   └── assets/        -- Imágenes, iconos, sonidos
├── requirements.txt
├── .env.example       -- Plantilla de variables de entorno
└── README.md
```

## API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | No | Crear usuario |
| POST | `/login` | No | Iniciar sesión, devuelve JWT |
| GET | `/tasks` | Bearer | Listar tareas del usuario |
| POST | `/tasks` | Bearer | Crear tarea |
| GET | `/tasks/{id}` | Bearer | Obtener tarea |
| PUT | `/tasks/{id}` | Bearer | Actualizar tarea |
| DELETE | `/tasks/{id}` | Bearer | Eliminar tarea |
| POST | `/sessions` | Bearer | Guardar sesión completada |
| GET | `/sessions` | Bearer | Historial de sesiones (últimas 50) |
| GET | `/stats` | Bearer | Estadísticas: sesiones, minutos, racha, XP, nivel |

## Flujo de autenticación

1.  `POST /register` con email y contraseña → cuenta creada
2.  `POST /login` con mismas credenciales → devuelve `access_token` + datos del usuario
3.  Guardar token en `localStorage`
4.  Enviar token en header `Authorization: Bearer <token>` en cada request protegido
5.  Token expira en 24 horas

## Validaciones

| Campo | Regla |
|-------|-------|
| Email | Formato válido (EmailStr) |
| Contraseña | 6-128 caracteres |
| Prioridad | `alta`, `media` o `baja` |
| Duración tarea | 5-480 minutos |
| Duración sesión | 1-240 minutos |

## Estado actual

- Backend funcional con 11 endpoints, auth JWT, validaciones Pydantic
- Dashboard con Pomodoro, tareas, calendario, sesiones, mascota, gráficos
- Backend como fuente de verdad para estadísticas (XP, nivel, racha)
- Vistas de Análisis, Logros y Ajustes completadas con datos reales
- CORS configurable vía entorno
- .env.example sin credenciales reales

## Pendientes conocidos

- Migraciones de base de datos: reemplazar `ensure_missing_columns()` por Alembic
- Pruebas automatizadas (backend y frontend)
- Endpoint de preferencias de usuario para persistir ajustes en servidor
- La racha se calcula sobre sesiones, no sobre actividad diaria login
- El sidebar se oculta en mobile sin menú alternativo

## Autor

Carlos David Charfuelan
