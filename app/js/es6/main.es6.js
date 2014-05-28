/* global google:true */
/* jshint unused:false */
/* jshint camelcase:false */
/* global AmCharts: true */

(function(){
  'use strict';

  $(document).ready(init);

  function init()
  {
    initMap(38, -80, 3);
    $('#add').click(add);
  }

  var map;
  var charts = {};

  function initMap(lat, lng, zoom)
  {
    let styles = [{'featureType':'landscape.natural','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#e0efef'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#1900ff'},{'color':'#c0e8e8'}]},{'featureType':'landscape.man_made','elementType':'geometry.fill'},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','stylers':[{'color':'#7dcdcd'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'visibility':'on'},{'lightness':700}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function add()
  {
    let zip = $('#zip').val().trim();
    $('#zip').focus();
    getWeather(zip);
    geoCode(zip);
  }

  function getWeather(zip)
  {
    let url = `http://api.wunderground.com/api/bb0daa3d246877f0/forecast10day/q/${zip}.json?callback=?`;
    $('#zip').val('');

    $.getJSON(url, data=>{
      $('#graphs').append(`<div class='graph'data-zip=${zip}></div>`);
      initGraph(zip);
      console.log(data);
      data.forecast.simpleforecast.forecastday.forEach(d=>charts[zip].dataProvider.push({high: d.high.fahrenheit,
      low: d.low.fahrenheit, date: d.date.weekday}));
      charts[zip].validateData();

    });
  }

  function initGraph(zip)
  {
    let graph = $(`.graph[data-zip=${zip}]`)[0];
    //debugger;
    charts[zip] = AmCharts.makeChart(graph, {
      'type': 'serial',
      'theme': 'none',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'titles':[{
        'text': zip,
        'size': 16,
      }],
      'dataProvider': [],
      'valueAxes': [{
          'id':'temps',
          'axisColor': '#FF6600',
          'axisThickness': 2,
          'gridAlpha': 0,
          'axisAlpha': 1,
          'position': 'left'
      }],
      'graphs': [{
          'valueAxis': 'v1',
          'lineColor': '#FF6600',
          'bullet': 'round',
          'bulletBorderThickness': 1,
          'hideBulletsCount': 30,
          'title': 'high',
          'valueField': 'high',
  		    'fillAlphas': 0
      }, {
          'valueAxis': 'v2',
          'lineColor': '#FCD202',
          'bullet': 'square',
          'bulletBorderThickness': 1,
          'hideBulletsCount': 30,
          'title': 'low',
          'valueField': 'low',
  		'fillAlphas': 0
      }],
      'chartCursor': {
          'cursorPosition': 'mouse'
      },
      'categoryField': 'date',
      'categoryAxis': {
          'axisColor': '#DADADA',
          'minorGridEnabled': true,
          'labelRotation': 45
      }
  });

}

  function geoCode(zip)
  {
    let geocoder = new google.maps.Geocoder();

      geocoder.geocode({address: zip}, (results, status)=>{
        let name = results[0].formatted_address;
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        //console.log(results);
        addMarker(lat, lng, name, '../media/orange-pin.png');
        let LatLng = new google.maps.LatLng(lat, lng);
        map.setCenter(LatLng);
        map.setZoom(5);
      });
  }

  function addMarker(lat, lng, name, icon='../media/orange-pin.png')
  {
    let LatLng = new google.maps.LatLng(lat,lng);
    new google.maps.Marker({map: map, position: LatLng, title: name, icon: icon});
  }



})();





// (function(){
//   'use strict';
//
//   $(document).ready(init);
//
//   function init()
//   {
//     initMap(38, -80, 3);
//     $('#add').click(go);
//     //$('#add').click(initGraph);
//   }
//
//   var map;
//
//   function initMap(lat, lng, zoom)
//   {
//     let styles = [{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}];
//     let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
//     map = new google.maps.Map(document.getElementById('map'), mapOptions);
//   }
//
//   function go()
//   {
//     add();
//     let zip = $('#address').val().trim();
//     let url = `http://api.wunderground.com/api/bb0daa3d246877f0/forecast10day/q/${zip}.json?callback=?`;
//     $('#address').val('');
//     console.log(url);
//     $.getJSON(url, function(conditions, zip){
//       getForecast(conditions, zip);
//       initGraph(zip);
//     });
//   }
//
//   function add()
//   {
//     let zip = $('#address').val().trim();
//     //$('#address').val('');
//     $('#address').focus();
//
//     let geocoder = new google.maps.Geocoder();
//
//     geocoder.geocode({address: zip}, (results, status)=>{
//       let name = results[0].formatted_address;
//       let lat = results[0].geometry.location.lat();
//       let lng = results[0].geometry.location.lng();
//       //console.log(results);
//       addMarker(lat, lng, name, '../media/Pin.png');
//       let LatLng = new google.maps.LatLng(lat, lng);
//       map.setCenter(LatLng);
//       map.setZoom(5);
//     });
//
//   }
//
//   function addMarker(lat, lng, name, icon='../media/Pin.png')
//   {
//     let LatLng = new google.maps.LatLng(lat,lng);
//     new google.maps.Marker({map: map, position: LatLng, title: name, icon: icon});
//   }
//
//   function getForecast(conditions, zip)
//   {
//     console.log(conditions);
//     //$('#graphs').append(`<div class="graph" data-zip=${zip}</div>`);
//     //$(`.graph[data-zip=${zip}`])
//
//   //  charts[${zip}] = {};
//
//     // charts[${zip}] = conditions.forecast.simpleforecast.forecastday.forEach(d=>{high:d.high.fahrenheit, low:d.low.fahrenheit,
//     // date:d.date.weekday)};
//     //console.log(charts[${zip}]);
//
//     //debugger;
//
//
//
//
//     //conditions.forecast.simpleforecast.forecastday.forEach(m=>charts.dataProvider.push({high:m.high.fahrenheit, low:m.low.fahrenheit, date:m.date.weekday}));
//     //charts.validateData();
//
//
//
//     //console.log(conditions);
//     //$('#graphs').append('<div class="graph">')
//     // let high = conditions.forecast.simpleforecast.forecastday.high.fahrenheit;
//     // let low = conditions.forecast.simpleforecast.forecastday.low.fahrenheit;
//     // let zip = zip;
//     // let date = conditions.forecast.simpleforecast.forecastday.date.weekday;
//     // let chart[zip] = {};
//     // chart[zip].high = high;
//     // chart[zip].low = low;
//     // chart[zip].date = date;
//     //
//     // chart.dataProvider.chartData.push(chart[zip]);
//
//   }
//
//   //var chart;
//   var charts = {};
//   function initGraph(zip)
//   {
//     //let chartData;
//     //let graph = $(`.graphs[data-zip=${zip}]`);
//     //$(`#graphs`).append(graph);
//
//     charts = AmCharts.makeChart('graphs', {
//         'type': 'serial',
//         'theme': 'none',
//         'pathToImages': 'http://www.amcharts.com/lib/3/images/',
//         'legend': {
//             'useGraphSettings': true
//         },
//         'dataProvider': [],
//         'valueAxes': [{
//             'id':'temps',
//             'axisColor': '#FF6600',
//             'axisThickness': 2,
//             'gridAlpha': 0,
//             'axisAlpha': 1,
//             'position': 'left'
//         }],
//         'graphs': [{
//             'valueAxis': 'v1',
//             'lineColor': '#FF6600',
//             'bullet': 'round',
//             'bulletBorderThickness': 1,
//             'hideBulletsCount': 30,
//             'title': 'temperature high',
//             'valueField': 'high',
//     		'fillAlphas': 0
//         }, {
//             'valueAxis': 'v2',
//             'lineColor': '#FCD202',
//             'bullet': 'square',
//             'bulletBorderThickness': 1,
//             'hideBulletsCount': 30,
//             'title': 'temperature low',
//             'valueField': 'low',
//     		'fillAlphas': 0
//         }],
//         'chartCursor': {
//             'cursorPosition': 'mouse'
//         },
//         'categoryField': 'date',
//         'categoryAxis': {
//             'axisColor': '#DADADA',
//             'minorGridEnabled': true
//         }
//     });
//
//     charts.addListener('dataUpdated', zoomChart);
//     zoomChart();
//
//
//     function zoomChart()
//     {
//         charts.zoomToIndexes(charts.dataProvider.length - 20, charts.dataProvider.length - 1);
//     }
//
//   }
//
//
//
//
//
//
// })();
