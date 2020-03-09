'use strict';

// устранение мигания
(function () {
  var DEBOUNCE_INTERVAL = 1; // ms

  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        // -? Дима как работает метод apply ? не понял
        // что значит null ?
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();
