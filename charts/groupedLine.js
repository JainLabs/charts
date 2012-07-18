charts.extend({
    groupedLine: function(obj) {
        var data = obj.data,
            margin = {};

        obj.margin = obj.margin || {};
        margin.top    = typeof obj.margin.top    === 'number' ? obj.margin.top    : 20;
        margin.right  = typeof obj.margin.right  === 'number' ? obj.margin.right  : 10;
        margin.bottom = typeof obj.margin.bottom === 'number' ? obj.margin.bottom : 30;
        margin.left   = typeof obj.margin.left   === 'number' ? obj.margin.left   : 40;

        obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : 500;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : 400;

        obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
        obj.color     = (obj.color && obj.color !== '' && obj.color !== 'undefined') ? obj.color : 'steelblue';

        obj.title     = (obj.title && obj.title !== '' && obj.title !== 'undefined') ? obj.title : '';
        obj.xlabel    = (obj.xlabel && obj.xlabel !== '' && obj.xlabel !== 'undefined') ? obj.xlabel : '';
        obj.ylabel    = (obj.ylabel && obj.ylabel !== '' && obj.ylabel !== 'undefined') ? obj.ylabel : '';

        var width  = obj.width - margin.left - margin.right,
            height = obj.height - margin.top - margin.bottom;

        // Either set maximums to specified ones, or calculate based on maximum point
        var xMax = (obj.xMax && typeof obj.xMax === 'number') ? obj.xMax : 0,
            yMax = (obj.yMax && typeof obj.yMax === 'number') ? obj.yMax : 0;
        if (xMax === 0 || yMax === 0) {
            (function() {
                var findXMax = xMax === 0 ? true : false;
                var findYMax = yMax === 0 ? true : false;

                var point = {};
                for (var i = 0,len = data.length; i < len; i++) {
                    point = data[i];
                    if (findXMax && point.x > xMax) xMax = point.x;
                    if (findYMax && point.y > yMax) yMax = point.y;
                }
            })();
        }

        var xMarker = (obj.xMarker && typeof obj.xMarker === 'number') ? obj.xMarker : false,
            yMarker = (obj.yMarker && typeof obj.yMarker === 'number') ? obj.yMarker : false;

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
            .attr("class", "lineChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("font", "10px sans-serif")
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // title
        svg.append("svg:text")
            .attr("x", width/2+"px")
            .attr("text-anchor", "middle")
            .style("font-weight","bold")
            .style("font-size","16px")
            .text(obj.title);

        // x axis label
        svg.append("svg:text")
            .attr("x", width/2+"px")
            .attr("y", height+29+"px")
            .attr("text-anchor", "middle")
            .style("font-weight","bold")
            .style("font-size","12px")
            .text(obj.xlabel);

        // y axis label
        svg.append("svg:text")
            .attr("x", -height/2+"px")
            .attr("y", -29+"px")
            .attr("text-anchor", "middle")
            .attr("transform","rotate(-90)")
            .style("font-weight","bold")
            .style("font-size","12px")
            .text(obj.ylabel);

        if (xMarker) {
            var xMarkerPX = (x(xMarker)).toString();
            svg.append("line")
                .attr("x1", xMarkerPX)
                .attr("y1", "0")
                .attr("x2", xMarkerPX)
                .attr("y2", height.toString())
                .style("stroke","black");
        }

        if (yMarker) {
            var yMarkerPX = (y(yMarker)).toString();
            svg.append("line")
                .attr("x1", "0")
                .attr("y1", yMarkerPX)
                .attr("x2", width.toString())
                .attr("y2", yMarkerPX)
                .style("stroke","black");
        }

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("path")
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", obj.color)
            .style("stroke-width", "1.5px");

        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5)
            .style("fill", "white")
            .style("stroke", obj.color)
            .style("stroke-width", "1.5px");


        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = 
            '.lineChart .axis path, .lineChart .axis line {'+
            '  fill: none;'+
            '  stroke: #000;'+
            '  shape-rendering: crispEdges;'+
            '}';
    }
});