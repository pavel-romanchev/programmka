from typing import Optional
from sqlalchemy.orm import Session

from app.repositories.play_repository import PlayRepository
from app.domain.entities import Play


class PlayService:
    def __init__(self, db: Session):
        self.repository = PlayRepository(db)

    def get_all_plays(self) -> list[Play]:
        return self.repository.get_all()

    def get_play_by_id(self, play_id: int) -> Optional[Play]:
        return self.repository.get_by_id(play_id)

    def search_plays(self, title: str) -> list[Play]:
        return self.repository.search_by_title(title)

    def create_play(
        self,
        title: str,
        director: str,
        theater: str,
        duration: int,
        annotation: str,
        average_rating: float,
        actors: list[str],
        image_path: Optional[str] = None,
    ) -> Play:
        play = Play(
            id=None,
            title=title,
            director=director,
            theater=theater,
            duration=duration,
            annotation=annotation,
            average_rating=average_rating,
            actors=actors,
            image_path=image_path,
        )
        return self.repository.create(play)

    def update_play_image(self, play_id: int, image_path: str) -> Optional[Play]:
        return self.repository.update_image_path(play_id, image_path)

    def update_play(
        self,
        play_id: int,
        title: str,
        director: str,
        theater: str,
        duration: int,
        annotation: str,
        average_rating: float,
        actors: list[str],
        image_path: Optional[str] = None,
    ) -> Optional[Play]:
        play = Play(
            id=play_id,
            title=title,
            director=director,
            theater=theater,
            duration=duration,
            annotation=annotation,
            average_rating=average_rating,
            actors=actors,
            image_path=image_path,
        )
        return self.repository.update(play_id, play)

    def delete_play(self, play_id: int) -> bool:
        return self.repository.delete(play_id)
