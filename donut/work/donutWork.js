function donut() {
  var width = 400, // default width
      height = 400; // default height

  function chart(selection) {
    selection.each(function(d, i) {
      // generate chart here; `d` is the data and `this` is the element
      console.dir({d:d,i:i,'this':this});
    });
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  return chart;
}

var chart = donut().width(500).height(500),
    n = 10,
    data0 = d3.range(n).map(Math.random),
    data1 = d3.range(n).map(Math.random),
    selection = 
      d3.select("body")
      .append("svg")
        .attr("width", 500)
        .attr("height", 500)
      .selectAll("g.arc")
      .data(arcs(data0, data1));

chart(selection);

// [0.23219322157092392, 0.9191356583032757, 0.2695258134044707, 0.31438799924217165, 0.5268408670090139, 0.7023744080215693, 0.14206564030610025, 0.69741699565202, 0.41704507800750434, 0.9912532037124038]
// [0.6940422006882727, 0.5216716625727713, 0.774894213071093, 0.14039232791401446, 0.3258115428034216, 0.8178620557300746, 0.04466142621822655, 0.43929996504448354, 0.4041365694720298, 0.8251680934336036]