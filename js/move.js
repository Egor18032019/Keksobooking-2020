'use strict';
(function () {
  /**
   * переменная содержащая класс .map__pins
   */
  var setupDialogElement = document.querySelector('.map__pins');
  /**
   * переменная в setupDialogElement содержашая класс '.map__pin'
   */
  var dialogHandler = setupDialogElement.querySelector('.map__pin--main');
  /**
   * блок с классом '.ad-form'
   */
  var adForm = document.querySelector('.ad-form');
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
   * граница координат по Y
   */
  var limitY = setupDialogElement.offsetHeight - pinHeight * 3;

  /**
   * граница координат по X
   */
  var limitX = setupDialogElement.offsetWidth - pinWidth / 2;
  var onMoveMouse = function (evt) {
    evt.preventDefault();
    /**
     * начальные координаты нажатия мышки
     */
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      if (moveEvt.clientX < (pinWidth / 2) || moveEvt.clientY < (pinHeight / 2) || moveEvt.clientX > limitX || moveEvt.clientY > limitY) {
        return;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      // --? Дима, как тут заменить dialogHandler переменой =  цель вызова в данном случае dialogHandler?
      dialogHandler.style.top = (dialogHandler.offsetTop - shift.y) + 'px';
      dialogHandler.style.left = (dialogHandler.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      // заполняем адрес при отжатие
      mapPinMainAdress.value = Math.floor((startCoords.x + pinWidth / 2)) + ', ' + Math.floor((startCoords.y + pinHeight / 2));
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // обработчик на движение
    document.addEventListener('mousemove', onMouseMove);
    // обработчик на отпускание кнопки
    document.addEventListener('mouseup', onMouseUp);
  };
  // обработчик нажатия
  dialogHandler.addEventListener('mousedown', onMoveMouse);

})();
