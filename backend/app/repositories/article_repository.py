from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.article import ArticleModel
from app.domain.entities import Article


class ArticleRepository:
    def __init__(self, db: Session):
        self.db = db

    def _to_entity(self, model: ArticleModel) -> Article:
        return Article(
            id=model.id,
            title=model.title,
            subtitle=model.subtitle,
            content=model.content,
            image_path=model.image_path,
            play_id=model.play_id,
            created_at=model.created_at,
        )

    def _to_model(self, entity: Article) -> ArticleModel:
        return ArticleModel(
            id=entity.id,
            title=entity.title,
            subtitle=entity.subtitle,
            content=entity.content,
            image_path=entity.image_path,
            play_id=entity.play_id,
            created_at=entity.created_at,
        )

    def get_paginated(self, page: int, per_page: int) -> tuple[list[Article], int]:
        query = self.db.query(ArticleModel).order_by(ArticleModel.created_at.desc())
        total = query.count()
        offset = (page - 1) * per_page
        models = query.offset(offset).limit(per_page).all()
        return [self._to_entity(m) for m in models], total

    def get_by_id(self, article_id: int) -> Optional[Article]:
        model = (
            self.db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
        )
        return self._to_entity(model) if model else None

    def create(self, article: Article) -> Article:
        model = self._to_model(article)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def update_image_path(self, article_id: int, image_path: str) -> Optional[Article]:
        model = (
            self.db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
        )
        if model:
            model.image_path = image_path
            self.db.commit()
            self.db.refresh(model)
            return self._to_entity(model)
        return None

    def update(self, article_id: int, article: Article) -> Optional[Article]:
        model = (
            self.db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
        )
        if not model:
            return None
        model.title = article.title
        model.subtitle = article.subtitle
        model.content = article.content
        model.play_id = article.play_id
        if article.image_path is not None:
            model.image_path = article.image_path
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def delete(self, article_id: int) -> bool:
        model = (
            self.db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
        )
        if not model:
            return False
        self.db.delete(model)
        self.db.commit()
        return True
