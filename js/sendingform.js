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
   * функция для отрисовки ошибок
   * @param {text} errorMessage
   */
  var onError = function () {
    mainBlock.appendChild(adAlertElement);
    adFormSubmit.disabled = false;
    adFormSubmit.textContent = 'Попробуйте снова';
  };

  var closeError = function () {
    var errorElement = mainBlock.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', closeError);
    }
  };

  var onErrorEscPress = function (ev) {
    if (ev.key === window.ESC_KEY) {
      closeError();
    }
  };
  //  не работает
  var onErrorClick = function (evnt) {
    var errorButton = mainBlock.querySelector('.error__button');
    if (evnt.target === errorButton && evnt.which === 1) {
      closeError();
      // console.log('нажал на кнопку');
    }
  };


  document.addEventListener('keydown', onErrorEscPress);
  document.addEventListener('click', closeError);
  // как на кнопку повесить обработчик ?
  document.addEventListener('click', onErrorClick);

  var resetForm = function () {
    adForm.reset();
    adFormSubmit.textContent = 'Опубликовать';
    adFormSubmit.disabled = false;
  };

  var onSetupFormSubmit = function (evt) {
    var data = new FormData(adForm);
    adFormSubmit.textContent = 'Попытка отправки...';
    adFormSubmit.disabled = true;
    evt.preventDefault();
    window.backend.save(data, resetForm, onError);

  };

  adForm.addEventListener('submit', onSetupFormSubmit);
})();
