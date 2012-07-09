/*	educhart.js
*	Open Source education charting
*
*	By: JainLabs
*	us@jainlabs.com
*/


function log(msg) {
	if (logging == true) {
		console.log(msg);
	}
	return true;
}

function Educhart () {
	this_var = this;
	log('Educhart loaded');
	this.init();
}

Edu.prototype.init = function() {
	/* */

	this.charts = {'donut':
							{
								'map':  function (a) {
									return a;
								},
								'scale': function(a,b) {
									var range = b.max - b.min;
									
								}
							}
				};
};

Educhart.prototype.createChart = function(chartType,data) {
	
};

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};