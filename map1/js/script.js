
// var localFormatter = localise()
var ru = d3.locale({
  "decimal": ",",
  "thousands": "\xa0",
  "grouping": [3],
  "currency": ["", " руб."],
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
});
d3.format = ru.numberFormat;
myFormatter = ru.numberFormat(',.0f')



function clicker(obj){
      console.log(obj)
      if (obj.class='Button'){
        
        d3.selectAll('.buttonClicked').attr('class','button');
        d3.select(obj).attr('class', 'buttonClicked');
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

            var area= d3.select('.area')
            function updateRadar(name,area){

                    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM topdatum WHERE status IS true &format=geojson&dp=5",  function(error, d){
                    datum = d.features.map(function(d){return d.properties})

                    function Look(d){
                      var lookup = {};
                      for (var i = 0, len = d.length; i < len; i++) {
                          lookup[d[i].cityname] = d[i];
                        }
                      return lookup
                      }

                    
                    var sample = Look(datum)[name]

                    var max_pop = d3.max(datum.map(function(d){ return d.pop})),
                        max_den = d3.max(datum.map(function(d){ return d.den})),
                        max_gba = d3.max(datum.map(function(d){ return d.count})),
                        max_gla = d3.max(datum.map(function(d){ return d.gla}));

                        //axis direction 
                        // -y1-
                        // x2-x1
                        // -y2-
                        var width=278, height=230;
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

                      // console.log(sample)
                      
                      area.select('polygon')
                          .transition().delay(30)
                          .attr('points',function(d){return convertCoord([[width/2, y1(sample.pop)],[x1(sample.den),height/2],[width/2, y2(sample.count)],[x2(sample.gla),height/2]])} )

                      // circles = area.selectAll('circle')
                                    

                      area.select('#pop').transition().delay(30).attr('cy', y1(sample.pop) )
                      area.select('#den').transition().delay(30).attr('cx', x1(sample.den) )
                      area.select('#gla').transition().delay(30).attr('cx', x2(sample.gla) )
                      area.select('#count').transition().delay(30).attr('cy', y2(sample.count) )


                    });
                  }
            updateRadar(name,area)
          })
        })
        .error(function(err) {
          console.log(err);
        });
      }



function localMap(mapId, mapLink, lonlatzoom){
        cartodb.createVis(mapId, mapLink, {
            shareable: false,
            title: false,
            description: false,
            search: false,
            zoomControl: true,
            tiles_loader: false,
            center_lat: lonlatzoom[0],
            center_lon: lonlatzoom[1],
            zoom: lonlatzoom[2],
            scrollwheel:true,
            infowindow:true
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

function barChart(datum){
    var data = datum

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



          pop_data = data.sort(function(a,b){return d3.descending(a.pop, b.pop)}).slice(0,10);
          den_data = data.sort(function(a,b){return d3.descending(a.den, b.den)}).slice(0,10);
          gba_data = data.sort(function(a,b){return d3.descending(a.count, b.count)}).slice(0,10);
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
                .text(function(d,i) { return (i+1) + '. ' + d.cityname; });

          bar.append("text")
                .attr("x", function(d){return x(d.pop)- 5})
                .attr("y", (realBarHeight / 2 -6))
                .attr("dy", ".75em")
                .attr("class","label")
                .text(function(d,i) { return window.myFormatter(d.pop) });



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
              .text(function(d,i) { return (i+1) + '. ' + d.cityname; });

            bar.select('text.label')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("x", function(d){return x(d[id])-5})
              .text(function(d,i) { return window.myFormatter(d[id]) });

            var quantDict = {'pop':'Население, тыс. ч.','den':'Коммерческая плотность, кв. м. на тыс. жителей', 'gla':'Арендуемая площадь, кв. м.','count':'Количество торговых центров'};

            d3.select('#quant').text(quantDict[id])

            
          }
          
          d3.select('#gla').on('click', function(d){updateBars('gla',bar, gla_data)});
          d3.select('#pop').on('click', function(d){updateBars('pop',bar, pop_data)});
          d3.select('#gba').on('click', function(d){updateBars('count',bar, gba_data)});
          d3.select('#den').on('click', function(d){updateBars('den',bar, den_data)});
          


      // })
    } 


function radarChart(datum){
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

      

 
    
  // lookap - создаем словарь объектов по имени
  function Look(d){
  var lookup = {};
  for (var i = 0, len = d.length; i < len; i++) {
      lookup[d[i].cityname] = d[i];
    }
  return lookup
  }

  lookup = Look(datum)

  var sample = [lookup['Иваново']]
  // datum.forEach(function(d){console.log(d.cityname)})

  // var sample = [{'name':'Омск', 'pop':9000, 'den':1000, 'gla':819, 'gba':999}];
  var max_pop = d3.max(datum.map(function(d){ return d.pop})),
      max_den = d3.max(datum.map(function(d){ return d.den})),
      max_gba = d3.max(datum.map(function(d){ return d.count})),
      max_gla = d3.max(datum.map(function(d){ return d.gla}));
  // console.log([max_pop,max_den,max_gba,max_gla]);

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
          .attr("points",   function(d){return convertCoord([[width/2, y1(d.pop)],[x1(d.den),height/2],[width/2, y2(d.count)],[x2(d.gla),height/2]])} )
          

      var crad = 3;

      chart.append('circle')
          .attr('id','pop' )
          .attr('cx',width/2 )
          .attr('cy', function(d){return y1(d.pop)} )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('id','den' )
          .attr('cx',function(d){return x1(d.den) })
          .attr('cy', height/2 )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('id','count' )
          .attr('cx',width/2 )
          .attr('cy', function(d){return y2(d.count)} )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )
  

      chart.append('circle')
          .attr('id','gla' )
          .attr('cx', function(d){return x2(d.gla)} )
          .attr('cy', height/2 )
          .transition().delay(function (d,i){ return i * 15;})
          .attr('r', crad )

    var x1Axis = d3.svg.axis().scale(x1).ticks(1).orient("bottom").tickValues([max_den]).tickFormat(window.myFormatter);
    var x2Axis = d3.svg.axis().scale(x2).ticks(1).orient("bottom").tickValues([max_gla]).tickFormat(window.myFormatter);
    var y1Axis = d3.svg.axis().scale(y1).ticks(1).orient("right").tickValues([max_pop]).tickFormat(window.myFormatter);
    var y2Axis = d3.svg.axis().scale(y2).ticks(1).orient("right").tickValues([max_gba]).tickFormat(window.myFormatter);

    

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

    d3.selectAll(".content").on("click",function(){console.log('radar listener works!')})
    
            // var name =d3.select(this).select('.text').text()
            // d = [look[name]]

            // chart.select('#area')
            // .attr("points",   function(d){return convertCoord([[width/2, y1(d.pop)],[x1(d.den),height/2],[width/2, y2(d.count)],[x2(d.gla),height/2]])} )
            // })
             
    
}


function getData(){
  
    
        
    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM topdatum WHERE status IS true &format=geojson&dp=5",  function(error, d){
      dataset = d.features.map(function(d){return d.properties})
      createMap('map','http://rilosmaps.cartodb.com/api/v2/viz/2f67e2ca-dbe0-11e4-b561-0e0c41326911/viz.json')    
  
      localMap('map2','http://rilosmaps.cartodb.com/api/v2/viz/de88a126-c1b5-11e4-a92a-0e0c41326911/viz.json', [56.965254, 40.976324, 11])
      barChart(dataset)
      radarChart(dataset)


      
    });
          
}
      
              



          
              

    

