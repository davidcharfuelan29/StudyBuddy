from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os
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

@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return [{"id": t.id, "title": t.title} for t in tasks]


@app.post("/tasks")
def create_task(task: dict):
    db = SessionLocal()
    new_task = Task(title=task["title"])
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    db.close()

    return {
        "message": "Tarea creada",
        "task": {"id": new_task.id, "title": new_task.title}
    }


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    db.close()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return {"id": task.id, "title": task.title}


@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: dict):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    task.title = updated_task["title"]
    db.commit()
    db.refresh(task)
    db.close()

    return {
        "message": "Tarea actualizada",
        "task": {"id": task.id, "title": task.title}
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
        "task": {"id": task.id, "title": task.title}
    }