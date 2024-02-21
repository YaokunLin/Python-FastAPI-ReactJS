import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateBoatForm } from './CreateBoatForm';

describe('CreateBoatForm', () => {
  test('input updates on change and form submission', () => {
    const handleCreateBoat = jest.fn();
    const setNewBoatName = jest.fn();
    render(<CreateBoatForm newBoatName="" setNewBoatName={setNewBoatName} handleCreateBoat={handleCreateBoat} />);

    // Simulate user typing a new boat name
    fireEvent.change(screen.getByPlaceholderText('Enter new boat name'), {
      target: { value: 'Titanic' },
    });

    expect(setNewBoatName).toHaveBeenCalledWith('Titanic');

    // Simulate form submission
    fireEvent.submit(screen.getByRole('button'));

    expect(handleCreateBoat).toHaveBeenCalled();
  });
});
