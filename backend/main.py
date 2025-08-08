from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from crud import router as crud_router
from media import router as media_router
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only, restrict in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(crud_router, prefix="/api/content")
app.include_router(media_router, prefix="/api/media")

@app.get("/")
def root():
    return {"msg": "Backend up!"}
