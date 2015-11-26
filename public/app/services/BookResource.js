/**
 * Created by sdonose on 11/26/2015.
 */
(function () {
    'use strict';
angular.module('app')
  .factory('BookResource',['$resource',BookResource]);

  function BookResource($resource){
    return $resource('/api/books/:book_id',{book_id:'@book_id'}, {
        update:{method:'PUT'}
      })
  }
  })();