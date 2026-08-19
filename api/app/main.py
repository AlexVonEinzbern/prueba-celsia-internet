from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import Base, engine
from app.routers.clientes import router as clientes_router
from app.routers.servicios import router as servicios_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Celsia API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(clientes_router, prefix="/api")
app.include_router(servicios_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Celsia API"}


@app.get("/health")
async def health():
    return {"status": "ok"}
