import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders Fan Hub by default', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Fan Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Command Center/i })).toBeInTheDocument();
    expect(screen.getByText('World Cup 2026')).toBeInTheDocument();
  });

  it('switches to Staff Dashboard when clicked', async () => {
    render(<App />);
    const staffButton = screen.getByRole('button', { name: /Command Center/i });
    fireEvent.click(staffButton);
    
    expect(await screen.findByText('Venue Telemetry')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    render(<App />);
    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
