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
  // var pinHeight = document.querySelector('.map__pin').offsetHeight;

  var onMoveMouse = function (evt) {
    evt.preventDefault();
    /**
     * начальные координаты нажатия мышки
     */
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    /**
     * получаем обьект - размеров и координат
     */
    var rect = setupDialogElement.getBoundingClientRect();

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      //  тут rect не используем так ресурсоемкий
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordinataX = Math.max(0, Math.min((dialogHandler.offsetLeft - shift.x), (rect.width - pinWidth)));
      var coordinataY = Math.max(130, Math.min((dialogHandler.offsetTop - shift.y), 630));
      // 4.4.Для удобства пользователей значение Y - координаты адреса должно быть ограничено интервалом от 130 до 630.
      dialogHandler.style.top = coordinataY + 'px';

      dialogHandler.style.left = coordinataX + 'px';
      var coordinats = {
        coordinataX: coordinataX,
        coordinataY: coordinataY
      };

      // Определние границ
      if ((dialogHandler.offsetLeft - shift.x) < 0 || (dialogHandler.offsetLeft - shift.x) > (rect.width - pinWidth) || (dialogHandler.offsetTop - shift.y) > 630 || (dialogHandler.offsetTop - shift.y) < 130) {
        // console.log('Stop');
        // при выходе за границу снимаем обработчики на движение и отпускание
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      return coordinats;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      /**
       * координаты с onMouseMove()
       */
      var coordinats = onMouseMove(upEvt);
      // заполняем адрес при отжатие
      mapPinMainAdress.value = Math.floor(coordinats.coordinataX) + ', ' + dialogHandler.style.top.substring(0, 3);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    // обработчик на отпускание кнопки
    document.addEventListener('mouseup', onMouseUp);
  };
  // обработчик нажатия
  dialogHandler.addEventListener('mousedown', onMoveMouse);

})();
