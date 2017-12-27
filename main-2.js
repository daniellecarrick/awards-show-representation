var Chart = (function(window, d3) {

    var svg, data, x, y, xAxis, yAxis, dim, chartWrapper, margin = {},
        width, height, color, colors, tip;

    d3.csv('data/data.csv', init); //load data, then initialize chart

    //called once the data is loaded
    function init(csv) {
        data = csv;
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

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return '<span><strong>' + d.nominee + '</strong></span><br /> <span>' + d.secondarynominee + '</span><br /><span>' + d.category + '</span>';
            });

        colors = ['#FF0064', '#ddd'];

        color = d3.scale.ordinal()
            .range(colors);

        //initialize scales
        xExtent = d3.extent(data, function(d, i) { return d.year });
        yExtent = d3.extent(data, function(d, i) { return d.order });
        x = d3.scale.linear().domain(xExtent);
        y = d3.scale.linear().domain(yExtent);
        //initialize axis
        xAxis = d3.svg.axis().orient('bottom').tickFormat(d3.format('d'));;
        yAxis = d3.svg.axis().orient('left');

        //initialize svg
        svg = d3.select('#chart-container').append('svg');
        chartWrapper = svg.append('g');
        marker = chartWrapper.selectAll('rect')
            .data(data).enter().append('rect')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        chartWrapper.append('g').classed('x axis', true);
        chartWrapper.append('g').classed('y axis', true);

        //render the chart
        render();
    }

    function render() {

        //get dimensions based on window size
        updateDimensions(window.innerWidth);

        //update x and y scales to new dimensions
        x.range([0, width]);
        y.range([height, 0]);

        //update svg elements to new dimensions
        svg.attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom);
        chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //update the axis and line
        xAxis.scale(x);
        yAxis.scale(y);

        svg.select('.x.axis')
            .attr('transform', 'translate(10,' + height + ')')
            .call(xAxis);

        svg.select('.y.axis')
            .call(yAxis);

        marker.classed('marker', true)
            .attr('x', function(d) { return x(d.year); })
            .attr('y', function(d) { return y(d.order); })
            .attr('height', markerDimensions(height, 35))
            .attr('width', markerDimensions(width, xExtent[1]-xExtent[0]))
            .style('fill', function(d) { return color(d.gender); });

        svg.call(tip);
    }

    function markerDimensions(dimension, maxmarkers) {
        // calculate marker height and width so they don't overlap
        return dimension / maxmarkers / 2;
    }

    function updateDimensions(winWidth) {
        margin.top = 20;
        margin.right = 50;
        margin.left = 50;
        margin.bottom = 50;

        width = winWidth - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
    }

    return {
        render: render
    }

})(window, d3);

window.addEventListener('resize', Chart.render);