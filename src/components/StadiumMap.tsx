import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Amenity {
  id: string;
  type: 'concession' | 'restroom' | 'exit';
  x: number;
  y: number;
  label: string;
}

const amenities: Amenity[] = [
  { id: 'c1', type: 'concession', x: 150, y: 100, label: 'Burger Stand' },
  { id: 'c2', type: 'concession', x: 650, y: 100, label: 'Pizza' },
  { id: 'c3', type: 'concession', x: 400, y: 450, label: 'Drinks' },
  { id: 'r1', type: 'restroom', x: 250, y: 80, label: 'Restroom North' },
  { id: 'r2', type: 'restroom', x: 550, y: 80, label: 'Restroom North' },
  { id: 'r3', type: 'restroom', x: 300, y: 470, label: 'Restroom South' },
  { id: 'r4', type: 'restroom', x: 500, y: 470, label: 'Restroom South' },
  { id: 'e1', type: 'exit', x: 50, y: 275, label: 'Exit West' },
  { id: 'e2', type: 'exit', x: 750, y: 275, label: 'Exit East' },
  { id: 'e3', type: 'exit', x: 400, y: 50, label: 'Exit North' },
  { id: 'e4', type: 'exit', x: 400, y: 500, label: 'Exit South' },
];

export default React.memo(function StadiumMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeFilter, setActiveFilter] = useState<Amenity['type'] | 'all'>('all');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 550;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Prevent recreation
    if (!svg.select('.stadium').empty()) return;

    // Draw Stadium Outline
    const stadiumGroup = svg.append('g').attr('class', 'stadium');

    // Outer boundary
    stadiumGroup.append('rect')
      .attr('x', 50)
      .attr('y', 50)
      .attr('width', 700)
      .attr('height', 450)
      .attr('rx', 225)
      .attr('ry', 225)
      .attr('fill', '#e2e8f0') // Tailwind slate-200
      .attr('stroke', '#94a3b8') // Tailwind slate-400
      .attr('stroke-width', 4)
      .attr('class', 'dark:fill-slate-800 dark:stroke-slate-600');

    // Inner pitch
    stadiumGroup.append('rect')
      .attr('x', 200)
      .attr('y', 150)
      .attr('width', 400)
      .attr('height', 250)
      .attr('rx', 20)
      .attr('ry', 20)
      .attr('fill', '#4ade80') // Tailwind green-400
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Pitch center line
    stadiumGroup.append('line')
      .attr('x1', 400)
      .attr('y1', 150)
      .attr('x2', 400)
      .attr('y2', 400)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Center circle
    stadiumGroup.append('circle')
      .attr('cx', 400)
      .attr('cy', 275)
      .attr('r', 40)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Draw amenities
    const tooltip = d3.select('body').append('div')
      .attr('class', 'absolute hidden bg-slate-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none z-50 stadium-map-tooltip')
      .style('opacity', 0)
      .attr('role', 'tooltip');

    const amenityGroup = svg.append('g').attr('class', 'amenities');

    const nodes = amenityGroup.selectAll('.amenity')
      .data(amenities, (d: any) => (d as Amenity).id)
      .enter()
      .append('g')
      .attr('class', 'amenity')
      .attr('data-type', (d: any) => (d as Amenity).type)
      .attr('transform', (d: any) => `translate(${(d as Amenity).x}, ${(d as Amenity).y})`)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', 18);
        
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html((d as Amenity).label)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .classed('hidden', false);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', 14);
        
        tooltip.transition().duration(500).style('opacity', 0)
          .on('end', () => tooltip.classed('hidden', true));
      });

    // Color logic
    const getColor = (type: string) => {
      switch(type) {
        case 'concession': return '#f59e0b'; // amber-500
        case 'restroom': return '#3b82f6'; // blue-500
        case 'exit': return '#ef4444'; // red-500
        default: return '#94a3b8';
      }
    };

    const getIcon = (type: string) => {
      switch(type) {
        case 'concession': return '🍔';
        case 'restroom': return '🚻';
        case 'exit': return '🚪';
        default: return '📍';
      }
    };

    nodes.append('circle')
      .attr('r', 14)
      .attr('fill', (d: any) => getColor((d as Amenity).type))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('box-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)');

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '14px')
      .text((d: any) => getIcon((d as Amenity).type));

    return () => {
      d3.selectAll('.stadium-map-tooltip').remove();
    };

  }, []); // Run only once

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll('.amenity').style('display', function(this: SVGElement) {
      const type = this.getAttribute('data-type');
      return (activeFilter === 'all' || type === activeFilter) ? null : 'none';
    });
  }, [activeFilter]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
        <h3 className="font-semibold text-gray-800 dark:text-white">Stadium Interactive Map</h3>
        <div className="flex gap-2" role="group" aria-label="Map filters">
          <button 
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeFilter === 'all' ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('concession')}
            aria-pressed={activeFilter === 'concession'}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeFilter === 'concession' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'}`}
          >
            Concessions
          </button>
          <button 
            onClick={() => setActiveFilter('restroom')}
            aria-pressed={activeFilter === 'restroom'}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeFilter === 'restroom' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'}`}
          >
            Restrooms
          </button>
          <button 
            onClick={() => setActiveFilter('exit')}
            aria-pressed={activeFilter === 'exit'}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeFilter === 'exit' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'}`}
          >
            Exits
          </button>
        </div>
      </div>
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center p-4">
        <svg 
          ref={svgRef} 
          className="max-w-full max-h-full drop-shadow-sm"
          role="img"
          aria-label="Interactive map of the stadium"
          data-testid="stadium-map-svg"
        ></svg>
      </div>
    </div>
  );
});
