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
  var PRICE = {
    low: 1000,
    middle: 50000,
    hight: 50000
  };

  var onLoad = function (data) {
    // копируем пришедший массив
    housing = data.slice();
    // при загрузке вешаем два обработчика на измениния цены и типа жилья
    housingType.addEventListener('change', onSortPins);
    housingPrice.addEventListener('change', onSortPins);
    // отрисовываем этот массив с  пришедшими данными
    window.card.getRenderAdMapPins(data);
  };

  var onErrorEscPress = function (ev) {
    if (ev.key === window.ESC_KEY) {
      closeError();
    }
  };

  var mapPins = document.querySelector('.map__pins');

  /**
   * фильтр данных
   */
  var onSortPins = function () {
    var mapCard = mapBlock.querySelector('.map__card');
    if (mapCard) {
      mapCard.classList.add('visually-hidden');
    }
    var filterType = function (data) {
      return data.offer.type === housingType.value;
    };
    // .>??Дима - фильтр почемуто отказываеться работать
    var filterPriceMidle = function (data) {
      // console.log(housingPrice.value);
      // console.log(data.offer.price);
      // console.log(PRICE.housingPrice.value);
      return data.offer.price < PRICE.housingPrice.value;
    };

    var filterPriceHight = function (data) {
      return data.offer.price > PRICE.housingPrice.value;
    };

    var filterPrice = function (data) {
      return filterPriceMidle || filterPriceHight;
    };
    /**
     * фильтруем массив
     */
    var housingCopy = housing.filter(function (data) {

      return filterType(data) && filterPrice;

    });

    // console.log(housingCopy);
    // чистим то что до этого нарисовали
    mapPins.innerHTML = '';
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
