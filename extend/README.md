Steps:  
1. Include d3 and charts.js  
2. Choose core charts and wrappers and include files  
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