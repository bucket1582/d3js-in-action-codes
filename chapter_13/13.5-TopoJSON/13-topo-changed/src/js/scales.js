import { scaleRadial, scaleLinear } from "d3-scale";

export const getCityRadius = (numLaureates, maxLaureates) => {
  const cityRadiusScale = scaleRadial()
    .domain([0, maxLaureates])
    .range([0, 25]);

  return cityRadiusScale(numLaureates);
};

export const getCityTextOpacity = (numLaureates, maxLaureates) => {
  const cityOpacityScale = scaleLinear()
    .domain([0, maxLaureates])
    .range([0.2, 0.8]);
  
    return cityOpacityScale(numLaureates);
}