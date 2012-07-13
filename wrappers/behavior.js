// Requires ../charts/donut.js

charts.extend({
	behavior: function(data,sel,w,h) {
		var values = [];
		for(var i in data) {
			values.push({
				data: data[i],
				label: i
			});
		}

		this.donut({
			sections: values,
			centerLabel: 'Behavior',
			container: sel
		});
	}
});