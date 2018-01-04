function draw() {

    d3.select('#chart').remove();
    d3.select('#chart-container').append('div').attr('id', 'chart');

    var windowWidth = document.getElementById('wrapper').clientWidth;
    var windowHeight = 500;

    var margin = { top: 20, right: 30, bottom: 30, left: 10 },
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

    // grey for males, pink for females
    var colors = ['#eca0a6', '#cdcdcd'];

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
        xAxis.ticks(22)
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
            if (d.winner === 'TRUE') {
                return '<span class="winner">WINNER</span><br/><span class="tip-name"><strong>' + d.name + '</strong></span><br /> <span class="tip-movie">' + d.movie + '</span><br /><span class="tip-category">' + d.category + '</span>';
            } else {
                return '<span class="tip-name"><strong>' + d.name + '</strong></span><br /> <span class="tip-movie">' + d.movie + '</span><br /><span class="tip-category">' + d.category + '</span>';
            }
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
        y.domain(yExtent);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(10,' + (height + 10) + ')')
            .call(xAxis);

        /*svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -40)
            .attr('dy', '.71em')
            .style('text-anchor', 'middle')
            .text('Number of movies')
*/
        // Add the rectangles
        svg.selectAll('rect')
            // .data(data.filter(function(d) { return d.className === "best-screenplay"}))
            .data(data)
            .enter().append('rect')
            .attr('class', function(d) { if (d.gender === 'F') { return d.className; }})
            //.classed('winner', function(d) { return d.winner === 'TRUE' })
            .classed('marker', true)
           // .classed('woman', function(d) { return d.gender === 'F' })
            .attr('height', markerDimensions(height, xExtent[1] - xExtent[0]))
            // .attr('width', markerDimensions(width, xExtent[1] - xExtent[0]))
            .attr('width', markerDimensions(width, 20))
            .attr('x', function(d) { return x(d.year); })
            .attr('y', function(d) { return y(d.order); })
            .style('fill', function(d) {
                if (d.gender === 'F' && d.winner === 'TRUE') {
                    return 'url(#lightstripe)';
                } else {
                    return color(d.gender);
                }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    });
}



var annotations = {
    "best-director": ["3%", "0%"],
    "best-original-song" :["19%", "14%"],
    "best-original-score":["4%", "0%"],
    "best-screenplay": [ "7%", "9%"],
    "all": ["11%", "8%"]
};
console.log(annotations["best-screenplay"][0]);

// BUTTONS
d3.selectAll('.category-selection button').on('click', function() {
    var selectedCategory = this;
    d3.selectAll('.category-selection button').classed('selected', false);
    d3.select(this).classed('selected', !d3.select(this).classed('selected'));

    //grab the current value
    var nomineeNumber = annotations[selectedCategory.value][0];
    var winnerNumber = annotations[selectedCategory.value][1];

    // drop that value into viz
    d3.select('.winners .stat-highlight').html(winnerNumber);
    d3.select('.nominees .stat-highlight').html(nomineeNumber);

    console.log(nomineeNumber, winnerNumber);
    if (selectedCategory.value === 'all') {
        d3.selectAll('rect').attr('fill-opacity', 1);
    } else {
        d3.selectAll('.marker').attr('fill-opacity', 0.3);
        d3.selectAll('.' + selectedCategory.value).attr('fill-opacity', 1);
    }
})


draw();
window.addEventListener("resize", draw);