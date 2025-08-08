from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Chapter(Base):
    __tablename__ = "chapters"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)
    pages = relationship("Page", back_populates="chapter", cascade="all, delete")

class Page(Base):
    __tablename__ = "pages"
    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # store as MDX/Markdown
    order = Column(Integer, nullable=False, default=0)
    status = Column(String, default="draft")
    chapter = relationship("Chapter", back_populates="pages")

class Media(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    url = Column(String, nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now())
