
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
var colors = {'pop': 'green', 'sal':'purple', 'den':'rgb(0, 55, 153)'}
Lookup = {};

function maxRounded(mvalue){
  digits = mvalue.toString().length

  xs = [1.5,2,5,10].map(function(d){return d*Math.pow(10,(digits-1))})
  
  var res
  for (i=0, len = xs.length; i<len; i++){
    if (mvalue<xs[i]){
      res=xs[i]
      break;
    }
  }
  return res
}


function clicker(id, c){
      if (c='Button'){
        
        d3.selectAll('.buttonClicked').attr('class','button');
        d3.select('#'+id).attr('class', 'buttonClicked');
      } 
}

function graphCharts(rayonId, datum){
  var data = datum

  function Look(d){
  var lookup = {};
  for (var i = 0, len = d.length; i < len; i++) {
      lookup[d[i].name1] = d[i];
      console.log(d[i].name1)
    }
  return lookup
  }

  window.Lookup = Look(datum)
  var sample = [window.Lookup[rayonId]]

  var margin = {top: 10, right: 10, bottom: 10, left: 10};

  var width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var svg = d3.select("#linechart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  console.log(sample)
  console.log([sample.pop2002 ,sample.pop2010 ,sample.pop2012 ,sample.pop2013 ,sample.pop2014])
  linechart(svg,[sample.pop2002 ,sample.pop2010 ,sample.pop2012 ,sample.pop2013 ,sample.pop2014 ],[2002,2010,2011,2012,2013,2014],[height,0],[0,width])

}

function barChart(datum){
    var data = datum

    var margin = {top: 30, right: 10, bottom: 30, left: 30};

    var width = 500 - margin.left - margin.right,
        height = 212 - margin.top - margin.bottom;

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
       .text('Население, чел.')


    var g = d3.select("#basic")



          pop_data = data.sort(function(a,b){return d3.descending(a.pop2014, b.pop2014)}).slice(0,5);
          den_data = data.sort(function(a,b){return d3.descending(a.density2014, b.density2014)}).slice(0,5);
          sal_data = data.sort(function(a,b){return d3.descending(a.salary2014, b.salary2014)}).slice(0,5);
          
          console.log(pop_data);
          
          var x = d3.scale.linear()
            .domain([0, d3.max(pop_data, function(d) { return d.pop2014 })])
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
              .attr("width", function(d){return x(d.pop2014)})
              .attr("height", realBarHeight-4);

          bar.append("text")
                .attr("class","name")
                .attr("x", -10)
                .attr("y", barHeight/2-6)
                .attr("dy", ".75em")
                .text(function(d,i) { return (i+1) + '. ' + d.name1; });

          bar.append("text")
                .attr("x", function(d){return x(d.pop2014)- 5})
                .attr("y", (realBarHeight / 2 -6))
                .attr("dy", ".75em")
                .attr("class","label")
                .text(function(d) { return window.myFormatter(d.pop2014) });



          function updateBars(id, bar,data){
            var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[id] })])
              .range([0, width-100]);

            console.log(id)
            
            bar.data(data)
            bar.select('rect')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("width", function(d){return x(d[id])})
            
            bar.select('text.name')
              .text(function(d,i) { return (i+1) + '. ' + d.name1; });

            bar.select('text.label')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("x", function(d){return x(d[id])-5})
              .text(function(d,i) { return window.myFormatter(d[id]) });

            var quantDict = {'pop2014':'Население, тыс. ч.','dencity2014':'Плотность, количество человек на кв. км.', 'salary2014':'Средняя зарплата, руб.'};

            d3.select('#quant').text(quantDict[id])

            
          }
          
          
          d3.select('#pop').on('click', function(d){updateBars('pop2014',bar, pop_data)});
          d3.select('#sal').on('click', function(d){updateBars('salary2014',bar, sal_data)});
          d3.select('#den').on('click', function(d){updateBars('density2014',bar, den_data)});
        
    }

function createMap(mapId, mapLink){


        cartodb.createVis(mapId, mapLink, {
            shareable: false,
            title: false,
            description: false,
            search: false,
            zoomControl: false,
            tiles_loader: false,
            center_lat: 55.799497,
            center_lon: 37.618013,
            legend:false,
            zoom: 9

        })
        .done(function(vis, layers) {
          
          // here goes all logis
            
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
            zoomControl: false,
            tiles_loader: false,
            center_lat: lonlatzoom[0],
            center_lon: lonlatzoom[1],
            zoom: lonlatzoom[2],
            scrollwheel:false,
            infowindow:false
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
            
            var box = d3.selectAll('.cartodb-legend-stack').style('bottom','246px').style('right','5px')
            box.select('.cartodb-legend').style('padding','6px').style('padding-bottom','0px')
            box.select('.legend-title').style('margin-bottom','0px')

            box.selectAll('.quartile').style('height','12px')
            box.select('.colors').style('height','12px')

            d3.select('.cartodb-zoom').style('margin-top','5px').style('margin-left','5px')
            
          }

          minimizeLegend();
        
        })
        .error(function(err) {
          console.log(err);
        });
      }



function linechart(g, yArray, xArray, yRange, xRange){

  function convertCoord(d){
      var str="";
        for(var pti=0;pti<d.length;pti++){
            str=str+d[pti][0]+","+d[pti][1]+" ";
            }
            return str;
  }

  function zip(arrays) {
      return arrays[0].map(function(_,i){
          return arrays.map(function(array){return array[i]})
      });
  }

  var xMax = maxRounded(d3.max(xArray)),
      yMax = maxRounded(d3.max(yArray));
  
  var y1 = d3.scale.linear().domain([0, yMax]).range(yRange),
      x1 = d3.scale.linear().domain([0, xMax]).range(xRange);
  
  g.append('polyline')
   .attr("points",   function(d){return convertCoord([zip([xArray,yArray])])} )
   .attr('class','graplines')

  var xAxis = d3.svg.axis().scale(x1).ticks(1).orient("bottom").tickValues(xMax).tickFormat(window.myFormatter);
  var yAxis = d3.svg.axis().scale(y1).ticks(1).orient("left").tickValues(yMax).tickFormat(window.myFormatter);

  var axisLayer =  g.append('g')
                    .attr('class','AxisLayer')
              

  axisLayer.append('g')
    .attr("id", "xAxis")
    .attr("class", "axis")
    .attr("transform", "translate("+ xRange[0] +',' + yRange[1] + ")")
    .call(xAxis);

  axisLayer.append('g')
    .attr("id", "yAxis")
    .attr("class", "axis")
    .attr("transform", "translate("+ xRange[0] +',' + yRange[1] + ")")
    .call(yAxis);
}  


function getData(){
  
    
        
    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM mosrayons &format=geojson&dp=5",  function(error, d){
      dataset = d.features.map(function(d){return d.properties})
      createMap('map1','https://cityfish.cartodb.com/api/v2/viz/36a22e32-cb60-11e4-bfa2-0e853d047bba/viz.json')
      localMap('map2','http://rilosmaps.cartodb.com/api/v2/viz/1d6f5f4c-cd6e-11e4-b9ec-0e018d66dc29/viz.json', [56.965766, 40.99548, 13])
      barChart(dataset)
      graphCharts('Академический',dataset)
      
      
    });
          
}
    
              



          
              

    

