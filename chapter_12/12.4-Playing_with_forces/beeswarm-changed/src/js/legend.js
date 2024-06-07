import { select } from "d3-selection";
import { houses } from "./helper";
import { getRadius } from "./scales";

export const createLegend = () => {

  const talkClassLegend = select(".legend-talkClasses")
    .append("ul");



  const addTalkClass = (min_percentage, max_percentage, colorString) =>
    {
      let talkClass = select(".legend-talkClasses")
        .selectChild("ul");
      
      talkClass = talkClass.append("li")
        .attr("class", ".legend-talkClass");

      talkClass.append("span")
        .attr("class", "legend-class-color")
        .style("background-color", colorString);
      
      talkClass.append("span")
        .attr("class", "legend-class-label")
        .text(min_percentage.concat(" < X ≤ ", max_percentage))
    }

  addTalkClass("75%", "100%", "#6068ae");
  addTalkClass("50%", "75%", "#888ec2");
  addTalkClass("25%", "50%", "#afb3d7");
  addTalkClass("0%", "25%", "#d7d9eb");
  


  // Circle radius
  const houseMax = 4;
  const houseMedium1 = 3;
  const houseMedium2 = 2;
  const houseMin = 1;
  const maxRadius = getRadius(houseMax * 2, houseMax * 2);
  const mediumRadius1 = getRadius(houseMax * 2, houseMedium1 * 1.5);
  const mediumRadius2 = getRadius(houseMax * 2, houseMedium2 * 1.2);
  const minRadius = getRadius(houseMax * 2, houseMin);
  const legendRadius = select(".legend-radius")
    .append("svg")
      .attr("viewBox", "0 0 260 200")
    .append("g")
      .attr("transform", "translate(1, 10)");
  const legendCircles = legendRadius 
    .append("g")
      .attr("fill", "transparent")
      .attr("stroke", "#272626");
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", maxRadius)
      .attr("r", maxRadius);
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", 2*maxRadius - mediumRadius1)
      .attr("r", mediumRadius1);
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", 2*maxRadius - mediumRadius2)
      .attr("r", mediumRadius2)
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", 2*maxRadius - minRadius)
      .attr("r", minRadius);

  const linesLength = 100;
  const legendLines = legendRadius
    .append("g")
      .attr("stroke", "#272626")
      .attr("stroke-dasharray", "6 4");
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 0)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 0);
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 2*maxRadius - 2*mediumRadius1)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 2*maxRadius - 2*mediumRadius1);
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 2*maxRadius - 2*mediumRadius2)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 2*maxRadius - 2*mediumRadius2);
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 2*maxRadius - 2*minRadius)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 2*maxRadius - 2*minRadius);

  const labels = legendRadius
    .append("g")
      .attr("fill", "#272626")
      .attr("dominant-baseline", "middle");
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 0)
      .text(houses.find(item => item.order == houseMax).house.split(" ").at(-1));
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 2*maxRadius - 2*mediumRadius1)
      .text(houses.find(item => item.order == houseMedium1).house.split(" ").at(-1));
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 2*maxRadius - 2*mediumRadius2)
      .text(houses.find(item => item.order == houseMedium2).house.split(" ").at(-1));
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 2*maxRadius - 2*minRadius)
      .text(houses.find(item => item.order == houseMin).house.split(" ").at(-1));

};