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
    console.log(colors);

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