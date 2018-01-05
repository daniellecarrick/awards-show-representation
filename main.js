function draw() {

    d3.select('#chart').remove();
    d3.select('#chart-container').append('div').attr('id', 'chart');

    var windowWidth = document.getElementById('wrapper').clientWidth;
    var windowHeight = 500;

    var margin = { top: 20, right: 20, bottom: 30, left: 10 },
        width = windowWidth - margin.left - margin.right,
        height = windowHeight - margin.top - margin.bottom;

    var breakPoint = {
        desktop: 900,
        mobile: 200,
        ipad: 500
    }

    var x = d3.time.scale()
        .range([0, width]);
    /*
            var x = d3.scale.linear()
            .range([0, width]);*/

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
    // .tickFormat(d3.format('d'));

    if (window.innerWidth < breakPoint.ipad) {
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
        .direction(function(d) {
            if (d.year < 854773200000) { // equivalent to 1997
                return 'e';
            } else if (d.year > 1422766800000) { //equivalent to 2015
                return 'w';
            } else {
                return 'n';
            }
        })
        .html(function(d) {
            if (d.winner === 'TRUE') {
                return '<span class="winner">WINNER</span><br/><span class="tip-name"><strong>' + d.name + '</strong></span><br /> <span class="tip-movie">' + d.movie + '</span><br /><span class="tip-category">' + d.category + '</span>';
            } else {
                return '<span class="tip-name"><strong>' + d.name + '</strong></span><br /> <span class="tip-movie">' + d.movie + '</span><br /><span class="tip-category">' + d.category + '</span>';
            }
        });

    svg.call(tip);


    var format = d3.time.format('%Y');
    var shortYear = d3.time.format('%y');


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

//console.log(format.parse(d.year));
//console.log(shortYear(format.parse(d.year)));
             d.year = format.parse(d.year);
            // var yo = shortYear(format.parse(d.year))
            //console.log(yo);
            //d.year = +d.year;

        });

        console.log(data);

        var xExtent = d3.extent(data, function(d) { return d.year; });
        var yExtent = d3.extent(data, function(d) { return d.order; });
        x.domain(xExtent);
        y.domain(yExtent);

        xAxis.tickFormat(shortYear);

        //X axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(7,' + (height + 10) + ')')
            .call(xAxis);

        // Add the rectangles
        svg.selectAll('rect')
            // .data(data.filter(function(d) { return d.className === "best-screenplay"}))
            .data(data)
            .enter().append('rect')
            .attr('class', function(d) { if (d.gender === 'F') { return d.className; } })
            //.classed('winner', function(d) { return d.winner === 'TRUE' })
            .classed('marker', true)
            // .classed('woman', function(d) { return d.gender === 'F' })
            .attr('height', markerDimensions(height, 20))
            // .attr('width', markerDimensions(width, xExtent[1] - xExtent[0]))
            .attr('width', markerDimensions(width, 20))
            .attr('x', function(d) { return x(d.year); })
            .attr('y', function(d) { return y(d.order); })
            .style('fill', function(d) {
                if (d.gender === 'F' && d.winner === 'TRUE') {
                    return 'url(#lightstripe)';
                    //return '#e26c76';
                } else {
                    return color(d.gender);
                }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    });
}



var annotations = {
    "best-director": ["4%", "0%"],
    "best-original-song": ["20%", "14%"],
    "best-original-score": ["5%", "4%"],
    "best-screenplay": ["9%", "9%"],
    "all": ["12%", "8%"]
};

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