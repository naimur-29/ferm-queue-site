from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import Member, Member_without_serial

# Main App Object
app = FastAPI()

# Import all functions from database (db.py)
from app.db import (
    fetch_one_member,
    fetch_all_members,
    add_member,
    update_member,
    remove_member,
    remove_all_members
)

origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

app.add_middleware (
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# root path
@app.get("/")
def root():
    return {"message": "welcome to ferm's queue!"}

@app.get("/api/queue")
async def get_members():
    res = await fetch_all_members()
    
    return res["queue"]

@app.get("/api/queue{serial}", response_model=Member)
async def get_member_by_serial(serial):
    try:
        serial = int(serial)
        res = await fetch_one_member(serial)
        
        if res:
            return res
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")
    except:
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")

@app.post("/api/queue")
async def create_member(member: Member_without_serial):
    res = await add_member(member.dict())
    
    if res:
        return res
    raise HTTPException(status_code=400, detail="bad request or already on the queue!")
        
@app.put("/api/queue{serial}", response_model=Member)
async def put_member_by_serial(serial, member: Member_without_serial):
    try:
        serial = int(serial)
        res = await update_member(serial, member.username, member.link)
        
        if res:
            return res
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")
    except:
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")

@app.delete("/api/queue{serial}")
async def delete_member(serial):
    try:
        serial = int(serial)
        res = await remove_member(serial)
        
        if res:
            return res
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")
    except:
        raise HTTPException(status_code=404, detail=f"no member with serial: {serial}")
    
@app.delete("/api/queue")
async def delete_all_members():
    res = await remove_all_members()
    
    if res:
        return res
    raise HTTPException(status_code=404, detail="no members found!")