/**
 * Created by sdonose on 11/25/2015.
 */
(function () {
  'use strict';
  angular.module('app')
    .controller('EditBookController', ['$routeParams', 'dataService', 'books', '$cookies', '$cookieStore', '$log', '$location','BookResource','currentUser', EditBookController])

  function EditBookController($routeParams, dataService, books, $cookies, $cookieStore, $log, $location,BookResource,currentUser) {
    var vm = this;

    dataService.getBookByID($routeParams.bookID)
      .then(getBookSuccess)
      .catch(getBookError);

    /*resource*/
    //
    //var currentBook=BookResource.get({book_id:$routeParams.bookID});
    //$log.log(vm.currentBook)

    function getBookSuccess(book) {
      vm.currentBook = book;
      currentUser.lastBookEdited=vm.currentBook;
    }

    function getBookError(reason) {
      $log.error(reason);
    }

    vm.saveBook = function () {
      dataService.updateBook(vm.currentBook)
        .then(updateBookSuccess)
        .catch(updateBookError)

      /*resource*/
      //vm.currentBook.$update();
      //$location.path('/');
    }

    function updateBookSuccess(message) {
      $log.info(message);
      $location.path('/');
    }

    function updateBookError(errorMessage) {
        $log.error(errorMessage);
    }

    //vm.currentBook = books.filter(function (item) {
    //  return item.book_id == $routeParams.bookID;
    //})[0];
    //


    vm.setAsFavorite = function () {
      $cookies.favoriteBook = vm.currentBook.title;
    }
    //$cookieStore.put('lastEdited', vm.currentBook);
  }
})();