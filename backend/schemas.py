from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime

# --- TASKS ---

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    due_date: Optional[str] = None
    priority: Literal["alta", "media", "baja"] = "media"
    duration_minutes: int = Field(default=30, ge=5, le=480)
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=180)
    due_date: Optional[str] = None
    priority: Optional[Literal["alta", "media", "baja"]] = None
    duration_minutes: Optional[int] = Field(default=None, ge=5, le=480)
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
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

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
    duration_minutes: int = Field(ge=1, le=240)
    mode: Literal["pomodoro", "break", "short-break", "long-break"] = "pomodoro"
    task_id: Optional[int] = None
    task_title: Optional[str] = None
    task_completed: bool = False
    away_minutes: int = 0

class SessionResponse(BaseModel):
    id: int
    user_id: int
    duration_minutes: int
    mode: str
    task_id: Optional[int] = None
    task_title: Optional[str] = None
    task_completed: bool = False
    away_minutes: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


# --- STATS ---

class StatsResponse(BaseModel):
    total_sessions: int
    total_minutes: int
    current_streak: int
    xp: int
    level: int
    light_sessions: int = 0
    deep_sessions: int = 0


# --- SETTINGS ---

class SettingsResponse(BaseModel):
    data: dict

    model_config = {"from_attributes": True}


class SettingsUpdate(BaseModel):
    data: dict
