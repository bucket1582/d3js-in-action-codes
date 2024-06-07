import { createLegend } from "./legend";
import { loadData } from "./load-data";
import { drawNetwork } from "./network";

createLegend();

// Load data
const [nodes, edges] = loadData();

// Draw the network
drawNetwork(nodes, edges);