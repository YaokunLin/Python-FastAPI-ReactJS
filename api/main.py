from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# 🔑 Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Boat(BaseModel):
    id: str
    name: str
    status: str

class UpdateBoatStatus(BaseModel):
    status: str

boats = [
  { "id": "1", "name": "Sailor's Delight", "status": "Docked" },
  #{ "id": "2", "name": "Wave Rider", "status": "Outbound to Sea" },
  #{ "id": "3", "name": "Harbor Mistress", "status": "Inbound to Harbor" },
  #{ "id": "4", "name": "The Fixer-Upper", "status": "Maintenance" },
]

@app.get("/boats", response_model=List[Boat])
async def get_boats():
    return boats

@app.get("/boats/{boat_id}", response_model=Boat)
def get_boat_by_id(boat_id: str):
    for boat in boats:
        if boat["id"] == boat_id:
            return boat
    raise HTTPException(status_code=404, detail="Boat not found")

@app.post("/boats", response_model=Boat)
def create_boat(boat: Boat):
    boats.append(boat.dict())
    return boat

@app.put("/boats/{boat_id}", response_model=Boat)
def update_boat(boat_id: str, update_data: UpdateBoatStatus):
    for boat in boats:
        if boat["id"] == boat_id:
            boat["status"] = update_data.status  # Update the status based on the request body
            return boat
    raise HTTPException(status_code=404, detail="Boat not found")

@app.delete("/boats/{boat_id}")
def delete_boat(boat_id: str):
    for index, boat in enumerate(boats):
        if boat["id"] == boat_id:
            del boats[index]
            return {"message": "Boat deleted successfully"}
    raise HTTPException(status_code=404, detail="Boat not found")
