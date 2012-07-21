// Requires ../charts/line.js

charts.extend({
	DRA: function(obj) {
		var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined,
	        data = [],
	        scores = obj.scores;

		obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;

        // Map scores to a usable format
        for (var i in scores) {
        	if (scores.hasOwnProperty(i)) {
        		console.log(i, scores[i]);
        		data.push({
        			x: i,
        			y: scores[i]
        		});
        	}
        }

        // sort data
        data.sort(function(curr,next) {
        	if (curr.x < next.x) return -1;
        	if (curr.x > next.x) return 1;
        	return 0;
        })

        console.log('data: ', data);

        var lineCall = {
			time: true,
			data: data,
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score'
		};
		console.log(lineCall);

		var returnChart = this.line(lineCall);
		returnChart.obj = obj;
		returnChart.redraw = function(data) {
            this.remove();
            this.obj.scores = data;
            this.obj.container = '#'+this.id;
            console.log('this.obj', JSON.stringify(this.obj));

            // returnChart = charts.DRA(this.obj);
			return charts.DRA(this.obj);
        };
        returnChart.add = function(data) {
			this.redraw(charts.extend(this.obj.scores,data));
		};

		console.log('returnChart: ',returnChart);

		return returnChart;
	}
});