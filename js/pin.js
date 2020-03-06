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


  var housing = [];

  var Price = {
    low: 10000,
    middle: 50000,
    high: 50000
  };

  var onLoad = function (data) {
    // копируем пришедший массив
    housing = data.slice();
    // ставим ограничения чтобы отрисовывал не больше 5 - согласно ТЗ
    // var displayData = data.slice(0, 5);
    // при загрузке вешаем два обработчика на измениния цены и типа жилья
    housingType.addEventListener('change', onSortPins);
    housingPrice.addEventListener('change', onSortPins);
    // отрисовываем этот массив с  пришедшими данными
    onSortPins();
    // window.card.getRenderAdMapPins(displayData);
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
    // if (it === 'low') {
    //   return cost < Price[it];
    // }
    // if (it === 'high') {
    //   return cost > Price[it];
    // }
    // if (it === 'middle') {
    //   // console.log('это ' + it + ' граница ' + PRICE[it]);
    //   return cost < Price.high && cost > Price.low;
    // }
    // return data;
    //  - ,,,,????? всеравно не работает (((
    switch (it) {
      case 'low':
        // if (it === 'low')
        return cost < Price[it];
        // break;
      case 'high':
        return cost >= Price[it];
        // break;
      case 'middle':
        return cost < Price.high && cost > Price.low;
        // break;
      default:
        return data;
        // break;
    }
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
    var housingCopy = housing.filter(function (data) {
      return filterType(data) && filterPriceMiddle(data);
    });

    // console.log(housingCopy);
    // чистим то что до этого нарисовали
    var deletePins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    deletePins.forEach(function (pins) {
      pins.remove();
    });

    // ставим ограничения чтобы отрисовывал не больше 5 - согласно ТЗ
    var housingCopyDisplay = housingCopy.slice(0, 5);
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
