var chart;
var height = 1500
var width = 600

//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg')
  vis = chart.append('svg:g')
  		.attr("width", width)
		.attr("height", height)
  //PUT YOUR INIT CODE BELOW
  console.log("init");
  d3.json("data/epublic.geojson", drawMap)
}


//DEFINE YOUR VARIABLES UP HERE
var margin = {top: 80, right: 80, bottom: 80, left: 80},
	width = 1000 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



function drawMap(rawdata){
	console.log(rawdata);
	var group = svg.selectAll("g")
		.data(rawdata.features)
		.enter()
		.append("g")

	var projection = d3.geo.mercator()
		.scale(2000)
		.translate([3500, 2000])
		.precision(.1);
		
	var path = d3.geo.path().projection(projection);

	var areas = group.append("path")
		.attr("d", path)
		.attr("class", "area")
		.attr("fill", "steelblue");
	
	areas.on('mouseover', function(d,i){
		d3.select(this.parentNode.appendChild(this))
			.attr("fill", "orange");
			//console.log(this);
			//.style({'fill-opacity':1,'stroke':'#F00'});
	})

	areas.on('mouseout', function(d,i){
		d3.select(this.parentNode.appendChild(this))
			.attr("fill", "steelblue");

	})

	areas.on('click', function(d,i){
		d3.select(this.parentNode.appendChild(this))
			.attr("fill","red");
	})

	/*group.append("text")
		.attr("x", function (d) { return path.centroid(d)[0]; })
		.attr("y", function (d) { return path.centroid(d)[1]; })
		.attr("text-anchor", "middle")
		.attr('font-size', '10pt')
		.text(function (d) {return d.properties.NAME; });*/
}
