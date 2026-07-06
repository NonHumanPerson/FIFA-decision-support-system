import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffDashboard from './StaffDashboard';

global.fetch = vi.fn() as any;

describe('StaffDashboard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default metrics', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('Venue Telemetry')).toBeInTheDocument();
  });

  it('generates insights when button is clicked', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ insights: 'Action Plan: 1. Deploy staff 2. Manage crowd' })
    });

    render(<StaffDashboard />);
    const generateBtn = screen.getByTestId('generate-action-plan-button');
    
    // Select an incident
    const incident = screen.getByText('Medical request at Section 120, Row 5.');
    fireEvent.click(incident);

    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
    });
    
    expect(await screen.findByText(/Deploy staff/i)).toBeInTheDocument();
  });
});
