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


function clicker(id, c){
      if (c='Button'){
        
        d3.selectAll('.buttonClicked').attr('class','button');
        d3.select('#'+id).attr('class', 'buttonClicked');
      } 
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
       .text('Население, чел.')


    var g = d3.select("#basic")



          pop_data = data.sort(function(a,b){return d3.descending(a.pop_2014, b.pop_2014)}).slice(0,5);
          den_data = data.sort(function(a,b){return d3.descending(a.dencity, b.dencity)}).slice(0,5);
          sal_data = data.sort(function(a,b){return d3.descending(a.salary_2014, b.salary_2014)}).slice(0,5);
          
          console.log(pop_data);
          
          var x = d3.scale.linear()
            .domain([0, d3.max(pop_data, function(d) { return d.pop_2014 })])
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
              .attr("width", function(d){return x(d.pop_2014)})
              .attr("height", realBarHeight-4);

          bar.append("text")
                .attr("class","name")
                .attr("x", -10)
                .attr("y", barHeight/2-6)
                .attr("dy", ".75em")
                .text(function(d,i) { return (i+1) + '. ' + d.new_name; });

          bar.append("text")
                .attr("x", function(d){return x(d.pop_2014)- 5})
                .attr("y", (realBarHeight / 2 -6))
                .attr("dy", ".75em")
                .attr("class","label")
                .text(function(d) { return window.myFormatter(d.pop_2014) });



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
              .text(function(d,i) { return (i+1) + '. ' + d.new_name; });

            bar.select('text.label')
              .transition().delay(function (d,i){ return i * 15;})
              .attr("x", function(d){return x(d[id])-5})
              .text(function(d,i) { return window.myFormatter(d[id]) });

            var quantDict = {'pop_2014':'Население, тыс. ч.','den_2014':'Коммерческая плотность, кв. м. на тыс. жителей', 'sal_2014':'Средняя зарплата, руб.'};

            d3.select('#quant').text(quantDict[id])

            
          }
          
          
          d3.select('#pop').on('click', function(d){updateBars('pop_2014',bar, pop_data)});
          d3.select('#sal').on('click', function(d){updateBars('salary_2014',bar, sal_data)});
          d3.select('#den').on('click', function(d){updateBars('dencity',bar, den_data)});
          
          
                    


      // })
    } 

function getData(){
  
    
        
    d3.json("http://philip.cartodb.com/api/v2/sql?q=SELECT * FROM raydatum &format=geojson&dp=5",  function(error, d){
      dataset = d.features.map(function(d){return d.properties})
      
      barChart(dataset)
      


      
    });
          
}
      
              



          
              

    

