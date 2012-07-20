var charts = {};

(function(window,charts,undefined) {
	var type = function( obj ) {
		var class2type = JSON.parse({"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"});
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	};

	var isPlainObject = function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || type(obj) !== "object" || obj.nodeType || (obj != null && obj == obj.window) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	};

	var isArray = Array.isArray || function( obj ) {
		return type(obj) === "array";
	};

	charts.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target !== "function") {
			target = {};
		}

		// extend charts itself if only one argument is passed
		if ( length === i ) {
			target = charts;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = charts.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};
})(this,charts);
charts.extend({
  donut: function(obj) {
    //Width, Height and radius of Donut Chart
    var data = [],
        cats = [],
        colors = [];
    
    //New color function using d3 scale.
    var d3color = d3.scale.category20();

    (function() {
      for (var i = 0, _len = obj.sections.length; i < _len; i++) {
        var _data  = obj.sections[i].data,
            _label = obj.sections[i].label,
            _color = obj.sections[i].color;

        // fix inputs
        _label = (_label && _label !== '' && _label !== 'undefined') ? _label : '';
        _color = (_color && _color !== '' && _color !== 'undefined') ? _color : d3color(i);

        // make sure the section has data (we don't want empty sections)
        if (typeof _data !== 'number' || _data === 0) {
          continue;
        } else {
          data[i]   = _data;
          cats[i]   = _label;
          colors[i] = _color;
        }
      }
    })();
    console.log('colors recieved:', colors);

    var centerLabel = obj.centerLabel || "",
        sel = obj.container || 'body',
        w = obj.width || 400,
        h = obj.height || 400,
        r = w / 2,
        donut = d3.layout.pie().sort(null), // Scale for the arc length of Chart using D3
        arc = d3.svg.arc().innerRadius(1.2*r/3).outerRadius(r);

    
    
    //Insert an svg element
    
    var svg = d3.select(sel).append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")  
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    //Adding the wedges to the chart
    var g = svg.selectAll("g")
          .data(donut(data))
        .enter().append("svg:g");
    
    g.append("svg:path")
          .attr("d", arc)
          .style("fill",function(d, i) { return colors[i]; })
        .style("stroke", '#fff')
        .append("svg:title")
          .text(function(d) {return String(d.data) + " votes";});
    
    g.append("svg:text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
          .style("font", r/13+"px sans-serif")
          .style("fill","white")
      .text(function(d, i) { return cats[i]; });
    
    
    //adding text to the middle of donut hole
    svg.append("svg:text")
        .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("font","bold "+r/10+"px Helvetica, Georgia")
        .text(centerLabel)
    
      
    // Computes the angle of an arc, converting from radians to degrees.
      function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
      }
  }
});
charts.extend({
  gauge: function(configuration) {
    function Gauge(configuration) {
      this.placeholderName = (configuration.container && configuration.container !== '' && configuration.container !== 'undefined') ? configuration.container : 'body';
      var self = this; // some internal d3 functions do not "like" the "this" keyword, hence setting a local variable
      this.configure = function (configuration) {
        this.config = configuration;
        this.config.value = configuration.value || 0;
        this.config.size = this.config.size * 0.9;
          if(!this.config.size || (this.config.size<=0)) this.config.size = 120*0.9;
        console.log(this.config.size);
        this.config.raduis = this.config.size * 0.97 / 2;
        this.config.cx = this.config.size / 2;
        this.config.cy = this.config.size / 2;
        this.config.min = configuration.min || 0;
        this.config.max = configuration.max || 100;
        this.config.range = this.config.max - this.config.min;
        this.config.majorTicks = configuration.majorTicks || 5;
        this.config.minorTicks = configuration.minorTicks || 2;

        this.config.redZones = [];
        this.config.redZones.push(configuration.zones.red);

        this.config.yellowZones = [];
        this.config.yellowZones.push(configuration.zones.yellow);
        
        this.config.greenZones = [];
        this.config.greenZones.push(configuration.zones.green);

        this.config.greenColor = configuration.greenColor || "#109618";
        this.config.yellowColor = configuration.yellowColor || "#FF9900";
        this.config.redColor = configuration.redColor || "#DC3912";
      }
      this.render = function () {
        this.body = d3.select(this.placeholderName).append("svg:svg").attr("class", "gauge").attr("width", this.config.size).attr("height", this.config.size);
        this.body.append("svg:circle").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", this.config.raduis).style("fill", "#ccc").style("stroke", "#000").style("stroke-width", "0.5px");
        this.body.append("svg:circle").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", 0.9 * this.config.raduis).style("fill", "#fff").style("stroke", "#e0e0e0").style("stroke-width", "2px");
        for (var index in this.config.greenZones) {
          this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
        }
        for (var index in this.config.yellowZones) {
          this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
        }
        for (var index in this.config.redZones) {
          this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
        }
        if (undefined != this.config.label) {
          var fontSize = Math.round(this.config.size / 9);
          this.body.append("svg:text").attr("x", this.config.cx).attr("y", this.config.cy / 2 + fontSize / 2).attr("dy", fontSize / 2).attr("text-anchor", "middle").text(this.config.label).style("font-size", fontSize + "px").style("font-family", "Arial").style("fill", "#333").style("stroke-width", "0px");
        }
        var fontSize = Math.round(this.config.size / 16);
        var majorDelta = this.config.range / (this.config.majorTicks - 1);
        for (var major = this.config.min; major <= this.config.max; major += majorDelta) {
          var minorDelta = majorDelta / this.config.minorTicks;
          for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
            var point1 = this.valueToPoint(minor, 0.75);
            var point2 = this.valueToPoint(minor, 0.85);
            this.body.append("svg:line").attr("x1", point1.x).attr("y1", point1.y).attr("x2", point2.x).attr("y2", point2.y).style("stroke", "#666").style("stroke-width", "1px");
          }
          var point1 = this.valueToPoint(major, 0.7);
          var point2 = this.valueToPoint(major, 0.85);
          this.body.append("svg:line").attr("x1", point1.x).attr("y1", point1.y).attr("x2", point2.x).attr("y2", point2.y).style("stroke", "#333").style("stroke-width", "2px");
          if (major == this.config.min || major == this.config.max) {
            var point = this.valueToPoint(major, 0.63);
            this.body.append("svg:text").attr("x", point.x).attr("y", point.y).attr("dy", fontSize / 3).attr("text-anchor", major == this.config.min ? "start" : "end").text(major).style("font-size", fontSize + "px").style("font-family", "Arial").style("fill", "#333").style("stroke-width", "0px");
          }
        }
        var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
        this.drawPointer(0);
        pointerContainer.append("svg:circle").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", 0.12 * this.config.raduis).style("fill", "#4684EE").style("stroke", "#666").style("opacity", 1);

        return this;
      }
      this.redraw = function (value) {
        this.drawPointer(value);

        return this;
      }
      this.drawBand = function (start, end, color) {
        if (0 >= end - start) return;
        this.body.append("svg:path").style("fill", color).attr("d", d3.svg.arc().startAngle(this.valueToRadians(start)).endAngle(this.valueToRadians(end)).innerRadius(0.65 * this.config.raduis).outerRadius(0.85 * this.config.raduis)).attr("transform", function () {
          return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)"
        });
      }
      this.drawPointer = function (value) {
        var delta = this.config.range / 13;
        var head = this.valueToPoint(value, 0.85);
        var head1 = this.valueToPoint(value - delta, 0.12);
        var head2 = this.valueToPoint(value + delta, 0.12);
        var tailValue = value - (this.config.range * (1 / (270 / 360)) / 2);
        var tail = this.valueToPoint(tailValue, 0.28);
        var tail1 = this.valueToPoint(tailValue - delta, 0.12);
        var tail2 = this.valueToPoint(tailValue + delta, 0.12);
        var data = [head, head1, tail2, tail, tail1, head2, head];
        var line = d3.svg.line().x(function (d) {
          return d.x
        }).y(function (d) {
          return d.y
        }).interpolate("basis");
        var pointerContainer = this.body.select(".pointerContainer");
        var pointer = pointerContainer.selectAll("path").data([data])
        pointer.enter().append("svg:path").attr("d", line).style("fill", "#dc3912").style("stroke", "#c63310").style("fill-opacity", 0.7)
        pointer.transition().attr("d", line)
        //.ease("linear")
        //.duration(5000);
        var fontSize = Math.round(this.config.size / 10);
        pointerContainer.selectAll("text").data([value]).text(Math.round(value)).enter().append("svg:text").attr("x", this.config.cx).attr("y", this.config.size - this.config.cy / 4 - fontSize).attr("dy", fontSize / 2).attr("text-anchor", "middle").text(Math.round(value)).style("font-size", fontSize + "px").style("font-family", "Arial").style("fill", "#000").style("stroke-width", "0px");
      }
      this.valueToDegrees = function (value) {
        return value / this.config.range * 270 - 45;
      }
      this.valueToRadians = function (value) {
        return this.valueToDegrees(value) * Math.PI / 180;
      }
      this.valueToPoint = function (value, factor) {
        var point = {
          x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
          y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value))
        }
        return point;
      }
      // initialization
      this.configure(configuration);
    }

    var _gauge = new Gauge(configuration).render();
    return _gauge.redraw(_gauge.config.value);
  }
});
charts.extend({
    groupedLine: function(obj) {
        console.log('obj.data', obj.data);
        var data = [];
        // Map obj.data to a usable format
        for (var i in obj.data) {
            if (obj.data.hasOwnProperty(i)) {
                if (obj.time) {
                    var x = new Date(i).getTime();
                } else {
                    var x = i;
                }
                for (var z in obj.data[i]) {
                    data.push({
                        x: x,
                        y: obj.data[i][z]
                    });
                }
            }
        }
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
        //svg.append("path")
        //    .attr("class", "line")
        //    .attr("d", line)
        //    .style("fill", "none")
        //    .style("stroke", obj.color)
        //    .style("stroke-width", "1.5px");

        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5)
            .style("fill", function(d) {
                console.log(d, yMarker);
                if (obj.boxColors && yMarker) {
                    if (d.y < yMarker) {
                        console.log('belowLine');
                        return obj.boxColors['belowLine'] || obj.color;
                    }
                    if (d.y > yMarker) {
                        console.log('aboveLine');
                        return obj.boxColors['aboveLine'] || obj.color;
                    }
                    if (d.y = yMarker) {
                        console.log('onLine');
                        return obj.boxColors['onLine'] || obj.color;
                    }
                }
                return obj.color;
            })
            .style("stroke", function(d) {
                console.log(d, yMarker);
                if (obj.boxColors && yMarker) {
                    if (d.y < yMarker) {
                        console.log('belowLine');
                        return obj.boxColors['belowLine'] || obj.color;
                    }
                    if (d.y > yMarker) {
                        console.log('aboveLine');
                        return obj.boxColors['aboveLine'] || obj.color;
                    }
                    if (d.y = yMarker) {
                        console.log('onLine');
                        return obj.boxColors['onLine'] || obj.color;
                    }
                }
                return obj.color;
            })
            .style("stroke-width", "1.5px");

        (function() {
            for (var group in obj.data) {
                if (obj.data.hasOwnProperty(group)) {
                    var groupData = obj.data[group].sort(),
                        maxData = groupData.pop(),
                        minData = groupData.shift(),
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
    }
});
charts.extend({
    line: function(obj) {
        console.log('obj', obj);
        var data = obj.data,
            margin = {};

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
            console.log(data);
            // Either set maximum/minumum x to specified ones, or calculate based on maximum/minumum x in data
            console.log('obj.xMax: ', obj.xMax);
            var xMax = obj.xMax ? new Date(obj.xMax) : 0;
            if (xMax === 0) {
                (function() {
                    xMax = new Date(data[0].x);
                    var m;
                    for (var i = 0,len = data.length; i < len; i++) {
                        m = new Date(data[i].x);
                        console.log('m: ', m);
                        if (m > xMax) xMax = m;
                    }
                })();
            }
            console.log('xMax: ', new Date(xMax));

            console.log('obj.xMin: ', obj.xMin);
            var xMin = obj.xMin ? new Date(obj.xMin) : 0;
            if (xMin === 0) {
                (function() {
                    xMin = new Date(data[0].x);
                    var m;
                    for (var i = 0,len = data.length; i < len; i++) {
                        m =  new Date(data[i].x);
                        console.log('m: ', m);
                        if (m < xMin) xMin = m;
                    }
                })();
            }
            console.log('xMin: ', new Date(xMin));

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
            console.log('xMarker: ', xMarker);
            console.log('xMarkerPX: ', xMarkerPX);
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
// Requires ../charts/donut.js

charts.extend({
	behavior: function(data,sel,w,h) {
		console.log(data);

		var positive = data['positive'],
			negative = data['negative'],
			neutral  = data['neutral'],
			values = [];

		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};

		(function() {
			var behaviorArr = ['positive', 'negative', 'neutral'];
			for (var b in behaviorArr) {
				var currentBehavior = behaviorArr[b],
					sizeOfBehavior = Object.size(data[currentBehavior]);
				console.log(currentBehavior);

				var colorScale = d3.scale.linear().domain([0,sizeOfBehavior]).range([100,256]); // Linear scale for colors
				var j = 0; // counter
				for (var i in data[currentBehavior]) {
					console.log(i, j);
					if (currentBehavior === 'positive') var _color = "rgb(0,"+colorScale(j)+",0)";
					if (currentBehavior === 'negative') var _color = "rgb("+colorScale(j)+",0,0)";
					if (currentBehavior === 'neutral' ) var _color = "rgb("+colorScale(j)+","+colorScale(j)+","+colorScale(j)+")";

					values.push({
						data: data[currentBehavior][i],
						label: i,
						color: _color
					});
					j++;
				}
			}
		})();
		console.log('values', values);

		this.donut({
			sections: values,
			centerLabel: 'Behavior',
			container: sel,
			width: w,
			height: h
		});
	}
});
// Requires ../charts/line.js

charts.extend({
	DRA: function(obj) {
		var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined,
	        data = [],
	        scores = obj.scores;

		obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;

        // Map scores to a usable format
        for (var i in scores) {
        	if (scores.hasOwnProperty(i)) {
        		console.log(i, scores[i]);
        		data.push({
        			x: i,
        			y: scores[i]
        		});
        	}
        }

        // sort data
        data.sort(function(curr,next) {
        	if (curr.x < next.x) return -1;
        	if (curr.x > next.x) return 1;
        	return 0;
        })

        console.log('data: ', data);

        var lineCall = {
			time: true,
			data: data,
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score'
		};
		console.log(lineCall);
		this.line(lineCall);
	},


	DRAPlain: function(obj) {
		var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined,
	        data = [],
	        scores = obj.scores;

		obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;

        // Map scores to a usable format
        for (var i in scores) {
        	if (scores.hasOwnProperty(i)) {
        		console.log(i, scores[i]);
        		data.push({
        			x: i,
        			y: scores[i]
        		});
        	}
        }

        // sort data
        data.sort(function(curr,next) {
        	if (curr.x < next.x) return -1;
        	if (curr.x > next.x) return 1;
        	return 0;
        })

		this.line({
			time: false,
			data: data,
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score',
			xMax: xMax,
			yMax: 60,
			xMarker: obj.deadline,
			yMarker: obj.goal,
			container: obj.container,
			width:  obj.width,
			height: obj.height
		});
	},
});
