import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

beforeEach(() => {
  fetch.resetMocks();
});

describe('BoatStatusBoard', () => {
  test('loads and displays boats', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { id: '1', name: 'Boat 1', status: 'Docked' },
      { id: '2', name: 'Boat 2', status: 'Outbound to Sea' }
    ]));

    render(<Board />);

    // Verify fetch was called
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/boats'));

    // Wait for boats to be displayed
    const dockedLane = await screen.findByText('Docked');
    const outboundLane = await screen.findByText('Outbound to Sea');

    expect(within(dockedLane.parentElement).getByText('Boat 1')).toBeInTheDocument();
    expect(within(outboundLane.parentElement).getByText('Boat 2')).toBeInTheDocument();
  });

  // Add more tests here for drag and drop, updating boat status, etc.
});
