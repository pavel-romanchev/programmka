from dataclasses import dataclass
from typing import Optional, Any
from datetime import datetime


@dataclass
class Play:
    id: Optional[int]
    title: str
    director: str
    theater: str
    duration: int
    annotation: str
    average_rating: float
    actors: list[dict[str, str]]
    image_path: Optional[str]


@dataclass
class Article:
    id: Optional[int]
    title: str
    subtitle: Optional[str]
    content: str
    image_path: Optional[str]
    play_id: Optional[int]
    created_at: datetime
