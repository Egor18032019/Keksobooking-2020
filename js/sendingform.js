'use strict';
// отправка формы с помощью AJAX

(function () {
  var mainBlock = document.querySelector('main');
  /**
   * блок form
   */
  var adForm = mainBlock.querySelector('.ad-form');

  /**
   * кнопка отправить внутри adForm  с классом ad-form__submit
   */
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  /**
   * ищем шаблон ошибки и клонируем его
   */
  var adAlertElement = document.querySelector('#error').content.cloneNode(true);
  /**
   * шаблон успешной отправки формы
   */
  var adSuccessElement = document.querySelector('#success').content.cloneNode(true);

  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var photoPreview = document.querySelector('.ad-form__photo');

  var onCloseError = function () {
    var errorElement = mainBlock.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', onCloseError);
    }
  };

  var onCloseSuccess = function () {

    var successElement = mainBlock.querySelector('.success');

    if (successElement) {
      mainBlock.removeChild(successElement);
      // successElement.remove();
      document.removeEventListener('keydown', onSuccessEscPress);
      document.removeEventListener('click', onCloseSuccess);
    }
  };

  var onErrorEscPress = function (evt) {
    if (evt.key === window.ESC_KEY) {
      onCloseError();
    }
  };

  var onSuccessEscPress = function (evt) {
    if (evt.key === window.ESC_KEY) {
      onCloseSuccess();
    }
  };
  var mapFilters = document.querySelector('.map__filters');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainAdress = adForm.querySelector('input[name="address"]');
  /**
   * это ширина блока map__pin в котором перетаскивается метка.
   */
  var pinWidth = document.querySelector('.map__pin').offsetWidth;
  /**
   * это высота блока map__pin в котором перетаскивается метка.
   */
  var pinHeight = document.querySelector('.map__pin').offsetHeight;

  var onCoordinateForAdress = function () {
    var mapPinMainLeft = mapPinMain.style.left.substr(0, mapPinMain.style.left.length - 2);
    var mapPinMainTop = mapPinMain.style.top.substr(0, mapPinMain.style.top.length - 2);
    var pinX = Math.floor(+mapPinMainLeft + pinWidth / 2);
    var pinY = Math.floor(+mapPinMainTop + pinHeight);
    mapPinMainAdress.value = pinX + ', ' + pinY;
  };

  var onLoadForm = function () {
    adForm.reset();
    mapFilters.reset();
    avatarPreview.innerHTML = '';
    photoPreview.innerHTML = '';

    mainBlock.appendChild(adSuccessElement);

    adFormSubmit.textContent = 'Опубликовать';
    adFormSubmit.disabled = false;

    onCoordinateForAdress();
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', onCloseSuccess);
  };

  /**
   * функция для отрисовки ошибок
   * @param {text} errorMessage
   */
  var onError = function () {
    mainBlock.appendChild(adAlertElement);
    adFormSubmit.disabled = false;
    adFormSubmit.textContent = 'Попробуйте снова';
    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onCloseError);
    var errorButton = mainBlock.querySelector('.error__button');
    // ставим обработчик на кнопку
    if (errorButton) {
      errorButton.addEventListener('click', onCloseError);
      // а как его снять ? если нет обьекта то обработчика на нем нет?
    }
  };

  var onSetupFormSubmit = function (evt) {
    evt.preventDefault();
    var data = new FormData(adForm);
    adFormSubmit.textContent = 'Попытка отправки...';
    adFormSubmit.disabled = true;
    window.backend.save(data, onLoadForm, onError);

  };

  adForm.addEventListener('submit', onSetupFormSubmit);
})();
