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

  const getCityOpacity = (city) => {
    const numberOfLaureates = city.laureates.length;
    if (numberOfLaureates < 2) return 0.15;
    if (numberOfLaureates < 5) return 0.3;
    if (numberOfLaureates < 10) return 0.45;
    return 0.6;
  }

  const bestCitiesPerCountry = cities.filter(
    city => cities.filter(
      curCity => curCity.country == city.country
    ).reduce(
      (prev, curr) => (prev && prev.laureates.length > curr.laureates.length) ? prev : curr
    ).city == city.city
  );

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

  const maxLaureatesPerCity = max(bestCitiesPerCountry, d => d.laureates.length);
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
      .data(bestCitiesPerCountry)
      .join("circle")
        .attr("class", "circle-city")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("fill", d => (d.city == "New York City") ? "#ed5858" : "#35a7c2")
        .attr("fill-opacity", getCityOpacity)
        .attr("stroke", d => (d.city == "New York City") ? "#e82c2c" : "#35a7c2")
        .attr("stroke-opacity", getCityOpacity);

    updateCityCircles();

    // Show related legend
    select(".legend-cities")
      .style("display", "block");
    
  };

  drawLegend(maxLaureatesPerCity);

  // On project load, display cities
  displayCities();

};