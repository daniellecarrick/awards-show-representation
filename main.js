function draw() {

    d3.select('#chart').remove();
    d3.select('#chart-container').append('div').attr('id', 'chart');

    var windowWidth = document.getElementById('chart-container').clientWidth;
    var windowHeight = 500;

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = windowWidth - margin.left - margin.right,
        height = windowHeight - margin.top - margin.bottom;

    var breakPoint = {
      desktop: 900,
      mobile: 200,
      ipad: 500
    }

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // grey for males, yellow #ffcc00 for females
    var colors = ['#FF0064', '#ddd'];

    // Do not include a domain
    var color = d3.scale.ordinal()
        .range(colors);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(22)
        .tickFormat(d3.format('d'));

    if (window.innerWidth < breakPoint.desktop) {
        xAxis.ticks(11)
    } else {
        xAxis.ticks(221)
    }

    var markerDimensions = function(widthOrHeight, maxmarkers) {
        // calculate marker height and width so they don't overlap
        return widthOrHeight / maxmarkers / 2;
    }

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient('left');

    var svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // TOOLTIP

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return '<span><strong>' + d.nominee + '</strong></span><br /> <span>' + d.secondarynominee + '</span><br /><span>' + d.category + '</span>';
        });

    svg.call(tip);

    d3.csv('data/data.csv', function(error, data) {
        if (error) throw error;

        // for sorting in the future --> seperate into array, sort, and merge. Or append M and prepend females by year.

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

        var xExtent = d3.extent(data, function(d) { return d.year; });
        var yExtent = d3.extent(data, function(d) { return d.order; });
        x.domain(xExtent);
        y.domain(yExtent).nice();

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(10,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -40)
            .attr('dy', '.71em')
            .style('text-anchor', 'middle')
            .text('Number of nominees')

        // Add the rectangles
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('class', function(d) { return d.className; })
            .classed('winner', function(d) { return d.winner === 'TRUE' })
            .classed('marker', true)
            .attr('height', markerDimensions(height, yExtent[1]))
            .attr('width', markerDimensions(width, xExtent[1] - xExtent[0]))
            .attr('x', function(d) { return x(d.year); })
            .attr('y', function(d) { return y(d.order); })
            .style('fill', function(d) { return color(d.gender); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    });
}

// DROPDOWNS Highlight selected category
/*d3.select('select').on('change', function() {
    var selectedCategory = this.value;
    if (selectedCategory === 'all') {
        d3.selectAll('rect').attr('fill-opacity', 1).attr('stroke-opacity', 1);

    } else {
        d3.selectAll('rect').attr('fill-opacity', 0.3).attr('stroke-opacity', 0.3);
        d3.selectAll('.' + selectedCategory).attr('fill-opacity', 1).attr('stroke-opacity', 1);;
        //console.log(selectedCategory);
    }

})*/

// BUTTONS
d3.selectAll('.category-selection button').on('click', function() {
    var selectedCategory = this.value;
    // console.log(selectedCategory.classed('all'), this.classList.remove('btn'))
    if (selectedCategory === 'all') {
        d3.selectAll('rect').attr('fill-opacity', 1).attr('stroke-opacity', 1);

    } else {
        d3.selectAll('rect').attr('fill-opacity', 0.3).attr('stroke-opacity', 0.3);
        d3.selectAll('.' + selectedCategory).attr('fill-opacity', 1).attr('stroke-opacity', 1);;
    }
})

// Highlight winners
d3.select('button.winner').on('click', function() {
    var toggleWinner = d3.select(this);
    toggleWinner.classed('selected', !toggleWinner.classed('selected'));
    var buttonText = toggleWinner.classed('selected') ? 'Hide winners' : 'Show winners';
    var strokeVal = toggleWinner.classed('selected') ? '#333333' : 'none';
    d3.selectAll('rect.winner').style('stroke', strokeVal);
    toggleWinner.html(buttonText);
})

draw();
window.addEventListener("resize", draw);