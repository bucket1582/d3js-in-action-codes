import { select, selectAll } from "d3-selection";
import { max, range } from "d3-array";
import { scaleLinear } from "d3-scale";
import { transition } from "d3-transition";

export const drawMatrix = (nodes, edges) => {

  let nodes_filter = nodes.slice();
  // Order characters (nodes) by length of names (short to long)
  nodes.sort((a, b) => a.name.length - b.name.length);

  // Prepare the data matrix
  const edgeHash = {};
  edges.forEach(edge => {

    const link1 = {
      source: edge.source,
      target: edge.target,
      weight: edge.weight
    };
    const id1 = `${edge.source}-${edge.target}`;
    edgeHash[id1] = link1;
    
    const link2 = {
      source: edge.target,
      target: edge.source,
      weight: edge.weight
    };
    const id2 = `${edge.target}-${edge.source}`;
    edgeHash[id2] = link2;

  });

  nodes_filter = nodes_filter.filter(
    node => edges.filter(
      edge => (edge.source == node.id & edge.target == "second_musician") || (edge.target == node.id && edge.source == "second_musician")
    ).length > 0
  );

  console.log(nodes_filter);
  

  const matrix = [];
  const squareWidth = 16;
  const padding = 2;
  nodes.forEach((charA, i) => {
    nodes.forEach((charB, j) => {
      if (charA !== charB) {
        const id = `${charA.id}-${charB.id}`;
        let color;
        const charA_exists = nodes_filter.filter(item => item.name === charA.name).length > 0;
        const charB_exists = nodes_filter.filter(item => item.name === charB.name).length > 0;
        if (charA_exists || charB_exists)
          {
            color = "#ff0000";
          }
        else
          {
            color = "#364652";
          }
        const item = {
          id: id,
          source: charA.id,
          target: charB.id,
          x: i * (squareWidth + padding),
          y: j * (squareWidth + padding),
          color: color
        };

        if (edgeHash[id]) {
          item["weight"] = edgeHash[id].weight;
          matrix.push(item)
        }
      }
    });
  });


  // Dimensions
  const innerWidth = nodes.length * (squareWidth + padding);
  const innerHeight = nodes.length * (squareWidth + padding);
  const margin = { top: 130, right: 0, bottom: 0, left: 130 };
  const width = innerWidth + margin.right + margin.left;
  const height = innerHeight + margin.top + margin.bottom;


  // Append SVG container
  const svg = select("#matrix")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
  // Append the grid squares
  const maxWeight = max(edges, d => d.weight);
  const opacityScale = scaleLinear()
    .domain([0, maxWeight])
    .range([0, 1]);
  svg
    .selectAll(".grid-quare")
    .data(matrix)
    .join("rect")
      .attr("class", "grid-quare")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", squareWidth)
      .attr("height", squareWidth)
      .attr("fill", d => d.color)
      .attr("fill-opacity", d => opacityScale(d.weight));


  // Append the labels
  const labelsContainer = svg
    .selectAll(".matrix-label")
    .data(nodes)
    .join("g")
      .attr("class", "matrix-label")
      .attr("dominant-baseline", "middle")
      .style("font-size", "13px");

  labelsContainer
    .append("text")
      .attr("class", "label-top")
      .attr("x", -8)
      .attr("y", (d, i) => i * (squareWidth + padding) + squareWidth / 2)
      .attr("text-anchor", "end")
      .text(d => d.name);
      
  labelsContainer
    .append("text")
      .attr("class", "label-left")
      .attr("transform", (d, i) => `translate(${i * (squareWidth + padding) + squareWidth / 2}, -8) rotate(-90)`)
      .text(d => d.name);


  // Add a legend for the opacity of the squares
  const weights = range(1, maxWeight + 1);

  const legend = select(".matrix-legend")
    .append("ul")
    .selectAll(".legend-color-item")
    .data(weights)
    .join("li")
      .attr("class", "legend-color-item");
  legend
    .append("div")
      .attr("class", "legend-color")
      .style("background-color", "#364652")
      .style("opacity", d => opacityScale(d));
  legend
    .append("div")
      .attr("class", "legend-color-label")
      .text(d => d);

};