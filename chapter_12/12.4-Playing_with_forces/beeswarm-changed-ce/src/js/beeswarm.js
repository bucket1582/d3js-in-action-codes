import { select, selectAll } from "d3-selection";
import { max } from "d3-array";
import { forceSimulation, forceY, forceCollide } from "d3-force";
import { colorScale, getRadius } from "./scales";
import { scaleRadial, scaleLinear } from "d3-scale";
import { houses } from "./helper";

export const drawBeeswarm = (nodes) => {

  // Dimensions
  const width = 1140;
  const height = 400;


  // Make a deep copy of the nodes array
  const beeswarmNodes = JSON.parse(JSON.stringify(nodes));

  // Append a SVG container
  const svg = select("#beeswarm")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);


  // Append nodes
  const maxLines = max(nodes, d => d.totalLinesNumber)

  const linearValueByTalks = scaleLinear()
    .domain([0, maxLines])
    .range([0, 60])

  const getClass = (lines) => {
    const lineValue = linearValueByTalks(lines);
    if (lineValue > 45)
      {
        return 0;
      }
    else if (lineValue > 30)
      {
        return 1;
      }
    else if (lineValue > 15)
      {
        return 2;
      }
    else
      {
        return 3;
      }
  }

  const getColor = (classInt) => {
    switch(classInt)
    {
      case 0:
        return "#6068ae";
      case 1:
        return "#888ec2";
      case 2:
        return "#afb3d7";
      case 3:
        return "#d7d9eb";
    }
  }

  const computeRadius = (house) =>
    {
      return houses.find(item => item.house === house).order * 10;
    }

  svg
    .selectAll(".beeswarm-circle")
    .data(beeswarmNodes)
    .join("circle")
      .attr("class", "beeswarm-circle")
      .attr("r", d => {
        d["radius"] = computeRadius(d.house);
        return d.radius;
      })
      .attr("fill", d => getColor(getClass(d.totalLinesNumber)))
      .attr("stroke", "#FAFBFF")
      .attr("stroke-width", 1)
      .attr("repr", d => d.id);
  
  const findJuliet = () => {
    const juliet = svg.select("[repr=juliet]");
    return [juliet.attr("cx"), juliet.attr("cy")];
  }

  svg
      .append("text")
      .attr("class", "juliet-name")
      .attr("font-size", "1em")
      .attr("transform", `translate(70, 50), rotate(-40)`)
      .attr("fill", "#4b4866")
      .text("Juliet");
  
  // Function called after each tick to set the nodes' position
  const updateNetwork = () => {
    selectAll(".beeswarm-circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    
    const julietCoords = findJuliet();
    select(".juliet-name")
      .attr("x", julietCoords[0])
      .attr("y", julietCoords[1]);
  };


  // Run the simulation
  const simulation = forceSimulation()
    .force("y", forceY(0) )
    .force("collide", forceCollide().radius(d => d.radius + 2) )
    .nodes(beeswarmNodes)
    .on("tick", updateNetwork);
};