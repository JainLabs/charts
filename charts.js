// Copyright (C) 2012 JainLabs, Ajay Jain, Paras Jain
// This software is icensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License, found at http://creativecommons.org/licenses/by-nc/3.0/.
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
        colors = [],
        chartID = "donut"+Math.round(Math.random()*1000000); // random id for SVG
    
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

    var centerLabel = obj.centerLabel || "",
        sel = obj.container || 'body',
        w = obj.width || 400,
        h = obj.height || 400,
        r = w / 2,
        donut = d3.layout.pie().sort(null), // Scale for the arc length of Chart using D3
        arc = d3.svg.arc().innerRadius(1.2*r/3).outerRadius(r);

    
    
    //Insert an svg element
    
    var svg = d3.select(sel).append("svg:svg")
      .attr("id", chartID)
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
        .style("stroke", '#fff');
    
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
        this.obj.sections = data;
        this.obj.container = '#'+this.id;

        return charts.donut(this.obj);
      },
      add: function(data) {
        this.redraw(this.obj.sections.concat(data));
        return this;
      }
    };
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
// Copyright (C) 2012 JainLabs, Ajay Jain, Paras Jain
// This software is icensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License, found at http://creativecommons.org/licenses/by-nc/3.0/.

charts.extend({
	groupedLine: function(obj) {
        // Clone objects
        var clone = function(objToClone) {
          var newObj = (objToClone instanceof Array) ? [] : {};
          for (i in objToClone) {
            if (i == 'clone') continue;
            if (objToClone[i] && typeof objToClone[i] == "objToCloneect") {
              newObj[i] = objToClone[i].clone();
            } else newObj[i] = objToClone[i]
          } return newObj;
        };

		var style = document.createElement('style');
		document.head.appendChild(style);
		style.innerHTML = 
			'.lineChart .axis path, .lineChart .axis line {'+
			'  fill: none;'+
			'  stroke: #000;'+
			'  shape-rendering: crispEdges;'+
			'}';
		// Add popover styles and scripts
		if (obj.popover && jQuery) {
			style.innerHTML = style.innerHTML + '.tooltip{position:absolute;z-index:1020;display:block;padding:5px;font-size:11px;opacity:0;filter:alpha(opacity=0);visibility:visible}.tooltip.in{opacity:.8;filter:alpha(opacity=80)}.tooltip.top{margin-top:-2px}.tooltip.right{margin-left:2px}.tooltip.bottom{margin-top:2px}.tooltip.left{margin-left:-2px}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;text-decoration:none;background-color:#000;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0}.popover{position:absolute;top:0;left:0;z-index:1010;display:none;padding:5px}.popover.top{margin-top:-5px}.popover.right{margin-left:5px}.popover.bottom{margin-top:5px}.popover.left{margin-left:-5px}.popover.top .arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.popover.right .arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.popover.bottom .arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.popover.left .arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.popover .arrow{position:absolute;width:0;height:0}.popover-inner{width:280px;padding:3px;overflow:hidden;background:#000;background:rgba(0,0,0,0.8);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 3px 7px rgba(0,0,0,0.3);-moz-box-shadow:0 3px 7px rgba(0,0,0,0.3);box-shadow:0 3px 7px rgba(0,0,0,0.3)}.popover-title{margin:0;padding:9px 15px;line-height:1;background-color:#f5f5f5;border-bottom:1px solid #eee;-webkit-border-radius:3px 3px 0 0;-moz-border-radius:3px 3px 0 0;border-radius:3px 3px 0 0}.popover-content{padding:14px;background-color:#fff;-webkit-border-radius:0 0 3px 3px;-moz-border-radius:0 0 3px 3px;border-radius:0 0 3px 3px;-webkit-background-clip:padding-box;-moz-background-clip:padding-box;background-clip:padding-box}.popover-content p,.popover-content ul,.popover-content ol{margin-bottom:0}';
			!function(b){var a=function(d,c){this.init("tooltip",d,c)};a.prototype={constructor:a,init:function(f,e,d){var g,c;this.type=f;this.$element=b(e);this.options=this.getOptions(d);this.enabled=true;if(this.options.trigger!="manual"){g=this.options.trigger=="hover"?"mouseenter":"focus";c=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(g,this.options.selector,b.proxy(this.enter,this));this.$element.on(c,this.options.selector,b.proxy(this.leave,this))}this.options.selector?(this._options=b.extend({},this.options,{trigger:"manual",selector:""})):this.fixTitle()},getOptions:function(c){c=b.extend({},b.fn[this.type].defaults,c,this.$element.data());if(c.delay&&typeof c.delay=="number"){c.delay={show:c.delay,hide:c.delay}}return c},enter:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.show){return c.show()}clearTimeout(this.timeout);c.hoverState="in";this.timeout=setTimeout(function(){if(c.hoverState=="in"){c.show()}},c.options.delay.show)},leave:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(this.timeout){clearTimeout(this.timeout)}if(!c.options.delay||!c.options.delay.hide){return c.hide()}c.hoverState="out";this.timeout=setTimeout(function(){if(c.hoverState=="out"){c.hide()}},c.options.delay.hide)},show:function(){var g,c,i,e,h,d,f;if(this.hasContent()&&this.enabled){g=this.tip();this.setContent();if(this.options.animation){g.addClass("fade")}d=typeof this.options.placement=="function"?this.options.placement.call(this,g[0],this.$element[0]):this.options.placement;c=/in/.test(d);g.remove().css({top:0,left:0,display:"block"}).appendTo(c?this.$element:document.body);i=this.getPosition(c);e=g[0].offsetWidth;h=g[0].offsetHeight;switch(c?d.split(" ")[1]:d){case"bottom":f={top:i.top+i.height,left:i.left+i.width/2-e/2};break;case"top":f={top:i.top-h,left:i.left+i.width/2-e/2};break;case"left":f={top:i.top+i.height/2-h/2,left:i.left-e};break;case"right":f={top:i.top+i.height/2-h/2,left:i.left+i.width};break}g.css(f).addClass(d).addClass("in")}},isHTML:function(c){return typeof c!="string"||(c.charAt(0)==="<"&&c.charAt(c.length-1)===">"&&c.length>=3)||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(c)},setContent:function(){var d=this.tip(),c=this.getTitle();d.find(".tooltip-inner")[this.isHTML(c)?"html":"text"](c);d.removeClass("fade in top bottom left right")},hide:function(){var c=this,d=this.tip();d.removeClass("in");function e(){var f=setTimeout(function(){d.off(b.support.transition.end).remove()},500);d.one(b.support.transition.end,function(){clearTimeout(f);d.remove()})}b.support.transition&&this.$tip.hasClass("fade")?e():d.remove()},fixTitle:function(){var c=this.$element;if(c.attr("title")||typeof(c.attr("data-original-title"))!="string"){c.attr("data-original-title",c.attr("title")||"").removeAttr("title")}},hasContent:function(){return this.getTitle()},getPosition:function(c){return b.extend({},(c?{top:0,left:0}:this.$element.offset()),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,c=this.$element,d=this.options;e=c.attr("data-original-title")||(typeof d.title=="function"?d.title.call(c[0]):d.title);return e},tip:function(){return this.$tip=this.$tip||b(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};b.fn.tooltip=function(c){return this.each(function(){var f=b(this),e=f.data("tooltip"),d=typeof c=="object"&&c;if(!e){f.data("tooltip",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.tooltip.Constructor=a;b.fn.tooltip.defaults={animation:true,placement:"top",selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}(window.jQuery);!function(b){var a=function(d,c){this.init("popover",d,c)};a.prototype=b.extend({},b.fn.tooltip.Constructor.prototype,{constructor:a,setContent:function(){var e=this.tip(),d=this.getTitle(),c=this.getContent();e.find(".popover-title")[this.isHTML(d)?"html":"text"](d);e.find(".popover-content > *")[this.isHTML(c)?"html":"text"](c);e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var d,c=this.$element,e=this.options;d=c.attr("data-content")||(typeof e.content=="function"?e.content.call(c[0]):e.content);return d},tip:function(){if(!this.$tip){this.$tip=b(this.options.template)}return this.$tip}});b.fn.popover=function(c){return this.each(function(){var f=b(this),e=f.data("popover"),d=typeof c=="object"&&c;if(!e){f.data("popover",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.popover.Constructor=a;b.fn.popover.defaults=b.extend({},b.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery);
		}

		var chartID = "groupedLine"+Math.round(Math.random()*1000000);

		var data = [];
		// Find and count duplicates and map data
		(function() {
			for (var i in obj.data) {
				var currentData = obj.data[i];
				if (obj.data.hasOwnProperty(i) && currentData instanceof Array) {
					if (obj.time) {
						var x = new Date(i);
					} else {
						var x = i;
					}
					currentData.sort();
					var max = new Number();
					for (var b = 0; b < currentData.length; ++b) {
						if (currentData[b] !== max) {
							data.push({
								count: 1,
								x: x,
								y: currentData[b]
							});
							max = currentData[b];
						} else if (data[data.length-1].y === currentData[b] && data[data.length-1].x === x) {
							// Duplicate found, increment the count of the corresponding point in data
							++data[data.length-1].count;
						}
					}
				}
			}
		})();
		
        var margin = {};
        obj.margin = obj.margin || {};
        margin.top    = typeof obj.margin.top	=== 'number' ? obj.margin.top	: 20;
        margin.right  = typeof obj.margin.right  === 'number' ? obj.margin.right  : 20;
        margin.bottom = typeof obj.margin.bottom === 'number' ? obj.margin.bottom : 30;
        margin.left   = typeof obj.margin.left   === 'number' ? obj.margin.left   : 40;

        obj.width  = (obj.width && typeof obj.width === 'number') ? obj.width : 500;
        obj.height = (obj.height && typeof obj.height === 'number') ? obj.height : 400;

        obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
        obj.color     = (obj.color && obj.color !== '' && obj.color !== 'undefined') ? obj.color : 'steelblue';

        obj.title  = (obj.title && obj.title !== '' && obj.title !== 'undefined') ? obj.title : '';
        obj.xlabel = (obj.xlabel && obj.xlabel !== '' && obj.xlabel !== 'undefined') ? obj.xlabel : '';
        obj.ylabel = (obj.ylabel && obj.ylabel !== '' && obj.ylabel !== 'undefined') ? obj.ylabel : '';

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

		// Draw dots
		(function() {
			var done = false
              , runs = 0
			  , d = clone(data)
              , _d = []
              , baseRadius = 3.5
			  , strokeWidth = '1.5px';

			while(!done) {
				if (runs !== 0) strokeWidth = '2px';
				// Render dots

                svg.selectAll('.dot .run'+runs)
                    .data(d)
                    .enter().append("circle")
                        .attr("class", "dot")
                        .attr("cx", line.x())
                        .attr("cy", line.y())
                        .attr("r", baseRadius+4*runs+'px')
                        .style("fill", function(d) {
                            if (obj.boxColors && yMarker && runs === 0) {
                                if (d.y < yMarker) {
                                    return obj.boxColors['belowLine'] || obj.color;
                                }
                                if (d.y > yMarker) {
                                    return obj.boxColors['aboveLine'] || obj.color;
                                }
                                if (d.y == yMarker) {
                                    return obj.boxColors['onLine'] || obj.color;
                                }
                            } else {
                                return "none";
                            }
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
                        .style("stroke-width", strokeWidth)
                        // Popover properties
                        .attr("rel", "popover")
                        .attr("data-title", function(d){
                            return d.y;
                        })
                        .attr("data-content", function(d){
                            return '<div style="margin-top:-15px"><strong>'+obj.xlabel+':</strong> '+ (new Date(d.x).toLocaleDateString()) +'<br>'+
                                '<strong>'+obj.ylabel+':</strong> '+d.y+'</strong></div>';
                        });

				// Remove rendered dots from data
				for (var i = 0, len = d.length; i < len; ++i) {
                    --d[i].count;
                    if (d[i].count > 0) _d.push(d[i]);
                }
                // Remove undefined values from d
                d = _d; _d = [];
                ++runs;
				if (d.length === 0) done = true;
			}
		})();

		// Enable popover
		if (obj.popover && jQuery) jQuery('circle').popover();

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
				return charts.groupedLine(this.obj);
			},
			add: function(data) {
				this.redraw(charts.extend(this.obj.data,data));
				return this;
			}
		};
	}
});
charts.extend({
    line: function(obj) {
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.innerHTML = 
            '.lineChart .axis path, .lineChart .axis line {'+
            '  fill: none;'+
            '  stroke: #000;'+
            '  shape-rendering: crispEdges;'+
            '}';
        // Add popover styles and scripts
        if (obj.popover && jQuery) {
            style.innerHTML = style.innerHTML + '.tooltip{position:absolute;z-index:1020;display:block;padding:5px;font-size:11px;opacity:0;filter:alpha(opacity=0);visibility:visible}.tooltip.in{opacity:.8;filter:alpha(opacity=80)}.tooltip.top{margin-top:-2px}.tooltip.right{margin-left:2px}.tooltip.bottom{margin-top:2px}.tooltip.left{margin-left:-2px}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;text-decoration:none;background-color:#000;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0}.popover{position:absolute;top:0;left:0;z-index:1010;display:none;padding:5px}.popover.top{margin-top:-5px}.popover.right{margin-left:5px}.popover.bottom{margin-top:5px}.popover.left{margin-left:-5px}.popover.top .arrow{bottom:0;left:50%;margin-left:-5px;border-top:5px solid #000;border-right:5px solid transparent;border-left:5px solid transparent}.popover.right .arrow{top:50%;left:0;margin-top:-5px;border-top:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid transparent}.popover.bottom .arrow{top:0;left:50%;margin-left:-5px;border-right:5px solid transparent;border-bottom:5px solid #000;border-left:5px solid transparent}.popover.left .arrow{top:50%;right:0;margin-top:-5px;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000}.popover .arrow{position:absolute;width:0;height:0}.popover-inner{width:280px;padding:3px;overflow:hidden;background:#000;background:rgba(0,0,0,0.8);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 3px 7px rgba(0,0,0,0.3);-moz-box-shadow:0 3px 7px rgba(0,0,0,0.3);box-shadow:0 3px 7px rgba(0,0,0,0.3)}.popover-title{margin:0;padding:9px 15px;line-height:1;background-color:#f5f5f5;border-bottom:1px solid #eee;-webkit-border-radius:3px 3px 0 0;-moz-border-radius:3px 3px 0 0;border-radius:3px 3px 0 0}.popover-content{padding:14px;background-color:#fff;-webkit-border-radius:0 0 3px 3px;-moz-border-radius:0 0 3px 3px;border-radius:0 0 3px 3px;-webkit-background-clip:padding-box;-moz-background-clip:padding-box;background-clip:padding-box}.popover-content p,.popover-content ul,.popover-content ol{margin-bottom:0}';
            !function(b){var a=function(d,c){this.init("tooltip",d,c)};a.prototype={constructor:a,init:function(f,e,d){var g,c;this.type=f;this.$element=b(e);this.options=this.getOptions(d);this.enabled=true;if(this.options.trigger!="manual"){g=this.options.trigger=="hover"?"mouseenter":"focus";c=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(g,this.options.selector,b.proxy(this.enter,this));this.$element.on(c,this.options.selector,b.proxy(this.leave,this))}this.options.selector?(this._options=b.extend({},this.options,{trigger:"manual",selector:""})):this.fixTitle()},getOptions:function(c){c=b.extend({},b.fn[this.type].defaults,c,this.$element.data());if(c.delay&&typeof c.delay=="number"){c.delay={show:c.delay,hide:c.delay}}return c},enter:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(!c.options.delay||!c.options.delay.show){return c.show()}clearTimeout(this.timeout);c.hoverState="in";this.timeout=setTimeout(function(){if(c.hoverState=="in"){c.show()}},c.options.delay.show)},leave:function(d){var c=b(d.currentTarget)[this.type](this._options).data(this.type);if(this.timeout){clearTimeout(this.timeout)}if(!c.options.delay||!c.options.delay.hide){return c.hide()}c.hoverState="out";this.timeout=setTimeout(function(){if(c.hoverState=="out"){c.hide()}},c.options.delay.hide)},show:function(){var g,c,i,e,h,d,f;if(this.hasContent()&&this.enabled){g=this.tip();this.setContent();if(this.options.animation){g.addClass("fade")}d=typeof this.options.placement=="function"?this.options.placement.call(this,g[0],this.$element[0]):this.options.placement;c=/in/.test(d);g.remove().css({top:0,left:0,display:"block"}).appendTo(c?this.$element:document.body);i=this.getPosition(c);e=g[0].offsetWidth;h=g[0].offsetHeight;switch(c?d.split(" ")[1]:d){case"bottom":f={top:i.top+i.height,left:i.left+i.width/2-e/2};break;case"top":f={top:i.top-h,left:i.left+i.width/2-e/2};break;case"left":f={top:i.top+i.height/2-h/2,left:i.left-e};break;case"right":f={top:i.top+i.height/2-h/2,left:i.left+i.width};break}g.css(f).addClass(d).addClass("in")}},isHTML:function(c){return typeof c!="string"||(c.charAt(0)==="<"&&c.charAt(c.length-1)===">"&&c.length>=3)||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(c)},setContent:function(){var d=this.tip(),c=this.getTitle();d.find(".tooltip-inner")[this.isHTML(c)?"html":"text"](c);d.removeClass("fade in top bottom left right")},hide:function(){var c=this,d=this.tip();d.removeClass("in");function e(){var f=setTimeout(function(){d.off(b.support.transition.end).remove()},500);d.one(b.support.transition.end,function(){clearTimeout(f);d.remove()})}b.support.transition&&this.$tip.hasClass("fade")?e():d.remove()},fixTitle:function(){var c=this.$element;if(c.attr("title")||typeof(c.attr("data-original-title"))!="string"){c.attr("data-original-title",c.attr("title")||"").removeAttr("title")}},hasContent:function(){return this.getTitle()},getPosition:function(c){return b.extend({},(c?{top:0,left:0}:this.$element.offset()),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,c=this.$element,d=this.options;e=c.attr("data-original-title")||(typeof d.title=="function"?d.title.call(c[0]):d.title);return e},tip:function(){return this.$tip=this.$tip||b(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};b.fn.tooltip=function(c){return this.each(function(){var f=b(this),e=f.data("tooltip"),d=typeof c=="object"&&c;if(!e){f.data("tooltip",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.tooltip.Constructor=a;b.fn.tooltip.defaults={animation:true,placement:"top",selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}(window.jQuery);!function(b){var a=function(d,c){this.init("popover",d,c)};a.prototype=b.extend({},b.fn.tooltip.Constructor.prototype,{constructor:a,setContent:function(){var e=this.tip(),d=this.getTitle(),c=this.getContent();e.find(".popover-title")[this.isHTML(d)?"html":"text"](d);e.find(".popover-content > *")[this.isHTML(c)?"html":"text"](c);e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var d,c=this.$element,e=this.options;d=c.attr("data-content")||(typeof e.content=="function"?e.content.call(c[0]):e.content);return d},tip:function(){if(!this.$tip){this.$tip=b(this.options.template)}return this.$tip}});b.fn.popover=function(c){return this.each(function(){var f=b(this),e=f.data("popover"),d=typeof c=="object"&&c;if(!e){f.data("popover",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.popover.Constructor=a;b.fn.popover.defaults=b.extend({},b.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery);
        }

        var chartID = "line"+Math.round(Math.random()*1000000), // random id for SVG
            data = obj.data,
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
            .style("stroke-width", "1.5px")
            // Popover properties
            .attr("rel", "popover")
            .attr("data-title", function(d){
                return d.y;
            })
            .attr("data-content", function(d){
                var x = d.x;
                if (obj.time) var x = (new Date(d.x)).toLocaleDateString();
                return '<div style="margin-top:-15px"><strong>'+obj.xlabel+':</strong> '+ x +'<br>'+
                    '<strong>'+obj.ylabel+':</strong> '+d.y+'</div>';
            });

        // Enable popover
        if (obj.popover && jQuery) jQuery('circle').popover();

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

                return charts.line(this.obj);
            },
            add: function(data) {
                this.redraw(this.obj.data.concat(data));
                return this;
            }
        };
    }
});
// Requires ../charts/donut.js

charts.extend({
	behavior: function(data,sel,w,h) {

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

				var colorScale = d3.scale.linear().domain([0,sizeOfBehavior]).range([100,256]); // Linear scale for colors
				var j = 0; // counter
				for (var i in data[currentBehavior]) {
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

		var returnChart = this.donut({
			sections: values,
			centerLabel: 'Behavior',
			container: sel,
			width: w,
			height: h
		});
		returnChart.data = data;
		returnChart.redraw = function(data) {
            this.remove();
            this.data = data;
            this.container = '#'+this.id;

			return charts.behavior(this.data,this.container,w,h);
        };
		delete returnChart.add;

		return returnChart;
	}
});
// Requires ../charts/line.js

charts.extend({
	DRA: function(obj) {
		// var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined,
        var data = [],
	        scores = obj.scores;

        obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.color = (obj.color && obj.color !== '' && obj.color !== 'undefined') ? obj.color : '';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;
        obj.popover    = obj.popover === true ? true : false;

        // Map scores to a usable format
        for (var i in scores) {
        	if (scores.hasOwnProperty(i)) {
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

        var lineCall = {
			time: true,
			data: data,
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score',
            xMarker: obj.deadline,
            yMarker: obj.goal,
            xMax: obj.xMax,
            yMax: obj.yMax,
            xMin: obj.xMin,
            yMin: obj.yMin,
            container: obj.container,
            width: obj.width,
            height: obj.height,
            color: obj.color,
            popover: obj.popover
		};

		var returnChart = this.line(lineCall);
		returnChart.obj = obj;
		returnChart.redraw = function(data) {
            this.remove();
            this.obj.scores = data;
            this.obj.container = '#'+this.id;

            // returnChart = charts.DRA(this.obj);
			return charts.DRA(this.obj);
        };
        returnChart.add = function(data) {
			this.redraw(charts.extend(this.obj.scores,data));
		};

		return returnChart;
	}
});
