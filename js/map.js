'use strict';
//  взаимовдейстиве с карточками
(function () {

  var mapBlock = document.querySelector('.map');
  /**
   * блок с классом input[name="price"] в adForm (ценик на жилье)
   */
  /**
   * блок с классом '.ad-form'
   */
  var adForm = document.querySelector('.ad-form');
  var selecTypePrice = adForm.querySelector('input[name="price"]');

  /**
   * функция которая содержит обработчик на закрытие и открытие
   */
  window.exitPopup = function () {
    var mapCard = mapBlock.querySelector('.map__card');
    var popupClose = mapCard.querySelector('.popup__close');
    var closePopup = function () {
      if (mapCard) {
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
})();
