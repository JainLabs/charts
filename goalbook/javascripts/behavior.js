document.addEventListener('DOMContentLoaded', function () {
	window.behaviorChart = charts.behavior({
	  positive: {
	    '0-1 remiders':3,
	    '2 remiders':2
	  },
	  negative: {
	    '3+ remiders': 1,
	    'directions ignored': 1
	  }
	}, '#chartContainer', 270, 270);
	$('#chart_share').on('click', function(e) {
		e.preventDefault();
		switch($('select[name="reminders"]').val()) {
			case '0-1': ++behaviorChart.data.positive['0-1 remiders']; break;
			case '2': ++behaviorChart.data.positive['2 remiders']; break;
			case '3 or more': ++behaviorChart.data.negative['3+ remiders']; break;
			case 'directions ignored': ++behaviorChart.data.negative['directions ignored']; break;
		}
		behaviorChart.redraw(behaviorChart.data);
		return false;
	});
});