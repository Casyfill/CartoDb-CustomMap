function clicker(id, c){
      if (c='Button'){
        // console.log(id)
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
            pop: +d.pop,
            den: +d.den,
            gba: +d.gba,
            gla: +d.gla
          };
        }, function(error, data) {

          pop_data = data.sort(function(a,b){return d3.descending(a.pop, b.pop)}).slice(0,10);
          den_data = data.sort(function(a,b){return d3.descending(a.den, b.den)}).slice(0,10);
          gba_data = data.sort(function(a,b){return d3.descending(a.gba, b.gba)}).slice(0,10);
          gla_data = data.sort(function(a,b){return d3.descending(a.gla, b.gla)}).slice(0,10);
          
          gla_data.forEach(function(d){console.log(d.name + ' ' + d.gla)})

          // var newA = data.sort(function(a,b){return d3.descending(a.pop, b.pop)})
          //   .slice(0,10);
          // console.log(newA)
          
          var x = d3.scale.linear()
            .domain([0, d3.max(pop_data, function(d) { return d.pop })])
            .range([0, width-100]);


          var bar = g.selectAll('#basic g')
              .data(pop_data);

          bar.enter()
              .append("g")
              .attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

          bar.append("rect")
              .attr("width", function(d){return x(d.pop)})
              .attr("height", barHeight - 4);

          bar.append("text")
                .attr("class","name")
                .attr("x", -10)
                .attr("y", (barHeight / 2 -6))
                .attr("dy", ".75em")
                .text(function(d,i) { return (i+1) + '. ' + d.name; });

          bar.append("text")
                .attr("x", function(d){return x(d.pop)-5})
                .attr("y", (barHeight / 2 -6))
                .attr("dy", ".75em")
                .attr("class","label")
                .text(function(d,i) { return d.pop });



          function updateBars(id, bar,data){
            var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[id] })])
              .range([0, width-100]);

            console.log('   ' + id)
            // data.forEach(function(d,i){console.log(i + ' ' + d.name + ' ' + d[id])})

            // bar.exit()
            bar.data(data)

            bar.select('rect')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("width", function(d){return x(d[id])})
            
            bar.select('text.name')
              .text(function(d,i) { return (i+1) + '. ' + d.name; });

            bar.select('text.label')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("x", function(d){return x(d[id])-5})
              .text(function(d,i) { return d[id] });

            
          }
          
          d3.select('#gla').on('click', function(d){updateBars('gla',bar, gla_data)});
          d3.select('#pop').on('click', function(d){updateBars('pop',bar, pop_data)});
          d3.select('#gba').on('click', function(d){updateBars('gba',bar, gba_data)});
          d3.select('#den').on('click', function(d){updateBars('den',bar, den_data)});
          


      })
    } 


function radarChart(){
  var margin = {top: 5, right: 5, bottom: 5, left: 5};

  var width = 358 - margin.left - margin.right,
      height = 310 - margin.top - margin.bottom;


  var svg = d3.select("#radarWrapper")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("id", 'radar')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

}



          
              

    

