var svg, enrol;
//var height = 1500
//var width = 600

//Gets called when the page is loaded.
function init(){
    //PUT YOUR INIT CODE BELOW
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 750 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

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
/* Draws the boundary for Ontario
 * Could be repuposed for other provinces
 */
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
        .attr("background-color","gray")
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
    
    var rateById = d3.map();

    var quantize = d3.scale.quantize()
        .domain([0, 55000])
        .range(d3.range(5).map(function(i){return "q" + i;}));
   
    var projection = d3.geo.mercator()
        .scale(2000)
        .translate([3250, 2050])
        .precision(.1);

    var path = d3.geo.path().projection(projection);

    d3.json("data/ontario.geojson", drawOntario)

    queue()
        .defer(d3.csv, 'data/enrolment-by-grade/2011-2012/elementary.csv', function(d){ rateById.set(d["Board Number"].substring(1), +d["Total Enrolment"]);})
        .await(ready);
    function ready(error, on){
        
        var group = svg.selectAll("#vis")
            .data(rawdata.features)
            .enter()
            .append("g")

        var areas = group.append("path")
            .attr("d", path)
            .attr("class", function(d) {return quantize(rateById.get(d.properties.DSB_NUMBER));});

        areas.on('mouseover', function(d,i){
            d3.select(this.parentNode.appendChild(this))
                //.attr("fill", "orange");
                //console.log(this);
                .style({'fill-opacity':1,'stroke':'#F00'});
        })

        areas.on('mouseout', function(d,i){
            d3.select(this.parentNode.appendChild(this))
                //.attr("fill", "steelblue");
                .style({'fill-opacity':1,'stroke':'none'});

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
    
    }
    /*group.append("text")
        .attr("x", function (d) { return path.centroid(d)[0]; })
        .attr("y", function (d) { return path.centroid(d)[1]; })
        .attr("text-anchor", "middle")
        .attr('font-size', '10pt')
        .text(function (d) {return d.properties.NAME; });*/
}

function enrolChart(geoData, eleData, secData){ 
   
        var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var enrol = d3.select("#enrol").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    

    var x = d3.scale.ordinal()
        .rangeRoundBands([20, 600], 0.1);

    var y = d3.scale.linear()
        .range([height,0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickPadding(-5)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var eleGradeTitles = d3.keys(eleData).filter(function(key) {return key !== "Board Number" && key !== "Board Name" && key !== "Total Enrolment";});
    
    var secGradeTitles = d3.keys(secData).filter(function(key) {return key !== "Board Number" && key !== "Board Name" && key !== "Total Enrolment";});

    console.log(secGradeTitles); 
    var gradeTitles = eleGradeTitles.concat(secGradeTitles);
    console.log(gradeTitles); 

    eleData.grades = eleGradeTitles.map(function(name){
        return {name: name, value: +eleData[name]}; 
    });
    
    secData.grades = secGradeTitles.map(function(name){
        return {name: name, value: +secData[name]}; 
    }); 
    console.log(eleData.grades); 
    console.log(secData.grades);

    var grades = eleData.grades.concat(secData.grades);

    console.log(grades); 

    //x.domain(gradeTitles).rangeRoundBands([25, 700]);
    x.domain(gradeTitles);
    y.domain([0, d3.max(grades, function(d) {return d.value;} )]);

    enrol.append("g")
        .attr("class","x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)" 
        });

    enrol.append("g")
        .attr("class", "y axis")
        .call(yAxis)
       .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Student Enrolled");

    enrol.selectAll("rect")
        .data(grades)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return x(d.name);})
        .attr("width", 30)
        .attr("y", function(d){return y(d.value);})
        .attr("height", function(d) { return height - y(d.value); });

}

function selectDistrict(geoData,i){
    //console.log(districtData);
    
    //removes previous chart
    d3.select("#enrol").select("svg").remove();

    d3.csv('data/enrolment-by-grade/2011-2012/elementary.csv', function(d){
        d.forEach(function(d){
            //console.log(d["Board Number"]);
            //Map data does not have a B infront of the district number but it is the same number
            if(d["Board Number"] == 'B'+geoData.properties.DSB_NUMBER){
                
                d3.csv('data/enrolment-by-grade/2011-2012/secondary.csv', function(c){
                    c.forEach(function(b){
                        if(b["Board Number"] == 'B'+geoData.properties.DSB_NUMBER){
                            console.log("Secondary: " + b["Board Name"]);
                            console.log("Elementary: " + d["Board Name"]); 
                            enrolChart(geoData, d, b);
                        }
                    });
                });
                //console.log("CSV: " + d["Board Name"]);
                //console.log("GEOJSON: " + geoData.properties.NAME);
                //enrolChart(geoData, d);   
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

