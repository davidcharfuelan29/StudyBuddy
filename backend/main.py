from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os
from sqlalchemy import inspect, text
from .database import SessionLocal, engine, Base
from .models import Task, User


app = FastAPI()

# 📁 Ruta base del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 📁 Servir frontend
app.mount("/frontend", StaticFiles(directory=os.path.join(BASE_DIR, "frontend")), name="frontend")

# 🔐 HASH CONFIG
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# 🧱 CREAR TABLAS
Base.metadata.create_all(bind=engine)

def ensure_task_columns():
    inspector = inspect(engine)

    if "tasks" not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns("tasks")
    }

    columns = {
        "due_date": "VARCHAR",
        "priority": "VARCHAR DEFAULT 'media'",
        "duration_minutes": "INTEGER DEFAULT 30",
        "completed": "BOOLEAN DEFAULT FALSE",
    }

    with engine.begin() as connection:
        for column_name, definition in columns.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(f"ALTER TABLE tasks ADD COLUMN {column_name} {definition}")
                )

ensure_task_columns()

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🏠 HOME
@app.get("/")
def home():
    return RedirectResponse(url="/frontend/index.html")


# 🔐 REGISTER
@app.post("/register")
def register(user: dict):
    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == user["email"]).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    hashed_password = hash_password(user["password"])

    new_user = User(
        email=user["email"],
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {"message": "Usuario creado"}


# 🔑 LOGIN
@app.post("/login")
def login(user: dict):
    db = SessionLocal()

    db_user = db.query(User).filter(User.email == user["email"]).first()

    if not db_user:
        db.close()
        raise HTTPException(status_code=400, detail="Usuario no existe")

    if not verify_password(user["password"], db_user.password):
        db.close()
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    db.close()

    return {
        "message": "Login exitoso",
        "user": {
            "id": db_user.id,
            "email": db_user.email
        }
    }


# 📋 TASKS

def serialize_task(task: Task):
    return {
        "id": task.id,
        "title": task.title,
        "due_date": task.due_date,
        "priority": task.priority or "media",
        "duration_minutes": task.duration_minutes or 30,
        "completed": bool(task.completed),
    }

@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return [serialize_task(t) for t in tasks]


@app.post("/tasks")
def create_task(task: dict):
    db = SessionLocal()
    new_task = Task(
        title=task["title"],
        due_date=task.get("due_date"),
        priority=task.get("priority", "media"),
        duration_minutes=task.get("duration_minutes", 30),
        completed=task.get("completed", False),
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    db.close()

    return {
        "message": "Tarea creada",
        "task": serialize_task(new_task)
    }


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    db.close()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return serialize_task(task)


@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: dict):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    task.title = updated_task.get("title", task.title)
    task.due_date = updated_task.get("due_date", task.due_date)
    task.priority = updated_task.get("priority", task.priority)
    task.duration_minutes = updated_task.get(
        "duration_minutes",
        task.duration_minutes,
    )
    task.completed = updated_task.get("completed", task.completed)
    db.commit()
    db.refresh(task)
    db.close()

    return {
        "message": "Tarea actualizada",
        "task": serialize_task(task)
    }


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    db.delete(task)
    db.commit()
    db.close()

    return {
        "message": "Tarea eliminada",
        "task": serialize_task(task)
    }
