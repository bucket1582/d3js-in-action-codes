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

export const getColor = (field) => {
  const fields = ["Economics", "Physics", "Medicine", "Literature", "Chemistry", "Peace"];
  const colors = ["#cfb846", "#466fcf", "#46cf54", "#cf4696", "#b5384b", "#b0aeae"];
  switch(field)
  {
    case fields[0]: return colors[0];
    case fields[1]: return colors[1];
    case fields[2]: return colors[2];
    case fields[3]: return colors[3];
    case fields[4]: return colors[4];
    case fields[5]: return colors[5];
    default: return ""
  }
}