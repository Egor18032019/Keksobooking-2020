'use strict';

/**
 * это фиксированные значения обьктов
 */
var TYPE_RANDOM = ['palace', 'flat', 'house', 'bungalo'];
var CHECKOUT_RANDOM = ['12:00', '13:00', '14:00'];
var CHECKIN_RANDOM = ['12:00', '13:00', '14:00'];
var FEATURES_RANDOM = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_RANDOM = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
/**
 * переменная которая содержит в себе кол-во обьявлений(по заданию их 8)
 */
var NUMBER_OF_ADS = 8;

/**
 * кнопка 'Escape'
 */
var ESC_KEY = 'Escape';
/**
 * кнопка 'Enter'
 */
var ENTER_KEY = 'Enter';

// тут ищем ДОМ элемент куда будем добавлять метку
var mapPins = document.querySelector('.map__pins');

/**
 * шаблон метки c разметкой метки .map__pin
 */
var similarMapPin = document.querySelector('#pin').content.querySelector('.map__pin');
/**
 * шаблон для карточек обьявлений '.map__card'
 */
var cardsTemplate = document.querySelector('#card').content.querySelector('.map__card');

var mapBlock = document.querySelector('.map');
/**
 *  блок с классом '.map__filters-container'
 */
var mapFiltersContainer = mapBlock.querySelector('.map__filters-container');

/**
 * это ширина блока map__pin в котором перетаскивается метка.
 */
var pinWidth = document.querySelector('.map__pin').offsetWidth;
/**
 * это высота блока map__pin в котором перетаскивается метка.
 */
var pinHeight = document.querySelector('.map__pin').offsetHeight;

/**
 * блок с классом '.ad-form'
 */
var adForm = document.querySelector('.ad-form');
/**
 * массив input лежащий в adForm
 */
var adFormInput = adForm.querySelectorAll('input', 'select');

/**
 * блок с классом '.map__filters' лежащий в mapBlock
 */
var mapFilters = mapBlock.querySelector('.map__filters');

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
 * блок с классом map__pin--main в mapBlock (красный кружок)
 */
var mapPinMain = mapBlock.querySelector('.map__pin--main');

var mapPinMainAdress = adForm.querySelector('input[name="address"]');

/**
 * блок с классом input[name="price"] в adForm (ценик на жилье)
 */
var selecTypePrice = adForm.querySelector('input[name="price"]');


/**
 * массив для подставки данных
 */
var typeObj = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

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


/**
 * генерация случайного числа
 * @param {number} min чистло от
 * @param {number} max максимальное число
 * @return {number} случайное число в диапозоне от мин до max
 */
var getRandomInt = function (min, max) {
  return Math.ceil(min + Math.random() * (max - min));
};

/**
 * тут пишем рандомную функцию которая будет случайно выбирать элемент из любого массивва
 * @param {arr} arr масссив из которого нам нужен случайный элемент
 * @return {randomElement} случайный элемент массива
 */
var getRandomElement = function (arr) {
  if (!arr) {
    return null;
  }
  var random = Math.floor(Math.random() * arr.length);
  return arr[random];
};

/**
 * создаем массив строк случайной длины из ниже предложенных(но в нем могут быть дубликаты)
 * @param {*} RandomLength максимальная длина массива
 * @param {*} RandomArray массив значений
 * @return {arr} массив где возможны дубликаты значений
 */
var getRandomArrLength = function (RandomLength, RandomArray) {
  var randomArrLength = [];
  for (var i = 0; i < RandomLength; i++) {
    randomArrLength.push(getRandomElement(RandomArray));
  }
  return randomArrLength;
};

// создаем случайный массив строк ограниченый максимальной длиной
/**
 * случайный массив строк для списка удобств
 */
var RandomArrLengthFeatures = getRandomArrLength(getRandomInt(0, FEATURES_RANDOM.length), FEATURES_RANDOM);
/**
 *  случайный массив строк для массива с фотками
 */
var RandomArrLengthPhotos = getRandomArrLength(getRandomInt(0, PHOTOS_RANDOM.length), PHOTOS_RANDOM);


/**
 * пишем функцию которая перебирает массив и удаляет одинаковые элементы
 * @param {*} arr
 * @return {arr} массив где нет одинаковых элементов
 */
