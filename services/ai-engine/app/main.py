from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="THREATATLAS AI Engine",
    description="AI-powered Cyber Threat Intelligence Engine",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to THREATATLAS AI Engine",
        "status": "running",
        "service": "AI Engine"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "threatatlas-ai-engine",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/v1/ai/status")
def ai_status():
    return {
        "ai_engine": "operational",
        "machine_learning": "not_initialized",
        "threat_classification": "not_initialized",
        "anomaly_detection": "not_initialized"
    }
