function chart() {
  var width = 720, // default width
      height = 80; // default height

  function my(selection) {
    selection.each(function(d, i) {
      // generate chart here; `d` is the data and `this` is the element
    });
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };

  return my;
}