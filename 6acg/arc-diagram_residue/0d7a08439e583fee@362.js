// https://observablehq.com/@ezequielscott/arc-diagram-horizontal-version@362
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["residue_interactions.json", new URL("../residue_interactions.json", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md``
    )
  });
  main.variable(observer("viewof order")).define("viewof order", ["d3", "html"], function (d3, html) {
    const options = [
      { name: "Order by name", value: (a, b) => d3.ascending(a.id, b.id) },
      { name: "Order by chain", value: (a, b) => a.chain - b.chain || d3.ascending(a.id, b.id) },
      { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id) }
    ];
    const form = html`<form style="display: flex; align-items: center; min-height: 33px;"><select name=i>${options.map(o => Object.assign(html`<option>`, { textContent: o.name }))}`;
    const timeout = setTimeout(() => {
      form.i.selectedIndex = 1;
      form.dispatchEvent(new CustomEvent("input"));
    }, 2000);
    form.onchange = () => {
      clearTimeout(timeout);
      form.value = options[form.i.selectedIndex].value;
      form.dispatchEvent(new CustomEvent("input")); // Safari
    };
    form.value = options[form.i.selectedIndex].value;
    return form;
  }
  );
  main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3", "DOM", "width", "height", "graph", "x", "margin", "color", "arc_x", "step", "viewof order", "invalidation"], function (d3, DOM, width, height, graph, x, margin, color, arc_x, step, $0, invalidation) {
    const svg = d3.select(DOM.svg(width, height));

    const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 8)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x = x(d.id)}, ${margin.bottom})`)
      .call(g => g.append("text")
        .attr("y", 10)
        .attr("dy", "0.35em")
        .attr("fill", d => d3.lab(color(d.chain)).darker(2))
        .attr("transform", "rotate(-45)")
        .text(d => d.id))
      .call(g => g.append("circle")
        .attr("r", 3)
        .attr("fill", d => color(d.chain)));

    const path = svg.insert("g", "*")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("stroke", d => d.source.chain === d.target.chain ? color(d.source.chain) : "#aaa")
      .attr("d", arc_x);

    const overlay = svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("height", margin.bottom + 40)
      .attr("width", step)
      .attr("x", d => x(d.id) - step / 2)
      .on("mouseover", d => {
        svg.classed("hover", true);
        label.classed("primary", n => n === d);
        label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
        path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
      })
      .on("mouseout", d => {
        svg.classed("hover", false);
        label.classed("primary", false);
        label.classed("secondary", false);
        path.classed("primary", false).order();
      });

    function update() {
      x.domain(graph.nodes.sort($0.value).map(d => d.id));

      const t = svg.transition()
        .duration(750);

      label.transition(t)
        .delay((d, i) => i * 20)
        .attrTween("transform", d => {
          const i = d3.interpolateNumber(x(d.id), d.x);
          return t => `translate(${d.x = i(t)},${margin.bottom})`;
        });

      path.transition(t)
        .duration(750 + graph.nodes.length * 20)
        .attrTween("d", d => () => arc_x(d));

      overlay.transition(t)
        .delay((d, i) => i * 20)
        .attr("x", d => x(d.id) - step / 2);
    }

    $0.addEventListener("input", update);
    invalidation.then(() => $0.removeEventListener("input", update));

    return svg.node();
  }
  );
  main.variable(observer("arc_x")).define("arc_x", ["margin"], function (margin) {
    return (
      function arc_x(d) {
        const x1 = d.source.x;
        const x2 = d.target.x;
        const r = Math.abs(x2 - x1) / 2;
        return `M${x1},${margin.bottom} A${r},${r} 0,0,${x1 < x2 ? 1 : 0} ${x2},${margin.bottom}`;
      }
    )
  });
  main.variable(observer("x")).define("x", ["d3", "graph", "margin", "right"], function (d3, graph, margin, right) {
    return (
      d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [margin.left, right - margin.left])
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
      md` ### Define the parameters`
    )
  });
  main.variable(observer()).define(["html"], function (html) {
    return (
      html`<style> 
.hover path {
  stroke: #ccc;
}

.hover text {
  fill: #ccc;
}

.hover g.primary text {
  fill: black;
  font-weight: bold;
}

.hover g.secondary text {
  fill: #333;
}

.hover path.primary {
  stroke: #333;
  stroke-opacity: 1;
}
</style>`
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 20, right: 20, bottom: 500, left: 30 }
    )
  });
  main.variable(observer("height")).define("height", function () {
    return (
      800
    )
  });
  main.variable(observer("right")).define("right", ["data", "step", "margin"], function (data, step, margin) {
    return (
      (data.nodes.length - 1) * step + margin.left + margin.right
    )
  });
  main.variable(observer("step")).define("step", function () {
    return (
      12
    )
  });
  main.variable(observer("color")).define("color", ["d3", "graph"], function (d3, graph) {
    return (
      d3.scaleOrdinal(graph.nodes.map(d => d.chain).sort(d3.ascending), d3.schemeCategory10)
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`### Create a graph`
    )
  });
  main.variable(observer("graph")).define("graph", ["data"], function (data) {
    const nodes = data.nodes.map(({ id, chain }) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      chain
    }));

    const nodeById = new Map(nodes.map(d => [d.id, d]));

    const links = data.links.map(({ source, target, value }) => ({
      source: nodeById.get(source),
      target: nodeById.get(target),
      value
    }));

    for (const link of links) {
      const { source, target, value } = link;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }

    return { nodes, links };
  }
  );
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`### Read the data`
    )
  });
  main.variable(observer("data")).define("data", ["FileAttachment"], function (FileAttachment) {
    return (
      FileAttachment("residue_interactions.json").json()
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`### Imports`
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@5")
    )
  });
  return main;
}
