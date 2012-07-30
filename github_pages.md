<script src="http://d3js.org/d3.v2.js"></script>  
<script src="http://jainlabs.github.com/charts/cdn/charts.min.js"></script>
Charts
=======

## What is charts.js
charts.js is meant to be an easy to use library to pair complex online charting libraries like d3 or Google's Charting API with easy to use code. The library includes specialization to specific fields like education.

## Get charts.js in 5 minutes
```
<html>  
	<head>  
		<script src="http://d3js.org/d3.v2.js"></script>  
		<script src="http://jainlabs.github.com/charts/cdn/charts.min.js"></script> <!-- CDN HOSTED VERSION OF charts.js -->    
	</head>   
	<body>  
		<div id="chart_area"></div>  
		<script>  
			charts.gauge({  
				container: '#chart_area',  
				value: 50,  
				size: 240,  
				label: 'Memory',  
				minorTicks: 5,  
				majorTicks: 5,  
				zones: {  
					red: { from: 0, to: 5 },  
					yellow: { from: 5, to: 15 },  
					green: { from: 85, to: 100 }  
				}  
			});  
		</script>
	</body>  
</html>
```  
produces:  
<div id="chart_area"></div>  

## More charting examples

<script>  
	charts.gauge({  
		container: '#chart_area',  
		value: 50,  
		size: 240,  
		label: 'Memory',  
		minorTicks: 5,  
		majorTicks: 5,  
		zones: {  
			red: { from: 0, to: 5 },  
			yellow: { from: 5, to: 15 },  
			green: { from: 85, to: 100 }  
		}  
	});  
</script>
