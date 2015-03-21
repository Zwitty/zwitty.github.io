var chart;
var height = 200
var width = 300
//DEFINE YOUR VARIABLES UP HERE
var margin = {top: 80, right: 80, bottom: 80, left: 80},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.ordinal()
		.rangeRoundBands([0,width], 0.25);

var y = d3.scale.linear()
	.range([height,0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom"); //This should be right

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

//Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg')
  vis = chart.append('svg:g')
  //PUT YOUR INIT CODE BELOW



  //
}

//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv',update)
}
				  
function update(rawdata){
  //PUT YOUR UPDATE CODE BELOW	
	if(getXSelectedOption() == 'sales' && getYSelectedOption() == 'region'){
		data = d3.nest()
			.key(function(d){return d.region})
			.rollup(function(values){
				return d3.sum(values, function(d){return d.sales;})		
			})
			.entries(rawdata)
	
		console.log(data);
	}	
	if(getXSelectedOption() == 'sales' && getYSelectedOption() == 'category'){
		data = d3.nest()
			.key(function(d){return d.category})
			.rollup(function(values){
				return d3.sum(values, function(d){return d.sales;})		
			})
			.entries(rawdata)
	
		console.log(data);
	}	

	if(getXSelectedOption() == 'profit' && getYSelectedOption() == 'region'){
		data = d3.nest()
			.key(function(d){return d.region})
			.rollup(function(values){
				return d3.sum(values, function(d){return d.profit;})		
			})
			.entries(rawdata)
	
		console.log(data);
	}	

	if(getXSelectedOption() == 'profit' && getYSelectedOption() == 'category'){
		data = d3.nest()
			.key(function(d){return d.category})
			.rollup(function(values){
				return d3.sum(values, function(d){return d.profit;})		
			})
			.entries(rawdata)
	
		console.log(data);
	}	

	x.domain(data.map(function(d){return d.key;}));
	y.domain([0, d3.max(data, function(d) {return d.values;})]);
	
	var svg = d3.select("svg");
		svg.selectAll("*").remove();	

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + width + ",0)" )
		.call(yAxis);

	svg.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.style("fill", "steelblue")
		.attr("x", function(d){return x(d.key);})
		.attr("width", x.rangeBand())
		.attr("y", function(d){return y(d.values);})
		.attr("height", function(d) {return height - y(d.values);});
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node()
  var i = node.selectedIndex
  return node[i].value
}

// Returns the selected option in the Y-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node()
  var i = node.selectedIndex
  return node[i].value
}

