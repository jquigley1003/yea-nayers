angular.module('YeaNayers').directive('myMapEight', function(){
  return{
    template: function(){
      d3.select("svg").remove();

      var width = 960,
          height = 600;

      var formatNumber = d3.format(",.0f");

      var path = d3.geo.path()
          .projection(null);

      var radius = d3.scale.sqrt()
          .domain([0, 1e6])
          .range([0, 15]);

      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);

      var legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
        .selectAll("g")
          .data([1e6, 5e6, 1e7])
        .enter().append("g");

      legend.append("circle")
          .attr("cy", function(d) { return -radius(d); })
          .attr("r", radius);

      legend.append("text")
          .attr("y", function(d) { return -2 * radius(d); })
          .attr("dy", "1.3em")
          .text(d3.format(".1s"));

      d3.json("/data/us.json", function(error, us) {
        if (error) return console.error(error);

        svg.append("path")
            .datum(topojson.feature(us, us.objects.nation))
            .attr("class", "land")
            .attr("d", path);

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", path);

        svg.append("g")
            .attr("class", "bubble")
          .selectAll("circle")
            .data(topojson.feature(us, us.objects.counties).features
              .sort(function(a, b) { return b.properties.population - a.properties.population; }))
          .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("r", function(d) { return radius(d.properties.population); })
          .append("title")
            .text(function(d) {
              return d.properties.name
                  + "\nPopulation " + formatNumber(d.properties.population);
            });
      });

      d3.select(self.frameElement).style("height", height + "px");
    }
  }
});