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

function importJS(file, callback) {
	callback = typeof callback !== 'undefined' ? callback : function(argument) {};
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.onload= callback
	script.src= file;
	head.appendChild(script);
	log('loaded: ' + file);
	return true;
}

function Educhart() {
	var this_var = this;
	log('Educhart loaded');
}

Educhart.prototype.init = function() {
	this.charts = {'donut': // call donut.create({'SUBJECT':ARBITRARY_DATA_POINT})
					{
						'scale': function(a,b) {
							/* return (a-b.min())/(b.max()-b.min()); // Calculate position in range of data */
							return Math.round(a/Array.sum(b)*100)/100; // Percentage of dataset
						},
						'create': function(data) {
							var labels = [];
							var values = [];
							j=0;
							for(var i in data) {
								labels[j] = i;
								values[j] = this.scale(data[i],data);
								j++;
							}
							// donut function passing chartData
							log('Creating donut chart with data: ');
							log([labels,values]);
							importJS('donut/donut.js');
							
						}
					}
				};
	log('educhart initialized');
};

Educhart.prototype.createChart = function(chartType,data) {
	
};

var educhart = new Educhart();
educhart.init();
educhart.charts.donut.create({'math':1,'science':2});