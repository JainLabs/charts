// Requires ../charts/donut.js

charts.extend({
	behavior: function(data,sel,w,h) {
		var labels = [], values = [], j=0;
		for(var i in data) {
			labels[j] = i;
			values[j] = data[i];
			j++
		}
		this.donut({
			data: values,
			labels: labels,
			centerLabel: 'Behavior',
			container: sel
		});
	}
});