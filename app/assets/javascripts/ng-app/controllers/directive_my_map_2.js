angular.module('YeaNayers').directive('myMapTwo', function(){
  return{
    template: function(){
      var width = 960,
              height = 500;

      var color = d3.scale.threshold()
              .domain([.02, .04, .06, .08, .10]) // <-A
              .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

      var path = d3.geo.path();

      var svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

      var g = svg.append("g")
              .call(d3.behavior.zoom()
              .scaleExtent([1, 10])
              .on("zoom", zoom));

      d3.json("/data/us.json", function (error, us) {
        d3.tsv("/data/unemployment.tsv", function (error, unemployment) {
          var rateById = {};

          unemployment.forEach(function (d) { // <-B
              rateById[d.id] = +d.rate;
          });

          g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function (d) {
                return color(rateById[d.id]); // <-C
            });

          g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path);
        });
      });
      
      function zoom() {
        g.attr("transform", "translate("
          + d3.event.translate
          + ")scale(" + d3.event.scale + ")");
      }
    }
  }
});