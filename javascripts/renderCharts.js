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
  }
}, '#behavior_chart', 300, 300);

// LINE CHARTS
/* charts.DRA({
  scores: {
    '2012/06/1': 25,
    '2012/06/4': 28,
    '2012/06/7': 35,
    '2012/06/11': 50
  },
  container: '#DRA_chart',
  deadline: '2012/06/10',
  goal: 50,
  width: 300,
  height: 300
}); */