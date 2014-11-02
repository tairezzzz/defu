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
    $interval(function () {
      $(".region").removeClass("captured");
      var random = new Random();
      var ind = random.integer(0, 26);
      var region = $(".region").eq(ind);
      var colorade = $(".colorade");
      region.addClass("captured")
      region.css("opacity", 0.5);
      $(".colorade").css({
        "top": region.position().top + region[0].getBoundingClientRect().height / 2 - colorade.height() / 2,
        "left": region.position().left + region[0].getBoundingClientRect().width / 2 - colorade.width() / 2
      });
    }, 20000);
    $scope.toIntro = function () {
      $state.go('intro');
    }
  });
