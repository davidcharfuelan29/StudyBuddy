from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

from .database import SessionLocal, engine
from .models import Task, User, Session as SessionModel, UserSettings
from .schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    UserCreate, UserLogin, UserResponse,
    Token, SessionCreate, SessionResponse,
    StatsResponse, SettingsResponse, SettingsUpdate,
)
from .auth import create_access_token, get_current_user

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
@limiter.limit("5/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    new_user = User(email=user.email, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuario creado"}


@app.post("/login", response_model=Token)
@limiter.limit("10/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
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
    new_session = SessionModel(
        user_id=current_user.id,
        duration_minutes=session.duration_minutes,
        mode=session.mode,
        task_id=session.task_id,
        task_title=session.task_title,
        task_completed=session.task_completed,
        away_minutes=session.away_minutes,
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
        .filter(SessionModel.user_id == current_user.id, SessionModel.mode == 'pomodoro')
        .all()
    )

    total_sessions = len(sessions)
    total_minutes = sum(s.duration_minutes for s in sessions)

    light_sessions = sum(1 for s in sessions if (s.duration_minutes or 0) <= 15)
    deep_sessions = total_sessions - light_sessions

    streak = calculate_streak(sessions)

    total_xp = total_minutes
    xp = total_xp % 350
    level = (total_xp // 350) + 1

    return StatsResponse(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        current_streak=streak,
        xp=xp,
        level=level,
        light_sessions=light_sessions,
        deep_sessions=deep_sessions,
    )


@app.get("/settings", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        return SettingsResponse(data={})
    return SettingsResponse(data=settings.data)


@app.put("/settings", response_model=SettingsResponse)
def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id, data=settings_data.data)
        db.add(settings)
    else:
        settings.data = settings_data.data
    db.commit()
    db.refresh(settings)
    return SettingsResponse(data=settings.data)


def calculate_streak(sessions: list) -> int:
    if not sessions:
        return 0

    dates = set()
    for s in sessions:
        if s.created_at:
            dates.add(s.created_at.date())

    if not dates:
        return 0

    sorted_dates = sorted(dates, reverse=True)
    streak = 1

    today = datetime.now(timezone.utc).date()

    if sorted_dates[0] < today:
        last = sorted_dates[0]
        if (today - last).days > 1:
            return 0

    for i in range(len(sorted_dates) - 1):
        current = sorted_dates[i]
        previous = sorted_dates[i + 1]
        if (current - previous).days == 1:
            streak += 1
        else:
            break

    return streak
