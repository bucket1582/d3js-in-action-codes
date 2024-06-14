export const loadData = () => {

  const nodes = require("../data/nodes.json");
  const edges = require("../data/edges.json");

  return [nodes, edges];

};