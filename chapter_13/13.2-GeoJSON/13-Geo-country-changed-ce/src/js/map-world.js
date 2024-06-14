import { select, selectAll } from "d3-selection";
import { geoPath, geoEqualEarth, geoGraticule } from "d3-geo";
import { countryColorScale } from "./scales";

export const drawWorldMap = (laureates, world) => {

  // Perform calculations
  world.features.forEach(country => {
    const props = country.properties;
    props.laureates = laureates.filter(laureate => laureate.birth_country === props.name && laureate.category == "Physics");
  });

  // Dimensions
  const width = 1230;
  const height = 620;

  // Append the SVG container
  const svg = select("#map")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Define the map projection
  const projection = geoEqualEarth()
    .translate([width/2, height/2])
    .scale(220);

  // Initialize the path generator
  const geoPathGenerator = geoPath()
    .projection(projection);

  // Define the graticule generator
  const graticuleGenerator = geoGraticule();

  // Append the graticules
  const graticules = svg
    .append("g")
      .attr("fill", "transparent")
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.2);
  graticules
    .append("path")
    .datum(graticuleGenerator)
      .attr("d", geoPathGenerator);
  graticules
    .append("path")
    .datum(graticuleGenerator.outline)
      .attr("d", geoPathGenerator);

  // Append the country paths
  svg
    .selectAll(".country-path")
    .data(world.features)
    .join("path")
      .attr("class", "country-path")
      .attr("d", geoPathGenerator)
      .attr("country-name", d => d.properties.name)
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.4);

  const updateCountryFills = () => {
    selectAll(".country-path")
      .attr("fill", d => d.properties.laureates.length > 0 
        ? countryColorScale(d.properties.laureates.length) 
        : "#f8fcff");
  };

  const displayCountries = () => {
    updateCountryFills();

    select(".legend-countries")
      .style("display", "flex");
  };

  let japanCoordinates = select("[country-name=Japan]").attr("d").split("L");
  japanCoordinates = japanCoordinates.map(
    coords => {
      coords = coords.replace("M", "");
      coords = coords.replace("Z", "");
      return coords.split(",")
    }
  ).filter(
    coords => coords[1] > 100
  ).reduce(
    (prev, current) => (prev && prev[0] < current[0]) ? prev : current
  ).map(
    value => parseFloat(value)
  );

  const lineStartCoordinates = [japanCoordinates[0], japanCoordinates[1] - 20];
  const lineEndCoordinates = [japanCoordinates[0] - 65, japanCoordinates[1] - 35];
  const textCoordinates = [japanCoordinates[0] - 250, japanCoordinates[1] - 20];
  const rectCoordinates = [
    [textCoordinates[0] - 20, textCoordinates[1] + 20], [textCoordinates[0] - 20, textCoordinates[1] - 45], 
    [textCoordinates[0] + 185, textCoordinates[1] - 45], [textCoordinates[0] + 185, textCoordinates[1] + 20]
  ];
  
  const japanLaureates = world.features.filter(
    country => country.properties.name == "Japan"
  )[0].properties.laureates.length;

  const svgTag = select("svg");
  svgTag.append("path")
    .attr("d", "M" + rectCoordinates.map(coord => coord.join(",")).join("L") + "Z")
    .attr("fill", "#ffffff")
    .attr("stroke", "#941f1f")
    .attr("stroke-width", 4);
  svgTag.append("line")
    .attr("x1", lineStartCoordinates[0])
    .attr("y1", lineStartCoordinates[1])
    .attr("x2", lineEndCoordinates[0])
    .attr("y2", lineEndCoordinates[1])
    .attr("style", "stroke:#941f1f;stroke-width:4");
  svgTag.append("text")
    .attr("x", textCoordinates[0])
    .attr("y", textCoordinates[1])
    .attr("z-index", 424)
    .attr("font-size", "2em")
    .attr("font-family", "Georgia")
    .attr("fill", "#262626")
    .text(`Japan: ${japanLaureates}`);

  // On project load, display countries
  displayCountries();

};