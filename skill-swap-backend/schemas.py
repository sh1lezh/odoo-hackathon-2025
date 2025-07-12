from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    location: Optional[str] = None
    profile_photo: Optional[str] = None
    availability: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SkillSwapRequestCreate(BaseModel):
    skills_offered: str
    skills_wanted: str
    message: Optional[str] = None

class SkillSwapRequestResponse(BaseModel):
    id: int
    user_id: int
    skills_offered: str
    skills_wanted: str
    message: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
