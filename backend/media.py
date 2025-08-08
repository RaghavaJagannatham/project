from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import os
import httpx
from models import Media
from database import get_db

router = APIRouter()

def require_admin(token: str = Header(...)):
    if token != "admin-token":
        raise HTTPException(status_code=403, detail="Not authorized")
    return True

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "media")
MEDIA_MAX_SIZE_MB = int(os.getenv("MEDIA_MAX_SIZE_MB", 5))

@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_media(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Invalid image type")
    if file.size and file.size > MEDIA_MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large")

    # Upload to Supabase Storage
    url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{file.filename}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": file.content_type,
    }
    file_bytes = await file.read()
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, content=file_bytes)
        if resp.status_code not in (200, 201):
            raise HTTPException(status_code=500, detail="Failed to upload to storage")
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{file.filename}"

    # Save to DB
    media = Media(filename=file.filename, url=public_url)
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return {"id": media.id, "url": media.url}

@router.get("/", dependencies=[Depends(require_admin)])
async def list_media(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Media).order_by(Media.uploaded_at.desc()))
    media = result.scalars().all()
    return [dict(id=m.id, filename=m.filename, url=m.url, uploaded_at=m.uploaded_at.isoformat()) for m in media]

@router.delete("/{media_id}", dependencies=[Depends(require_admin)])
async def delete_media(media_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    # Optionally delete from Supabase Storage too!
    await db.delete(media)
    await db.commit()
    return {"ok": True}
