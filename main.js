var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// grey for males, yellow for females
var colors = ['#ffcc00', '#ececec', 'white'];

// Do not include a domain
var color = d3.scale.ordinal()
  .range(colors);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
   // .tickSize(-height)
    .tickFormat(d3.format("d"));

var dotRadius = function(height, maxDots) {
  // calculate dot radius so they don't overlap
  return height/maxDots/2;
}

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// TOOLTIP

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span><strong>" + d.nominee + "</strong></span><br /> <span>" + d.secondarynominee+ "</span><br /><span>" + d.category + "</span>";
  });

svg.call(tip);

// PULL IN THE DATA

d3.csv("data/data.csv", function(error, data) {
  if (error) throw error;
  console.log(data);

  data.forEach(function(d) {
    d.order = +d.order;
    d.year = +d.year;
  });

  x.domain([1995,2018]);
  y.domain(d3.extent(data, function(d) { return d.order; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of nominees")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("rect")
      .attr("class", "dot")
      //.attr("r", 10)
      .attr("height", dotRadius(height, 35))
      .attr("width", dotRadius(width, 2018-1995))
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.order); })
      .style("fill", function(d) { return color(d.gender); })
      .style("stroke", function(d) { return d.winner === "TRUE" ? "#333333" : "none" })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
/*
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      //.attr("r", 10)
      .attr("r", dotRadius(height, 35))
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return y(d.order); })
      .style("fill", function(d) { return color(d.gender); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);*/
/*
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
      */

});