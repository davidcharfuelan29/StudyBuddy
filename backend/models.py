from sqlalchemy import Column, Integer, String
from .database import Base

# 🔹 MODELO TASK 
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)


# 🔹 MODELO USER 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)