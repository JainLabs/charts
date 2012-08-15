// Requires ../charts/line.js

charts.extend({
	DRA: function(obj) {
		// var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined,
        var data = [],
	        scores = obj.scores;

        obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.color = (obj.color && obj.color !== '' && obj.color !== 'undefined') ? obj.color : '';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;
        obj.popover    = obj.popover === true ? true : false;

        // Map scores to a usable format
        for (var i in scores) {
        	if (scores.hasOwnProperty(i)) {
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

        var lineCall = {
			time: true,
			data: data,
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score',
            xMarker: obj.deadline,
            yMarker: obj.goal,
            xMax: obj.xMax,
            yMax: obj.yMax,
            xMin: obj.xMin,
            yMin: obj.yMin,
            container: obj.container,
            width: obj.width,
            height: obj.height,
            color: obj.color,
            popover: obj.popover
		};

		var returnChart = this.line(lineCall);
		returnChart.obj = obj;
		returnChart.redraw = function(data) {
            this.remove();
            this.obj.scores = data;
            this.obj.container = '#'+this.id;

            // returnChart = charts.DRA(this.obj);
			return charts.DRA(this.obj);
        };
        returnChart.add = function(data) {
			this.redraw(charts.extend(this.obj.scores,data));
		};

		return returnChart;
	}
});