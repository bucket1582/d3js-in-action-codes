import { drawFranceMap } from "./map-france";
import { drawLegend } from "./legend";

import laureates from "../data/laureates.json";
import france from "../data/france.json";

drawFranceMap(laureates, france);
drawLegend();
