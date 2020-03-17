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
  var adFormSelect = adForm.querySelectorAll('select');

  /**
   * блок с классом '.map__filters' лежащий в mapBlock
   */
  var mapFilters = mapBlock.querySelector('.map__filters');

  /**
   * массив input лежащий в mapFilters
   */
  var mapFiltersInput = mapFilters.querySelectorAll('input');
  var mapFiltersSelect = mapFilters.querySelectorAll('select');

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

  var mapPinMainActive = function () {

    adForm.classList.remove('ad-form--disabled');
    adForm.removeAttribute('disabled', '');
    mapFilters.removeAttribute('disabled');
    init();
    // разблокируем инпт и селекты в двух форамах
    window.form.adFormEnabled(adFormInput);
    window.form.adFormEnabled(adFormSelect);
    window.form.adFormEnabled(mapFiltersSelect);
    window.form.adFormEnabled(mapFiltersInput);

    mapPinMain.removeEventListener('mousedown', mapPinMainActive);
    // убираем обработчик кликов с mapPinMain что бы не плодил обьявления

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
    // возращает true если
    return data.offer.type === housingType.value || housingType.value === 'any';
  };

  /**
   * функция сортировке по цене
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterPriceMiddle = function (data) {
    var it = housingPrice.value;
    var count = +data.offer.price;
    switch (it) {
      case 'low':
        // if (it === 'low')
        return count < Price.LOW;
        // break не работает вместе с return;
      case 'high':
        return count >= Price.HIGH;
        // break;
      case 'middle':
        return count < Price.HIGH && count > Price.LOW;
        // break;
      default:
        return true;
        // break;
    }
  };

  /**
   * функция сортировке по кол-ву комнат
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterRooms = function (data) {
    var it = +housingRooms.value;
    var count = +data.offer.rooms;
    return it === count || housingRooms.value === 'any';
  };

  /**
   * функция сортировке по кол-ву гостей
   * @param {array} data массив данных
   * @return {array} data отсортированнный массив
   */
  var filterGuest = function (data) {
    var it = +housingQuests.value;
    var count = +data.offer.guests;
    return it === count || housingQuests.value === 'any';
  };

  /**
   * сортировка по удобствам
   * @param {*} data массив
   * @return {array} отсортированный массив
   */
  var filterFeatures = function (data) {
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
    var i = 0;
    var housingCopy = [];
    while (i < housing.length && housingCopy.length < 5) {
      var data = housing[i];
      if (filterType(data) && filterPriceMiddle(data) && filterRooms(data) && filterGuest(data) && filterFeatures(data)) {
        housingCopy.push(data);

      }
      i++;
    }


    // отрисовываем массив
    window.card.getRenderAdMapPins(housingCopy);
  };
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var photoPreview = document.querySelector('.ad-form__photo');

  var adFormReset = adForm.querySelector('.ad-form__reset');

  // --------------- обработчик очистки формы
  var resetForm = function (evt) {
    if (evt.which === 1) {
      adForm.reset();
      mapFilters.reset();
      avatarPreview.removeChild(avatarPreview.firstChild);
      photoPreview.innerHTML = '';
      onSortPins();
    }
  };
  adFormReset.addEventListener('click', resetForm);


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
