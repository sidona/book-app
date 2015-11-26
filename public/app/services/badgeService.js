/**
 * Created by sdonose on 11/25/2015.
 */
(function () {
    'use strict';

  angular.module('app')
    .value('badgeService',{
    retrieveBadge:retrieveBadge
  })

  function retrieveBadge(minutesRead){
    var badge=null;

    switch (true){
      case (minutesRead>5000):
        badge='Book Worm';
        break;
      case(minutesRead>2500):
        badge='page turner';
        break;
      default :
        badge='getting started'

    }
    return badge;
  }
  })();