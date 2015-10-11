"use strict";

var width = "100%",
	height = 768,

    populations = [],
    svg;

const LIMIT = 80;

function setGraph (populations) {
    var svg = d3.select("#females-males")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var drawArea = svg.append('g')
        .attr("id", "draw-area")
        .attr("transform", "translate("+ (svg.node().clientWidth / 2) + ",0)");

    populations.forEach((p) => {
        let pop = drawArea.append('g').attr('id', p.name);

        pop.append("rect")
            .classed('males', true)
            .attr("width", width);

        pop.append("rect")
            .classed('females', true);

        pop.append('text')
            .classed('label', true)
            .text(p.label);
    });

    drawArea.append('g')
        .classed('axis', true)
        .attr("transform", "translate(0, " + height + ")");

    return svg;
}

function drawGraph (svg, populations) {
    var scale = d3.scale
		.linear()
		.range([-svg.node().clientWidth / 2, svg.node().clientWidth / 2])
        .domain([-LIMIT, LIMIT]);
        //.domain([-100, 100]);

    var scaleY = d3.scale.ordinal()
        .domain(populations.map((p) => { return p.name; }))
        .rangeRoundBands([0, height], 0.02, 0);

    populations.forEach((p) => {
        d3.select('#' + p.name + '')
            .attr("transform", "translate(0, " + scaleY(p.name) + ")");

        d3.select('#' + p.name + ' .females')
            .attr('height', scaleY.rangeBand())
            .attr('width', scale(p.females))
            .attr('x', scale(-p.females));

        d3.select('#' + p.name + ' .males')
            .attr('height', scaleY.rangeBand())
            .attr('width', scale(p.males));

        d3.select('#' + p.name + ' text')
            .attr("x", scale(-LIMIT))
            .attr("y", scaleY.rangeBand() / 2);
    });

    var axis = d3.svg.axis().scale(scale)
        .ticks(12)
        .tickFormat(function (t) {
            //return Math.abs(t) + '%';
            return Math.abs(t);
        })
        .orient('bottom');

    d3.select('g.axis')
        .call(axis);
};

populations = Population(Resource.Computas).updateGenders(Resource.Genders).genderDistributionByAge();

//populations.push(Population(Resource.Stortinget).updateGenders(Resource.Genders).genderDistribution());

console.log(populations);

svg = setGraph(populations);
drawGraph(svg, populations);

window.onresize = function () {
    drawGraph(svg, populations);
};