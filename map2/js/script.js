
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
myFloatFormatter2 = ru.numberFormat(',.2f')
var colors = {'pop2014': 'red', 'salary2014':'rgb(0, 55, 153)', 'density2014':'darkblue'}
var quantDict = {'pop2014':'Население, тыс. чел.','density2014':'Плотность, количество человек на кв. км.', 'salary2014':'Средняя зарплата, руб.'};


var lgWidth
var lgHeigth
var cHeight
var cWidth
var lYs=[]

// links to map
var maps = {'Северное Тушино': {'link':'https://rilosmaps.cartodb.com/u/rilos-katia/api/v2/viz/0583de02-e822-11e4-94a9-0e4fddd5de28/viz.json', 'coordinates':[55.864266,37.427031,13]},
          'Щукино': {'link':'https://rilosmaps.cartodb.com/u/rilos-katia/api/v2/viz/4444049a-e823-11e4-ae67-0e853d047bba/viz.json', 'coordinates':[55.8016,37.4744,13]},
          'Пресненский': {'link':'https://rilosmaps.cartodb.com/u/rilos-katia/api/v2/viz/2d628f02-e824-11e4-8d04-0e018d66dc29/viz.json', 'coordinates':[55.76032,37.561985,13]},
          'Академический': {'link':'https://rilosmaps.cartodb.com/u/rilos-katia/api/v2/viz/2373319e-e825-11e4-b1d1-0e4fddd5de28/viz.json', 'coordinates':[55.68868, 37.577669, 13]},
          'Выхино-Жулебино': {'link':'https://rilosmaps.cartodb.com/u/rilos-katia/api/v2/viz/b237159e-e825-11e4-80e1-0e9d821ea90d/viz.json', 'coordinates':[55.698634,37.825995,13]}
  }

Lookup = {};

var htypes = ['частные дома',
             'многоэтажные жилье с адм',
             'многоэтажное жилье',
             'в строительстве']

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

  margin = {top: 30, right: 25, bottom: 0, left: 40};

  width = 346 - margin.left - margin.right
  height = 304 - margin.top - margin.bottom;

  // window.lgMargin=margin
  window.lgWidth=width
  window.lgHeigth=height

  var svg = d3.select("#linechart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  // gradient
  var gColor = "rgb(41, 100, 255)"
  var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("y1", "0%")
    .attr("y2", "100%")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("spreadMethod", "pad");

  gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("stop-color", gColor)
      .attr("stop-opacity", 1);

  gradient.append("svg:stop")
      .attr("offset", "40%")
      .attr("stop-color", gColor)
      .attr("stop-opacity", 0.4);

  gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("stop-color", gColor)
      .attr("stop-opacity", 0);

  var charts = svg.append('g')
                  .attr('id','grapcharts')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  
  var h = 80;
  g1 = charts.append('g')
            .attr('id','lPop')
            .attr("transform", "translate(0," + 0 + ")")

  g2 = charts.append('g')
            .attr('id','lSal')
            .attr("transform", "translate(0," + 148 + ")")
  // 
  linechart(g2,[sample.salary2003, sample.salary2004, sample.salary2005, sample.salary2006, sample.salary2007, sample.salary2008, sample.salary2009, sample.salary2010, sample.salary2012 ,sample.salary2013 ,sample.salary2014],[2003,2004,2005,2006,2007,2008,2009,2010,2012,2013,2014],width,h, true, window.quantDict['salary2014'])
  linechart(g1,[sample.pop2002 ,sample.pop2010 ,sample.pop2012 ,sample.pop2013 ,sample.pop2014 ],[2002,2010,2012,2013,2014],width,h, false, window.quantDict['pop2014'])

}