var getRemoveDuplicates = function (arr) {
  var seen = {};
  var resultUniqueArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (!(arr[i] in seen)) {
      resultUniqueArr.push(arr[i]);
      seen[arr[i]] = true;
    }
  }
  return resultUniqueArr;
};

/**
 * текстовая функция которая составляет нужной длины текст
 * @param {number} needText - кол-во циклов
 * @return {string} выдаёт текст нужной длины
 */
var getDescriptionRandom = function (needText) {
  var text = 'Берите не пожалеете ! Дёшево !! Ни где такое не найдете !!! ';
  return text.substring(0, needText);
};

/**
 *  функция которая в зависимости от NUMBER_OF_ADS создаёт такое же количество обьектов в массиве.
 * @param {number}NUMBER_OF_ADS число необходимых обьектов в массиве
 * @return {arr} возвращает массив с задданым кол-вом обьектов.
 */
var getAdList = function () {
  // тут обьявим пустой массив в который  - будем толкать элементы
  var adList = [];
  for (var i = 1; i <= NUMBER_OF_ADS; i++) {
    var maxWidth = document.querySelector('.map__pins').offsetWidth;
    // вынес сюда чтобы адреc считалься
    var coordinateX = getRandomInt(130, maxWidth);
    var coordinateY = getRandomInt(130, 630);
    adList.push({
      author: {
        avatar: 'img/avatars/user' + '0' + i + '.png'
        // тут пишем генерацию адрессной строки для ключа avatar
      },
      location: {
        x: coordinateX,
        y: coordinateY
        // "x": случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка
        // "y": случайное число, координата y метки на карте от 130 до 630.
      },
      offer: {
        title: 'Что сюда написать ? Массив с которого будут дергаться в случайном порядке элементы ?',
        // строка, заголовок предложения
        address: coordinateX + ' , ' + coordinateY,
        // --? поучему он не подтаскивает значения с соседненго обьекта ? location цпециально выше положил ?
        price: getRandomInt(1000, 1000000),
        // число, стоимость - случайно
        type: getRandomElement(TYPE_RANDOM),
        // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
        rooms: getRandomInt(1, 10),
        // количество комнат - случайно же ?
        quests: getRandomInt(1, 10),
        // количество гостей, которое можно разместить - слчучайно ? максимум сколько ?
        checkin: getRandomElement(CHECKIN_RANDOM),
        // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00 - случайно
        checkout: getRandomElement(CHECKOUT_RANDOM),
        // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
        features: getRemoveDuplicates(RandomArrLengthFeatures),
        // массив строк случайной длины из ниже предложенных:
        // "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
        description: getDescriptionRandom(getRandomInt(21, 58)),
        // строка с описанием
        photos: getRemoveDuplicates(RandomArrLengthPhotos)
        // массив строк случайной длины, содержащий адреса фотографий
        //  "http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
        //   "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
      }
    });
  }
  return adList;
};


/**
 * функция которая в зависимости от данных из массива позиционирует метку+ генерирует подписи и аватарки
 * @param {*} unitGetAdList элемент из массив с которого отрисовываем
 * @return {template} возращает склонируемый шаблон с заполнеными координтам+подписями+картинками
 */
var getCreateAdMapElement = function (unitGetAdList) {
  // тут копируем шаблон
  var adMapElement = similarMapPin.cloneNode(true);
  var leftX = unitGetAdList.location.x + pinWidth / 2;
  var topY = unitGetAdList.location.y + pinHeight / 2;
  var addImgButton = adMapElement.querySelector('img');

  adMapElement.style.left = leftX + 'px';
  adMapElement.style.top = topY + 'px';
  addImgButton.alt = unitGetAdList.offer.title;
  addImgButton.src = unitGetAdList.author.avatar;
  // на скопируемый шаблон вешаем слушатель событий - > который при клике отрисовывает обьявление -
  // согласно элементу массива которым отрисовался этот пин.
  // я незнаю где js хранить информацию с какого элемента он отрисовал этот пин
  // но работает же ))
  adMapElement.addEventListener('click', function () {
    renderCard(unitGetAdList);
  });

  return adMapElement;
};

/**
 * функция которая в зависимости от длины массива создаёт метки и циклом накидывает фрагменты
 * @param {arr} cards массив обьектов которых надо отрисовать на страницы
 * и возращает новыем ДОМ элементы
 */
