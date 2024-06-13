import { select, selectAll } from "d3-selection";
import { geoPath, geoEqualEarth, geoGraticule } from "d3-geo";
import { countryColorScale } from "./scales";

export const drawWorldMap = (laureates, world) => {

  // Perform calculations
  world.features.forEach(country => {
    const props = country.properties;
    props.laureates = laureates.filter(laureate => laureate.birth_country === props.name);
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

  // On project load, display countries
  displayCountries();

};