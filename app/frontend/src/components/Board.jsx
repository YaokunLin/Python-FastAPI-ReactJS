import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { CreateBoatForm } from './CreateBoatForm';

const BoatList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Swimlane = styled.div`
  margin: 8px;
  text-align: center;
  border: 1px solid lightgrey;
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  background-color: ${(props) => (props.isDraggingOver ? 'lightblue' : 'white')};
  @media (min-width: 768px) {
    width: 24%;
    min-height: 500px;
  }
`;

const Container = styled.div`
  position: relative;
  padding: 8px;
  padding-right: 24px;
  margin: 8px;
  text-align: center;
  border-radius: 10px;
  //border: 1px solid green;
  font-size: 0.9rem;
  background-image: url('/boat-icon.png'); 
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: center; 
  height: 50px; // Adjust height as necessary
  width: 80%; // Adjust width as necessary
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;



const DeleteButton = styled.div`
  position: absolute;
  top: 0px; // Adjust top positioning for better alignment
  right: 100px; // Adjust right positioning for better alignment
  cursor: pointer;
  color: red;
  font-weight: bold;
  padding: 2px 4px; // Adjust padding for better visibility and clickability
  user-select: none;
  background: white; // Optional: add a background to improve visibility
  border-radius: 50%; // Optional: make the button circular for a nicer look
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10px; // Define width and height to ensure a square shape
  height: 15px;
  font-size: 8px; 
  border: 1px solid red;
`;


const baseUrl = process.env.REACT_APP_ENVIRONMENT === "prod" ? "" : "http://localhost:8080";

async function fetchBoats() {
  const response = await fetch(`${baseUrl}/boats`);
  const data = await response.json();
  return data || [];
}

async function updateBoatStatus(boatId, newStatus) {
  await fetch(`${baseUrl}/boats/${boatId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });
}

async function deleteBoat(boatId) {
  await fetch(`${baseUrl}/boats/${boatId}`, {
    method: 'DELETE',
  });
}

function BoatStatusBoard() {
  const [boats, setBoats] = useState([]);
  const [newBoatName, setNewBoatName] = useState("");

  useEffect(() => {
    fetchBoats().then(setBoats);
  }, []);

  const handleCreateBoat = async (e) => {
    e.preventDefault();
    const newBoat = { name: newBoatName, status: "Docked", id: boats.length + 1 };
    await fetch(`${baseUrl}/boats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBoat),
    });
    setNewBoatName("");
    fetchBoats().then(setBoats);
  };

  const handleDeleteBoat = async (boatId) => {
    try {
      await deleteBoat(boatId);
      const updatedBoats = boats.filter(boat => boat.id !== boatId);
      setBoats(updatedBoats);
    } catch (error) {
      console.error('Failed to delete boat', error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
  
    const newBoats = [...boats];
    const boatIndex = boats.findIndex(boat => boat.id.toString() === draggableId);
    const draggedBoat = newBoats[boatIndex];
    newBoats.splice(boatIndex, 1);
    newBoats.splice(destination.index, 0, { ...draggedBoat, status: destination.droppableId });
  
    setBoats(newBoats);
  
    try {
      await updateBoatStatus(draggableId, destination.droppableId);
    } catch (error) {
      console.error('Failed to update boat status', error);
      fetchBoats().then(setBoats);
    }
  };

  const swimlanes = ['Docked', 'Outbound to Sea', 'Inbound to Harbor', 'Maintenance'];

  return (
    <>
      <CreateBoatForm
        newBoatName={newBoatName}
        setNewBoatName={setNewBoatName}
        handleCreateBoat={handleCreateBoat}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <BoatList>
          {swimlanes.map((lane) => (
            <Droppable key={lane} droppableId={lane}>
              {(provided, snapshot) => (
                <Swimlane
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <h4>{lane}</h4>
                  {boats.filter(boat => boat.status === lane).map((boat, index) => (
                    <Draggable key={boat.id} draggableId={boat.id.toString()} index={index}>
                      {(provided) => (
                        <Container
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {boat.name}
                          <DeleteButton onClick={() => handleDeleteBoat(boat.id)}>X</DeleteButton>
                        </Container>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Swimlane>
              )}
            </Droppable>
          ))}
        </BoatList>
      </DragDropContext>
    </>
  );
}

export default BoatStatusBoard;
