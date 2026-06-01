from pydantic import BaseModel, EmailStr
from typing import Optional

# --- TASKS ---

class TaskCreate(BaseModel):
    title: str
    due_date: Optional[str] = None
    priority: str = "media"
    duration_minutes: int = 30
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    duration_minutes: Optional[int] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    due_date: Optional[str] = None
    priority: str
    duration_minutes: int
    completed: bool
    user_id: Optional[int] = None

    model_config = {"from_attributes": True}


# --- USERS ---

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    model_config = {"from_attributes": True}


# --- AUTH ---

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None


# --- SESSION ---

class SessionCreate(BaseModel):
    duration_minutes: int
    mode: str = "pomodoro"

class SessionResponse(BaseModel):
    id: int
    user_id: int
    duration_minutes: int
    mode: str
    created_at: str

    model_config = {"from_attributes": True}


# --- STATS ---

class StatsResponse(BaseModel):
    total_sessions: int
    total_minutes: int
    current_streak: int
    xp: int
    level: int
