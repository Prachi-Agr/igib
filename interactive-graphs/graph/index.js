data = d3.json('d3.min.js');

let divSelection = d3.select("body") 
    .selectAll("div");

 divSelection
    .data(videoData)
    .enter()
  .append('div')
    .text(function(d) { 
       return d.title + ": " + d.amount + " views";
	  })
    .attr("class", "bar")
    .style("width", function(d) { return d.amount * 50 + "px"; });