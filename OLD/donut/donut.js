function donut(data, cats, centerLabel, sel, w, h) {
  //Width, Height and radius of Donut Chart
  if (!cats) cats = [];
  var w = w || 400,
    h = h || 400,
    r = w / 2,
    //Scale for the arc length of Chart using D3
      donut = d3.layout.pie().sort(null),
      arc = d3.svg.arc().innerRadius(r - 120).outerRadius(r);

  
  //New color function using d3 scale.
  var color = d3.scale.category20();
  
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
        .style("fill",function(d, i) { return color(i); })
      .style("stroke", '#fff')
      .append("svg:title")
        .text(function(d) {return String(d.data) + " votes";})
  
  g.append("svg:text")
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
        .style("font", "10px sans-serif")
    .text(function(d, i) { return cats[i]; });
  
  
  //adding text to the middle of donut hole
  svg.append("svg:text")
      .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font","bold 14px Georgia")
      .text(centerLabel)
  
    
  // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }
}