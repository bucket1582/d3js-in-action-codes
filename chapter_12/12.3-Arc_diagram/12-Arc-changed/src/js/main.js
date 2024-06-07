import { createLegend } from "./legend";
import { loadData } from "./load-data";
import { drawArcDiagram } from "./arc";

createLegend();

// Load data
const [nodes, edges] = loadData();

// Draw the arc diagram
drawArcDiagram(nodes, edges);