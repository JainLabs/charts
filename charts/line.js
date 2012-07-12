charts.extend({
    line: function(obj) {
        //var data = d3.range(40).map(function(i) {
        //  return {x: i / 39, y: (Math.sin(i / 3) + 2) / 4};
        //});

        var data = obj.data,
            margin = {};
        
        obj.margin = obj.margin || {};
        margin.top    = typeof obj.margin.top    === 'number' ? obj.margin.top    : 10;
        margin.right  = typeof obj.margin.right  === 'number' ? obj.margin.right  : 10;
        margin.bottom = typeof obj.margin.bottom === 'number' ? obj.margin.bottom : 20;
        margin.left   = typeof obj.margin.left   === 'number' ? obj.margin.left   : 40;

        obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
        obj.color     = (obj.color && obj.color !== '' && obj.color !== 'undefined') ? obj.color : 'steelblue';
        console.log(obj.color);

        
        var width = obj.width - margin.left - margin.right,
            height = obj.height - margin.top - margin.bottom;

        var xMax = 0, yMax = 0;
        (function() {
            var point = {};
            for (var i = 0,len = data.length; i < len; i++) {
                point = data[i];
                if (point.x > xMax) xMax = point.x;
                if (point.y > yMax) yMax = point.y;
            }
        })();
        console.log(xMax, yMax);

        var x = d3.scale.linear()
            .domain([0, xMax])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, yMax])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        var svg = d3.select(obj.container).append("svg")
            .datum(data)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("path")
            .attr("class", "line")
            .attr("d", line);

        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5);
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = 
            'body {'+
            '  font: 10px sans-serif;'+
            '}'+
            '.axis path, .axis line {'+
            '  fill: none;'+
            '  stroke: #000;'+
            '  shape-rendering: crispEdges;'+
            '}'+
            '.line {'+
            '  fill: none;'+
            '  stroke: '+obj.color+';'+
            '  stroke-width: 1.5px;'+
            '}'+
            '.dot {'+
            '  fill: white;'+
            '  stroke: '+obj.color+';'+
            '  stroke-width: 1.5px;'+
            '}'
    }
});