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

  var closeError = function () {
    var errorElement = mainBlock.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', closeError);
    }
  };

  var closeSuccess = function () {
    var successElement = mainBlock.querySelector('.success');
    if (successElement) {
      successElement.remove();
      document.removeEventListener('keydown', onSuccessEscPress);
      document.removeEventListener('click', closeSuccess);
    }
  };

  var onErrorEscPress = function (evt) {
    if (evt.key === window.ESC_KEY) {
      closeError();
    }
  };

  var onSuccessEscPress = function (evt) {
    if (evt.key === window.ESC_KEY) {
      closeSuccess();
    }
  };


  var onLoadForm = function () {
    adForm.reset();
    avatarPreview.removeChild(avatarPreview.firstChild);
    photoPreview.innerHTML = '';

    mainBlock.appendChild(adSuccessElement);
    adFormSubmit.textContent = 'Опубликовать';
    adFormSubmit.disabled = false;
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', closeSuccess);

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
    document.addEventListener('click', closeError);
    var errorButton = mainBlock.querySelector('.error__button');
    // ставим обработчик на кнопку
    if (errorButton) {
      errorButton.addEventListener('click', closeError);
      // а как его снять ? если нет обьекта то обработчика на нем нет?
    }
  };

  var onSetupFormSubmit = function (evt) {
    var data = new FormData(adForm);
    adFormSubmit.textContent = 'Попытка отправки...';
    adFormSubmit.disabled = true;
    evt.preventDefault();
    window.backend.save(data, onLoadForm, onError);

  };

  adForm.addEventListener('submit', onSetupFormSubmit);

  // // --------------- обработчик очистки формы
  // var resetForm = function (evt) {
  //   if (evt.which === 1) {
  //     adForm.reset();
  //     mapFilters.reset();
  //     avatarPreview.removeChild(avatarPreview.firstChild);
  //     photoPreview.innerHTML = '';

  //   }
  // };
  // adFormReset.addEventListener('click', resetForm);

})();
