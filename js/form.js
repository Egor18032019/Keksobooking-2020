'use strict';
(function () {
  /**
   * блок с классом '.ad-form'
   */
  var adForm = document.querySelector('.ad-form');
  /**
   * блок с #room_number лежащий в adForm
   * (комнаты)
   */
  var selectRoom = adForm.querySelector('#room_number');

  /**
   * блок с #capacity лежащий в adForm
   * (гости)
   */
  var selectCapacity = adForm.querySelector('#capacity');

  var elementTIme = adForm.querySelector('.ad-form__element--time');
  var selectCheckIn = elementTIme.querySelector('#timein');
  var selectCheckOut = elementTIme.querySelector('#timeout');
  /**
   * блок с #type лежащий в adForm
   * (тип жилья)
   */
  var selectType = adForm.querySelector('#type');
  /**
   * блок с классом input[name="price"] в adForm (ценик на жилье)
   */
  var selecTypePrice = adForm.querySelector('input[name="price"]');

  /**
   * массив input лежащий в adForm
   */
  var adFormInput = adForm.querySelectorAll('input');
  var adFormSelect = adForm.querySelectorAll('select');

  /**
   * кнопка отправить внутри adForm  с классом ad-form__submit
   */
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  /**
   * массив для подставки данных
   */
  var typeObjPrice = {
    palace: 10000,
    // строка или так ?
    flat: '1000',
    house: '5000',
    bungalo: '0'
  };

  var mapBlock = document.querySelector('.map');
  /**
   * блок с классом '.map__filters' лежащий в mapBlock
   */
  var mapFilters = mapBlock.querySelector('.map__filters');

  /**
   * массив input лежащий в mapFilters
   */
  var mapFiltersInput = mapFilters.querySelectorAll('input');
  var mapFiltersSelect = mapFilters.querySelectorAll('select');

  /**
   * функция принимает массив и каждому добавляет атрибут disabled
   * @param {arr} array масссив которому добовляем атрибут disabled
   */
  var adFormDisabled = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = true;
    }
  };

  /**
   * сравнивает чтобы кол-во комната не превышало кол-во гостей && плюс следит за 100 и не для гостей
   */
  var onRoomSelectChange = function () {
    if (selectRoom.value === '100' && selectCapacity.value !== '0') {
      selectCapacity.setCustomValidity('Пригласите больше гостей');
    } else if (selectCapacity.value === '0' && selectRoom.value !== '100') {
      selectCapacity.setCustomValidity('Зачем вам комнаты , если нет гостей ?');
    } else if (selectRoom.value < selectCapacity.value) {
      selectCapacity.setCustomValidity('Очень много гостей');
    } else {
      selectCapacity.setCustomValidity('');
    }
  };

  var onTypeSelectChange = function () {
    var selectTypeValue = selectType.value;
    selecTypePrice.setAttribute('min', typeObjPrice[selectTypeValue]);
    selecTypePrice.setAttribute('placeholder', typeObjPrice[selectTypeValue]);
  };

  var onCheckinSelectChange = function () {
    selectCheckOut.value = selectCheckIn.value;
  };

  var onCheckoutSelectChange = function () {
    selectCheckIn.value = selectCheckOut.value;
  };

  /**
   * функция принимает массив и каждому убирает атрибут disabled
   * @param {arr} array масссив которому убирает атрибут disabled
   */
  var adFormEnabled = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = false;
    }
  };
  // блокиркуем все инпуты и селекты в двух формах
  adFormDisabled(adFormInput);
  adFormDisabled(adFormSelect);
  adFormDisabled(mapFiltersInput);
  adFormDisabled(mapFiltersSelect);

  adForm.setAttribute('disabled', '');
  mapFilters.setAttribute('disabled', '');

  selecTypePrice.addEventListener('invalid', function () {
    if (selecTypePrice.validity.rangeOverflow) {
      selecTypePrice.setCustomValidity('Это столько не стоит');
    } else {
      selecTypePrice.setCustomValidity('');
    }
  });

  selectRoom.addEventListener('invalid', function () {

    if (selecTypePrice.validity.patternMismatch) {
      selecTypePrice.setCustomValidity('Выберите меньше гостей');
    } else {
      selecTypePrice.setCustomValidity('');
    }
  });


  // вешаем обработчик чтобы реагировать на изменения
  selectCheckIn.addEventListener('change', onCheckinSelectChange);
  selectCheckOut.addEventListener('change', onCheckoutSelectChange);
  selectRoom.addEventListener('change', onRoomSelectChange);
  selectType.addEventListener('change', onTypeSelectChange);
  // обработчик на кнопку отправить, проверяет кол-во гостей и комнат
  adFormSubmit.addEventListener('click', onRoomSelectChange);

  window.form = {
    adFormEnabled: adFormEnabled,
    onRoomSelectChange: onRoomSelectChange
  };

})();
