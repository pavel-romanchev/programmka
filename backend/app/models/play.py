from sqlalchemy import Column, Integer, String, Float, Text

from app.database import Base


class PlayModel(Base):
    __tablename__ = "plays"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    director = Column(String(255), nullable=False)
    theater = Column(String(255), nullable=False)
    duration = Column(Integer, nullable=False)
    annotation = Column(Text, nullable=False)
    average_rating = Column(Float, nullable=False)
    actors = Column(Text, nullable=False)
    image_path = Column(String(500), nullable=True)
