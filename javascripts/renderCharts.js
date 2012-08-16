// GAUGE CHARTS
var headerchart = charts.gauge({  
    container: '#chartheader',  
    value: 0,  
    size: 200,  
    label: 'RAM',  
    minorTicks: 5,  
    majorTicks: 5,  
    zones: {  
        red: { from: 90, to: 100 },  
        yellow: { from: 75, to: 90 },  
        green: { from: 0, to: 20 }  
    }
});
var val = 0;
window.setInterval(function(){ headerchart.redraw(Math.floor(Math.random()*10)+25) }, 100);

var gauge = charts.gauge({
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
  trendLine: {
    start: [0,'July...'],
    end: [20,'Aug...']
  },
  color: "#0A0",
  width: 600,
  height: 300,
  container: "#line_chart",
  xMax: 'Wed Jul 04 2012 12:00:00 GMT-0700 (PDT)',
  yMax: 20,
  popover: true
});

$('#line_customize').append(
  'Title: <input type="text" name="title" value="'+lineChart.obj.title+'" /><br />'+
  'x marker: <input type="date" name="xMarker" value="'+lineChart.obj.xMarker+'" /><br />'+
  'y marker: <input type="number" name="yMarker" value="'+lineChart.obj.yMarker+'" /><br />'+
  'x label: <input type="text" name="xlabel" value="'+lineChart.obj.xlabel+'" /><br />'+
  'y label: <input type="text" name="ylabel" value="'+lineChart.obj.ylabel+'" /><br />'+
  'x max: <input type="date" name="xMax" value="'+lineChart.obj.xMax+'" /><br />'+
  'y max: <input type="number" name="yMax" value="'+lineChart.obj.yMax+'" /><br />'+
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
      data = d[10].value ? JSON.parse(d[10].value) : [];
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
    yMarker: d[2].value || "",
    xMax: d[5].value || "",
    yMax: parseFloat(d[6].value) || undefined,
    color: d[9].value || "",
    width: parseFloat(d[8].value) || 600,
    height: parseFloat(d[7].value) || 300,
    container: "#line_chart",
    popover: true
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
  color: 'green',
  popover: true
});

// Code to add DRA customization form
// $('#DRA_customize').append(
//   'Title: <input type="text" name="title" value="'+DRAChart.obj.title+'" /><br />'+
//   'Deadline: <input type="date" name="xMarker" value="'+DRAChart.obj.xMarker+'" /><br />'+
//   'Goal: <input type="date" name="yMarker" value="'+DRAChart.obj.yMarker+'" /><br />'+
//   'Height: <input type="number" name="height" value="'+DRAChart.obj.height+'" /><br />'+
//   'Width: <input type="number" name="width" value="'+DRAChart.obj.width+'" /><br />'+
//   'Color: <input type="color" name="color" value="'+DRAChart.obj.color+'" /><br />'+
//   'Data: <br /><textarea name="data">'+JSON.stringify(DRAChart.obj.data,null,2)+'</textarea><br />'+
//   // '<input type="date" name="line_x" placeholder="date"/>'+
//   '<input type="submit" class="cupid-green" style="margin-top:10px" value="Customize">'
// );

// $('#DRA_customize').submit(function(e) {
//   e.preventDefault()
  
//   return false;
// });

$('#DRA_addData').submit(function(e) {
  e.preventDefault();
  var d = $(this).serializeArray(), o = {};
  o[d[1].value] = d[0].value;
  DRAChart.add(o);
  return false;
});


// GROUPED LINE CHART

charts.groupedLine({
  time: true,
  data: {
    'Sun Jul 01 2012 00:00:00 GMT-0700 (PDT)': [.3,.3,.42,.5,.6],
    'Sun Jul 02 2012 00:00:00 GMT-0700 (PDT)': [.6,.8,.9],
    'Sun Jul 03 2012 00:00:00 GMT-0700 (PDT)': [1.5,1.5,1.5,2,2.1],
    'Sun Jul 04 2012 00:00:00 GMT-0700 (PDT)': [2.2,2.3,2.5,2.5]
  },
  title: 'Grouped Line Chart',
  xlabel: 'Time',
  ylabel: 'y Label',
  xMax: 'Wed Jul 04 2012 10:00:00 GMT-0700 (PDT)',
  yMax: 3,
  xMarker: 'Wed Jul 03 2012 10:00:00 GMT-0700 (PDT)',
  yMarker: 2,
  container: '#grouped_line_chart',
  width:  600,
  height: 300,
  boxColors: {
    belowLine: '#999999',
    onLine: 'steelblue',
    aboveLine: 'green'
  },
  popover: true
});


// GAUGE CHART

charts.gauge({
  container: '#gauge_chart',
  value: 90,
  size: 240,
  label: 'Power',
  minorTicks: 5,
  majorTicks: 5,
  zones: {
    red: { from: 0, to: 5 },
    yellow: { from: 5, to: 15 },
    green: { from: 85, to: 100 }
  }
});