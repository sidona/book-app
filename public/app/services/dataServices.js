/**
 * Created by sdonose on 11/25/2015.
 */
(function () {
  'use strict';

  angular.module('app')
    .factory('dataService', ['$q', '$timeout', '$http', 'constants', '$cacheFactory', dataService]);

  function dataService($q, $timeout, $http, constants, $cacheFactory) {
    return {
      getAllBooks: getAllBooks,
      getAllReaders: getAllReaders,
      getBookByID: getBookByID,
      updateBook: updateBook,
      addBook: addBook,
      deleteBook: deleteBook,
      getUsersSummary: getUserSummary
    };

    //function getAllBooks(){
    //  //logger.output('getting all books')
    //  var booksArray=[
    //    {
    //      "book_id": 1,
    //      "title": "Anna Karenina",
    //      "author": "Leo Tolstoy",
    //      "year_published": "1878"
    //    },
    //    {
    //      "book_id": 2,
    //      "title": "The Things They Carried",
    //      "author": "Tim O'Brien",
    //      "year_published": "1990"
    //    },
    //    {
    //      "book_id": 3,
    //      "title": "Invisible Man",
    //      "author": "Ralph Ellison",
    //      "year_published": "1952"
    //    },
    //    {
    //      "book_id": 57,
    //      "title": "Advanced OS X Programming",
    //      "author": "Mark Dalrymple",
    //      "year_published": "2010"
    //    },
    //    {
    //      "book_id": 59,
    //      "title": "The Cat and the Hat",
    //      "author": "Dr. Seuss",
    //      "year_published": "1950"
    //    },
    //    {
    //      "book_id": 61,
    //      "title": "Green Eggs and Ham",
    //      "author": "Dr. Seuss",
    //      "year_published": "1960"
    //    }
    //  ];
    //
    //  var deferred=$q.defer();
    //
    //  $timeout(function(){
    //
    //    var successful=true;
    //    if(successful){
    //      deferred.notify('just getting started gathering books....');
    //      deferred.notify('almost done gathering books....');
    //
    //      deferred.resolve(booksArray)
    //    }else{
    //      deferred.reject('error retrieving books')
    //    }
    //  },1000);
    //
    //  return deferred.promise;
    //}

    function getUserSummary() {
      var deferred = $q.defer();

      var dataCache = $cacheFactory.get('bookLoggerCache');
      if (!dataCache) {
        dataCache = $cacheFactory('bookLoggerCache');
      }

      var summaryFromCache = dataCache.get('summary');
      if (summaryFromCache) {

        console.log('returning summary from cache');
        deferred.resolve(summaryFromCache);
      } else {
        console.log('gathering new summary data');

        var booksPromise = getAllBooks();
        var readersPromise = getAllReaders();

        $q.all([booksPromise, readersPromise])
          .then(function (bookLoggerData) {

            var allBooks = bookLoggerData[0];
            var allReaders = bookLoggerData[1];

            var grandTotalMinutes = 0;

            allReaders.forEach(function (currentReader, index, array) {
              grandTotalMinutes += currentReader.totalMinutesRead;
            });
            var summaryData = {
              bookCount: allBooks.length,
              readerCount: allReaders.length,
              grandTotalMinutes: grandTotalMinutes
            };

            dataCache.put('summary', summaryData)
            deferred.resolve(summaryData);
          });
      }


      return deferred.promise;
    }

    function deleteSummaryFromCache() {
      var dataCache = $cacheFactory.get('bookLoggerCache');
      dataCache.remove('summary');
    }

    function getAllBooks() {
      return $http({
        method: 'GET',
        url: 'api/books',
        headers: {
          'PS-BookLogger-Version': constants.APP_VERSION
        },
        transformResponse: transformGetBooks,
        cache: true
      })
        .then(sendResponseData)
        .catch(sendGetBooksError)
    }

    function deleteAllBooksResponseFromCache() {

      var httpCache = $cacheFactory.get('$http');
      httpCache.remove('api/books');
    }

    function transformGetBooks(data, headersGetter) {

      var transformed = angular.fromJson(data);

      transformed.forEach(function (currentValue, index, array) {
        currentValue.dateDownloaded = new Date();
      });
      console.log(transformed);
      return transformed;
    }


    function sendResponseData(response) {
      return response.data;
    }

    function sendGetBooksError(response) {
      return $q.reject('error retrieving book(s).Http status:' + response.status + ')');
    }


    /*using shortcut function*/

    function getBookByID(bookID) {
      return $http.get('api/books/' + bookID)
        .then(sendResponseData)
        .catch(sendGetBooksError)
    }

    function updateBook(book) {
      deleteSummaryFromCache();
      deleteAllBooksResponseFromCache();
      return $http({
        method: 'PUT',
        url: 'api/books/' + book.book_id,
        data: book
      })
        .then(updateBookSuccess)
        .catch(updateBookError);
    }

    function updateBookSuccess(response) {
      return 'book update ' + response.config.data.title;
    }

    function updateBookError(response) {
      return $q.reject('error updating book.(Http status: ' + response.status + ')');
    }

    function addBook(newBook) {
      deleteSummaryFromCache();
      deleteAllBooksResponseFromCache();
      return $http({
        method: 'POST',
        url: 'api/books',
        data: newBook,
        transformRequest: transformPostRequest
      })
        .then(addBookSuccess)
        .catch(addBookError);
    }

    function transformPostRequest(data, headersGetter) {
      data.newBook = true;
      console.log(data);
      return JSON.stringify(data);
    }


    function addBookSuccess(response) {
      return 'book added: ' + response.config.data.title;
    }

    function addBookError(response) {
      return $q.reject('error adding book. (HTTP status: ' + response.status + ')');
    }

    function deleteBook(bookID) {
      deleteSummaryFromCache();
      deleteAllBooksResponseFromCache();
      return $http({
        method: 'DELETE',
        url: 'api/books/' + bookID
      })
        .then(deleteBookSuccess)
        .catch(deleteBookError);
    }

    function deleteBookSuccess(response) {
      return 'book deleted';
    }

    function deleteBookError(response) {
      return $q.reject('error deleting book.(HTTP status: ' + response.status + ')');
    }


    function getAllReaders() {
      //logger.output('getting all readers')
      var readersArray = [
        {
          reader_id: 1,
          name: 'daniel',
          weeklyReadingGoal: 210,
          totalMinutesRead: 600
        },
        {
          reader_id: 5,
          name: 'mari',
          weeklyReadingGoal: 290,
          totalMinutesRead: 8600
        }
      ];

      var deferred = $q.defer();

      $timeout(function () {

        var successful = true;
        if (successful) {


          deferred.resolve(readersArray)
        } else {
          deferred.reject('error retrieving books')
        }
      }, 1000);

      return deferred.promise;

    }
  }

  dataService.$inject = ['logger'];
})();