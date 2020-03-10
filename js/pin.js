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

  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingQuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

  var housing = [];

  var Price = {
    LOW: 10000,
    MIDDLE: 50000,
    HIGH: 50000
  };

  var onLoad = function (data) {
    // копируем пришедший массив
    housing = data.slice();
    //  вешаем один обработчик на всю форму
    mapFilters.addEventListener('change', window.debounce(onSortPins));
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
        return cost === 1 || cost < 1;
        // break не работает вместе с return;
      case '2':
        // показывает обьявления где есть две комнаты(где есть одна комната не показывает)
        return cost === 2;
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
   * сортировка по удобствам
   * @param {*} data массив
   * @return {array} отсортированный массив
   */
  var filterFeatures = function (data) {
    // console.log(data);
    /**
     * преобразованный массив удобств из псевдо масива
     * на псевдо массиве не работает every и т.п.
     */
    var inputFeatures = Array.from(housingFeatures.querySelectorAll('input:checked'));

    // массив с удобствами
    var sumFeatures = data.offer.features;
    // возвращает те значения которые удовлетворяют следующим условиям: в data.offer.features (каждого обьекта в массиве data) есть хотя бы одно значения инпута из массива inputFeatures
    // сравниваем каждое значение элемента массива чекнутых инпутов inputFeatures
    // с каждым элементом массива удобств sumFeatures
    return inputFeatures.every(function (inputElement) {
      // every так как проверям ВСЕ ли элементы равны условиям функции(то есть возратят true после выполнения условий функции)
      return sumFeatures.some(function (featuresElement) {
        // some так как проверяем есть ли ОДНО такое значение в массиве значений = и если хоть одно есть то возвращает true

        return featuresElement === inputElement.value;

      });
    });

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

    // чистим то что до этого нарисовали
    var deletePins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    deletePins.forEach(function (pins) {
      pins.remove();
    });

    // ставим ограничения чтобы отрисовывал не больше 5 - согласно ТЗ
    var housingCopyDisplay = housing.filter(function (data) {
      return filterType(data) && filterPriceMiddle(data) && filterRooms(data) && filterGuest(data) && filterFeatures(data);
    });
    /**
     * фильтруем массив должен сработать если элементов больше 5
     */
    var housingCopy = housingCopyDisplay.slice(0, 5);

    // отрисовываем массив
    window.card.getRenderAdMapPins(housingCopy);
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
