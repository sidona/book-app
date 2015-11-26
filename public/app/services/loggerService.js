/**
 * Created by sdonose on 11/25/2015.
 */
(function () {
    'use strict';

  angular.module('app')
    .service('logger',BookAppLogger)

 function LoggerBase(){

 }
  LoggerBase.prototype.output=function(message){
    console.log("LoggerBase: "+message)
  }
  function BookAppLogger(){
    LoggerBase.call(this);

    this.logBook=function(book){
      console.log('book '+book.title)
    }
  }

  BookAppLogger.prototype=Object.create(LoggerBase.prototype)

  })();