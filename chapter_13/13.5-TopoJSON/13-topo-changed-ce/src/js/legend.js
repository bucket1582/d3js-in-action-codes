import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";

export const drawLegend = () => {
    const width = 10;
    const height = 20;

    const legend = select(".france-legend");

    const ul = legend.append("ul");
    
    const fields = ["Economics", "Physics", "Medicine", "Literature", "Chemistry", "Peace"];
    const colors = ["#cfb846", "#466fcf", "#46cf54", "#cf4696", "#b5384b", "#b0aeae"];

    for (let i = 0; i < 6; i++) {
        const li = ul.append("li");
        li.append("span")
            .text("●")
            .style("color", colors[i]);
        li.append("span")
            .text(fields[i]);
    }
}