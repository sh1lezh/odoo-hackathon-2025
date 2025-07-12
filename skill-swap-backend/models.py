from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    location = Column(String)
    profile_photo = Column(String)
    availability = Column(String)

class SkillSwapRequest(Base):
    __tablename__ = "skill_swap_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skills_offered = Column(String)
    skills_wanted = Column(String)
    message = Column(String)
    status = Column(String, default="Pending")
