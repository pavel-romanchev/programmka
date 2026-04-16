from typing import Optional
from pydantic import BaseModel, Field


class ActorEntry(BaseModel):
    role: str = Field(default="", min_length=0)
    actor: str = Field(..., min_length=1)


class PlayBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    director: str = Field(..., min_length=1, max_length=255)
    theater: str = Field(..., min_length=1, max_length=255)
    duration: int = Field(..., gt=0)
    annotation: str = Field(..., min_length=1)
    average_rating: float = Field(..., ge=1.0, le=10.0)
    actors: list[ActorEntry] = Field(..., min_length=0)


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
    actors: list[ActorEntry]
    image_path: Optional[str] = None

    class Config:
        from_attributes = True
