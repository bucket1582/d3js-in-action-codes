import { loadData } from "./load-data";
import { drawMatrix } from "./matrix";

// Load data
const [nodes, edges] = loadData();

// Draw the adjacency matrix
drawMatrix(nodes, edges);