function barChart(datum){
    var data =[]
    datum.forEach(function(d){if(d.name1!='Москва'){data.push(d)}})

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
       .text(window.quantDict['pop2014'])


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
                .text(function(d) { return window.myFloatFormatter2(d.pop2014) });



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
            center_lat: 55.742449, 
            center_lon: 37.514049,
            legend:false,
            infowindow:true,
            scrollwheel:true,
            zoom: 9

        })
        .done(function(vis, layers) {
          // here goes all logics
          var sublayer = layers[1].getSubLayer(1);
          sublayer.setInteraction(true)
          sublayer.on("featureClick",function(e, latlng, pos, data, layerIndex){mapClick(e, latlng, pos, data, layerIndex)})
        
            // sublayer.on("featureClick",function(e, latlng, pos, data, layerIndex){console.log(data)})
            })
        .error(function(err) {
          console.log(err);
        });      
      }
    


function mapClick(e, latlng, pos, data, layerIndex) {
          // reaction on polygon click in the main map
          var id= data.namenew ;
          console.log(id)
          
          d3.select('#rayonId').text('район '+id)
          d3.select('#RayonAnalysis').text('Сравнительный анализ, район '+id)
        
          d3.select(map2.firstChild).remove()
          localMap('map2',window.maps[id]['link'], window.maps[id]['coordinates']);

          updateGraph(id)
          updateChect(id)

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
          
          
        
        })
        .error(function(err) {
          console.log(err);
        });
  }

