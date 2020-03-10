'use strict';

// устранение мигания
(function () {
  var DEBOUNCE_INTERVAL = 555; // ms

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
// for (var index = 0; index < inputFeatures.length; index++) {
//   if (inputFeatures[index].checked) {
//     return contains(sumFeatures, inputFeatures[index].value);
//   }
// }
// return true;
// };
