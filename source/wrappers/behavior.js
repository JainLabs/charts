// Requires ../charts/donut.js

charts.extend({
	behavior: function(data,sel,w,h) {

		var positive = data['positive'],
			negative = data['negative'],
			neutral  = data['neutral'],
			values = [];

		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};

		(function() {
			var behaviorArr = ['positive', 'negative', 'neutral'];
			for (var b in behaviorArr) {
				var currentBehavior = behaviorArr[b],
					sizeOfBehavior = Object.size(data[currentBehavior]);

				var colorScale = d3.scale.linear().domain([0,sizeOfBehavior]).range([100,256]); // Linear scale for colors
				var j = 0; // counter
				for (var i in data[currentBehavior]) {
					if (currentBehavior === 'positive') var _color = "rgb(0,"+colorScale(j)+",0)";
					if (currentBehavior === 'negative') var _color = "rgb("+colorScale(j)+",0,0)";
					if (currentBehavior === 'neutral' ) var _color = "rgb("+colorScale(j)+","+colorScale(j)+","+colorScale(j)+")";

					values.push({
						data: data[currentBehavior][i],
						label: i,
						color: _color
					});
					j++;
				}
			}
		})();

		var returnChart = this.donut({
			sections: values,
			centerLabel: 'Behavior',
			container: sel,
			width: w,
			height: h
		});
		returnChart.data = data;
		returnChart.redraw = function(data) {
            this.remove();
            this.data = data;
            this.container = '#'+this.id;

			return charts.behavior(this.data,this.container,w,h);
        };
		delete returnChart.add;

		return returnChart;
	}
});