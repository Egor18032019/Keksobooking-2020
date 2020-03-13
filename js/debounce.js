'use strict';

// устранение мигания
(function () {
  var DEBOUNCE_INTERVAL = 5; // ms

  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      // console.log(parameters);
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        // фунцкция которая пришла в аргументах функции debounce
        // вызываеться на null и принимает значения parametrs равные аргументам функции которая пришла в аргументах debounce.
        // как то так
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();
