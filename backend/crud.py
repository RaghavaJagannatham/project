from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Chapter, Page
from database import get_db

router = APIRouter()

def require_admin(token: str = Header(...)):
    # Simple admin check for demo (replace with JWT in prod)
    if token != "admin-token":
        raise HTTPException(status_code=403, detail="Not authorized")
    return True

# --- Chapters ---

@router.get("/chapters")
async def list_chapters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chapter).order_by(Chapter.order))
    chapters = result.scalars().all()
    return [dict(id=c.id, title=c.title, order=c.order) for c in chapters]

@router.post("/chapters", dependencies=[Depends(require_admin)])
async def create_chapter(data: dict, db: AsyncSession = Depends(get_db)):
    chapter = Chapter(title=data["title"], order=data.get("order", 0))
    db.add(chapter)
    await db.commit()
    await db.refresh(chapter)
    return dict(id=chapter.id, title=chapter.title, order=chapter.order)

@router.put("/chapters/{chapter_id}", dependencies=[Depends(require_admin)])
async def update_chapter(chapter_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chapter).where(Chapter.id == chapter_id))
    chapter = result.scalar_one_or_none()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    chapter.title = data.get("title", chapter.title)
    chapter.order = data.get("order", chapter.order)
    await db.commit()
    return {"ok": True}

@router.delete("/chapters/{chapter_id}", dependencies=[Depends(require_admin)])
async def delete_chapter(chapter_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chapter).where(Chapter.id == chapter_id))
    chapter = result.scalar_one_or_none()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    await db.delete(chapter)
    await db.commit()
    return {"ok": True}

# --- Pages ---

@router.get("/chapters/{chapter_id}/pages")
async def list_pages(chapter_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.chapter_id == chapter_id).order_by(Page.order))
    pages = result.scalars().all()
    return [dict(id=p.id, title=p.title, content=p.content, order=p.order, status=p.status) for p in pages]

@router.post("/chapters/{chapter_id}/pages", dependencies=[Depends(require_admin)])
async def create_page(chapter_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    page = Page(chapter_id=chapter_id, title=data["title"], content=data["content"], order=data.get("order", 0), status=data.get("status", "draft"))
    db.add(page)
    await db.commit()
    await db.refresh(page)
    return dict(id=page.id, title=page.title, content=page.content, order=page.order, status=page.status)

@router.put("/pages/{page_id}", dependencies=[Depends(require_admin)])
async def update_page(page_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.id == page_id))
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    page.title = data.get("title", page.title)
    page.content = data.get("content", page.content)
    page.order = data.get("order", page.order)
    page.status = data.get("status", page.status)
    await db.commit()
    return {"ok": True}

@router.delete("/pages/{page_id}", dependencies=[Depends(require_admin)])
async def delete_page(page_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.id == page_id))
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    await db.delete(page)
    await db.commit()
    return {"ok": True}
