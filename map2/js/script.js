var localFormatter = d3.locale({
  "decimal": ".",
  "thousands": ",",
  "grouping": [3],
  "currency": ["$", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
})
d3.format = localFormatter.numberFormat


function clicker(id, c){
      if (c='Button'){
        
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
            center_lat: 55,
            center_lon: 58,
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
          // d3.selectAll(".content").on("click",function(){
          //       var name =d3.select(this).select('.text').text()
          //       // console.log(name)
          //       d3.select('#cityName').text(name)})
          

          d3.selectAll(".content").on("click",function(d){
            var links = {'Иваново': {'link':'http://rilosmaps.cartodb.com/api/v2/viz/83684e08-dc41-11e4-90bf-0e0c41326911/viz.json', 'coordinates':[56.965254, 40.976324, 11]},
                                     'Екатеринбург':{'link':' http://rilosmaps.cartodb.com/api/v2/viz/1f0f8220-dc44-11e4-91eb-0e018d66dc29/viz.json' , 'coordinates':[56.852020, 60.582492,11]}, 
                                     'Омск':{'link':'http://rilosmaps.cartodb.com/api/v2/viz/928d5fba-dc44-11e4-aa84-0e853d047bba/viz.json', 'coordinates':[54.968537, 73.369185,11]}};


            console.log('onTitle at work!')
            var name =d3.select(this).select('.text').text()
            // console.log(links[name])
            d3.select('#cityName').text('г. ' + name)
            d3.select(map2.firstChild).remove()
            localMap('map2',links[name]['link'],links[name]['coordinates'])

          })
        })
        .error(function(err) {
          console.log(err);
        });
      }


function test(){
  console.log('Heyyy')
}


function localMap(mapId, mapLink, lonlatzoom){
        cartodb.createVis(mapId, mapLink, {
            shareable: false,
            title: false,
            description: false,
            search: false,
            zoomControl: false,
            tiles_loader: false,
            center_lat: lonlatzoom[0],
            center_lon: lonlatzoom[1],
            zoom: lonlatzoom[2]
        })
        .done(function(vis, layers) {
          layers[1].setInteraction(false);
          layers[1].on('featureOver', function(e, latlng, pos, data) {
            cartodb.log.log(e, latlng, pos, data);
          });
          // you can get the native map to work with it
          var map = vis.getNativeMap();
          // now, perform any operations you need
          // map.setZoom(3);
          // map.panTo([50.5, 30.5]);
          
          function minimizeLegend(){
            // console.log('!>!')
            // d3.selectAll('.cartodb-legend').attr('padding','10px')
          }

          minimizeLegend();
        })
        .error(function(err) {
          console.log(err);
        });
      }

function barChart(){

    var margin = {top: 30, right: 10, bottom: 30, left: 30};

    var width = 500 - margin.left - margin.right,
        height = 262 - margin.top - margin.bottom;

    var svg = d3.select("#topChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
        
    svg.append("g")
        .attr("id", 'basic')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append('g')
       .attr('id','quantG')
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .append('text')
       .attr('id','quant')
       .attr("transform", "translate(" + (width) + "," + (height-4) + ")")
       .text('Население, тыс. чел.')


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
          
          
          
          var x = d3.scale.linear()
            .domain([0, d3.max(pop_data, function(d) { return d.pop })])
            .range([0, width-100]);

          // var barHeight = height/pop_data.length;
          var barHeight = 25;
          var realBarHeight = barHeight;
          var bar = g.selectAll('#basic g')
              .data(pop_data);

          bar.enter()
              .append("g")
              .attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

          bar.append("rect")
              .attr("width", function(d){return x(d.pop)})
              .attr("height", realBarHeight-4);

          bar.append("text")
                .attr("class","name")
                .attr("x", -10)
                .attr("y", barHeight/2-6)
                .attr("dy", ".75em")
                .text(function(d,i) { return (i+1) + '. ' + d.name; });

          bar.append("text")
                .attr("x", function(d){return x(d.pop)- 5})
                .attr("y", (realBarHeight / 2 -6))
                .attr("dy", ".75em")
                .attr("class","label")
                .text(function(d,i) { return d.pop });



          function updateBars(id, bar,data){
            var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[id] })])
              .range([0, width-100]);

            // console.log(id)
            

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

            var quantDict = {'pop':'Население, тыс. ч.','den':'Арендуемые плотность, кв. м. на тыс. жителей', 'gla':'Торговые площади, кв. м.','gba':'Количество торговых центров'};

            d3.select('#quant').text(quantDict[id])

            
          }
          
          d3.select('#gla').on('click', function(d){updateBars('gla',bar, gla_data)});
          d3.select('#pop').on('click', function(d){updateBars('pop',bar, pop_data)});
          d3.select('#gba').on('click', function(d){updateBars('gba',bar, gba_data)});
          d3.select('#den').on('click', function(d){updateBars('den',bar, den_data)});
          


      })
    } 


