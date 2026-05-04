from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, engine
from .models import Task, Base

app = FastAPI()

# Crear tablas
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home
@app.get("/")
def home():
    return {"message": "StudyBuddy API funcionando"}


# Obtener tareas
@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return [{"id": t.id, "title": t.title} for t in tasks]


# Crear tarea
@app.post("/tasks")
def create_task(task: dict):
    db = SessionLocal()
    new_task = Task(title=task["title"])
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    db.close()
    return {"message": "Tarea creada", "task": {"id": new_task.id, "title": new_task.title}}


# Obtener tarea por ID
@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    db.close()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return {"id": task.id, "title": task.title}


# Actualizar tarea
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

    return {"message": "Tarea actualizada", "task": {"id": task.id, "title": task.title}}


# Eliminar tarea
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

    return {"message": "Tarea eliminada", "task": {"id": task.id, "title": task.title}}