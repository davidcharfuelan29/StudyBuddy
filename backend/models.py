from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

# 🔹 MODELO TASK
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    due_date = Column(String, nullable=True)
    priority = Column(String, default="media")
    duration_minutes = Column(Integer, default=30)
    completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)


# 🔹 MODELO USER
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    tasks = relationship("Task", backref="owner")


# 🔹 MODELO SESSION (temporizador Pomodoro)
class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_minutes = Column(Integer, default=25)
    mode = Column(String, default="pomodoro")
    created_at = Column(String, default=None)
