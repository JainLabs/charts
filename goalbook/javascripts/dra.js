document.addEventListener('DOMContentLoaded', function () {
	window.dra = charts.DRA({
		scores: {
			'2012/06/1': 25,
			'2012/06/4': 28,
			'2012/06/7': 35,
			'2012/06/11': 50
		},
		container: '#chartContainer',
		deadline: '2012/11/11',
		goal: 40,
		width: 630,
		height: 270,
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