function linechart(g, yArray, xArray, width, height, t, title){


  var yMax = d3.max(yArray),
      yMin = d3.min(yArray);
      // xMax = d3.max(xArray),
      // xMin = d3.min(xArray),
      

  var hd = 15 ;   

  var y1 = d3.scale.linear().domain([0, yMax]).range([height,0]),
      x1 = d3.scale.linear().domain([2000, 2015]).range([0,width]);
  

  var xmArray = xArray.map(function(d){return x1(d)}),
      ymArray = yArray.map(function(d){return y1(d)});

  g.append('text')
    .text(title)
    .attr("class", "graphtitle")
    .attr('text-anchor', 'start')

  var graph = g.append('g')
               .attr('class','graph')
               .attr("transform", "translate(0,"+hd+")")

  
  
  // generate polygon coord
  var PolygonXarray = [xmArray[0]].concat(xmArray).concat([xmArray[xmArray.length - 1]])
  var PolygonYarray = [height].concat(ymArray).concat([height])
  // draw polygon
  graph.append('polygon')
    .attr('class','linefill')
    .attr('points',function(){return convertCoord(zip([PolygonXarray,PolygonYarray]))} )


  // line
  graph.append('polyline')
   .attr("points", function(){return convertCoord(zip([xmArray,ymArray]))} )
   .attr('class','graphlines')


  var xAxis = d3.svg.axis().scale(x1).orient("bottom").tickValues([2000,2005,2010,2015]);
  var yAxis = d3.svg.axis().scale(y1).tickValues([0,yMin,yMax]).orient("left").tickFormat(window.myFormatter);

  var axisLayer =  graph.append('g')
                    .attr('class','AxisLayer')
              
  axisLayer.append('g')
    .attr("id", "yAxis")
    .attr("class", "axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);


  axisLayer.append('g')  
    .attr("id", "xAxis")
    .attr("class", "axis")
    .attr("transform", "translate("+ 0 +',' + (height+10) + ")")
    .call(xAxis);


  } 
   

function cChart(id){
  console.log('compareChart in work!')
  var sample = [window.Lookup[id]][0]
  var moscow = [window.Lookup['Москва']][0]

  // SVG
  var margin = {top: 20, right: 25, bottom: 20, left: 15};

  var width = 346 - margin.left - margin.right,
      height = 304 - margin.top - margin.bottom;

  window.cWidth = width
  window.cHeight = height

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
  

    var d = [[sample.privatehousingpercent,window.htypes[0]],
             [sample.multistoreyresadmpercentt,window.htypes[1]],
             [sample.multistoreyrespercent,window.htypes[2]],
             [sample.underconstructionpercent,window.htypes[3]]
             ]
    
    var m = [[moscow.privatehousingpercent,window.htypes[0]],
             [moscow.multistoreyresadmpercentt,window.htypes[1]],
             [moscow.multistoreyrespercent,window.htypes[2]],
             [moscow.underconstructionpercent,window.htypes[3]]
             ]

    var htype = []
    


  
    g.append('g').attr('id','brs1')
    g.append('g').attr('id','brs2').attr("transform", "translate(53,0)")
    var brs1 = g.select('#brs1')
    var brs2 = g.select('#brs2')


    function stackBar2(g,m,textRight,cls){
      summ=0
      m.forEach(function(d){summ+=d[0]})
      var y = d3.scale.linear().domain([0, summ]).range([0,height])
      
      if (textRight==true){
        x1=0
        x2=25
        anchor = 'start'
        }
      else {
        x1=30
        x2 = -5
        anchor='end'
      }
      var h=0;
      
      m = m.map(function(d){return [h, h+=d[0], d[1]]})
      
      var stack = g.append('g')
                  .attr('class','stack')
                  .attr("transform", "translate("+x1+",0)")

      // var tip = d3.tip()
      //     .attr('class', 'd3-tip')
      //     .offset([-10, 0])
      //     .html(function(d) {
      //         return "<span>" + htype[m.indexOf(d)] + "</span>";
      //     })            


      var rects =stack.selectAll('rect')
      .data(m)
      .enter()
      .append('rect')
      .attr('class',cls)
      .attr("width", '20px')
      .attr('y',function(d){return y(d[0])})
      .attr('height',function(d){return y(d[1]-d[0])})
      

      stack.selectAll('text')
      .data(m)
      .enter()
      .append('text')
      .attr('class','bLabel')
      .attr('x',x2)
      .attr('y',function(d){if(y(d[0])+8<=height){return y(d[0])+8} else {return height}})
      .text(function(d){if (d[1]-d[0]>1.5){return window.myFloatFormatter(d[1]-d[0])+' %'} else {return ''}})
      .attr('text-anchor',anchor);

    }
    stackBar2(brs1,m,false,'msk1')
    stackBar2(brs2,d, true,'ryn1')
    }
  
  htypeBars(htype,sample,moscow)

  var sal = mWindow.append('g')
                     .attr('id','priceComp')
                     .attr("transform", "translate(130,0)")

  function compPrice(g,s,m){
    datum = [[s.price1room,m.price1room],[s.price2rooms,m.price2rooms],[s.price3rooms,m.price3rooms]]
    var height = 50
    
    sMax = d3.max([s.price1room,m.price1room,s.price2rooms,m.price2rooms,s.price3rooms,m.price3rooms])
    var y = d3.scale.linear().domain([0, sMax]).range([0,height])
    var y1 = d3.scale.linear().domain([0, sMax]).range([height,0])


    // title
    g.append('text')
     .text('Средняя цена жилья,')
     .attr('class','chTitle')
     .attr('y','11')
     .append('tspan')
     .text('руб./кв.м.')
     .attr('y','25')
     .attr('x','0')
    
    var labels = ['1 комната','2 комнаты','3 комнаты']
    // Bars
    g.append('g')
     .attr('id','barsG')
     .attr("transform", "translate(0,40)")

    var bars = g.select('#barsG')
     .selectAll('g')
     .data(datum)
     .enter()
     .append('g')
     .attr('class','bars')
     .attr("transform", function(d,i){return "translate("+(15+i*60)+",0)"})

    bars.append('rect')
      .attr('class','sRect')
      .attr('width','20')
      .attr('x',0)
      .attr('y',function(d){return (height - y(d[0]))})
      .attr('height',function(d){return y(d[0])}) 
    
    bars.append('rect')
      .attr('class','mRect')
      .attr('width','20')
      .attr('x',23)
      .attr('y',function(d){return (height-y(d[1]))})
      .attr('height',function(d){return y(d[1])}) 
    
    bars.append('text')
      .attr('class','RoomLabel')
      .attr('text-anchor','middle')
      .attr('x',21.5)
      .attr('y',(height +15))
      .text(function(d,i){return labels[i]})
     
    
    var yAxis = d3.svg.axis().scale(y1).ticks(3).orient("left").tickFormat(window.myFormatter);

    var axisLayer =  g.append('g')
                    .attr('class','AxisLayer')
              
    axisLayer.append('g')
      .attr("class", "axis")
      .attr("transform", "translate(5,"+(height-11)+")")
      .call(yAxis);
    

    

  }

  compPrice(sal,sample,moscow)

  var popComp = mWindow.append('g')
                     .attr('id','popComp')
                     .attr("transform", "translate(130,186)")


  function compPop(g, s,m){
    // m is hardcoded?
    console.log(s)
    console.log(m)
    g.append('text')
     .text('Население района, %')
     .attr('class','chTitle')
     .attr('y','11')

    g.append('rect')
    .attr('class','msk')
    .attr('y','20')
    .attr('height','20')
    .attr('width','180')

    var percent = d3.max([180*(s / m),4])

    g.append('rect')
    .attr('class','ryn')
    .attr('y','20')
    .attr('height','20')
    .attr('width',percent)

    g.append('text')
    .attr('class','bLabel')
    .attr('id','rPop')
    .attr('y',33)
    .attr('x',percent+5)
    .text(window.myFloatFormatter2(180*(s / m)) + ' %')
    .attr('text-anchor','start');

    g.append('text')
    .attr('class','bLabel')
    .attr('y','33')
    .attr('x',177)
    .text('100 %')
    .attr('text-anchor','end');
    
  }
  compPop(popComp,sample.pop2014,moscow.pop2014)

  var salComp = mWindow.append('g')
                     .attr('id','salComp')
                     .attr("transform", "translate(130,116)")

  function compSal(g, s,m){
    
    var x = d3.scale.linear().domain([0, d3.max([s,m])]).range([0,180])

    g.append('text')
     .text('Средняя зарплата, руб.')
     .attr('class','chTitle')
     .attr('y','11')

    g.append('rect')
        .attr('class','msk')
        .attr('x',0 )
        .attr('y',40)
        .attr('width',x(m) )
        .attr('height',20 )

    g.append('rect')
        .attr('class','ryn')
        .attr('x',0 )
        .attr('y',20)
        .attr('width',x(s) )
        .attr('height',20 )

    g.append('text')
     .attr('class','wbLabel')
     .attr('id','rSal')
     .attr('x',x(s)-5 )
     .attr('y',33)
     .text(window.myFormatter(s))
     .attr('text-anchor','end');

     g.append('text')
     .attr('class','bLabel')
     .attr('id','mSal')
     .attr('x',x(m)-5 )
     .attr('y',53)
     .text(window.myFormatter(m))
     .attr('text-anchor','end');

        
  }

  compSal(salComp,sample.salary2014,moscow.salary2014)
  
  // legends
  var lgnd = mWindow.append('g')
                     .attr('id','legend')
                     .attr("transform", "translate(130,238)")
  
  function legend(g){
    var data =[['msk','Москва',],['ryn',' район Академический']]
    
    var rows = g.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('class','row')
                .attr("transform", function(d,i){return "translate(0,"+i*14 +")"})

    rows.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width',12)
        .attr('height',12)
        .attr('class', function(d){return d[0]})

    rows.append('text')
        .attr('x', 15)
        .attr('y', 8)
        .attr('class', 'bLabel')
        .attr('id', function(d){return d[0]})
        .text(function(d){return d[1]})
        .style('font-weight', 'bold')

    }

  legend(lgnd)
  }

  

