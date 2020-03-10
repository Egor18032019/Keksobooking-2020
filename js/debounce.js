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

        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();

