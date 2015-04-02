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
    

    d3.json("data/ontario.geojson", drawOntario)
}

function updateClicked(){
    if(getSelectedLang() == 'English' && getSelectedType() == 'Public'){
        document.getElementById("title").innerHTML = "English Public School Districts";
    	d3.json("data/epublic.geojson", drawMap)
    }

    if(getSelectedLang() == 'French' && getSelectedType() == 'Public'){
        document.getElementById("title").innerHTML = "French Public School Districts";
        d3.json("data/fpublic.geojson", drawMap)
    }

    if(getSelectedLang() == 'English' && getSelectedType() == 'Catholic'){
        document.getElementById("title").innerHTML = "English Catholic School Districts";
        d3.json("data/ecatholic.geojson", drawMap)
    }

    if(getSelectedLang() == 'French' && getSelectedType() == 'Catholic'){
        document.getElementById("title").innerHTML = "French Catholic School Districts";
        d3.json("data/fcatholic.geojson", drawMap)
    }
}

function drawOntario(rawdata){
 
    var group = svg.selectAll("#vis")
        .data(rawdata.features)
        .enter()
        .append("g")

    var projection = d3.geo.mercator()
        .scale(2000)
        .translate([3250, 2050])
        .precision(.1);

    var path = d3.geo.path().projection(projection);

    var areas = group.append("path")
        .attr("d", path)
        .attr("class", "area")
        .attr("fill", "none")
        .attr("stroke", "black");
    
    group.append("text")
        .attr("x", function (d) { return path.centroid(d)[0]; })
        .attr("y", function (d) { return path.centroid(d)[1]-50; })
        .attr("text-anchor", "middle")
        .attr('font-size', '20pt')
        .text(function (d) {return d.properties.NAME; });
   
}

function drawMap(rawdata){
    //console.log(rawdata);

    svg.selectAll("*").remove();

    d3.json("data/ontario.geojson", drawOntario)

    var group = svg.selectAll("#vis")
        .data(rawdata.features)
        .enter()
        .append("g")

    var projection = d3.geo.mercator()
        .scale(2000)
        .translate([3250, 2050])
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
        selectDistrict(d,i);
        /*.append("text")
            .attr("x", function (d) { return path.centroid(d)[0];})
            .attr("y", function (d) { return path.centroid(d)[1];})
            .attr("text-anchor", "middle")
            .attr('font-anchor', '10pt')
            .text(function (d) { return d.properties.NAME; });*/

    })

    /*group.append("text")
        .attr("x", function (d) { return path.centroid(d)[0]; })
        .attr("y", function (d) { return path.centroid(d)[1]; })
        .attr("text-anchor", "middle")
        .attr('font-size', '10pt')
        .text(function (d) {return d.properties.NAME; });*/
}

function enrolChart(geoData, enrolData){
    console.log("Inside enrol");
    console.log(geoData);
    
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var enrol = d3.select("#enrol").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.25);

    var y = d3.scale.linear()
        .range([height,0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var gradeTitles = d3.keys(enrolData).filter(function(key) {return key !== "Board Number" && key !== "Board Name" && key !== "Total Enrolment";});

    console.log(gradeTitles); 

    enrolData.grades = gradeTitles.map(function(name){return {name: name, value: +enrolData[name]}; });

    x.domain(gradeTitles).rangeRoundBands([0, x.rangeBand()]);
    y.domain([0, d3.max(enrolData, function(d) {return d3.max(d.grades, function(d){return d.value;}); })]);

    enrol.append("g")
        .attr("class","x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis);

    enrol.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);

    enrol.selectAll("rect")
        .data(enrolData)
        .enter().append("rect")
        .style("fill", "orange")
        .attr("x", function(d){return x(d.name);})
        .attr("y", function(d){return y(d.value);})
        .attr("height", function(d) { return height - y(d.value); });

}

function selectDistrict(geoData,i){
    //console.log(districtData);
    d3.csv('data/Data/Ontario/enrolment-grade-elementary-schools/2011-2012/enrolment_by_grade-elementary_schools_2011-2012_en_0.csv', function(d){
        d.forEach(function(d){
            //console.log(d["Board Number"]);
            //Map data does not have a B infront of the district number but it is the same number
            if(d["Board Number"] == 'B'+geoData.properties.DSB_NUMBER){
                console.log("CSV: " + d["Board Name"]);
                console.log("GEOJSON: " + geoData.properties.NAME);
                enrolChart(geoData, d);   
            }
        });
        //console.log(d[i]["Board Name"]);
        //console.log(districtData); 
    });

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

