
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
myFloatFormatter = ru.numberFormat(',.1f')
var colors = {'pop2014': 'green', 'salary2014':'purple', 'density2014':'rgb(0, 55, 153)'}
var quantDict = {'pop2014':'Население, тыс. ч.','dencity2014':'Плотность, количество человек на кв. км.', 'salary2014':'Средняя зарплата, руб.'};

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
      
    }
  return lookup
  }

  window.Lookup = Look(datum)
  var sample = [window.Lookup[rayonId]][0]

  var margin = {top: 40, right: 25, bottom: 0, left: 50};

  var width = 346 - margin.left - margin.right,
      height = 304 - margin.top - margin.bottom;

  var svg = d3.select("#linechart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var charts = svg.append('g')
                  .attr('id','grapcharts')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  
  function splitRangeEndOffset(range,num, offset){
      // splits range into chinks without
      var sh = (range[1]-range[0])/num
      
      r = [];
      for (i=0, len = num; i<len; i++){
      s = range[0] +(sh)*i
      e = s + sh-offset
      r.push([s,e])
      }

      return r
    }

  // console.log(splitRange([0,8],2))

  hs = splitRangeEndOffset([0,height],2, 70)
  // 
  linechart(charts,[sample.salary2012 ,sample.salary2013 ,sample.salary2014],[2012,2013,2014],[hs[1][1],hs[1][0]],[0,width], true, window.quantDict['salary2014'])
  linechart(charts,[sample.pop2002 ,sample.pop2010 ,sample.pop2012 ,sample.pop2013 ,sample.pop2014 ],[2002,2010,2012,2013,2014],[hs[0][1],hs[0][0]],[0,width], false, window.quantDict['pop2014'])

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
              .attr('fill',window.colors['pop2014'])
              .attr("width", function(d){return x(d.pop2014)})
              .attr("height", realBarHeight-4)


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
              .attr('fill',window.colors[id])
            
            bar.select('text.name')
              .text(function(d,i) { return (i+1) + '. ' + d.name1; });

            bar.select('text.label')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("x", function(d){return x(d[id])-5})
              .text(function(d,i) { return window.myFormatter(d[id]) });

            

            d3.select('#quant').text(window.quantDict[id])

            
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
            zoomControl: true,
            tiles_loader: false,
            center_lat: 55.799497,
            center_lon: 37.618013,
            legend:false,
            infowindow:true,
            zoom: 10

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
            zoomControl: true,
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
            //TODO: работает на чужую карту
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

function linechart(g, yArray, xArray, yRange, xRange, t, title){

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

  var xMax = d3.max(xArray),
      yMax = d3.max(yArray),
      xMin = d3.min(xArray),
      yMin = d3.min(yArray);

  var y1 = d3.scale.linear().domain([yMin, yMax]).range(yRange),
      x1 = d3.scale.linear().domain([2000, 2015]).range(xRange);
  

  var xmArray = xArray.map(function(d){return x1(d)}),
      ymArray = yArray.map(function(d){return y1(d)});


  g.append('polyline')
   .attr("points", function(){return convertCoord(zip([xmArray,ymArray]))} )
   .attr('class','graphlines')

  var xAxis = d3.svg.axis().scale(x1).ticks(1).orient("bottom").tickValues([2000,2005,2010,2015]);
  var yAxis = d3.svg.axis().scale(y1).ticks(3).orient("left").tickFormat(window.myFormatter);

  var axisLayer =  g.append('g')
                    .attr('class','AxisLayer')
              
  axisLayer.append('g')
    .attr("class", "axis")
    .attr("transform", "translate("+ 0 +',' + 0 + ")")
    .call(yAxis);

  
  
  axisLayer.append('g')  
    .attr("class", "axis")
    .attr("transform", "translate("+ 0 +',' + (yRange[0]+10) + ")")
    .call(xAxis);
  

  axisLayer.append('g')
    .attr("transform", "translate("+ 0 +',' + (yRange[0]+50) + ")")
    .append('text')
    .text(title)
    .attr("class", "graphtitle")
    .attr('text-anchor', 'start')
    // .attr('font-family','sams-serif')
    // .attr('font-size','1px')

}  

function cChart(id){
  console.log('compareChart in work!')
  var sample = [window.Lookup[id]][0]
  var moscow = [window.Lookup['Москва']][0]

  // SVG
  var margin = {top: 20, right: 25, bottom: 20, left: 25};

  var width = 346 - margin.left - margin.right,
      height = 304 - margin.top - margin.bottom;

  var svg = d3.select("#compareChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var mWindow = svg.append('g')
                  .attr('id','charts')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var htype = mWindow.append('g')
                     .attr('id','htype')

  function htypeBars(g,sample,moscow){
    var y = d3.scale.linear().domain([0, 100]).range([0,height])

    var d = [0,
             sample.privatehousingpercent,
             sample.multistoreyresadmpercentt,
             sample.multistoreyrespercent,
             sample.underconstructionpercent]
    
    var m = [0,
             moscow.privatehousingpercent,
             moscow.multistoreyresadmpercentt,
             moscow.multistoreyrespercent,
             moscow.underconstructionpercent]

  
    g.append('g').attr('id','brs1')
    g.append('g').attr('id','brs2').attr("transform", "translate(60,0)")
    var brs1 = g.select('#brs1')
    var brs2 = g.select('#brs2')

    function stackBar(g,m){
      // generate stacked barchart with percent labels
      var types = ['private','msra','msr','uc']
      h = 0
      for (var i=0; i<4; i++){
          h+=y(m[i])
          
          g.append('rect')
          .attr('class',types[i])
          .attr("width", '25px')
          .attr("height", y(m[i+1]))
          .attr('y', h);

        }
      
      h = 0
      for (var i=0; i<4; i++){
          h+=y(m[i])
          if (m[i+1]!=0){
          g.append('text')
          .attr('class','bLabel')
          .attr("x", '30px')
          .attr('y', function(d){if((h+8)<=height){return h+8} else {return height}})
          .text(window.myFloatFormatter(m[i+1])+' %');
          }
        }
      }
  
    stackBar(brs1,m)
    stackBar(brs2,d)
    }
  
  htypeBars(htype,sample,moscow)
}

function getData(){
  
    
        
    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM mosrayons &format=geojson&dp=5",  function(error, d){
      dataset = d.features.map(function(d){return d.properties})
      createMap('map1','https://rilosmaps.cartodb.com/u/philip/api/v2/viz/f9cbd828-e761-11e4-9ba6-0e9d821ea90d/viz.json')
      localMap('map2','http://rilosmaps.cartodb.com/api/v2/viz/1d6f5f4c-cd6e-11e4-b9ec-0e018d66dc29/viz.json', [56.965766, 40.99548, 13])
      barChart(dataset)
      graphCharts('Академический',dataset)
      cChart('Академический')
      
      
    });
          
}
    
              



          
              

    

