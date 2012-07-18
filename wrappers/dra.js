// Requires ../charts/line.js

charts.extend({
	DRA: function(obj) {
		var xMax = (obj.deadline && typeof obj.deadline === 'number') ? obj.deadline + .5 : undefined;

		obj.container = (obj.container && obj.container !== '' && obj.container !== 'undefined') ? obj.container : 'body';
		obj.width     = (obj.width && typeof obj.width === 'number') ? obj.width : undefined;
        obj.height    = (obj.height && typeof obj.height === 'number') ? obj.height : undefined;

		this.line({
			data: [{
					x: 0,
					y: 25
				}, {
					x: .5,
					y: 30
				},  {
					x: 2,
					y: 40
				}, {
					x: 2.5,
					y: 45
				}],
			title: 'Reading Level',
			xlabel: 'Time',
			ylabel: 'DRA Score',
			xMax: xMax,
			yMax: 60,
			xMarker: obj.deadline,
			yMarker: obj.goal,
			container: obj.container,
			width:  obj.width,
			height: obj.height,
		});
	}
});