function updateGraph(id){
      function updateLinechart(id, yArray, xArray, width, height, delayTime){
        
        // get max's
        var yMax = d3.max(yArray),
            yMin = d3.min(yArray);


        // two axises
        var y1 = d3.scale.linear().domain([0, yMax]).range([height,0]),
            x1 = d3.scale.linear().domain([2000, 2015]).range([0,width]);


        
        // scale arrays
        var xmArray = xArray.map(function(d){return x1(d)}),
            ymArray = yArray.map(function(d){return y1(d)});

        var yAxis = d3.svg.axis().scale(y1).tickValues([0,yMin,yMax]).orient("left").tickFormat(window.myFormatter);
        // move polyline
        // console.log(d3.select('#'+id)[0])

        var chart= d3.select('#'+id)

        // update line
        chart.select('polyline')
          .transition().delay(delayTime)
          .attr("points", function(){return convertCoord(zip([xmArray,ymArray]))} )

      // update polygon
      var PolygonXarray = [xmArray[0]].concat(xmArray).concat([xmArray[xmArray.length - 1]])
      var PolygonYarray = [height].concat(ymArray).concat([height])
      
      chart.select('.linefill')
          .transition().delay(delayTime)
          .attr('points',function(){return convertCoord(zip([PolygonXarray,PolygonYarray]))} )
        
      chart.select('#yAxis')
             .transition().delay(delayTime)
             .call(yAxis)

        // var ax = d3.select('#grapcharts .AxisLayer')[0][i]
        }

      var sample = window.Lookup[id]
      
      var h = 80;
      updateLinechart('lSal',[sample.salary2003,sample.salary2004,sample.salary2005,sample.salary2006,sample.salary2007,sample.salary2008,sample.salary2009,sample.salary2010,sample.salary2012 ,sample.salary2013 ,sample.salary2014],[2003,2004,2005,2006,2007,2008,2009,2010,2012,2013,2014],window.lgWidth,h, 50 )
      updateLinechart('lPop',[sample.pop2002 ,sample.pop2010 ,sample.pop2012 ,sample.pop2013 ,sample.pop2014 ],[2002,2010,2012,2013,2014],window.lgWidth,h,50 )
  }

