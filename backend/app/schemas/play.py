from typing import Optional
from pydantic import BaseModel, Field


class PlayBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    director: str = Field(..., min_length=1, max_length=255)
    theater: str = Field(..., min_length=1, max_length=255)
    duration: int = Field(..., gt=0)
    annotation: str = Field(..., min_length=1)
    average_rating: float = Field(..., ge=1.0, le=10.0)
    actors: list[str] = Field(..., min_length=1)


class PlayCreate(PlayBase):
    pass


class PlayUpdate(PlayBase):
    pass


class PlayResponse(BaseModel):
    id: int
    title: str
    director: str
    theater: str
    duration: int
    annotation: str
    average_rating: float
    actors: list[str]
    image_path: Optional[str] = None

    class Config:
        from_attributes = True
