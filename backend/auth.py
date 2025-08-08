from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os
from passlib.hash import bcrypt
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

def verify_password(plain, hashed):
    return bcrypt.verify(plain, hashed)

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    if data.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Invalid credentials")
    if not verify_password(data.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=403, detail="Invalid credentials")
    # Dummy token (replace with JWT for more security if you want later)
    token = "admin-token"
    user = {"email": ADMIN_EMAIL, "role": "admin"}
    return {"token": token, "user": user}
