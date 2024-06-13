import { scaleSequential, scaleRadial } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";

export const countryColorScale = scaleSequential(interpolateYlGnBu)
  .domain([1, 100]);