/**
 * Created by sdonose on 11/25/2015.
 */
(function () {

  angular.module('app')
    .controller('BooksController', ['books', 'dataService', 'logger', 'badgeService','$q','$cookies','$cookieStore','$log','$route','BookResource','currentUser', BooksController]);


  function BooksController(books, dataService, logger, badgeService,$q,$cookies,$cookieStore,$log,$route,BookResource,currentUser) {

    var vm = this;
    vm.appName = books.appName;

    dataService.getUsersSummary()
      .then(getUserSummarySuccess);

    function getUserSummarySuccess(summaryData){
      console.log(summaryData);
      vm.summaryData=summaryData;
    }


    ///* same promise for books and reader, using array*/
    //var bookPromise=dataService.getAllBooks();
    //var readersPromise=dataService.getAllReaders();
    //
    //$q.all([bookPromise,readersPromise])
    //  .then(getAllDataSuccess)
    //  .catch(getAllDataError);
    //
    //function getAllDataSuccess(dataArray){
    //  vm.allBooks=dataArray[0];
    //  vm.allReaders=dataArray[1];
    //}
    //function getAllDataError(reason){
    //  console.log(reason);
    //}


    //vm.allBooks=dataService.getAllBooks();

    /*with resource*/
    //vm.allBooks=BookResource.query();



    /*with promise books*/
    dataService.getAllBooks()
      .then(getBooksSuccess, null, getBooksNotification)
      .catch(errorCallback)
      .finally(getAllBooksComplete)

    function getBooksSuccess(books) {
      // throw 'error in success handler'
      vm.allBooks = books;
    }

    //function getBooksError(reason){
    //  console.log(reason)
    //}

    function errorCallback(errorMsg) {
      console.log(errorMsg)
    }

    function getBooksNotification(notification) {
      console.log('promise notification ' + notification);
    }

    function getAllBooksComplete() {
      console.log('getAllBooksComplete');
    }

    /*readers promise*/

    dataService.getAllReaders()
      .then(getReadersSuccess)
      .catch(errorCallback)
      .finally(getAllReadersComplete)

    function getReadersSuccess(readers){
      vm.allReaders=readers;
      $log.log('all readers retrieve')
    }
    function getAllReadersComplete(){

      console.log('getAllReaders has completed')
    }

    vm.deleteBook=function(bookID){
      dataService.deleteBook(bookID)
        .then(deleteBookSuccess)
        .catch(deleteBookError)
    };

    function deleteBookSuccess(message){
      $log.info(message);
      $route.reload();
    }
    function deleteBookError(errorMessage){
      $log.error(errorMessage)
    }

    //vm.allReaders = dataService.getAllReaders();

    vm.getBadge = badgeService.retrieveBadge;

    logger.output('BooksController has been created');


    vm.favoriteBook=$cookies.favoriteBook;
    vm.currentUser=currentUser;

    $log.log('logging with log');
    $log.log('logging with info');
    $log.log('logging with warn');
    $log.log('logging with error');
    $log.log('logging with debug');

  }


}());