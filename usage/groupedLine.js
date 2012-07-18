<!DOCTYPE html>
<html>
<head>
	<title>Grouped Line Chart</title>
	<script type="text/javascript" src="../d3.v2.js"></script>
	<script type="text/javascript" src="../charts.js"></script>
	<script type="text/javascript" src="../charts/line.js"></script>
	<!-- <script type="text/javascript" src="../wrappers/behavior.js"></script> -->
	<script>
	window.onload = function() {
		charts.groupedLine({
			data: [{
					x: 0,
					y: .3
				}, {
					x: .5,
					y: 1
				}, {
					x: 1,
					y: 10
				}, {
					x: 2,
					y: 100
				}],
			title: 'Line Chart',// Default: ''
			xlabel: 'x Label',	// Default: ''
			ylabel: 'y Label',	// Default: ''
			xMax: 2.5,			// Default: maximum x coord in data set
			yMax: 120,			// Default: maximum y coord in data set
			xMarker: 1.75,			// Default: no marker
			yMarker: 50,		// Default: no marker
			container: 'body',	// Default: 'body'
			width:  900,		// Default: 500
			height: 400,		// Default: 400
			margin: {
				top: 20,		// Default: 20
				right: 10,		// Default: 10
				bottom: 30,		// Default: 30
				left: 40		// Default: 40
			},
			color: 'orange'		// Default: 'steelblue'
		});
	};
	</script>
</head>
<body>
</body>
</html>