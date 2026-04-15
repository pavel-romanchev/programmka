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
        models = (
            self.db.query(PlayModel).filter(PlayModel.title.ilike(f"%{title}%")).all()
        )
        return [self._to_entity(m) for m in models]

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
