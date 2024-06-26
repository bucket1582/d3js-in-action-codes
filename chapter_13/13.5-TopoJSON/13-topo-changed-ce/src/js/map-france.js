import * as topojson from "topojson-client";
import { select } from "d3-selection";
import { geoMercator, geoPath } from "d3-geo";
import { count, max } from "d3-array";
import { getCityRadius, getCityTextOpacity, getColor } from "./scales";

export const drawFranceMap = (laureates, france) => {

  // Convert TopoJSON to GeoJSON
  let departments = topojson.feature(france, france.objects.FRA_adm2).features;


  // Extract borders
  let borders = topojson.mesh(france, france.objects.FRA_adm2);

  // Dimensions
  const width = 800;
  const height = 800;

  // Define projection
  const projection = geoMercator()
    .scale(3000)
    .translate([280, 3150]);

  // Initialize the path generator
  const geoPathGenerator = geoPath()
    .projection(projection);

  // Append SVG container
  const svg = select("#map-france")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Append the departments paths
  svg
    .selectAll(".department")
    .data(departments)
    .join("path")
      .attr("class", "department")
      .attr("d", d => geoPathGenerator(d))
      .attr("fill", "#f8fcff");

  // Append the borders path
  svg
    .append("path")
      .attr("class", "departments-borders")
      .attr("d", geoPathGenerator(borders))
      .attr("fill", "none")
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.4);

  // Filter laureates data
  const franceLaureates = laureates.filter(laureate => laureate.birth_country === "France");

  const cities = [];
  franceLaureates.forEach(laureate => {
    if (cities.find(city => city.name === laureate.birth_city)) {
      cities.find(city => city.name === laureate.birth_city).laureates.push(laureate);
    } else {
      cities.push({
        name: laureate.birth_city,
        latitude: laureate.birt_city_latitude,
        longitude: laureate.birt_city_longitude,
        laureates: [laureate]
      });
    }
  });

  const maxLaureatesPerCity = max(cities, d => d.laureates.length);
  const findBestFieldOfCity = (city) => {
    const fields = ["Economics", "Physics", "Medicine", "Literature", "Chemistry", "Peace"];
    const counts = [0, 0, 0, 0, 0, 0];
    city.laureates.forEach(
      laureate => counts[fields.findIndex(field => laureate.category == field)] += 1
    );
    const maxValue = max(counts);
    return fields[counts.findIndex(value => value == maxValue)];
  }

  // Append city circles
  svg
    .selectAll(".france-city-circle")
    .data(cities)
    .join("circle")
      .attr("class", "france-city-circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", d => getCityRadius(d.laureates.length, maxLaureatesPerCity))
      .attr("fill", d => getColor(findBestFieldOfCity(d)))
      .attr("fill-opacity", 0.5)
      .attr("stroke",  d => getColor(findBestFieldOfCity(d)));
};