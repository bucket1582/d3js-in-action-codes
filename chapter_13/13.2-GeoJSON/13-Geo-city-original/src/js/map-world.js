import { select, selectAll } from "d3-selection";
import { geoPath, geoEqualEarth, geoGraticule } from "d3-geo";
import { max } from "d3-array";
import { getCityRadius } from "./scales";
import { drawLegend } from "./legend";

export const drawWorldMap = (laureates, world) => {

  // Perform calculations
  world.features.forEach(country => {
    const props = country.properties;
    props.laureates = laureates.filter(laureate => laureate.birth_country === props.name);
  });

  const cities = [];
  laureates.forEach(laureate => {
    if (laureate.birth_country !== "" && laureate.birth_city !== "") {

      const relatedCity = cities.find(city => city.city === laureate.birth_city) && cities.find(city => city.country === laureate.birth_country);
      
      if (relatedCity) {
        relatedCity.laureates.push(laureate);
      } else {
        cities.push({
          city: laureate.birth_city,
          country: laureate.birth_country,
          latitude: laureate.birt_city_latitude,
          longitude: laureate.birt_city_longitude,
          laureates: [laureate]
        });
      }

    }
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

  const maxLaureatesPerCity = max(cities, d => d.laureates.length);
  const updateCityCircles = () => {
    selectAll(".circle-city")
      .attr("r", d => getCityRadius(d.laureates.length, maxLaureatesPerCity));
  };
  
  const displayCities = () => {
    // Remove country styles and events
    selectAll(".country-path")
      .attr("fill", "#f8fcff");

    // Show birth cities
    svg
      .selectAll(".circle-city")
      .data(cities)
      .join("circle")
        .attr("class", "circle-city")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("fill", "#35a7c2")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#35a7c2");

    updateCityCircles();

    // Show related legend
    select(".legend-cities")
      .style("display", "block");
    
  };

  drawLegend(maxLaureatesPerCity);

  // On project load, display cities
  displayCities();

};