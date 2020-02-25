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
    /**
     * узнаем размеры псевдво элемента и приводим его к числу
     */
    var afterDialogHandler = +window.getComputedStyle(dialogHandler, ':after').getPropertyValue('height').substring(0, 2);

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

      // Определние границ
      if ((dialogHandler.offsetLeft - shift.x) < 0 || (dialogHandler.offsetLeft - shift.x) > (rect.width - pinWidth) || (dialogHandler.offsetTop - shift.y) > 630 || (dialogHandler.offsetTop - shift.y) < 130) {
        // pinWidth / 2  - что бы найти середину пина
        mapPinMainAdress.value = Math.floor(dialogHandler.offsetLeft + pinWidth / 2) + ', ' + Math.floor(dialogHandler.offsetTop + pinHeight + afterDialogHandler);

        // при выходе за границу снимаем обработчики на движение и отпускание
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      return;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // заполняем адрес при отжатие
      // pinWidth / 2  - что бы найти середину пина
      mapPinMainAdress.value = Math.floor(dialogHandler.offsetLeft + pinWidth / 2) + ', ' + Math.floor(dialogHandler.offsetTop + pinHeight + afterDialogHandler);

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