function radarChart(){
  var margin = {top: 40, right: 40, bottom: 40, left:40};

  var width = 358 - margin.left - margin.right,
      height = 310 - margin.top - margin.bottom;


  var svg = d3.select("#radarWrapper")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("id", 'radar')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      

  var sample = [{'name':'Омск', 'pop':9000, 'den':1000, 'gla':819, 'gba':999}];
  var max_pop = 13000,
      max_den = 1000,
      max_gba = 1000,
      max_gla = 984;

  //axis direction 
  // -y1-
  // x2-x1
  // -y2-

  var y1 = d3.scale.linear().domain([0, max_pop]).range([height/2,0]);
  var x1 = d3.scale.linear().domain([0, max_den]).range([width/2, width/2 +height/2]);
  var y2 = d3.scale.linear().domain([0, max_gba]).range([height/2, height ]);
  var x2 = d3.scale.linear().domain([0, max_gla]).range([width/2,width/2-height/2]);

  
  function convertCoord(d){
    var str="";
      for(var pti=0;pti<d.length;pti++){
          str=str+d[pti][0]+","+d[pti][1]+" ";
          }
          return str;
    }

  
  var chart = d3.select('#radar').selectAll("g")
                .data(sample)
                .enter()
                .append('g')
                .attr('class','area')
      
      chart.append('polygon')   
          .attr("points",   function(d){return convertCoord([[width/2, y1(d.pop)],[x1(d.den),height/2],[width/2, y2(d.gba)],[x2(d.gla),height/2]])} )
          .transition().delay(function (d,i){ return i * 15;});

      var crad = 3;

      chart.append('circle')
          .attr('cx',width/2 )
          .attr('cy', function(d){return y1(d.pop)} )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('cx',function(d){return x1(d.den) })
          .attr('cy', height/2 )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('cx',width/2 )
          .attr('cy', function(d){return y2(d.gba)} )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('cx', function(d){return x2(d.gla)} )
          .attr('cy', height/2 )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )

    var x1Axis = d3.svg.axis().scale(x1).ticks(3).orient("bottom");
    var x2Axis = d3.svg.axis().scale(x2).ticks(3).orient("bottom");
    var y1Axis = d3.svg.axis().scale(y1).ticks(3).orient("right");
    var y2Axis = d3.svg.axis().scale(y2).ticks(3).orient("right");

    

    var axisLayer =  d3.select('#radarWrapper svg')
                      .append('g')
                      .attr('id','AxisLayer')
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          axisLayer
          .append('g')
          .attr("class", "axis")
          .attr("id", "x1Axis")
          .attr("transform", "translate(0," + height/2 + ")")
          .call(x1Axis);


          axisLayer
          .append('g')
          .attr("class", "axis")
          .attr("id", "x2Axis")
          .attr("transform", "translate(0," + height/2  + ")")
          .call(x2Axis);

          axisLayer
          .append('g')
          .attr("class", "axis")
          .attr("id", "y1Axis")
          .attr("transform", "translate(" + (width/2) + ",0)")
          .call(y1Axis);

          axisLayer
          .append('g')
          .attr("class", "axis")
          .attr("id", "y2Axis")
          .attr("transform", "translate(" + (width/2) + ",0)")
          .call(y2Axis);

    
    // remove Zero tick  
    axisLayer.selectAll(".tick")
          .each(function (d, i) {
            if ( d == 0 ) {
              this.remove();
            }
            });
    
  // LABELS
  var Names =  d3.select('#radarWrapper svg')
            .append('g')
            .attr('id','Names')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var txtOffset = 20

      Names
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (10-txtOffset) + ")")
      .attr('class','name')
      .attr('text-anchor', 'middle')
      .text('Население')

      Names
      .append("text")
      .attr("transform", "translate(" + 10 + "," + height/2 + ")")
      .attr('class','name')
      .attr('text-anchor', 'end')
      .text('GLA')

      Names
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height+txtOffset) + ")")
      .attr('class','name')
      .attr('text-anchor', 'middle')
      .text('Комм. плотность')

      Names
      .append("text")
      .attr("transform", "translate(" + (width-10) + "," + height/2 + ")")
      .attr('class','name')
      .text('GBA')
}

function getData(){
    
    var sql = new cartodb.SQL({ user: 'rilos', format: 'geojson', dp: 5});
    sql.execute("SELECT * FROM topdatum")
        .done(function(data) {
        console.log(data.rows);
        })
        .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
        })
          
}
      
              



          
              

    

