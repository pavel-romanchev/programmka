from dataclasses import dataclass
from typing import Optional, Any


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
