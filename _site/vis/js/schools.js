var svg;
var height = 1500
var width = 600

//Gets called when the page is loaded.
function init(){
  //PUT YOUR INIT CODE BELOW
  var margin = {top: 80, right: 80, bottom: 80, left: 80},
	  width = 1000 - margin.left - margin.right,
	  height = 800 - margin.top - margin.bottom;

  svg = d3.select("#vis").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("data/epublic.geojson", drawMap)
}

function updateClicked(){
	if(getSelectedLang() == 'English' && getSelectedType() == 'Public'){
		d3.json("data/epublic.geojson", drawMap)
	}

	if(getSelectedLang() == 'French' && getSelectedType() == 'Public'){
		d3.json("data/fpublic.geojson", drawMap)
	}

	if(getSelectedLang() == 'English' && getSelectedType() == 'Catholic'){
		d3.json("data/ecatholic.geojson", drawMap)
	}

	if(getSelectedLang() == 'French' && getSelectedType() == 'Catholic'){
		d3.json("data/fcatholic.geojson", drawMap)
	}
}

function drawMap(rawdata){
	//console.log(rawdata);

	svg.selectAll("*").remove();

	var group = svg.selectAll("#vis")
		.data(rawdata.features)
		.enter()
		.append("g")

	var projection = d3.geo.mercator()
		.scale(2000)
		.translate([3250, 2025])
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

function getSelectedLang(){
	var node = d3.select('#langdropdown').node()
	var i = node.selectedIndex
	return node[i].value
}
function getSelectedType(){
	var node = d3.select('#typedropdown').node()
	var i = node.selectedIndex
	return node[i].value
}
