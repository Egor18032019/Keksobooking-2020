'use strict';
(function () {
  var mapBlock = document.querySelector('.map');
  /**
   * блок с классом map__pin--main в mapBlock (красный кружок)
   */
  var mapPinMain = mapBlock.querySelector('.map__pin--main');
  /**
   * блок с классом '.ad-form'
   */
  var adForm = document.querySelector('.ad-form');
  /**
   * массив input лежащий в adForm
   */
  var adFormInput = adForm.querySelectorAll('input', 'select');
  /**
   * блок с классом '.map__filters' лежащий в mapBlock
   */
  var mapFilters = mapBlock.querySelector('.map__filters');

  /**
   * переменная для записи координат
   */
  var mapPinMainAdress = adForm.querySelector('input[name="address"]');
  /**
   * это ширина блока map__pin в котором перетаскивается метка.
   */
  var pinWidth = document.querySelector('.map__pin').offsetWidth;
  /**
   * это высота блока map__pin в котором перетаскивается метка.
   */
  var pinHeight = document.querySelector('.map__pin').offsetHeight;

  var mapPins = document.querySelector('.map__pins');

  /**
   * пишем единую фунцию в которой содержиться
   * открытие карты
   * отрисовка пинов
   */
  var init = function () {
    // открываем карту
    mapBlock.classList.remove('map--faded');
    window.backend.load(onLoad, onError);
  };

  var mapPinMainCoordinate = function (evt) {
    if (evt.which === 1) {
      var pinX = Math.floor(evt.pageX + pinWidth / 2);
      var pinY = Math.floor(evt.pageY + pinHeight / 2);
      mapPinMainAdress.value = pinX + ', ' + pinY;
      mapPinMainAdress.setAttribute('readonly', '');
      mapPinMain.removeEventListener('mousedown', mapPinMainCoordinate);
    }
  };

  var mapPinMainActive = function (evt) {
    if (evt.which === 1) {
      adForm.classList.remove('ad-form--disabled');
      adForm.removeAttribute('disabled', '');
      mapFilters.removeAttribute('disabled');
      init();
      window.form.adFormEnabled(adFormInput);
      mapPinMain.removeEventListener('mousedown', mapPinMainActive);
      // убираем обработчик кликов с mapPinMain что бы не плодил обьявления
      window.form.onRoomSelectChange();
    }
  };

  var housingType = mapBlock.querySelector('#housing-type');
  var housingPrice = mapBlock.querySelector('#housing-price');
  var housingRooms = mapBlock.querySelector('#housing-rooms');
  var housingQuests = mapBlock.querySelector('#housing-guests');
  var housingFeatures = mapBlock.querySelector('#housing-features');
  /**
   * псевдо массив input-ов удобств
   */
  var inputFeatures = housingFeatures.querySelectorAll('input');

  // var wifiFeatures = housingFeatures.querySelector('#filter-wifi');
  // var dishwasherFeatures = housingFeatures.querySelector('#filter-dishwasher');
  // var parkingFeatures = housingFeatures.querySelector('#filter-parking');
  // var elevatorFeatures = housingFeatures.querySelector('#filter-elevator');
  // var conditionerFeatures = housingFeatures.querySelector('#filter-conditioner');
  // var washerFeatures = housingFeatures.querySelector('#filter-washer');

  var housing = [];

  var Price = {
    LOW: 10000,
    MIDDLE: 50000,
    HIGH: 50000
  };

  var onLoad = function (data) {
    // копируем пришедший массив
    housing = data.slice();

    // при загрузке вешаем два обработчика на измениния цены и типа жилья
    housingType.addEventListener('change', onSortPins);
    housingPrice.addEventListener('change', onSortPins);
    housingRooms.addEventListener('change', onSortPins);
    housingQuests.addEventListener('change', onSortPins);
    // housingFeatures.addEventListener('click', onSortPins);
    housingFeatures.addEventListener('change', onSortPins);
    // отрисовываем этот массив с  пришедшими данными
    onSortPins();
  };


  var onErrorEscPress = function (ev) {
    if (ev.key === window.ESC_KEY) {
      closeError();
    }
  };

  /**
   * сортировка по типу жилья
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterType = function (data) {
    // если значение поля "Любой тип жилья" то возращает массив без изменений
    if (housingType.value === 'any') {
      return data;
    }
    return data.offer.type === housingType.value;
  };

  /**
   * функция сортировке по цене
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterPriceMiddle = function (data) {
    var it = housingPrice.value;
    var cost = +data.offer.price;
    switch (it) {
      case 'low':
        // if (it === 'low')
        return cost < Price.LOW;
        // break не работает вместе с return;
      case 'high':
        return cost >= Price.HIGH;
        // break;
      case 'middle':
        return cost < Price.HIGH && cost > Price.LOW;
        // break;
      default:
        return data;
        // break;
    }
  };

  /**
   * функция сортировке по кол-ву комнат
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterRooms = function (data) {
    var it = housingRooms.value;
    var cost = +data.offer.rooms;
    switch (it) {
      case '1':
        // if (it === 1)
        return cost <= 1;
        // break не работает вместе с return;
      case '2':
        return cost < 3 && cost > 1;
      case '3':
        return cost >= 3;
      default:
        return data;
    }
  };

  /**
   * функция сортировке по кол-ву гостей
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterGuest = function (data) {
    var it = +housingQuests.value;
    var count = +data.offer.guests;
    switch (it) {
      case 1:
        // if (it === 1)
        return count <= 1;
        // break не работает вместе с return;
      case 2:
        return count < 3;
      case 0:
        return count === 0;
      default:
        return data;
    }
  };
  /**
   * проверяет есть ли искомый элемент в массиве и возвращает булеевое значение
   * @param {*} arr массив
   * @param {*} elem  элемент по которому проверям
   * @return {true} булево значение
   */
  var contains = function (arr, elem) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === elem) {
        return true;
      }
    }
    return false;
  };

  /**
   * сортировка по удобствам
   * @param {*} data массив
   * @return {array} отсортированный массив
   */
  var filterFeatures = function (data) {
    // массив с удобствами
    var sumFeatures = data.offer.features;
    // по псевдомассиву inputFeatures пробегаем циклом и если есть чекнутые элементы
    // то начинаем проверять есть ли значение чекнутого элемента в массиве sumFea
    var fun = function () {
      for (var index = 0; index < inputFeatures.length; index++) {
        if (inputFeatures[index].checked) {
          return contains(sumFeatures, inputFeatures[index].value);
          // sumFeatures.some(inputFeatures[index].value);
        }
      }
      return data;
    };

    return fun();

  };

  /**
   * фильтр данных
   */
  var onSortPins = function () {
    // скрываем открытую карточку обьявдения
    var mapCard = mapBlock.querySelector('.map__card');
    if (mapCard) {
      mapCard.classList.add('visually-hidden');
    }

    /**
     * фильтруем массив должен сработать если элементов больше 5
     */
    var housingCopy = housing.slice(0, 5);

    // console.log(housingCopy);
    // чистим то что до этого нарисовали
    var deletePins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    deletePins.forEach(function (pins) {
      pins.remove();
    });

    // ставим ограничения чтобы отрисовывал не больше 5 - согласно ТЗ
    var housingCopyDisplay = housingCopy.filter(function (data) {
      return filterType(data) && filterPriceMiddle(data) && filterRooms(data) && filterGuest(data) && filterFeatures(data);
    });

    // отрисовываем массив
    window.card.getRenderAdMapPins(housingCopyDisplay);
  };


  var closeError = function () {
    var errorElement = mapBlock.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', closeError);
    }
  };
  /**
   * функция для отрисовки ошибок
   * @param {text} errorMessage
   */
  var onError = function (errorMessage) {
    /**
     * ищем шаблон ошибки и клонируем его
     */
    var adErrorElement = document.querySelector('#error').content.cloneNode(true);
    /**
     * переписываем текст ошибки
     */
    var alertMessage = adErrorElement.querySelector('.error__message');
    alertMessage.textContent = errorMessage;
    mapBlock.appendChild(adErrorElement);
    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', closeError);
  };

  mapPinMain.addEventListener('mousedown', mapPinMainActive);
  mapPinMain.addEventListener('mousedown', mapPinMainCoordinate);

})();
