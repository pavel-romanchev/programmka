from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import DATABASE_PATH, STATIC_DIR, IMAGES_DIR
from app.database import engine, Base
from app.api.plays import router as plays_router
from app.api.articles import router as articles_router
from app.models.article import ArticleModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="Theater Catalog",
    description="API for theater plays catalog",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.include_router(plays_router)
app.include_router(articles_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
