from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

from .core.config import settings
from .models import queuer, admin, queue_settings, active_queuer
from .api.api_v1.router import router

# Main App Object
app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_str}/openapi.json"
)

# Backend cors origins
origins = [
    "https://www.upcomingartistradio.com",
    "https://upcomingartistradio.com",
    "http://localhost:3000"
]

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
            queuer.Queuer,
            queue_settings.QueueSettings,
            active_queuer.ActiveQueuer
        ]
    )
    print("""
        created database!      
    """)
    
# scheduled tasks
@app.on_event("startup")
@repeat_every(seconds=60*3, wait_first=True)
async def auto_hold():
    print("running...")
    res = await queuer.Queuer.find(queuer.Queuer.on_hold == False).to_list()
    
    if res != []:
        for q in res:
            if (datetime.utcnow() - q.refreshed_at).total_seconds() >= 60*60:
                await q.update({"$set": {"on_hold": True}})

# root path
@app.get("/")
def root():
    return {"message": "welcome to ferm's queue!"}

# including routers
app.include_router(router, prefix=settings.api_v1_str)