import React from 'react';
import { render, screen } from '@testing-library/react';
import StadiumMap from './StadiumMap';

describe('StadiumMap component', () => {
  it('renders without crashing', () => {
    render(<StadiumMap />);
    expect(screen.getByText('Stadium Interactive Map')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<StadiumMap />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Concessions')).toBeInTheDocument();
    expect(screen.getByText('Restrooms')).toBeInTheDocument();
    expect(screen.getByText('Exits')).toBeInTheDocument();
  });
});
