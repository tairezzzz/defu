'use strict';
angular.module('Defu.controllers', [])

  .controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {

    // Called to navigate to the main app
    $scope.startApp = function () {
      $state.go('main');
    };
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };
  })

  .controller('MainCtrl', function ($scope, $state, $interval) {

    $scope.showInvader = $interval(function () {
      var ind = findInvader();
      $scope.ukraine[ind].invaderVisible = true;
    }, 1000)

    function findInvader() {
      var free_regions = [];
      angular.forEach($scope.ukraine, function (value, key) {
        if (value.invaderVisible === false) {
          free_regions.push(key);
        }
      });
      var random = new Random();
      var ind = random.integer(0, free_regions.length - 1);
      if ($scope.ukraine[free_regions[ind]].invaderVisible === false) return ind;
    }

    $scope.toIntro = function () {
      $state.go('intro');
    }
  })
;
