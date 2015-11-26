/**
 * Created by sdonose on 11/26/2015.
 */
(function () {
    'use strict';
angular.module('app')
  .factory('currentUser',currentUser);

  function currentUser(){
    return{
      lastBookEdited:lastBookEdited
    };

    var lastBookEdited={};
  }
  })();