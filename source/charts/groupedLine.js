charts.extend({
    groupedLine: function(obj) {
        var chartID = "groupedLine"+Math.round(Math.random()*1000000);
        // Map obj.data to a usable format
        var mapData = function(d) {
            var result = [];
            for (var i in d) {
                if (d.hasOwnProperty(i)) {
                    d[i] = d[i].sort();
                    if (obj.time) {
                        var x = new Date(i).getTime();
                    } else {
                        var x = i;
                    }
                    for (var z in d[i]) {
                        result.push({
                            x: x,
                            y: d[i][z]
                        });
                    }   
                }
            }
            return result;
        };
        var eliminateDuplicates = function(arr) {
            var i,
                len = arr.length,
                out = [],
                dupe = [],
                sorted_arr = arr.sort();

            for (i = 0; i < len - 1; i++) {
                if ((sorted_arr[i + 1].y !== sorted_arr[i].y) || (sorted_arr[i + 1].x !== sorted_arr[i].x)) {
                    out.push(arr[i]);
                }
            }
            out.push(arr[--len]);
            dupe = arr.filter(function(i) {
                return !(out.indexOf(i) > -1);
            });
            return { noDupe: out, dupe: dupe };
        };

        var data = eliminateDuplicates(mapData(obj.data)),
            dataOverlap = data.dupe;
        console.log(data);
        data = data.noDupe;
        console.log(data);
        
        var margin = {};
        obj.margin = obj.margin || {};
        margin.top    = typeof obj.margin.top    === 'number' ? obj.margin.top    : 20;
        margin.right  = typeof obj.margin.right  === 'number' ? obj.margin.right  : 20;
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

        // Marker on x axis
        var xMarker = obj.xMarker || false;
        if (xMarker && typeof xMarker === 'number' && !obj.time) xMarker = obj.xMarker;
        if (xMarker && obj.time) var xMarker = new Date(obj.xMarker).getTime();

        // Marker on y axis
        var yMarker = (obj.yMarker && typeof obj.yMarker === 'number') ? obj.yMarker : false;

        if (obj.time === true) {
            // Force dates into miliseconds
            for (var i = 0,len = data.length; i < len; i++) {
                data[i].x = parseFloat(new Date(data[i].x).getTime());
            }
            data.sort(function(curr, next) {
                var mcurr = new Date(curr.x),
                    mnext = new Date(next.x);
                if (mcurr < mnext) return -1; 
                if (mcurr > mnext) return 1; 
                return 0;
            });
            // Either set maximum/minumum x to specified ones, or calculate based on maximum/minumum x in data
            var xMax = obj.xMax ? new Date(obj.xMax) : 0;
            if (xMax === 0) {
                (function() {
                    xMax = new Date(data[0].x);
                    var m;
                    for (var i = 0,len = data.length; i < len; i++) {
                        m = new Date(data[i].x);
                        if (m > xMax) xMax = m;
                    }
                })();
            }

            var xMin = obj.xMin ? new Date(obj.xMin) : 0;
            if (xMin === 0) {
                (function() {
                    xMin = new Date(data[0].x);
                    var m;
                    for (var i = 0,len = data.length; i < len; i++) {
                        m =  new Date(data[i].x);
                        if (m < xMin) xMin = m;
                    }
                })();
            }

            // var x = d3.time.scale().domain([Date.parse('July 1 2012'), Date.parse('July 10 2012')]).range([0,500])
            var x = d3.time.scale()
                .domain([new Date(xMin), new Date(xMax)])
                .range([0, width]);
        } else {
            // Either set maximums to specified ones, or calculate based on maximum point
            var xMax = (obj.xMax && typeof obj.xMax === 'number') ? obj.xMax : 0;
            if (xMax === 0) {
                (function() {
                    var point = {};
                    for (var i = 0,len = data.length; i < len; i++) {
                        point = data[i];
                        if (point.x > xMax) xMax = point.x;
                    }
                })();
            }

            var x = d3.scale.linear()
                .domain([0, xMax])
                .range([0, width]);

        }
        var yMax = (obj.yMax && typeof obj.yMax === 'number') ? obj.yMax : 0;
        if (yMax === 0) {
            (function() {
                var findYMax = yMax === 0 ? true : false;
                var point = {};
                for (var i = 0,len = data.length; i < len; i++) {
                    point = data[i];
                    if (findYMax && point.y > yMax) yMax = point.y;
                }
            })();
        }
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
            .attr("id", chartID)
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

        // Line connecting points
        // svg.append("path")
        //     .attr("class", "line")
        //     .attr("d", line)
        //     .style("fill", "none")
        //     .style("stroke", obj.color)
        //     .style("stroke-width", "1.5px");

        if (obj.popover && jQuery) {
            svg.selectAll(".dot")
                .data(data)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", line.x())
                .attr("cy", line.y())
                .attr("r", 3.5)
                .attr("rel", "popover")
                .attr("data-title", function(d){
                    return d.y;
                })
                .attr("data-content", function(d){
                    return obj.xlabel+': '+ (new Date(d.x).toLocaleDateString()) +'<br>'+
                        obj.ylabel+': '+d.y;
                })
                .style("fill", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke-width", "1.5px");

            svg.selectAll(".circle")
                .data(dataOverlap)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", line.x())
                .attr("cy", line.y())
                .attr("r", 6.5)
                .attr("rel", "popover")
                .attr("data-title", function(d){
                    return d.y;
                })
                .attr("data-content", function(d){
                    return obj.xlabel+': '+ (new Date(d.x).toLocaleDateString()) +'<br>'+
                        obj.ylabel+': '+d.y;
                })
                .style("fill", "none")
                .style("stroke", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke-width", "2px");
            jQuery('circle').popover();
        } else {
            svg.selectAll(".dot")
                .data(data)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", line.x())
                .attr("cy", line.y())
                .attr("r", 3.5)
                .style("fill", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke-width", "1.5px");

            svg.selectAll(".circle")
                .data(dataOverlap)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", line.x())
                .attr("cy", line.y())
                .attr("r", 6.5)
                .style("fill", "none")
                .style("stroke", function(d) {
                    if (obj.boxColors && yMarker) {
                        if (d.y < yMarker) {
                            return obj.boxColors['belowLine'] || obj.color;
                        }
                        if (d.y > yMarker) {
                            return obj.boxColors['aboveLine'] || obj.color;
                        }
                        if (d.y == yMarker) {
                            return obj.boxColors['onLine'] || obj.color;
                        }
                    }
                    return obj.color;
                })
                .style("stroke-width", "2px");
        }

        // RECTANGLES/BOXES/GROUPS
        (function() {
            for (var group in obj.data) {
                if (obj.data.hasOwnProperty(group)) {
                    var groupData = obj.data[group].sort(),
                        maxData = groupData[groupData.length-1],
                        minData = groupData[0],
                        rectX = x(new Date(group).valueOf()), // x coord of rectangle
                        rectY = y(maxData), // y coord of rectangle
                        boxColor;
                    
                    // Should we color boxes based off position?
                    if (obj.boxColors && yMarker) {
                        // Decide if the box is on, below or above the line
                        if (maxData < yMarker) var boxPos = 'belowLine';
                        if (minData > yMarker) var boxPos = 'aboveLine';
                        if (maxData > yMarker && minData < yMarker) var boxPos = 'onLine';
                        boxColor = obj.boxColors[boxPos] || obj.color;
                    } else {
                        boxColor = obj.color;
                    }

                    svg.append("svg:rect")
                        .attr("class", "box")
                        .attr("x", rectX-5)
                        .attr("y", rectY-5)
                        .attr("width", 10)
                        .attr("height", y(minData)-rectY+10)
                        .style("fill", "none")
                        .style("stroke", boxColor)
                        .style("stroke-width", "1.5px");
                }
            }
        })();


        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = 
            '.lineChart .axis path, .lineChart .axis line {'+
            '  fill: none;'+
            '  stroke: #000;'+
            '  shape-rendering: crispEdges;'+
            '}';
        if (obj.popover) style.innerHTML = style.innerHTML + '.tooltip{position:absolute;z-index:1020;display:block;padding:5px;font-size:11px;opacity:0;filter:alpha(opacity=0);visibility:visible}.tooltip.in{opacity:.8;filter:alpha(opacity=80)}.tooltip.top{margin-top:-2px}.tooltip.right{margin-left:2px}.tooltip.bottom{margin-top:2px}.tooltip.left{margin-left:-2px}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;text-decoration:none;background-color:#000;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0}.popover{position:absolute;top:0;left:0;z-index:1010;display:none;padding:5px}.popover.top{margin-top:-5px}.popover.right{margin-left:5px}.popover.bottom{margin-top:5px}.popover.left{margin-left:-5px}.popover.top .arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.popover.right .arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.popover.bottom .arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.popover.left .arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.popover .arrow{position:absolute;width:0;height:0}.popover-inner{width:280px;padding:3px;overflow:hidden;background:#000;background:rgba(0,0,0,0.8);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 3px 7px rgba(0,0,0,0.3);-moz-box-shadow:0 3px 7px rgba(0,0,0,0.3);box-shadow:0 3px 7px rgba(0,0,0,0.3)}.popover-title{margin:0;padding:9px 15px;line-height:1;background-color:#f5f5f5;border-bottom:1px solid #eee;-webkit-border-radius:3px 3px 0 0;-moz-border-radius:3px 3px 0 0;border-radius:3px 3px 0 0}.popover-content{padding:14px;background-color:#fff;-webkit-border-radius:0 0 3px 3px;-moz-border-radius:0 0 3px 3px;border-radius:0 0 3px 3px;-webkit-background-clip:padding-box;-moz-background-clip:padding-box;background-clip:padding-box}.popover-content p,.popover-content ul,.popover-content ol{margin-bottom:0}';

        return {
            id: chartID,
            obj: obj,
            remove: function() {
                var oldElem = document.getElementById(this.id),
                    placeholder = document.createElement('div');
                placeholder.setAttribute('id',this.id);

                oldElem.parentNode.replaceChild(placeholder, oldElem);
                return this;
            },
            redraw: function(data) {
                this.remove();
                this.obj.data = data;
                this.obj.container = '#'+this.id;

                console.log(this.obj);
                return charts.groupedLine(this.obj);
            },
            add: function(data) {
                this.redraw(charts.extend(this.obj.data,data));
                return this;
            }
        };
    }
});