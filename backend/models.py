from sqlalchemy import Boolean, Column, Integer, String
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


# 🔹 MODELO USER 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
