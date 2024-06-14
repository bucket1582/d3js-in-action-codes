import { select, selectAll } from "d3-selection";
import { max } from "d3-array";
import { forceSimulation, forceCollide, forceCenter, forceManyBody, forceLink } from "d3-force";
import { colorScale, getRadius } from "./scales";

export const drawNetwork = (nodes, edges) => {

  // Dimensions
  const width = 850;
  const height = 600;


  // Append a SVG container
  const svg = select("#network")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);


  const getColor = (edge) => {
    if (edge.source == "romeo" || edge.target == "romeo") return "#1b35e0";
    if (edge.source == "juliet" || edge.target == "juliet") return "#5ec722";
    return "#364652";
  }

  // Append links
  svg
    .selectAll(".network-link")
    .data(edges)
    .join("line")
      .attr("class", "network-link")
      .attr("stroke", getColor)
      .attr("stroke-opacity", d => d.weight * 0.15)
      .attr("stroke-width", 3);


  // Append nodes
  const maxLines = max(nodes, d => d.totalLinesNumber)
  svg
    .selectAll(".network-node")
    .data(nodes)
    .join("circle")
      .attr("class", "network-node")
      .attr("r", d => {
        d["radius"] = getRadius(maxLines, d.totalLinesNumber);
        return d.radius;
      })
      .attr("fill", d => colorScale(d.house))
      .attr("fill-opacity", d => d.totalLinesNumber / maxLines)
      .attr("stroke", "#FAFBFF")
      .attr("stroke-opacity", d => d.totalLinesNumber / maxLines)
      .attr("stroke-width", 1);

  
  // Function called after each tick to set the nodes' position
  const updateNetwork = () => {
    selectAll(".network-link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    selectAll(".network-node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  };


  // Run the simulation
  const simulation = forceSimulation()
    .force("charge", forceManyBody().strength(-1000))
    .force("collide", forceCollide().radius(d => d.radius + 2) )
    .force("center", forceCenter().x(0).y(0))
    .force("link", forceLink().id(d => d.id).strength(d => d.weight/10))
    .force("bounding", () => { // custom force to keep nodes in frame
      nodes.forEach(node => {
        if (node.x < -width/2 + node.radius) {
          node.vx = 5;
        }
        if (node.y < -height/2 + node.radius) {
          node.vy = 5;
        }
        if (node.x > width/2 - node.radius) {
          node.vx = -5;
        }
        if (node.y > height/2 - node.radius) {
          node.vy = -5;
        }
      });
    })
    .nodes(nodes)
    .on("tick", updateNetwork);

  simulation
    .force("link")
    .links(edges);
};