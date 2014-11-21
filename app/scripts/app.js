'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('Defu', ['ionic', 'config', 'Defu.controllers'])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('intro', {
        url: '/',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');

  })
  .directive('ukraine', ['$window', '$timeout',
    function ($window, $timeout) {
      return {
        restrict: 'AE',
        scope: {
          data: '=',
          label: '@',
          onClick: '&'
        },
        link: function (scope, ele, attrs) {
          scope.$root.score = 0;
          scope.$root.ukraine = [];
          var mapScale = 4;
          var mapRatio = .65;
          var width = parseInt(d3.select('ion-view').style('width'));
          var height = width * mapRatio;
          var ukraine = [];

          var projection = d3.geo.albers()
            .center([0, 48.5])
            .rotate([-31.5, 0])
            .parallels([45, 50])
            .scale(width * mapScale)
            .translate([width / 2, (height - 60) / 2]);

          var color = d3.scale.threshold()
            .domain([10, 20, 30, 50])
            .range(['#F7CB6D', '#C4AA73', '#899BAD', '#739AC4', '#2E5C8A'])

          var svg = d3.select('#map').append('svg')
            .attr('width', width)
            .attr('height', height);

          var countriesPath;
          var regionsPath;
          var riversPath;
          var lakesPath;

          d3.json('ukraine.json', function (error, data) {
            var countries = topojson.feature(data, data.objects.countries);

            countriesPath = d3.geo.path()
              .projection(projection);

            svg.selectAll('.country')
              .data(countries.features)
              .enter().append('path')
              .attr('class', 'country')
              .attr('d', countriesPath)

            var countryBoundaries = topojson.mesh(data, data.objects.countries,
              function (a, b) {
                return a !== b
              });

            svg.append('path')
              .datum(countryBoundaries)
              .attr('class', 'country-boundary')
              .attr('d', countriesPath)

            var regions = topojson.feature(data, data.objects['ukraine-regions']);

            regionsPath = d3.geo.path()
              .projection(projection);

            svg.selectAll('.region')
              .data(regions.features)
              .enter().append('path')
              .attr('class', 'region')
              .attr('d', regionsPath)
              .attr('data-id', function (d) {
                scope.$root.ukraine.push({
                  "id": d.id,
                  "name": d.properties.name
                });
                return d.id;
              })
              .style('fill', function (d) {
                return color(d.properties.percent)
              })

            var rivers = topojson.feature(data, data.objects['rivers_lake_centerlines']);

            riversPath = d3.geo.path()
              .projection(projection);

            svg.selectAll('.river')
              .data(rivers.features)
              .enter().append('path')
              .attr('class', 'river')
              .attr('d', riversPath)

            var lakes = topojson.feature(data, data.objects.lakes);

            lakesPath = d3.geo.path()
              .projection(projection);

            svg.selectAll('.lake')
              .data(lakes.features)
              .enter().append('path')
              .attr('class', 'lake')
              .attr('d', lakesPath)

            var ukraineRegionBoundaries = topojson.mesh(data,
              data.objects['ukraine-regions'], function (a, b) {
                return a !== b
              });

            svg.append('path')
              .datum(ukraineRegionBoundaries)
              .attr('d', regionsPath)
              .attr('class', 'region-boundary')

            var ukraineBoundaries = topojson.mesh(data,
              data.objects['ukraine-regions'], function (a, b) {
                return a === b
              });

            svg.append('path')
              .datum(ukraineBoundaries)
              .attr('d', regionsPath)
              .attr('class', 'ukraine-boundary')

            d3.select(window).on('resize', resize);

            //svg.select('.region.captured').on("click", function (d) {
            //    scope.$apply(function () { // or $timeout(function() {
            //        //d.properties.percent = d.properties.percent + 10;
            //        scope.$root.score = scope.$root.score + 10;
            //    });
            //    //svg.selectAll('.region')
            //    //    .style('fill', function (dd) {
            //    //        return color(dd.properties.percent)
            //    //    })
            //})

          });

          function resize() {
            width = parseInt(d3.select('#map').style('width'));
            height = width * mapRatio;

            svg
              .style('width', width + 'px')
              .style('height', height + 'px');

            svg.selectAll('.country,.country-boundary').attr('d', countriesPath);
            svg.selectAll('.region,.region-boundary,.ukraine-boundary').attr('d', regionsPath);
            svg.selectAll('.lake').attr('d', lakesPath);
            svg.selectAll('.river').attr('d', riversPath);

            projection
              .scale(width * mapScale)
              .translate([width / 2, (height - 70) / 2]);
          }
        }
      }
    }]);
