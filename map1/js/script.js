function clicker(id, c){
      if (c='Button'){
        console.log(id)
        d3.selectAll('.buttonClicked').attr('class','button');
        d3.select('#'+id).attr('class', 'buttonClicked');
      } 
}

function createMap(mapId, mapLink){
        cartodb.createVis(mapId, mapLink, {
            shareable: false,
            title: false,
            description: false,
            search: false,
            zoomControl: false,
            tiles_loader: false,
            center_lat: 61.074157,
            center_lon: 69.089105,
            zoom: 3
        })
        .done(function(vis, layers) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          layers[1].on('featureOver', function(e, latlng, pos, data) {
            cartodb.log.log(e, latlng, pos, data);
          });
          // you can get the native map to work with it
          // var map = vis.getNativeMap();
          // now, perform any operations you need
          // map.setZoom(3);
          // map.panTo([50.5, 30.5]);

        })
        .error(function(err) {
          console.log(err);
        });
      }

function barChart(){

    var margin = {top: 30, right: 30, bottom: 30, left: 30};

    var width = 534 - margin.left - margin.right,
        height = 262 - margin.top - margin.bottom,
        barHeight = 20;

    var svg = d3.select("#topChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", 'basic')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var g = d3.select("#basic")

    
    d3.csv("data/topdatum.csv", function(d) {
          return {
            name: d.cityname, 
            population: +d.population,
            commdencity: +d.commdencity,
            gba: +d.gba,
            gla: +d.gla
          };
        }, function(error, data) {

          pop_data = data.sort(function(a,b){return d3.descending(a.population, b.population)}).slice(0,10);
          den_data = data.sort(function(a,b){return d3.descending(a.commdencity, b.commdencity)}).slice(0,10);
          gba_data = data.sort(function(a,b){return d3.descending(a.gba, b.gba)}).slice(0,10);
          gla_data = data.sort(function(a,b){return d3.descending(a.gla, b.gla)}).slice(0,10);
          


          
          // var curDatum = data.slice([0,1]);
          // data.forEach(function(d){console.log(d.name + ' ' + d.population)})
// cityname,population,commdencity,gba,gla
          // var max = );
          
          var x = d3.scale.linear()
            .domain([0, d3.max(pop_data, function(d) { return d.population })])
            .range([0, width-100]);

          // console.log(x);

          var bar = g.selectAll('g')
              .data(pop_data)
              .enter()
              .append("g")
              .attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

          bar.append("rect")
              .attr("width", function(d){return x(d.population)})
              .attr("height", barHeight - 4);

          bar.append("text")
                .attr("x", -10)
                .attr("y", (barHeight / 2 -6))
                .attr("dy", ".75em")
                .text(function(d) { return d.name; });
          
        });

    // data2.sort(function(a,b){return d3.descending(a.population, b.population)});

    



    // var data = [4, 8, 15, 16, 23, 42, 34, 39, 22, 3];
    // sorting
    // data.sort(function(a, b){return b-a});

    
    // var x = d3.scale.linear()
    //     .domain([0, d3.max(data)])
    //     .range([0, width]);

    

    
    
    // var bar = g.selectAll('g')
    //     .data(data)
    //     .enter()
    //     .append("g")
    //     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    // bar.append("rect")
    //     .attr("width", x)
    //     .attr("height", barHeight - 4);

    // bar.append("text")
    //     .attr("x", function(d) { return x(d); })
    //     .attr("y", barHeight / 2)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d; });
  }