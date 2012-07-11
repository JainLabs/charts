Charts
=======

## What is charts.js
charts.js is meant to be an easy to use library to pair complex online charting libraries like d3 or Google's Charting API with easy to use code. The library includes specialization to specific fields like education.

## How to use charts.js
1. Include d3 and charts.js  
```
	<script type="text/javascript" src="d3.v2.js"></script>  
	<script type="text/javascript" src="charts.js"></script>
```
2. Choose core charts and wrappers and include files. For example:  
```
	<script type="text/javascript" src="charts/donut.js"></script> <!-- Donut chart -->
	<script type="text/javascript" src="wrappers/behavior.js"></script> <!-- Behavior chart built on top of the Donut charts -->
```
3. Optional: create wrappers and charts with charts.extend()  
4. Call functions you need!

---

## Core Charts (charts/)
### Donut (donut.js)
```
charts.donut({  
    data: [172,136,135,10], 	  // Required  
    labels: ["a", "b", "c", "d"], // Default: []  
    centerLabel: 'Label', 		  // Default: ''  
    container: 'body', 			  // Default: 'body'  
    width: 400, 				  // Default: 400  
    height: 400 				  // Default: 400  
});
```


## Wrappers (wrappers/)
### Behavior (behavior.js)
```
charts.behavior({  
    'participation':1,  
    'productivity':2,  
    'excitment':1  
}, 'body');
```

---

## Creating wrappers & charts
Implementation of behavior chart:  
```
charts.extend({  
	behavior: function(data,sel,w,h) {  
		var labels = [], values = [], j=0;  
		for(var i in data) {  
			labels[j] = i;  
			values[j] = data[i];  
			j++;  
		}  
		this.donut({  
			data: values,  
			labels: labels,  
			centerLabel: 'Behavior',  
			container: sel  
		});  
	}  
});
```