function updateChect(id){
  // update comparison chart
  var sample = [window.Lookup[id]][0]
  var moscow = [window.Lookup['Москва']][0]
  

  // update housing tyoe
  function updateHtype(id, r){ 
    var height = window.cHeight 
    

    var m = [[r.privatehousingpercent,window.htypes[0]],
             [r.multistoreyresadmpercentt,window.htypes[1]],
             [r.multistoreyrespercent,window.htypes[2]],
             [r.underconstructionpercent,window.htypes[3]]
             ]

    summ=0
    m.forEach(function(d){summ+=d[0]})
    var y = d3.scale.linear().domain([0, summ]).range([0,height])

    h = 0
    m = m.map(function(d){return [h, h+=d[0],d[1]]})
    console.log(m)
    var stack = d3.select("#brs2 .stack")

    stack.selectAll('rect')
        .data(m)
        .transition().delay(50)
        .attr('y',function(d){return y(d[0])})
        .attr('height',function(d){return y(d[1]-d[0])})


    stack.selectAll('text')
        .data(m)
        .transition().delay(50)
        .attr('y',function(d){if(y(d[0])+8<=height){return y(d[0])+8} else {return height}})
        .text(function(d){if (d[1]-d[0]>1.5){return window.myFloatFormatter(d[1]-d[0])+' %'} else {return ''}})
          
          
    }

  function updatePop( s,m){
    var percent = d3.max([180*(s / m)+2,3])
    console.log(s)
    console.log(s / m)

    d3.select('#popComp .ryn')
      .transition().delay(50)
      .attr('width', percent)

    d3.selectAll('#popComp #rPop')
      .transition().delay(50)
      .attr('x', percent+5)
      .text(window.myFloatFormatter2(180*(s / m)) + ' %')
  }

  function updateSal(s,m){
    var max = d3.max([s,m])

    var x = d3.scale.linear().domain([0, d3.max([s,m])]).range([0,180])


    d3.select('#salComp .msk ')
        .transition().delay(50)
        .attr('width',x(m) )

    d3.select('#salComp .ryn ')
        .transition().delay(50)
        .attr('width',x(s) )
        

    d3.select('#salComp #rSal ')
     .transition().delay(50)
     .attr('x',x(s)-5 )
     .text(window.myFormatter(s))
  
    d3.select('#salComp #mSal ')
     .transition().delay(50)
     .attr('x',x(m)-5 )
     .text(window.myFormatter(m))

    }
  

  function updatePrice(s,m){
    newDatum = [[s.price1room,m.price1room],[s.price2rooms,m.price2rooms],[s.price3rooms,m.price3rooms]]
    sMax = d3.max([s.price3rooms,m.price3rooms])
    console.log('3room'+[s.price3rooms,m.price3rooms])
    console.log('max:'+sMax)
    
    var height =50
    
    var y = d3.scale.linear().domain([0, sMax]).range([0,height])
    var y1 = d3.scale.linear().domain([0, sMax]).range([height,0])
    console.log(y1(datum[2][0]),y1(datum[2][1]))
    var bars = d3.selectAll('#barsG .bars')

    bars.data(newDatum)
    
    bars.select('.sRect') 
    .transition().delay(50)
    .attr('y',function(d){return (height - y(d[0]))})
    .attr('height',function(d){return y(d[0])}) 

    bars.select('.mRect')
    .transition().delay(50)
    .attr('y',function(d){return (height - y(d[1]))})
    .attr('height',function(d){return y(d[1])}) 

    var yAxis = d3.svg.axis().scale(y1).ticks(3).orient("left").tickFormat(window.myFormatter);
    d3.select('#priceComp .axis')
             .transition().delay(50)
             .call(yAxis)
  }


  function updateLegend(id){
    var title = d3.select('#legend text#ryn')
                  .text('район ' +id)
                    
  }
  
  updateHtype(id, sample)
  updatePop(sample.pop2014,moscow.pop2014)
  updateSal(sample.salary2014,moscow.salary2014)
  updatePrice(sample,moscow)
  updateLegend(id)
}