var getRenderAdMapPins = function (cards) {
  var fragment = document.createDocumentFragment();
  // тут создаем переменую fragment которая в содает в document е любой DOM элемент - но он еще не отрисован
  // тут пишем массив который создается из функции getAdList в зависимости от numberOfAds
  for (var e = 0; e < cards.length; e++) {
    fragment.appendChild(getCreateAdMapElement(cards[e]));
    //  а тут в fragment циклом накидиваем детей от функции renderWizard с параметром wizards[i]
  }

  mapPins.appendChild(fragment);
};

/**
 * фукция вставки массива!! изображений
 * @param {*} adTemplate шаблон
 * @param {*} addElementArray один элемент массива
 * заполняет шаблон нужным кол-вом фоток
 */
var insertPhotos = function (adTemplate, addElementArray) {
  var removePhotosItem = adTemplate.querySelector('.popup__photos');
  removePhotosItem.innerHTML = ' ';
  if (addElementArray.offer.photos) {
    for (var j = 0; j < addElementArray.offer.photos.length; j++) {
      var addPhotosItem = new Image(45, 40);
      addPhotosItem.classList.add('popup__photo');
      addPhotosItem.src = addElementArray.offer.photos[j];
      removePhotosItem.appendChild(addPhotosItem);
    }
  }
};

/**
 * фунция для вставки удобств в шаблон
 * @param {*} adTemplate шаблон
 * @param {*} addElementArray один элемент массива
 * заполняет шаблон списком удобств из одного элемента массива
 */
var insertFeatures = function (adTemplate, addElementArray) {
  var removeFeatureItem = adTemplate.querySelector('.popup__features');
  removeFeatureItem.innerHTML = ' ';
  if (addElementArray.offer.features) {
    for (var i = 0; i < addElementArray.offer.features.length; i++) {
      var addFeatureItem = document.createElement('li');
      addFeatureItem.classList.add('popup__feature');
      addFeatureItem.classList.add('popup__feature--' + addElementArray.offer.features[i]);
      removeFeatureItem.appendChild(addFeatureItem);
    }
  }
};

/**
 * тут пишем функцию которая будт принимать ОДИН элемент массива и из него подставлять данные
 * в карточку обьявления
 * @param {Object} card так используються фиксированные значения
 * @return {DOM} заполненный DOM элемент данными из сгенерированного массива
 */
var getMapCard = function (card) {
  /**
   * склонированыый шаблон для карточек обьявлений от cardsTemplate
   */
  var adMapCard = cardsTemplate.cloneNode(true);
  if (card.offer.title) {
    adMapCard.querySelector('.popup__title').textContent = card.offer.title;
  }
  if (card.author.avatar) {
    adMapCard.querySelector('.popup__avatar').src = card.author.avatar;
  }
  if (card.offer.price) {
    adMapCard.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  }

  adMapCard.querySelector('.popup__type').textContent = typeObj[card.offer.type];
  // Запомнить что строку надо брать в квадратные скобки. через точку не работает
  // Квадратные скобки также позволяют обратиться к свойству, имя которого может быть результатом выражения.
  adMapCard.querySelector('.popup__text--address').textContent = card.offer.address;
  if (card.offer.rooms || card.offer.quests) {
    adMapCard.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.quests + ' гостей';
  }
  if (card.offer.checkin || card.offer.checkout) {
    adMapCard.querySelector('.popup__text--time').textContent = 'заезд после ' + card.offer.checkin + ' , выезд до  ' + card.offer.checkout + ' гостей';
  }

  adMapCard.querySelector('.popup__description').textContent = card.offer.description;

  // вставка масива фото
  insertPhotos(adMapCard, card);

  // вставка удобств
  insertFeatures(adMapCard, card);

  return adMapCard;
};

/**
 * пишем единую фунцию в которой содержиться
 * открытие карты
 * отрисовка пинов
 */
var init = function () {
  // открываем карту
  mapBlock.classList.remove('map--faded');
  var cards = getAdList(NUMBER_OF_ADS);
  getRenderAdMapPins(cards);
};

/**
 * функция которая отрисовывает обьявление и вставляет его перед mapFiltersContainer
 * @param {arr} card элемент массива
 * и также навешает слушателя событий ESC и Enter
 */
var renderCard = function (card) {
  var mapCard = mapBlock.querySelector('.map__card');
  if (document.contains(mapCard)) {
    mapCard.remove();
  }
  mapBlock.insertBefore(getMapCard(card), mapFiltersContainer);
  exitPopup();
};

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
 * функция принимает массив и каждому убирает атрибут disabled
 * @param {arr} array масссив которому убирает атрибут disabled
 */
