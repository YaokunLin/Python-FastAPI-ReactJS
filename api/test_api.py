import requests

BASE_URL = "http://127.0.0.1:8080"  # Update this if your app runs on a different host or port

def test_get_boats():
    response = requests.get(f"{BASE_URL}/boats")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_boat_by_id():
    # Assuming a boat with ID "1" exists
    response = requests.get(f"{BASE_URL}/boats/1")
    assert response.status_code == 200
    assert response.json()["id"] == "1"

def test_create_boat():
    new_boat = {
        "id": "5",
        "name": "Sea Explorer",
        "status": "Docked"
    }
    response = requests.post(f"{BASE_URL}/boats", json=new_boat)
    assert response.status_code == 200
    assert response.json()["id"] == "5"

def test_update_boat():
    updated_status = {
        "status": "Maintenance"
    }
    # Assuming a boat with ID "1" exists and can be updated
    response = requests.put(f"{BASE_URL}/boats/1", json=updated_status)
    assert response.status_code == 200
    assert response.json()["status"] == "Maintenance"

def test_delete_boat():
    # You might want to create a boat specifically for this test, then delete it
    # Assuming a boat with ID "5" exists and can be deleted
    response = requests.delete(f"{BASE_URL}/boats/5")
    assert response.status_code == 200
    assert response.json() == {"message": "Boat deleted successfully"}
