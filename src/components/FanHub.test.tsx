import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FanHub from './FanHub';

// Mock fetch
global.fetch = vi.fn() as any;

describe('FanHub component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat interface by default', () => {
    render(<FanHub />);
    expect(screen.getByPlaceholderText('Ask anything about the stadium...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument();
  });

  it('switches to map view when Map button is clicked', () => {
    render(<FanHub />);
    const mapButton = screen.getByRole('button', { name: /Map/i, hidden: true });
    fireEvent.click(mapButton);
    expect(screen.getByTestId('stadium-map-svg')).toBeInTheDocument();
  });

  it('sends a message and displays loading state', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Hello, fan!' })
    });

    render(<FanHub />);
    const input = screen.getByPlaceholderText('Ask anything about the stadium...');
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Where is the food?' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Where is the food?')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Hello, fan!')).toBeInTheDocument();
    });
  });
});
