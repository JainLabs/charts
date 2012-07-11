/*	educhart.js
*	Open Source education charting
*
*	By: JainLabs
*	us@jainlabs.com
*/

(function(window,undefined) {
	function log(msg) {
		console.log(msg);
		return true;
	}

	max = function(array){
	    return Math.max.apply(Math, array);
	};

	min = function(array){
	    return Math.min.apply(Math, array);
	};

	sumArray = function(array) {
		var total=0;
		for(var i in array) { total += array[i]; }
		return total
	}

	function importJS(file, callback) { // file is relative to the document that you include educhart.js
		callback = typeof callback !== 'undefined' ? callback : function(argument) {};
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.onload= callback;
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
								return Math.round(a/sumArray(b)*100)/100; // Percentage of dataset
							},
							'create': function(data) {
								var labels = [];
								var values = [];
								var j=0;
								for(var i in data) {
									labels[j] = i;
									values[j] = this.scale(data[i],data);
									j++;
								}
								// donut function passing chartData
								log('Creating donut chart with data: ');
								log([labels,values]);
								importJS('./donut/donut.js',function() {
									donut(values,labels,'subjects','body');
								});
							}
						}
					};
		log('educhart initialized');
	};

	Educhart.prototype.createChart = function(chartType,data) {
		
	};

	window.Educhart = Educhart;
})(this);