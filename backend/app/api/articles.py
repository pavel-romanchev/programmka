import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.article import (
    ArticleResponse,
    ArticleCreate,
    ArticleListItem,
    PaginatedArticles,
)
from app.services.article_service import ArticleService
from app.config import IMAGES_DIR, STATIC_DIR

router = APIRouter(prefix="/api/articles", tags=["articles"])

PER_PAGE = 6


def _save_image(image: UploadFile) -> str:
    ext = os.path.splitext(image.filename or "image.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = IMAGES_DIR / filename

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    with open(filepath, "wb") as f:
        content = image.file.read()
        f.write(content)

    return f"/static/images/{filename}"


def _delete_image(image_path: str) -> bool:
    if not image_path:
        return False
    try:
        full_path = STATIC_DIR / image_path.replace("/static/", "")
        if full_path.exists():
            os.remove(full_path)
            return True
    except Exception:
        pass
    return False


@router.get("/", response_model=PaginatedArticles)
def get_articles(
    page: int = 1,
    db: Session = Depends(get_db),
):
    service = ArticleService(db)
    articles, total, pages = service.get_articles_paginated(page, PER_PAGE)
    return PaginatedArticles(
        items=[ArticleListItem.model_validate(a) for a in articles],
        total=total,
        page=page,
        pages=pages,
    )


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    service = ArticleService(db)
    article = service.get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/", response_model=ArticleResponse)
async def create_article(
    title: str = Form(...),
    subtitle: Optional[str] = Form(None),
    content: str = Form(...),
    play_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    service = ArticleService(db)

    image_path = None
    if image and image.filename:
        image_path = _save_image(image)

    article = service.create_article(
        title=title,
        subtitle=subtitle,
        content=content,
        play_id=play_id,
        image_path=image_path,
    )

    return article


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: int,
    title: str = Form(...),
    subtitle: Optional[str] = Form(None),
    content: str = Form(...),
    play_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    service = ArticleService(db)

    existing = service.get_article_by_id(article_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")

    image_path = existing.image_path
    if image and image.filename:
        if image_path:
            _delete_image(image_path)
        image_path = _save_image(image)

    article = service.update_article(
        article_id=article_id,
        title=title,
        subtitle=subtitle,
        content=content,
        play_id=play_id,
        image_path=image_path,
    )

    return article


@router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    service = ArticleService(db)

    article = service.get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    if article.image_path:
        _delete_image(article.image_path)

    deleted = service.delete_article(article_id)
    if not deleted:
        raise HTTPException(status_code=500, detail="Failed to delete article")

    return {"status": "deleted", "id": article_id}
