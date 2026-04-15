from dataclasses import dataclass
from typing import Optional


@dataclass
class Play:
    id: Optional[int]
    title: str
    director: str
    theater: str
    duration: int
    annotation: str
    average_rating: float
    actors: list[str]
    image_path: Optional[str]
