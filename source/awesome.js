//D3.JS
//DATA DRIVEN DOCUMENTS


/*





20px      70px           30px     377px
[              ---------|-------------------          ]
100%					0%                         100%

PART 1: @LIGHTWEIGHT easy graph

1. SVG
2. RECT
3. SCALE
4. X-AXIS

PART 2: @EASY graph

5. UPDATE SCALE
6. UPDATE FIRST RECT AND POSITION
7. ADD RECT AND POSITION

PART 3: @FLEXIBLE

8. ARRAY AND FOREACH
9. REFACTOR APPENDING
10. SCALEY
11. LOAD ANOTHER POPULATION

PART 4: @ADVANCE

12. LOAD A MORE ADVANCED POPULATION
13. TALK ABOUT THE DATA

PART 5: @SHOW

14. RESPONSIVE
*/

var	populations = Population(Resource.Computas).genderDistributionByAge(),
	scaleX = d3.scale.linear();

	scaleY = d3.scale.ordinal()
		.domain(populations.map(function (cx) {
			return cx.name;
		}));

	xAxis = d3.svg.axis()
		.scale(scaleX)
		.tickFormat(function (d) {
			return Math.abs(d) + "%";
		}),
	yAxis = d3.svg.axis()
		.scale(scaleY)
		.orient('left'),
	svg = d3.select('#population')
		.append('svg'),
	x = svg.append('g')
		.classed('x axis', true),
	y = svg.append('g')
		.classed('y axis', true);

representations = populations.map(function (pop) {
	var node = svg.append('g');

	node.append('rect')
		.classed('females', true);

	node.append('rect')
		.classed('males', true);
	
	return { 
		node: node, 
		data: pop 
	};	
})


function updateGraph (representations) {

	width = svg.node().offsetWidth;
	height = svg.node().offsetHeight;

	scaleX.domain([-100, 100])	
		.range([0, width]),
	
	scaleY.rangeRoundBands([0, height]);

	x.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	y.call(yAxis);

	representations.forEach(function (rep) {

		var repHeight = scaleY.rangeBand();

		rep.node.attr('transform', 'translate(0,' + scaleY(rep.data.name) + ')');

		rep.node.select('.females')
			.attr("width", scaleX(rep.data.females) - scaleX(0))
			.attr('x', scaleX(-rep.data.females))
			.attr('height', repHeight);

		rep.node.select('.males')
			.attr("width", scaleX(rep.data.males) - scaleX(0))
			.attr('x', scaleX(0))
			.attr('height', repHeight);
	
	});
}

window.onresize = function () {
	updateGraph(representations);
};

updateGraph(representations);