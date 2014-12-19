angular.module('YeaNayers').directive('myMapFour', function(){
  return{
    template: function(){

      var width = 960,
          height = 600;

      var projection = d3.geo.albersUsa()
          .scale(1100)
          .translate([width / 2, height / 2]);

      var path = d3.geo.path()
          .projection(projection);

      var color = d3.scale.category10().domain(d3.range(9)),
          selectedColor = 0,
          dragColor;

      var components = color.domain().map(function() { return []; });

      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);

      var legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + ((width - color.domain().length * 24) / 2) + ",10)")
          .style("cursor", "pointer")
        .selectAll("rect")
          .data(color.domain())
        .enter().append("rect")
          .attr("x", function(d) { return d * 24; })
          .attr("width", 24 - 3)
          .attr("height", 24 - 3)
          .style("stroke", function(d) { return d ? null : "#000"; })
          .style("fill", color)
          .on("click", clicklegend);

      d3.select(self)
          .on("keydown", keydown)
          .node().focus();

      d3.json("/data/us.json", function(error, us) {
        if (error) return console.error(error);

        var bisectId = d3.bisector(function(d) { return d.id; }).left;

        var features = topojson.feature(us, us.objects.states).features;

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states))
            .attr("class", "background")
            .attr("d", path);

        var merge = svg.append("g")
            .attr("class", "merge")
          .selectAll("path")
            .data(components)
          .enter().append("path")
            .style("fill", function(d, i) { return color(i); })
            .style("stroke", function(d, i) { return d3.lab(color(i)).darker(); });

        svg.append("g")
            .attr("class", "foreground")
            .style("cursor", "pointer")
            .style("stroke-opacity", .5)
          .selectAll("path")
            .data(features)
          .enter().append("path")
            .attr("d", function(d) { d.color = null; return path(d); })
            .on("mouseover", function() { this.style.stroke = "black"; })
            .on("mouseout", function() { this.style.stroke = "red"; })
            .on('click', click);
            // .call(d3.behavior.drag()
            //   .on("dragstart", dragstart)
            //   .on("drag", drag)
            //   .on("click", click));

        top.location.hash.split("").slice(1, features.length).forEach(function(c, i) {
          if ((c = +c) >= 0 && c < 10) assign(features[i], c ? c - 1 : null);
        });

        redraw();

        function dragstart() {
          var feature = d3.event.sourceEvent.target.__data__;
          if (assign(feature, dragColor = feature.color === selectedColor ? null : selectedColor)) redraw();
        }

        // function drag() {
        //   var feature = d3.event.sourceEvent.target.__data__;
        //   console.log('feature: ' + JSON.stringify(feature));
        //   if (feature && assign(feature, dragColor)) redraw();
        // }

        function click(e) {
          console.log('e.id: ' + e.id);
          // assign(e, dragColor);
          // e.color = dragColor;

          // Find previously selected, unselect
          d3.select(".selected").classed("selected", false);

          // Select current item
          d3.select(this).classed("selected", true);
        }


        function assign(feature, color) {
          if (feature.color === color) return false;
          if (feature.color !== null) {
            var component = components[feature.color];
            component.splice(bisectId(component, feature.id), 1);
            feature.color = null;
          }
          if (color !== null) {
            var component = components[color];
            component.splice(bisectId(component, feature.id), 0, feature);
            feature.color = color;
          }
          return true;
        }

        function redraw() {
          merge.data(components).attr("d", function(d) { return path({type: "FeatureCollection", features: d}) || "M0,0"; });
          top.history.replaceState(null, null, "#" + features.map(function(d) { return d.color === null ? "0" : d.color + 1; }).join(""));
        }
      });

      function clicklegend(d) {
        legend[0][selectedColor].style.stroke = null;
        legend[0][selectedColor = d].style.stroke = "#000";
      }

      function keydown() {
        if (d3.event.keyCode >= 48 && d3.event.keyCode < 58) {
          var i = d3.event.keyCode - 49;
          if (i < 0) i = 10;
          clicklegend(i);
        }
      }

      d3.select(self.frameElement).style("height", height + "px");

    }
  }
});

