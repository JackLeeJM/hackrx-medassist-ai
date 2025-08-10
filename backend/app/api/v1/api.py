from fastapi import APIRouter
from app.api.v1.endpoints import health, patients, services


api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
