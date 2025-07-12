from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import database

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://skill-swap-app-omega.vercel.app/"],  # Adjust based on your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = next(database.get_db())
    try:
        yield db
    finally:
        db.close()

# Create tables
models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "Skill Swap API is running!"}

@app.post("/register/")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully", "user_id": db_user.id}

@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": db_user.id}

@app.post("/skill-swap-request/")
def create_skill_swap_request(request: schemas.SkillSwapRequestCreate, db: Session = Depends(get_db)):
    db_request = models.SkillSwapRequest(**request.dict(), user_id=1)  # Replace 1 with authenticated user_id
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return {"message": "Skill swap request created", "request_id": db_request.id}

@app.get("/skill-swap-requests/")
def get_skill_swap_requests(db: Session = Depends(get_db)):
    requests = db.query(models.SkillSwapRequest).all()
    return [schemas.SkillSwapRequestResponse.model_validate(request) for request in requests]

@app.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
