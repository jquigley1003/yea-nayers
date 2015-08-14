angular.module('YeaNayers').directive('myMapFive', function(){
  return{
    template: function(){
      d3.select("svg").remove();

      //Width and height
      var w = 960;
      var h = 600;
      //Define map projection
      var projection = d3.geo.albersUsa()
                      .translate([w/2, h/2])
                      .scale([1100]);
      //Define path generator
      var path = d3.geo.path()
                .projection(projection);
               
      //Define quantize scale to sort data values into buckets of color
      var color = d3.scale.quantize()
                  .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
                //Colors taken from colorbrewer.js, included in the D3 download
      //Create SVG element
      var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);          
      //Load in agriculture data
      d3.csv("/data/us-ag-productivity-2004.csv", function(data) {
        //Set input domain for color scale
        color.domain([
          d3.min(data, function(d) { return d.value; }), 
          d3.max(data, function(d) { return d.value; })
        ]);
        //Load in GeoJSON data
        d3.json("/data/us-states.json", function(json) {
          //Merge the ag. data and GeoJSON
          //Loop through once for each ag. data value
          for (var i = 0; i < data.length; i++) {
        
            var dataState = data[i].state;        //Grab state name
            var dataValue = parseFloat(data[i].value);  //Grab data value, and convert from string to float
        
            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
            
              var jsonState = json.features[j].properties.name;
        
              if (dataState == jsonState) {
            
                //Copy the data value into the JSON
                json.features[j].properties.value = dataValue;
                
                //Stop looking through the JSON
                break;
                
              }
            }   
          }
          //Bind data and create one path per GeoJSON feature
          svg.selectAll("path")
             .data(json.features)
             .enter()
             .append("path")
             .attr("d", path)
             .style("fill", function(d) {
                //Get data value
                var value = d.properties.value;
                
                if (value) {
                  //If value exists…
                  return color(value);
                } else {
                  //If value is undefined…
                  return "#ccc";
                }
             });

          //Load in cities data
          d3.csv("/data/us-cities.csv", function(data) {
            
            svg.selectAll("circle")
               .data(data)
               .enter()
               .append("circle")
               .attr("cx", function(d) {
                 return projection([d.lon, d.lat])[0];
               })
               .attr("cy", function(d) {
                 return projection([d.lon, d.lat])[1];
               })
               .attr("r", 5)
               .style("fill", "yellow")
               .style("opacity", 0.75)

            svg.selectAll("text")
                .data(data)
                .enter()
                .append("text") // append text
                .attr("x", function(d) {
                  return projection([d.lon, d.lat])[0];
                })
                .attr("y", function(d) {
                  return projection([d.lon, d.lat])[1];
                })
                .attr("dy", -7) // set y position of bottom of text
                .style("fill", "black") // fill the text with the colour black
                .style("font-size", "10")
                .attr("text-anchor", "middle") // set anchor y justification
                .text(function(d) {return d.cities;}); // define the text to display
          });
        });      
      });
    }
  }
});