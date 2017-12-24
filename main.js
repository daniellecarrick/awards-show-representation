var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// grey for males, yellow for females
var colors = ['#ffcc00', '#ddd', 'white'];

// color by category
//var colors = ['#1b9e77','#d95f02','#7570b3','#e7298a'];


// Do not include a domain
var color = d3.scale.ordinal()
    .range(colors);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // .tickSize(-height)
    .tickFormat(d3.format("d"));

var markerRadius = function(height, maxmarkers) {
    // calculate marker radius so they don't overlap
    return height / maxmarkers / 2;
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
        return "<span><strong>" + d.nominee + "</strong></span><br /> <span>" + d.secondarynominee + "</span><br /><span>" + d.category + "</span>";
    });

svg.call(tip);

// PULL IN THE DATA

d3.csv("data/data.csv", function(error, data) {
    if (error) throw error;
    console.log(data);

    /*  data.sort(function(x, y){
       return d3.ascending(x.gender, y.gender);
      })*/

    data.forEach(function(d) {
        d.order = +d.order;
        //d.newOrder = data.indexOf(d);
        // Remove the ' - Motion Picture' text from end of string
        function createLabel(d) {
            var textToTrim = ' - Motion Picture';
            d.category = d.category.replace(textToTrim, '');
            return d.category;
        }
        createLabel(d);
        // format category for classnames
        function classLabel(d) {
            d.className = d.category.split(' ').join('-');
            d.className = d.className.toLowerCase();
            return d.className;
        }
        classLabel(d);
        d.year = +d.year;
    });


    x.domain([1995, 2018]);
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
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of nominees")

    svg.selectAll(".marker")
        .data(data)
        .enter().append("rect")
        .attr("class", "marker")
        .attr("class", function(d) { return d.className; })
        .attr("height", markerRadius(height, 35))
        .attr("width", markerRadius(width, 2018 - 1995))
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d.order); })
        .style("fill", function(d) { return color(d.gender); })
        //.style("fill", function(d) { return color(d.category); })
        .style("stroke", function(d) { return d.winner === "TRUE" ? "#333333" : "none" })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

        // logic for buttons
/*    d3.select('button.best-director').on('click', function() {
        d3.selectAll('rect.best-director').attr('fill-opacity', 0.5);
        console.log('button clicked');
    })*/

  // Highlight selected category
    d3.select('select').on('change', function() {
      var selectedCategory = this.value;
        d3.selectAll('.' + selectedCategory).attr('fill-opacity', 0.5);
        console.log(selectedCategory);
    })

    /*
      svg.selectAll(".marker")
          .data(data)
        .enter().append("circle")
          .attr("class", "marker")
          //.attr("r", 10)
          .attr("r", markerRadius(height, 35))
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