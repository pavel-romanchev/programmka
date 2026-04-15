import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.play import PlayResponse, PlayCreate
from app.services.play_service import PlayService
from app.config import IMAGES_DIR

router = APIRouter(prefix="/api/plays", tags=["plays"])


def _save_image(image: UploadFile) -> str:
    ext = os.path.splitext(image.filename or "image.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = IMAGES_DIR / filename

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    with open(filepath, "wb") as f:
        content = image.file.read()
        f.write(content)

    return f"/static/images/{filename}"


@router.get("/", response_model=list[PlayResponse])
def get_all_plays(db: Session = Depends(get_db)):
    service = PlayService(db)
    return service.get_all_plays()


@router.get("/search", response_model=list[PlayResponse])
def search_plays(title: str, db: Session = Depends(get_db)):
    service = PlayService(db)
    return service.search_plays(title)


@router.get("/{play_id}", response_model=PlayResponse)
def get_play(play_id: int, db: Session = Depends(get_db)):
    service = PlayService(db)
    play = service.get_play_by_id(play_id)
    if not play:
        raise HTTPException(status_code=404, detail="Play not found")
    return play


@router.post("/", response_model=PlayResponse)
async def create_play(
    title: str = Form(...),
    director: str = Form(...),
    theater: str = Form(...),
    duration: int = Form(...),
    annotation: str = Form(...),
    average_rating: float = Form(...),
    actors: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    service = PlayService(db)

    image_path = None
    if image and image.filename:
        image_path = _save_image(image)

    actors_list = [a.strip() for a in actors.split(",") if a.strip()]

    play = service.create_play(
        title=title,
        director=director,
        theater=theater,
        duration=duration,
        annotation=annotation,
        average_rating=average_rating,
        actors=actors_list,
        image_path=image_path,
    )

    return play
