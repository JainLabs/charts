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
    data: 8,
    label: "sleeping"
  }, {
    data: 5,
    label: "coding"
  }, {
    data: 2,
    label: "games"
  }, {
    data: 2,
    label: "hacker news"
  }, {
    data: 2,
    label: "eating"
  }, {
    data: 5,
    label: "other"
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
  'Height: <input type="number" name="height" value="'+lineChart.obj.height+'" /><br />'+
  'Width: <input type="number" name="width" value="'+lineChart.obj.width+'" /><br />'+
  'Color: <input type="color" name="color" value="'+lineChart.obj.color+'" /><br />'+
  'Data: <br /><textarea name="data">'+JSON.stringify(lineChart.obj.data,null,2)+'</textarea><br />'+
  // '<input type="date" name="line_x" placeholder="date"/>'+
  '<input type="submit" class="cupid-green" style="margin-top:10px" value="Customize">'
);

$('#line_customize').submit(function(e) {
  e.preventDefault();
  var d = $(this).serializeArray(),
      data = d[8].value ? JSON.parse(d[8].value) : [];
  window.lineCustomizeData = d;
  console.log(d, data);

  // if ($('form#line_customize input[name=clearData]').is(':checked')) data = [];

  lineChart.remove();
  document.getElementById('line_chart').innerHTML = '';
  lineChart = undefined;

  window.lineChart = charts.line({
    time: true,
    data: data,
    title: d[0].value || "",
    xlabel: d[3].value || "",
    ylabel: d[4].value || "",
    xMarker: d[1].value || "",
    color: d[7].value || "steelblue",
    width: parseFloat(d[6].value) || 600,
    height: parseFloat(d[5].value) || 300,
    container: "#line_chart"
  });

  return false;
});

$('#line_addData').submit(function(e) {
  e.preventDefault();
  var d = $(this).serializeArray();
  if (lineChart) {
    lineChart.add([{
        x: d[1].value,
        y: parseFloat(d[0].value),
      }]);
  } else {
    var d = window.lineCustomizeData;
    window.lineChart = charts.line({
      time: true,
      data: [{
        x: d[1].value,
        y: parseFloat(d[0].value),
      }],
      title: d[0].value || "",
      xlabel: d[3].value || "",
      ylabel: d[4].value || "",
      xMarker: d[1].value || "",
      color: d[7].value || "steelblue",
      width: parseFloat(d[6].value) || 600,
      height: parseFloat(d[5].value) || 300,
      container: "#line_chart"
    });
  }
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
  height: 300,
  color: 'green'
});

$('#DRA_customize').append(
  'Title: <input type="text" name="title" value="'+DRAChart.obj.title+'" /><br />'+
  'Deadline: <input type="date" name="xMarker" value="'+DRAChart.obj.xMarker+'" /><br />'+
  'Goal: <input type="date" name="yMarker" value="'+DRAChart.obj.yMarker+'" /><br />'+
  'Height: <input type="number" name="height" value="'+DRAChart.obj.height+'" /><br />'+
  'Width: <input type="number" name="width" value="'+DRAChart.obj.width+'" /><br />'+
  'Color: <input type="color" name="color" value="'+DRAChart.obj.color+'" /><br />'+
  'Data: <br /><textarea name="data">'+JSON.stringify(DRAChart.obj.data,null,2)+'</textarea><br />'+
  // '<input type="date" name="line_x" placeholder="date"/>'+
  '<input type="submit" class="cupid-green" style="margin-top:10px" value="Customize">'
);

$('#DRA_customize').submit(function(e) {
  e.preventDefault()
  
  return false;
});

$('#DRA_addData').submit(function(e) {
  e.preventDefault();

  return false;
});