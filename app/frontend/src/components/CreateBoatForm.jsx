export function CreateBoatForm({ newBoatName, setNewBoatName, handleCreateBoat }) {
  return (
    <form onSubmit={handleCreateBoat}>
      <input
        type="text"
        value={newBoatName}
        onChange={(e) => setNewBoatName(e.target.value)}
        placeholder="Enter new boat name"
        required
        id="boat-name"
      />
      <button 
        type="submit"
        id="create-button"
        >
          Create
      </button>
    </form>
  );
}
