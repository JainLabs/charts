document.addEventListener('DOMContentLoaded', function () {
	window.behaviorChart = charts.behavior({
	  positive: {
	    '2 remiders':2,
	    '0-1 remiders':3
	  },
	  negative: {
	    'directions ignored': 1,
	    '3+ remiders': 1
	  }
	}, '#chartContainer', 270, 270);
	$('#chart_share').on('click', function(e) {
		e.preventDefault();
		var date = new Date($('input[name="effective[year]"]').val(),$('input[name="effective[month]"]').val(),$('input[name="effective[day]"]').val()),
			data = parseFloat($('input[name="completion"]').val()),
			point = {};
		point[date.toDateString()] = data;
		console.log(point);
		// dra.add(point);
		return false;
	});
});

// gl.add({
// 	'09/07/2011': [70,80,80,80,80]
// });