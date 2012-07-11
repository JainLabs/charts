Charts
======

## What is charts.js
charts.js is meant to be an easy to use library to pair complex online charting libraries like d3 or Google's Charting API with easy to use code. The library includes specialization to specific fields like education.

## How do I use charts.js
Simple.  
1. Include the charting file that you need.  
```<script src="chartjs/educhart.js">```  
2. Insert the following Javascript code where you would like to place the chart  
`<script>  
var educhart = new Educhart();  
educhart.init();  
educhart.charts.donut.create({'math':1,'science':2});  
</script>`