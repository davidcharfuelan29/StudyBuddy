from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from datetime import datetime, timezone
import os

from .database import SessionLocal, engine, Base
from .models import Task, User, Session as SessionModel
from .schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    UserCreate, UserLogin, UserResponse,
    Token, SessionCreate, SessionResponse,
    StatsResponse,
)
from .auth import create_access_token, get_current_user

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CORS_ORIGINS = "http://127.0.0.1:8000,http://localhost:8000"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(",")
    if origin.strip()
]

app.mount("/frontend", StaticFiles(directory=os.path.join(BASE_DIR, "frontend")), name="frontend")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)

def ensure_missing_columns():
    inspector = inspect(engine)
    tables_info = {
        "tasks": {
            "due_date": "VARCHAR",
            "priority": "VARCHAR DEFAULT 'media'",
            "duration_minutes": "INTEGER DEFAULT 30",
            "completed": "BOOLEAN DEFAULT FALSE",
            "user_id": "INTEGER REFERENCES users(id)",
        },
        "sessions": {
            "user_id": "INTEGER REFERENCES users(id)",
            "duration_minutes": "INTEGER DEFAULT 25",
            "mode": "VARCHAR DEFAULT 'pomodoro'",
            "created_at": "VARCHAR",
        },
    }

    with engine.begin() as connection:
        for table_name, columns in tables_info.items():
            if table_name not in inspector.get_table_names():
                continue
            existing = {c["name"] for c in inspector.get_columns(table_name)}
            for col_name, definition in columns.items():
                if col_name not in existing:
                    connection.execute(
                        text(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {definition}")
                    )

# Parche temporal de columnas. Reemplazar por Alembic cuando el proyecto pase a producción.
try:
    ensure_missing_columns()
except Exception:
    pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return RedirectResponse(url="/frontend/index.html")


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    new_user = User(email=user.email, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuario creado"}


@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no existe")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    token = create_access_token({"user_id": db_user.id})

    return Token(
        access_token=token,
        user=UserResponse(id=db_user.id, email=db_user.email),
    )


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    return tasks


@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_task = Task(
        title=task.title,
        due_date=task.due_date,
        priority=task.priority,
        duration_minutes=task.duration_minutes,
        completed=task.completed,
        user_id=current_user.id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id,
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    updated_task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id,
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    update_data = updated_task.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id,
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    db.delete(task)
    db.commit()

    return {"message": "Tarea eliminada"}


@app.post("/sessions", response_model=SessionResponse)
def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc).isoformat()

    new_session = SessionModel(
        user_id=current_user.id,
        duration_minutes=session.duration_minutes,
        mode=session.mode,
        created_at=now,
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


@app.get("/sessions", response_model=list[SessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.user_id == current_user.id)
        .order_by(SessionModel.id.desc())
        .limit(50)
        .all()
    )
    return sessions


@app.get("/stats", response_model=StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.user_id == current_user.id)
        .all()
    )

    total_sessions = len(sessions)
    total_minutes = sum(s.duration_minutes for s in sessions)

    streak = calculate_streak(sessions)

    total_xp = total_sessions * 50
    xp = total_xp % 350
    level = (total_xp // 350) + 1

    return StatsResponse(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        current_streak=streak,
        xp=xp,
        level=level,
    )


def calculate_streak(sessions: list) -> int:
    if not sessions:
        return 0

    dates = set()
    for s in sessions:
        if s.created_at:
            day = s.created_at[:10]
            dates.add(day)

    if not dates:
        return 0

    sorted_dates = sorted(dates, reverse=True)
    streak = 1

    from datetime import date, timedelta

    today = date.today()

    if sorted_dates[0] < today.isoformat():
        last = date.fromisoformat(sorted_dates[0])
        if (today - last).days > 1:
            return 0

    for i in range(len(sorted_dates) - 1):
        current = date.fromisoformat(sorted_dates[i])
        previous = date.fromisoformat(sorted_dates[i + 1])
        if (current - previous).days == 1:
            streak += 1
        else:
            break

    return streak
