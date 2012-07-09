/*	educhart.js
*	Open Source education charting
*
*	By: JainLabs
*	us@jainlabs.com
*/


function log(msg) {
	var logging = true;
	if (logging == true) {
		console.log(msg);
	}
	return true;
}

Array.max = function(array){
    return Math.max.apply(Math, array);
};

Array.min = function(array){
    return Math.min.apply(Math, array);
};

Array.sum = function(array) {
	var total=0;
	for(var i in array) { total += array[i]; }
	return total
}

function Educhart() {
	var this_var = this;
	log('Educhart loaded');
}

Educhart.prototype.init = function() {
	this.charts = {'donut':
					{
						'map': function (a) {
							return a;
						},
						'scale': function(a,b) {
							/* return (a-b.min())/(b.max()-b.min()); // Calculate position in range of data */
							return Math.round(a/Array.sum(b)*100)/100; // Percentage of dataset
						},
						'create': function(data) {
							var chartData = {};
							for(var i in data) {
								chartData[i] = this.scale(data[i],data);
							}
							// donut function passing chartData
							log(chartData);
						}
					}
				};
	log('educhart initialized');
};

Educhart.prototype.createChart = function(chartType,data) {
	
};

var educhart = new Educhart();
educhart.init();