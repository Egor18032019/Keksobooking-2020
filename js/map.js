'use strict';
//  взаимовдейстиве с карточками
(function () {

  var mapBlock = document.querySelector('.map');

  /**
   * блок с классом '.ad-form'
   */
  var adForm = document.querySelector('.ad-form');
  /**
   * блок с классом input[name="price"] в adForm (ценик на жилье)
   */
  var selecTypePrice = adForm.querySelector('input[name="price"]');

  /**
   * функция которая содержит обработчик на закрытие и открытие
   */
  var exitPopup = function () {
    var mapCard = mapBlock.querySelector('.map__card');
    var popupClose = mapCard.querySelector('.popup__close');
    var pins = document.querySelectorAll(".map__pin");

    var closePopup = function () {
      if (mapCard) {
        for (var i = 0; i < pins.length; i++) {
          pins[i].classList.remove('map__pin--active')
        }
        mapCard.classList.add('visually-hidden');
        document.removeEventListener('keydown', onPopupEscPress);
        mapCard.removeEventListener('keydown', onPopupEnterPress);
      }
    };

    var onPopupEnterPress = function (evnt) {
      // для закрытия попапа с клавиатуру если табом дошли до крестика
      if (document.activeElement === popupClose && evnt.key === window.ENTER_KEY) {
        closePopup();
      }
    };

    var onPopupEscPress = function (ev) {
      // если стоит  на цене - то карточку не закрыват
      if (document.activeElement !== selecTypePrice && ev.key === window.ESC_KEY) {
        closePopup();
      }
    };

    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
    mapCard.addEventListener('keydown', onPopupEnterPress);
  };

  window.map = {
    exitPopup: exitPopup
  };
})();
