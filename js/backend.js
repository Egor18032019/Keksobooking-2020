'use strict';
// Получение  данных

(function () {

  var URL = {
    POST: 'https://javascript.pages.academy/keksobooking',
    GET: 'https://javascript.pages.academy/keksobooking/data'
  };


  // Url нужно оформить в виде перчисления.

  var TIMEOUT_IN_MS = 10000;
  /**
   * коды ошибок
   */
  var StatusCode = {
    OK: 200
  };

  var sendRequest = function (onLoad, onError) {
    /**
     * new XMLHttpRequest();
     */
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('При получение произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  };

  var save = function (data, onLoad, onError) {
    var xhr = sendRequest(onLoad, onError);

    xhr.open('POST', URL.POST);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = sendRequest(onLoad, onError);

    xhr.open('GET', URL.GET);
    xhr.send();
  };

  window.backend = {
    load: load,
    save: save
  };

})();
