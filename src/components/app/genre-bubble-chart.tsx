import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import type { Genre } from '../../types/anime';

interface GenreBubbleChartProps {
  genres: Genre[];
  width?: number;
  height?: number;
}

export function GenreBubbleChart({
  genres,
  width = 800,
  height = 600,
}: GenreBubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current || genres.length === 0) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Set up SVG
    svg.attr('width', width).attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for force simulation
    const data = genres.map((genre) => {
      const count = genre.count || 100; // Default count if not provided
      return {
        id: genre.mal_id,
        name: genre.name,
        count,
        radius: Math.sqrt(count) * 2 + 20, // Scale radius based on count
      };
    });

    // Create color scale
    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0, genres.length - 1]);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '8px 12px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', '1000');

    // Create force simulation
    const simulation = d3
      .forceSimulation(data as d3.SimulationNodeDatum[])
      .force('x', d3.forceX(chartWidth / 2).strength(0.05))
      .force('y', d3.forceY(chartHeight / 2).strength(0.05))
      .force('charge', d3.forceManyBody().strength(-100))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => d.radius + 2)
      );

    // Create bubbles
    const bubbles = g
      .selectAll<SVGCircleElement, (typeof data)[0]>('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d, i) => colorScale(i))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);

        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>${d.count} anime`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7)
          .attr('stroke-width', 2);

        tooltip.style('opacity', 0);
      })
      .on('click', (event, d) => {
        // Navigate to anime list with genre filter and search query
        navigate('/', {
          state: {
            genreId: d.id,
            genreName: d.name,
          },
        });
      });

    // Create labels
    const labels = g
      .selectAll<SVGTextElement, (typeof data)[0]>('text')
      .data(data)
      .enter()
      .append('text')
      .text((d) => d.name)
      .attr('font-size', (d) => Math.min(d.radius / 3, 14))
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .style('user-select', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      bubbles.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      labels.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y + 5);
    });

    // Cleanup function
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [genres, width, height, navigate]);

  return (
    <div className='flex justify-center items-center w-full overflow-auto'>
      <svg ref={svgRef} className='block' />
    </div>
  );
}
