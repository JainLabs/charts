// GAUGE CHARTS
window.gauge = charts.gauge({
  container: "#chart_area_demo",
  value: 60,
  size: 240,
  label: "Memory",
  minorTicks: 5,
  majorTicks: 5,
  zones: {
    red: {
      from: 0,
      to: 5
    },
    yellow: {
      from: 5,
      to: 15
    },
    green: {
      from: 85,
      to: 100
    }
  }
})

// DONUT CHARTS
charts.donut({
  sections: [{
    data: 2,
    label: "eating",
  }, {
    data: 8,
    label: "sleeping",
  }, {
    data: 1.5,
    label: "hacker news",
  }, {
    data: 4,
    label: "coding",
  }],
  centerLabel: 'My day',
  container: '#donut_chart',
  width: 300,
  height: 300
});
charts.behavior(
{
  positive: {
    'participation':3,
    'productivity':2,
    'excitment':1
  },
  negative: {
    'sleeping': 1,
    'distracted': 1
  },
  neutral: {
    'restroom breaks': 2
  },
}, '#behavior_chart', 300, 300);

// LINE CHARTS
var lineChart = charts.line({
  time: true,
  data: [{
      x: 'Sun Jul 01 2012 00:00:00 GMT-0700 (PDT)',
      y: .3
    }, {
      x: 'Mon Jul 02 2012 00:00:00 GMT-0700 (PDT)',
      y: 1
    }, {
      x: 'Tue Jul 03 2012 00:00:00 GMT-0700 (PDT)',
      y: 10
    }, {
      x: 'Wed Jul 04 2012 00:00:00 GMT-0700 (PDT)',
      y: 15
    }],
  title: 'Line Chart with Time',
  xlabel: 'Time',
  ylabel: 'y Label',
  xMarker: '2012/07/03',
  color: "#0A0",
  width: 600,
  height: 300,
  container: "#line_chart"
});

$('#line_customize').append(
  'Title: <input type="text" name="title" value="'+lineChart.obj.title+'" /><br />'+
  'x marker: <input type="date" name="xMarker" value="'+lineChart.obj.xMarker+'" /><br />'+
  'y marker: <input type="date" name="yMarker" value="'+lineChart.obj.yMarker+'" /><br />'+
  'x label: <input type="text" name="xlabel" value="'+lineChart.obj.xlabel+'" /><br />'+
  'y label: <input type="text" name="ylabel" value="'+lineChart.obj.ylabel+'" /><br />'+
  'Clear data: <input type="checkbox" name="defaultData" /><br />'+
  'Height: <input type="number" name="height" value="'+lineChart.obj.height+'" /><br />'+
  'Width: <input type="number" name="width" value="'+lineChart.obj.width+'" /><br />'+
  'Color: <input type="color" name="color" value="'+lineChart.obj.color+'" /><br />'+
  // '<input type="date" name="line_x" placeholder="date"/>'+
  '<input type="submit" class="cupid-green" style="margin-top:10px" value="Customize">'
);

$('#line_customize').submit(function(e) {
  e.preventDefault();
  var d = $(this).serializeArray(),
      data = [{
      x: 'Sun Jul 01 2012 00:00:00 GMT-0700 (PDT)',
      y: .3
    }, {
      x: 'Mon Jul 02 2012 00:00:00 GMT-0700 (PDT)',
      y: 1
    }, {
      x: 'Tue Jul 03 2012 00:00:00 GMT-0700 (PDT)',
      y: 10
    }, {
      x: 'Wed Jul 04 2012 00:00:00 GMT-0700 (PDT)',
      y: 15
    }];
  console.log('d[6]: ',d[6]);

  if (d[5].value === "on") data = [];

  lineChart.remove();
  lineChart = charts.line({
    time: true,
    data: data,
    title: d[0].value || "",
    xlabel: d[3].value || "",
    ylabel: d[4].value || "",
    xMarker: d[1].value || "",
    color: d[7].value || "steelblue",
    width: d[6].value || 600,
    height: d[5].value || 300,
    container: "#line_chart"
  });

  return false;
});

$('#line_addData').submit(function() {
  var d = $(this).serializeArray();
  lineChart.add([{
      x: d[1].value,
      y: parseFloat(d[0].value),
    }]);
  return false;
});



var DRAChart = charts.DRA({
  scores: {
    '2012/06/1': 25,
    '2012/06/4': 28,
    '2012/06/7': 35,
    '2012/06/11': 50
  },
  container: '#DRA_chart',
  deadline: '2012/06/10',
  goal: 40,
  width: 600,
  height: 300
});