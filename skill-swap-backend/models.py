from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    location = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)
    availability = Column(String, nullable=True)

class SkillSwapRequest(Base):
    __tablename__ = "skill_swap_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skills_offered = Column(String)
    skills_wanted = Column(String)
    message = Column(String, nullable=True)
    status = Column(String, default="Pending")
