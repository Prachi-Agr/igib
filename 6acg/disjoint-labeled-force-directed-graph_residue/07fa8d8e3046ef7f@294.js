// https://observablehq.com/@pjayathissa/disjoint-labeled-force-directed-graph@294
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["residue_interactions.json",new URL("residue_interactions.json",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Disjoint Labeled Force-Directed Graph with Text

* Credits to [Disjoint Force-Directed Graph](https://observablehq.com/@d3/disjoint-force-directed-graph) `
)});
  main.variable(observer("chart")).define("chart", ["data","d3","DOM","width","height","drag","color","invalidation"], function(data,d3,DOM,width,height,drag,color,invalidation)
{
  // Styling Params
  const scale = 1
  const textOffset = 10
  
  const links = data.links.map(d => Object.create(d));

  const nodes = data.nodes.map(d => Object.create(d));
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX()
                    .strength(-50))
      .force("y", d3.forceY());
  
  const svg = d3.select(DOM.svg(width, height))
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));
 
    const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node")
      .call(drag(simulation));
  

    const circle = node.append("circle")
        .attr("r", 5)
        .attr("fill", color)
        .call(drag(simulation));
  


  const text = node.append("text")
      .text(d => d.id)
      .attr("stroke", "#999");

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x*scale)
        .attr("y1", d => d.source.y*scale)
        .attr("x2", d => d.target.x*scale)
        .attr("y2", d => d.target.y*scale);
    text
        .attr("x", d => d.x*scale+textOffset)
        .attr("y", d => d.y*scale);

    circle
        .attr("cx", d => d.x*scale)
        .attr("cy", d => d.y*scale);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("residue_interactions.json").json()
)});
  main.variable(observer("height")).define("height", function(){return(
680
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.chain);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
