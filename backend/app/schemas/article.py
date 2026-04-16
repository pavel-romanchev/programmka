from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., min_length=1)
    play_id: Optional[int] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleResponse(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    content: str
    image_path: Optional[str] = None
    play_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleListItem(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    image_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedArticles(BaseModel):
    items: list[ArticleListItem]
    total: int
    page: int
    pages: int
