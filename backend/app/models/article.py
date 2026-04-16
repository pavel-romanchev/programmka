from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class ArticleModel(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    image_path = Column(String(500), nullable=True)
    play_id = Column(Integer, ForeignKey("plays.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
