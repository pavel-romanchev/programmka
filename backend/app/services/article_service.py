import math
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.repositories.article_repository import ArticleRepository
from app.domain.entities import Article


class ArticleService:
    def __init__(self, db: Session):
        self.repository = ArticleRepository(db)

    def get_articles_paginated(
        self, page: int, per_page: int
    ) -> tuple[list[Article], int, int]:
        articles, total = self.repository.get_paginated(page, per_page)
        pages = math.ceil(total / per_page) if total > 0 else 1
        return articles, total, pages

    def get_article_by_id(self, article_id: int) -> Optional[Article]:
        return self.repository.get_by_id(article_id)

    def create_article(
        self,
        title: str,
        content: str,
        subtitle: Optional[str] = None,
        play_id: Optional[int] = None,
        image_path: Optional[str] = None,
    ) -> Article:
        article = Article(
            id=None,
            title=title,
            subtitle=subtitle,
            content=content,
            image_path=image_path,
            play_id=play_id,
            created_at=datetime.utcnow(),
        )
        return self.repository.create(article)

    def update_article_image(
        self, article_id: int, image_path: str
    ) -> Optional[Article]:
        return self.repository.update_image_path(article_id, image_path)

    def update_article(
        self,
        article_id: int,
        title: str,
        content: str,
        subtitle: Optional[str] = None,
        play_id: Optional[int] = None,
        image_path: Optional[str] = None,
    ) -> Optional[Article]:
        existing = self.repository.get_by_id(article_id)
        if not existing:
            return None
        article = Article(
            id=article_id,
            title=title,
            subtitle=subtitle,
            content=content,
            image_path=image_path if image_path else existing.image_path,
            play_id=play_id,
            created_at=existing.created_at,
        )
        return self.repository.update(article_id, article)

    def delete_article(self, article_id: int) -> bool:
        return self.repository.delete(article_id)
