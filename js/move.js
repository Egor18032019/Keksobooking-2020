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
      // делим на 3 для красоты
      var coordinataX = Math.max((pinWidth / 3), Math.min((dialogHandler.offsetLeft - shift.x), (rect.right - pinWidth / 3)));
      // (rect.right - pinWidth / 3 - полосу прокурутки(только я так и не разобалься как ее считать))
      var coordinataY = Math.max((pinHeight / 3), Math.min((dialogHandler.offsetTop - shift.y), (rect.bottom - pinHeight / 3)));
      // --? Дима, как тут заменить dialogHandler переменой =  цель вызова в данном случае dialogHandler? как его вынести ?
      dialogHandler.style.top = coordinataY + 'px';
      dialogHandler.style.left = coordinataX + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      // заполняем адрес при отжатие
      mapPinMainAdress.value = Math.floor((startCoords.x + pinWidth / 2)) + ', ' + Math.floor((startCoords.y + pinHeight / 2));
      // поменял document на setupDialogElement что пин не убегал от мышки  - когда мышка выходит за край
      setupDialogElement.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // обработчик на движение - поменял document на setupDialogElement что пин не убегал от мышки  - когда мышка выходит за край
    setupDialogElement.addEventListener('mousemove', onMouseMove);
    // обработчик на отпускание кнопки
    document.addEventListener('mouseup', onMouseUp);
  };
  // обработчик нажатия
  dialogHandler.addEventListener('mousedown', onMoveMouse);

})();
