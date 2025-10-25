# app.py
from fastapi import FastAPI
from api.routes_report import router as report_router
from utils.logger import get_logger
from fastapi.middleware.cors import CORSMiddleware

logger = get_logger("app")
app = FastAPI(title="LocalGov Connect Backend (FastAPI)")

# CORS: allow local dev; change origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(report_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
