import json
from typing import Optional
from sqlalchemy.orm import Session

from app.models.play import PlayModel
from app.domain.entities import Play


class PlayRepository:
    def __init__(self, db: Session):
        self.db = db

    def _to_entity(self, model: PlayModel) -> Play:
        return Play(
            id=model.id,
            title=model.title,
            director=model.director,
            theater=model.theater,
            duration=model.duration,
            annotation=model.annotation,
            average_rating=model.average_rating,
            actors=json.loads(model.actors) if model.actors else [],
            image_path=model.image_path,
        )

    def _to_model(self, entity: Play) -> PlayModel:
        return PlayModel(
            id=entity.id,
            title=entity.title,
            director=entity.director,
            theater=entity.theater,
            duration=entity.duration,
            annotation=entity.annotation,
            average_rating=entity.average_rating,
            actors=json.dumps(entity.actors, ensure_ascii=False),
            image_path=entity.image_path,
        )

    def get_all(self) -> list[Play]:
        models = self.db.query(PlayModel).all()
        return [self._to_entity(m) for m in models]

    def get_by_id(self, play_id: int) -> Optional[Play]:
        model = self.db.query(PlayModel).filter(PlayModel.id == play_id).first()
        return self._to_entity(model) if model else None

    def search_by_title(self, title: str) -> list[Play]:
        models = self.db.query(PlayModel).all()
        title_lower = title.lower()
        filtered = [m for m in models if title_lower in m.title.lower()]
        return [self._to_entity(m) for m in filtered]

    def create(self, play: Play) -> Play:
        model = self._to_model(play)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def update_image_path(self, play_id: int, image_path: str) -> Optional[Play]:
        model = self.db.query(PlayModel).filter(PlayModel.id == play_id).first()
        if model:
            model.image_path = image_path
            self.db.commit()
            self.db.refresh(model)
            return self._to_entity(model)
        return None

    def update(self, play_id: int, play: Play) -> Optional[Play]:
        model = self.db.query(PlayModel).filter(PlayModel.id == play_id).first()
        if not model:
            return None
        model.title = play.title
        model.director = play.director
        model.theater = play.theater
        model.duration = play.duration
        model.annotation = play.annotation
        model.average_rating = play.average_rating
        model.actors = json.dumps(play.actors, ensure_ascii=False)
        if play.image_path is not None:
            model.image_path = play.image_path
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def delete(self, play_id: int) -> bool:
        model = self.db.query(PlayModel).filter(PlayModel.id == play_id).first()
        if not model:
            return False
        self.db.delete(model)
        self.db.commit()
        return True
