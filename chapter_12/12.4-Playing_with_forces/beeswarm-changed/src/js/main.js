import { createLegend } from "./legend";
import { loadData } from "./load-data";
import { drawBeeswarm } from "./beeswarm";

createLegend();

// Load data
const [nodes, edges] = loadData();

// Draw the beeswarm
drawBeeswarm(nodes);