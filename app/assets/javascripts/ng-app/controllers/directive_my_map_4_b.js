angular.module( 'YeaNayers').directive( 'myMapFourB', [ 'voteService', '$state',
  function (voteService, $state) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element) {
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
          width = 700 - margin.left - margin.right,
          height = 420 - margin.top - margin.bottom;

        var projection = d3.geo.albersUsa()
            .scale(900)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        var color = d3.scale.category10().domain(d3.range(9)),
            selectedColor = 0,
            dragColor;

        var components = color.domain().map(function() { return []; });

        // Define 'div' for tooltips
        var div = d3.select("body")
          .append("div")             // declare the tooltip div 
          .attr("class", "tooltip")  // apply the 'tooltip' class
          .style("opacity", 0);      // set the opacity to nil
          
        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        // var y = d3.scale.linear().range([height, 0]);

        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");

        // var yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left")
        //     .ticks(10);

        //Render map based on 'data'
        scope.render = function(data) {
          
          // if(data.houseVoteByMember != undefined){
          //  console.log('beginning houseVote circle length = ' + data.houseVoteByMember.length);
          // }

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

              // Combine the vote data with state latitude and longitude
              d3.json("/data/states.json", function(usstate) {
                for (var i = 0; i < usstate.length; i++) {
                  //Grab state name
                  var usStateAbbrv = usstate[i].abbreviation;
                  //Grab data value, and convert from string to float
                  var usStateLat = parseFloat(usstate[i].lat);
                  var usStateLon = parseFloat(usstate[i].lon);
                  //Find the corresponding state inside the GeoJSON
                  if(data.houseVoteByMember != undefined){ 
                    for (var j = 0; j < data.houseVoteByMember.length; j++) {
                      var houseState = data.houseVoteByMember[j].person_role.state;
                      // var offsetLon = (Math.random() * 1.5)-1.5;
                      // var offsetLat = (Math.random() * 1.5)-1.5;
                      var offsetLon = j/data.houseVoteByMember.length;
                      offsetLon *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
                      var offsetLat = j/data.houseVoteByMember.length;
                      offsetLat *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
                      if (usStateAbbrv == houseState) {
                        //Copy the data value into the JSON
                        data.houseVoteByMember[j].person_role.stateLat = usStateLat + offsetLat;
                        data.houseVoteByMember[j].person_role.stateLon = usStateLon - offsetLon;
                      }
                    }
                  }
                  if(data.senateVoteByMember != undefined){ 
                    for (var j = 0; j < data.senateVoteByMember.length; j++) {
                      var senateState = data.senateVoteByMember[j].person_role.state;
                      // var offsetLon = (Math.random() * 1.5)-1.5;
                      // var offsetLat = (Math.random() * 1.5)-1.5;
                      var offsetLon = (Math.random() * 1.5)-1.5;
                      offsetLon %= 2 == 0 ? 1 : -1;      
                      var offsetLat = (Math.random() * 1.5)-1.5;
                      offsetLat %= 2 == 0 ? 1 : -1;
                      if (usStateAbbrv == senateState) {
                        //Copy the data value into the JSON
                        data.senateVoteByMember[j].person_role.stateLat = usStateLat + offsetLat;
                        data.senateVoteByMember[j].person_role.stateLon = usStateLon - offsetLon;
                      }
                    }
                  }
                }
              }); // end of states.json data load

                // console.log('circle info house votes = ', data.houseVoteByMember[0]);

              // Add the house vote data to the U.S. map
              if(data.houseVoteByMember != undefined){             
                svg.selectAll("circle")
                  .data(data.houseVoteByMember)
                  .enter()
                  .append("circle")
                  .attr("cx", function(d) {
                    return projection([d.person_role.stateLon, d.person_role.stateLat])[0];
                  })
                  .attr("cy", function(d) {
                    return projection([d.person_role.stateLon, d.person_role.stateLat])[1];
                  })
                  .attr("r", function(d) {
                    if (d.person_role.district > 40){
                      return 5;
                    }
                    else if (d.person_role.district > 20){
                      return 5;
                    }
                    else {
                      return 5;
                    }
                  })
                  .style("fill", function(d) {
                    if (d.option.value == "Yea") {
                      return "yellow"
                    }
                    else if (d.option.value == "Aye") {
                      return "yellow"
                    }
                    else if (d.option.value == "Not Voting") {
                      return "white"
                    } 
                    else {
                      return "black" 
                    };
                  }) 
                  .style("opacity", 0.55)
                  .style("stroke-width", 1.5)
                  .style("stroke", function(d) {
                    if (d.person_role.party == "Republican") {
                      return "red"
                    }
                    else if (d.person_role.party == "Democrat") {
                      return "blue"
                    } 
                    else {
                      return "green" 
                    };
                  })
                  // Tooltip stuff after this
                  .on("mouseover", function(d) {    
                    div.transition()
                      .duration(500)  
                      .style("opacity", 0);
                    div.transition()
                      .duration(200)  
                      .style("opacity", .9);  
                    div .html(
                      d.option.value + '<br/><a href= "' + d.person.link +
                      '" target = "_blank">' +
                      d.person.name +
                      '</a>' + '<br/>' + 
                      '<img src="https://www.govtrack.us/data/photos/' +
                      d.person.id +
                      '-100px.jpeg" />')  
                      .style("left", (d3.event.pageX - 130) + "px")      
                      .style("top", (d3.event.pageY - 50) + "px");
                  });                  
              }
              // Add the senate vote data to the U.S. map
              if(data.senateVoteByMember != undefined){               
                svg.selectAll("rect")
                  .data(data.senateVoteByMember)
                  .enter()
                  .append("rect")
                  .attr("x", function(d) {
                    return projection([d.person_role.stateLon, d.person_role.stateLat])[0];
                  })
                  .attr("y", function(d) {
                    return projection([d.person_role.stateLon, d.person_role.stateLat])[1];
                  })
                  .attr("width", 10)
                  .attr("height", 10)
                  .style("fill", function(d) {
                    if (d.option.value == "Yea") {
                      return "yellow"
                    }
                    else if (d.option.value == "Aye") {
                      return "yellow"
                    }
                    else if (d.option.value == "Not Voting") {
                      return "white"
                    }  
                    else {
                      return "black" 
                    };
                  }) 
                  .style("opacity", 0.55)
                  .style("stroke-width", 1.5)
                  .style("stroke", function(d) {
                    if (d.person_role.party == "Republican") {
                      return "red"
                    }
                    else if (d.person_role.party == "Democrat") {
                      return "blue"
                    } 
                    else {
                      return "green" 
                    }
                  })
                  // Tooltip stuff after this
                  .on("mouseover", function(d) {    
                    div.transition()
                      .duration(500)  
                      .style("opacity", 0);
                    div.transition()
                      .duration(200)  
                      .style("opacity", .9);  
                    div .html(
                      d.option.value + '<br/><a href= "' + d.person.link +
                      '" target = "_blank">' +
                      d.person.name +
                      '</a>' + '<br/>' + 
                      '<img src="https://www.govtrack.us/data/photos/' +
                      d.person.id +
                      '-100px.jpeg" />')  
                      .style("left", (d3.event.pageX - 130) + "px")      
                      .style("top", (d3.event.pageY - 50) + "px");
                  }); 
              }
            // }  //end of if statement

            // svg.append("g")
            //     .attr("class", "bubble")
            //   .selectAll("circle")
            //     .data(data)
            //   .enter().append("circle")
            //     .attr("transform", function(d) { return x(d.person_role.name); })
            //     .attr("r", 1.5);

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
              $state.go('home');
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
              merge.data(components)
                .attr("d", function(d) { 
                  return path({type: "FeatureCollection", features: d}) || "M0,0";
                });
              top.history.replaceState(null, null, "#" + features.map(function(d) {
                return d.color === null ? "0" : d.color + 1; 
              })
              .join(""));
            }
          }); // end load of us.json data
        }; //end scope.render function

        //Watch 'data' and run scope.render(newVal) whenever it changes
        //Use true for 'objectEquality' property so comparisons are done on equality and not reference
        scope.$watch('data', function(){
            d3.selectAll('circle').remove();
            d3.selectAll('rect').remove();
            d3.select(svg).remove();
            scope.render(scope.data);
        }, true);  
      } // end of link
    }; // end of return
  } // end of function(voteService)
]); // end of directive