function getData(){
     // get data and produce all viz
    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM mosrayons &format=geojson&dp=5",  function(error, d){
      dataset = d.features.map(function(d){return d.properties})
      createMap('map1','https://rilosmaps.cartodb.com/u/philip/api/v2/viz/f9cbd828-e761-11e4-9ba6-0e9d821ea90d/viz.json')
      localMap('map2',window.maps['Академический']['link'], window.maps['Академический']['coordinates'])
      barChart(dataset)
      graphCharts('Академический',dataset)
      cChart('Академический')
      addListners()
      
  
    });
          
}

// UTIL FUNCTIONS
function convertCoord(d){
  // produce string for polylines and polygons
      var str="";
        for(var pti=0;pti<d.length;pti++){
            str=str+d[pti][0]+","+d[pti][1]+" ";
            }
            return str;
  }

  function zip(arrays) {
    // zip two arrays into array of pairs
      return arrays[0].map(function(_,i){
          return arrays.map(function(array){return array[i]})
      });
  }


  function addListners(){
    // console.log(d3.selectAll('.msk1'))
    
    // var tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //         return "<span style='color:red'>" + 'd.frequency' + "</span>";
    //   })
    var div = d3.select("#compareChart").append("div")  
      .attr("class", "tooltip")       
      .style("opacity", 0);
    
    d3.selectAll('.msk1')
      .on("mouseover", function(d) {   
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html("<span style='color:white'>" + d[2]+'</span>')  
                .style("left", (d3.event.pageX-50) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(200)    
                .style("opacity", 0); 
        });


    d3.selectAll('.ryn1')
      .on("mouseover", function(d) {   
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html("<span style='color:white'>" + d[2]+'</span>')  
                .style("left", (d3.event.pageX-50) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });
  }

    
              



          
              

    

