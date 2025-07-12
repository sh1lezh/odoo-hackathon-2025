from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
import models
import schemas
import database

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Load from environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Simple authentication dependency (replace with JWT/OAuth in production)
def get_current_user_id(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        user_id = int(authorization)  # Replace with proper token decoding
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return user_id
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# Create tables
models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "Skill Swap API is running!"}

@app.post("/register/")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(**user.dict(exclude={"password"}), password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully", "user_id": db_user.id}

@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": db_user.id}

@app.post("/skill-swap-request/")
def create_skill_swap_request(
    request: schemas.SkillSwapRequestCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    if not db.query(models.User).filter(models.User.id == user_id).first():
        raise HTTPException(status_code=404, detail="User not found")
    db_request = models.SkillSwapRequest(**request.dict(), user_id=user_id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return {"message": "Skill swap request created", "request_id": db_request.id}

@app.get("/skill-swap-requests/")
def get_skill_swap_requests(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    requests = db.query(models.SkillSwapRequest).all()
    return [schemas.SkillSwapRequestResponse.model_validate(request) for request in requests]

@app.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user_id)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
