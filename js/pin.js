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
    var cards = window.getAdList(window.NUMBER_OF_ADS);
    window.getRenderAdMapPins(cards);
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
      window.adFormEnabled(adFormInput);
      mapPinMain.removeEventListener('mousedown', mapPinMainActive);
      // убираем обработчик кликов с mapPinMain что бы не плодил обьявления
      window.onRoomSelectChange();

    }
  };

  mapPinMain.addEventListener('mousedown', mapPinMainActive);
  mapPinMain.addEventListener('mousedown', mapPinMainCoordinate);
})();
