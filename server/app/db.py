# MongoDB driver
import motor.motor_asyncio

from app.models import Member

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
database = client.FERM
collection = database.queue

async def fetch_one_member (serial):
    document = await collection.find_one({"serial": serial})
    
    return document

async def fetch_all_members ():
    members = []
    cursor = collection.find({})
    async for document in cursor:
        members.append(Member(**document))
        
    return {"queue": members, "next_pos": members[-1].dict()["serial"]+1} if len(members) else {"queue": {"message": "empty queue!"}, "next_pos": 1}
        
async def add_member (member):
    res = await fetch_all_members()
    username = member["username"]
    serial = member["serial"] = res["next_pos"]
      
    document = await collection.find_one({"username": username})    
    if not document:
        await collection.insert_one(member)
    
        return {"message": f"successfully added {username} on {serial}!"}
    return False

async def update_member (serial, username, link):
    await collection.update_one({"serial": serial}, {"$set":{"username": username, "link": link}})
    document = await collection.find_one({"serial": serial})
    
    return document

async def remove_member (serial):
    res = await fetch_one_member(serial)
    await collection.delete_one({"serial": serial})

    return {"message": "successfully deleted member!"} if res else False

async def remove_all_members ():
    res = await fetch_all_members()
    await collection.delete_many({})
    
    return {"message": "successfully deleted all members!"} if res["next_pos"] != 1 else False