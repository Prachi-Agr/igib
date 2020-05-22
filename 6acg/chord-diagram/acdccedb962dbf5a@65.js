// https://observablehq.com/@d3/chord-diagram@65
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Chord Diagram

[Chord diagrams](https://github.com/d3/d3-chord) show directed relationships among a group of entities. This example adapted from [Circos](http://mkweb.bcgsc.ca/circos/).`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","chord","data","color","arc","groupTicks","outerRadius","formatValue","ribbon"], function(d3,width,height,chord,data,color,arc,groupTicks,outerRadius,formatValue,ribbon)
{
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("font-size", 10)
      .attr("font-family", "sans-serif");

  const chords = chord(data);

  const group = svg.append("g")
    .selectAll("g")
    .data(chords.groups)
    .join("g");

  group.append("path")
      .attr("fill", d => color(d.index))
      .attr("stroke", d => d3.rgb(color(d.index)).darker())
      .attr("d", arc);

  const groupTick = group.append("g")
    .selectAll("g")
    .data(d => groupTicks(d, 1e3))
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append("line")
      .attr("stroke", "#000")
      .attr("x2", 6);

  groupTick
    .filter(d => d.value % 5e3 === 0)
    .append("text")
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));

  svg.append("g")
      .attr("fill-opacity", 0.67)
    .selectAll("path")
    .data(chords)
    .join("path")
      .attr("d", ribbon)
      .attr("fill", d => color(d.target.index))
      .attr("stroke", d => d3.rgb(color(d.target.index)).darker());

  return svg.node();
}
);
  main.variable(observer("data")).define("data", function(){return(
[
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
]
)});
  main.variable(observer("groupTicks")).define("groupTicks", ["d3"], function(d3){return(
function groupTicks(d, step) {
  const k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(value => {
    return {value: value, angle: value * k + d.startAngle};
  });
}
)});
  main.variable(observer("formatValue")).define("formatValue", ["d3"], function(d3){return(
d3.formatPrefix(",.0", 1e3)
)});
  main.variable(observer("chord")).define("chord", ["d3"], function(d3){return(
d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)
)});
  main.variable(observer("arc")).define("arc", ["d3","innerRadius","outerRadius"], function(d3,innerRadius,outerRadius){return(
d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
)});
  main.variable(observer("ribbon")).define("ribbon", ["d3","innerRadius"], function(d3,innerRadius){return(
d3.ribbon()
    .radius(innerRadius)
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleOrdinal()
    .domain(d3.range(4))
    .range(["#000000", "#FFDD89", "#957244", "#F26223"])
)});
  main.variable(observer("outerRadius")).define("outerRadius", ["width","height"], function(width,height){return(
Math.min(width, height) * 0.5 - 30
)});
  main.variable(observer("innerRadius")).define("innerRadius", ["outerRadius"], function(outerRadius){return(
outerRadius - 20
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
Math.min(640, width)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
