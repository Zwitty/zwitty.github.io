var svg, enrol;
var type = 'enrolment';
var year = '2011-2012';
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
   
    d3.select("#enrol").select("svg").remove();

    d3.select("#scale")
        .style("visibility","visible");

    type = getSelectedDataType();
    year = getSelectedYear();

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
    
        var projection = d3.geo.mercator()
        .scale(2000)
        .translate([3250, 2050])
        .precision(.1);

    var path = d3.geo.path().projection(projection);

    var div = d3.select("#vis").append("div")
        .attr("class", "tooltip")               
        .style("opacity", 0);

    d3.json("data/ontario.geojson", drawOntario)

    queue()
        .defer(d3.csv, 'data/'+type+'/'+year+'/'+type+'.csv', function(d){ rateById.set(d["Board Number"], +d["Total Enrolment"]);})
        .await(ready);
    function ready(error, on){
        
        //d3.max(enrolData.grades, function(d) {return d.value;} )]
        //maxDataSetValue = d3.max(d3.values(rateById), function(d){return d.value});
        //maxDataSetValue = d3.max(d3.values(rateById));
        var maxDataSetValue = d3.max(rawdata.features, function(d){return rateById.get('B'+d.properties.DSB_NUMBER);});

        var quantize = d3.scale.quantize()
            .domain([0, d3.max(rawdata.features, function(d){return rateById.get('B'+d.properties.DSB_NUMBER);})])
            .range(d3.range(15).map(function(i){return "q" + i;}));
   
   
        var group = svg.selectAll("#vis")
            .data(rawdata.features)
            .enter()
            .append("g")

        var areas = group.append("path")
            .attr("d", path)
            .attr("class", function(d) {return quantize(rateById.get('B'+d.properties.DSB_NUMBER));});

        areas.on('mouseover', function(d,i){
            d3.select(this)
                .transition().duration(300).style("opacity",1);
               div.transition().duration(300)
                .style("opacity", 0.9)
               div.html(
                    d.properties.NAME
                    +'</br>'+
                    '<b>Number of Students:</b> '+rateById.get('B'+d.properties.DSB_NUMBER)
                    +'</br>'+
                    d.properties.WEBSITE)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
            
            d3.select(this.parentNode.appendChild(this))
                .style({'fill-opacity':1,'stroke':'#F00'});
                
        })

        areas.on('mouseout', function(d,i){
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
               div.transition().duration(300)
                .style("opacity", 0);
            
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

function enrolChart(geoData, enrolData){ 
   
    var margin = {top: 80, right: 80, bottom: 180, left: 80},
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    enrol = d3.select("#enrol").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var div = d3.select("#enrol").append("div")
        .attr("class", "tooltip")               
        .style("opacity", 0);


    

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

    var gradeTitles = d3.keys(enrolData).filter(function(key) {return key !== "Board Number" && key !== "Board Name" && key !== "Total Enrolment" && key !== "Total Elementary" && key !== "Total Secondary";});


    enrolData.grades = gradeTitles.map(function(name){
        return {name: name, value: +enrolData[name]}; 
    });
    //x.domain(gradeTitles).rangeRoundBands([25, 700]);
    x.domain(gradeTitles);
    y.domain([0, d3.max(enrolData.grades, function(d) {return d.value;} )]);
    //y.domain([0, 28000]);

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

    enrol.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(year+' '+type);

    enrol.selectAll("rect")
        .data(enrolData.grades)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return x(d.name);})
        .attr("width", 30)
        .attr("y", function(d){return y(d.value);})
        .attr("height", function(d) { return height - y(d.value); })
        
        .on('mouseover', function(d,i){
            d3.select(this)
                .transition().duration(300).style("opacity",1);
               div.transition().duration(300)
                .style("opacity", 0.9)
               div.html(
                    geoData.properties.NAME
                    +'</br>'+
                    '<b>Number of Students:</b> '+ d.value
                    )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })

        .on('mouseout', function(d,i){
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
               div.transition().duration(300)
                .style("opacity", 0);
        });

}

function selectDistrict(geoData,i){
    console.log("Selected District" + geoData.properties.NAME);
    
    //removes previous chart
    d3.select("#enrol").select("svg").remove();

    d3.csv('data/'+type+'/'+year+'/'+type+'.csv', function(d){
        d.forEach(function(d){
            //Map data does not have a B infront of the district number but it is the same number
            if(d["Board Number"] == 'B'+geoData.properties.DSB_NUMBER){
                console.log("Elementary: " + d["Board Name"]); 
                enrolChart(geoData, d);
                //console.log("GEOJSON: " + geoData.properties.NAME);
            }
        });
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
function getSelectedYear(){
    var node = d3.select('#yeardropdown').node()
    var i = node.selectedIndex
    return node[i].value
}
function getSelectedDataType(){
    var node = d3.select('#datadropdown').node()
    var i = node.selectedIndex
    return node[i].value
}
