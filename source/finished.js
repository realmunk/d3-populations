var populations = [Pop().genderDist(), Pop("Stortinget").genderDist()];

var svg = d3.select("#population")
	.append("svg");

var xGroup = svg.append("g")
	.classed("x axis", true);

var yGroup = svg.append("g")
	.classed("y axis", true);

var nodes = populations.map(function (population) {
	var node = svg.append('g')
		.classed('population', true);

	node.append('rect')
		.classed('females', true)

	node.append('rect')
		.classed('males', true)

	return { node: node, data: population};
});

function drawGraph (nodes) {
	
	var width = svg.node().offsetWidth,
		height = svg.node().offsetHeight;

	var scaleX = d3.scale.linear()
		.domain([
			-d3.max(populations.map(function (d) {
				return d.males;
			}).concat(populations.map(function (d) { 
				return d.females;
			}))), 
			d3.max(populations.map(function (d) {
				return d.males;
			}).concat(populations.map(function (d) { 
				return d.females;
			})))
		])
		.range([0, width]),

		scaleY = d3.scale.ordinal()
			.domain(populations.map(function (p) {
				return p.name;
			}))
			.rangeRoundBands([0, height], 0.1, 0),

		xAxis = d3.svg.axis()
			.scale(scaleX)
			.tickSize(-height - 1)
			.tickFormat(function (d) { return Math.abs(d); })
			.ticks(15),

		yAxis = d3.svg.axis()
			.scale(scaleY)
			.tickFormat(function (d) { /*return new Date().getFullYear() - d*/ return d; })
			.tickSize(-width + 1)
			.orient("left");

	xGroup.attr("transform", "translate(0, " + height + ")")
		.call(xAxis);

	yGroup.call(yAxis);

	nodes.forEach(function (n) {
		var h = scaleY.rangeBand();
		n.node.attr('transform', 'translate(0, ' + scaleY(n.data.name) + ')')

		n.node.select('.females')
			.attr("width", scaleX(n.data.females) - scaleX(0))
			.attr('x', scaleX(-n.data.females))
			.attr("height", h);

		n.node.select('.males')
			.attr("width", scaleX(n.data.males) - scaleX(0))
			.attr('x', scaleX(0))
			.attr("height", h);
	});

}
 
function draw () {
	drawGraph(nodes);
}

window.onload = draw;
window.onresize = draw;