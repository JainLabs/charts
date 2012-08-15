document.addEventListener('DOMContentLoaded', function () {
	window.gl = charts.groupedLine({
		time: true,
		data: {
			'02/20/2011': [10,10,10,20,00],
			'04/16/2011': [40,40,40,40,30],
			'08/05/2011': [50,50,50,50,30],
			'08/26/2011': [70,70,70,70,60]
		},
		title: 'Percent Correct Over Time',
		xlabel: 'Date',
		ylabel: 'Percent Correct',
		xMin: '02/01/2011',
		xMax: '07/30/2012',
		yMax: 100,
		xMarker: '06/10/2012',
		yMarker: 70,
		container: '#chartContainer',
		width: 630,
		height: 270,
		boxColors: {
			belowLine: '#999999',
			onLine: 'steelblue',
			aboveLine: 'green'
		},
		popover: true
	});
	$('#chart_share').on('click', function(e) {
		e.preventDefault();
		var date = new Date($('input[name="effective[year]"]').val(),$('input[name="effective[month]"]').val(),$('input[name="effective[day]"]').val()),
			data = [],
			session = {};

		jQuery.each([1,2,3,4,5],function(i,d) {
			data.push(parseFloat($('select[name="trial'+d+'"]').val()));
		})
		session[date.toDateString()] = data;
		// console.log(JSON.stringify(session));
		gl.add(session);
		return false;
	});
});

// gl.add({
// 	'09/07/2011': [70,80,80,80,80]
// });