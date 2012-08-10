document.addEventListener('DOMContentLoaded', function () {
	var gzl = charts.groupedLine({
		time: true,
		data: {
			'02/20/2011': [1,1,1,2,0],
			'03/01/2011': [1,2,2,2,2],
			'04/16/2011': [4,4,4,4,3],
			'08/05/2011': [5,5,5,5,3],
			'08/15/2011': [4,6,6,6,6],
			'08/26/2011': [7,7,7,7,6],
			'09/07/2011': [7,7,7,7,8]
		},
		title: 'Questions Correct Over Time',
		xlabel: 'Time',
		ylabel: 'Questions Correct',
		xMin: '02/01/2011',
		xMax: '05/28/2012',
		yMax: 10,
		xMarker: 'Wed Jul 03 2012 10:00:00 GMT-0700 (PDT)',
		yMarker: 9,
		container: '#chartContainer',
		width: 630,
		height: 270,
		boxColors: {
			belowLine: '#999999',
			onLine: 'orange',
			aboveLine: 'green'
		},
		popover: true
	});
});