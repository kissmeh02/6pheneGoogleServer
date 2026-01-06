from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routers import materials, suppliers, runs, formulas, predictions

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="Graphene Composite Simulator API",
    version="1.0.0",
    description="Physics-based prediction engine for graphene composite properties",
    lifespan=lifespan
)

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(materials.router)
app.include_router(suppliers.router)
app.include_router(runs.router)
app.include_router(formulas.router)
app.include_router(predictions.router)

@app.get("/")
async def root():
    return {
        "message": "Graphene Composite Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "materials": "/api/materials",
            "suppliers": "/api/suppliers",
            "runs": "/api/runs",
            "formulas": "/api/formulas",
            "predictions": "/api/predictions"
        }
    }












