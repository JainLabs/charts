document.addEventListener('DOMContentLoaded', function () {
	window.dra = charts.DRA({
		scores: {
			'2011/12/11': 30,
			'2012/02/24': 40,
			'2012/05/28': 30
		},
		container: '#chartContainer',
		deadline: '2012/11/11',
		goal: 40,
		xMax: '2012/11/20',
		yMax: 50,
		xMin: '2011/11/11',
		width: 630,
		height: 270,
		popover: true,
		color: '#006400'
	});
	$('#chart_share').on('click', function(e) {
		e.preventDefault();
		var date = new Date($('input[name="effective[year]"]').val(),$('input[name="effective[month]"]').val(),$('input[name="effective[day]"]').val()),
			data = parseFloat($('input[name="completion"]').val()),
			point = {};
		point[date.toDateString()] = data;
		console.log(point);
		dra.add(point);
		return false;
	});
});

// gl.add({
// 	'09/07/2011': [70,80,80,80,80]
// });