var adFormEnabled = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = false;
  }
};

/**
 * взависимости от значение поля кол-во комнат блокирует значение кол-во гостей
 */
var onRoomSelectChange = function () {
  if (selectRoom.value === '1') {
    selectCapacity.options[0].setAttribute('disabled', '');
    selectCapacity.options[1].setAttribute('disabled', '');
    selectCapacity.options[2].removeAttribute('disabled', '');
    selectCapacity.options[3].setAttribute('disabled', '');

  }
  if (selectRoom.value === '2') {
    selectCapacity.options[0].setAttribute('disabled', '');
    selectCapacity.options[1].removeAttribute('disabled', '');
    selectCapacity.options[2].removeAttribute('disabled', '');
    selectCapacity.options[3].setAttribute('disabled', '');
  }
  if (selectRoom.value === '3') {
    selectCapacity.options[0].removeAttribute('disabled', '');
    selectCapacity.options[1].removeAttribute('disabled', '');
    selectCapacity.options[2].removeAttribute('disabled', '');
    selectCapacity.options[3].setAttribute('disabled', '');
  }
  if (selectRoom.value === '100') {
    selectCapacity.options[0].setAttribute('disabled', '');
    selectCapacity.options[1].setAttribute('disabled', '');
    selectCapacity.options[2].setAttribute('disabled', '');
    selectCapacity.options[3].removeAttribute('disabled', '');
  }
};

/**
 * функция которая содержит обработчик на закрытие и открытие
 */
var exitPopup = function () {
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
    if (document.activeElement === popupClose && evnt.key === ENTER_KEY) {
      closePopup();
    }
  };

  var onPopupEscPress = function (ev) {
    if (document.activeElement !== selecTypePrice && ev.key === ESC_KEY) {
      closePopup();
    }
  };

  popupClose.addEventListener('click', function () {
    closePopup();
  });
  document.addEventListener('keydown', onPopupEscPress);
  mapCard.addEventListener('keydown', onPopupEnterPress);
};

/**
 * функция активациия пина
 * @param {*} evt
 */
var mapPinMainActive = function (evt) {
  if (evt.which === 1) {
    adForm.classList.remove('ad-form--disabled');
    adForm.removeAttribute('disabled', '');
    mapFilters.removeAttribute('disabled');
    init();
    adFormEnabled(adFormInput);
    mapPinMain.removeEventListener('mousedown', mapPinMainActive);
    // убираем обработчик кликов с mapPinMain что бы не плодил обьявления
    onRoomSelectChange();
  }
};

/**
 * функция отрисовки координат пина
 * @param {*} evt
 */
var mapPinMainCoordinate = function (evt) {
  if (evt.which === 1) {
    var pinX = Math.floor(evt.pageX + pinWidth / 2);
    var pinY = Math.floor(evt.pageY + pinHeight / 2);
    mapPinMainAdress.value = pinX + ', ' + pinY;
    mapPinMainAdress.setAttribute('readonly', '');
    mapPinMain.removeEventListener('mousedown', mapPinMainCoordinate);
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

adFormDisabled(adFormInput);
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
  // console.log(selectRoom);
  // console.log('ошибка');
  // --? Дима что тут использовать чтобы была ошибка неправилльного выбора ?
  if (selecTypePrice.validity.patternMismatch) {
    selecTypePrice.setCustomValidity('Выберите меньше гостей');
  } else {
    selecTypePrice.setCustomValidity('');
  }
});
// вешаем обработчик чтобы реагировать на изменения
mapPinMain.addEventListener('mousedown', mapPinMainActive);
mapPinMain.addEventListener('mousedown', mapPinMainCoordinate);
selectCheckIn.addEventListener('change', onCheckinSelectChange);
selectCheckOut.addEventListener('change', onCheckoutSelectChange);
selectRoom.addEventListener('change', onRoomSelectChange);
// --?? как бороться с этим . выбираешь 3 комнтаы ставишь 3 гостей - потом выбираешь 1 комнату 3 гостя остаеться
selectType.addEventListener('change', onTypeSelectChange);


// !фильтровать их и уточнять подробную информацию о них, показывая для каждого из объявлений карточку.
// !!записать в горячии клавиши  console.log()
