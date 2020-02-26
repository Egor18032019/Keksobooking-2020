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
   * фунцкция описывающая поведение указателя мышки
   * @param {target} evt указатель мышки
   */
  var onMoveMouse = function (evt) {
    evt.preventDefault();
    /**
     * получаем обьект - размеров и координат
     */
    var rect = setupDialogElement.getBoundingClientRect();
    /**
     * узнаем размеры псевдоэлемента у dialogHandler  и приводим его к числу
     */
    // var afterDialogHandler = +window.getComputedStyle(dialogHandler, ':after').getPropertyValue('height').substring(0, 2);
    /**
     * функция которая описывает движение мышки
     * @param {target} moveEvt указатель мышки при перемещение
     */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      //  тут rect не используем так ресурсоемкий
      /**
       * считаем координату Х координаты мышки - координаты левой границы окна. при изменение размеров окна значение границы тоже изменяется
       */
      var coordX = moveEvt.clientX - rect.left;
      /**
       * считаем координату Y . не стали использовать pageX так как нам не надо учитывать прокрутку при скролле мышкиы
       */
      var coordY = moveEvt.clientY - rect.top;

      coordX = Math.max(0, Math.min(coordX, rect.width));
      coordY = Math.max(130, Math.min(coordY, 630));
      // 4.4.Для удобства пользователей значение Y - координаты адреса должно быть ограничено интервалом от 130 до 630.
      var coordinataY = coordY - pinHeight;
      // Math.floor что бы не было -1 в строке Адрес
      var coordinataX = coordX - Math.floor(pinWidth / 2);

      dialogHandler.style.top = coordinataY + 'px';
      dialogHandler.style.left = coordinataX + 'px';
      /**
       * считаем координаты конца пина по X = от левого края пина - отнимаем половину ширины пина
      //  */
      // var coordEndX = dialogHandler.offsetLeft + (pinWidth / 2);
      // /**
      //  * координаты конца пина по Y = к координат верха пина прибавлем высоту пина и высоту псевдоэлемента
      //  */
      // var coordEndY = dialogHandler.offsetTop + pinHeight + afterDialogHandler;
      // заполняем адрес при движение
      mapPinMainAdress.value = Math.floor(coordX) + ', ' + Math.floor(coordY);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
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
