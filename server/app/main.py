from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.models import queuer, admin 
from app.api.api_v1.router import router

# Main App Object
app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_str}/openapi.json"
)

# Backend cors origins
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware (
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# initialization
@app.on_event("startup")
async def app_init():
    print("""
        initializing crucial application services...
    """)
    
    db_client = AsyncIOMotorClient(settings.database_uri)
    
    await init_beanie(
        database=db_client.queue,
        document_models= [
            admin.Admin,
            queuer.Queuer
        ]
    )
    print("""
        created database!      
    """)

# root path
@app.get("/")
def root():
    return {"message": "welcome to ferm's queue!"}

# including routers
app.include_router(router, prefix=settings.api_v1_str)