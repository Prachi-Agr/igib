// https://observablehq.com/@d3/disjoint-force-directed-graph@140
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["residue_interactions.json", new URL("residue_interactions.json", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`# Disjoint Force-Directed Graph

When using [D3’s force layout](https://github.com/d3/d3-force) with a disjoint graph, you typically want the [positioning forces](https://github.com/d3/d3-force/blob/master/README.md#positioning) (d3.forceX and d3.forceY) instead of the [centering force](https://github.com/d3/d3-force/blob/master/README.md#centering) (d3.forceCenter). The positioning forces, unlike the centering force, prevent detached subgraphs from escaping the viewport.`
    )
  });
  main.variable(observer("chart")).define("chart", ["data", "d3", "width", "height", "color", "drag", "invalidation"], function (data, d3, width, height, color, drag, invalidation) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", color)
      .call(drag(simulation));

    node.append("text")
      .text(function (d) {
        return d.name;
      })
      .attr('x', 6)
      .attr('y', 3)
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px");

    node.append("title")
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    invalidation.then(() => simulation.stop());

    return svg.node();
  }
  );
  main.variable(observer("data")).define("data", ["FileAttachment"], function (FileAttachment) {
    return (
      FileAttachment("residue_interactions.json").json()
    )
  });
  main.variable(observer("height")).define("height", function () {
    return (
      680
    )
  });
  main.variable(observer("color")).define("color", ["d3"], function (d3) {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.chain);
  }
  );
  main.variable(observer("drag")).define("drag", ["d3"], function (d3) {
    return (
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
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@5")
    )
  });
  return main;
}
