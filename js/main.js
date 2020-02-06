'use strict';
// это фиксированные значения обьктов
var TYPE_RANDOM = ['palace', 'flat', 'house', 'bungalo'];
var CHECKOUT_RANDOM = ['12:00', '13:00', '14:00'];
var CHECKIN_RANDOM = ['12:00', '13:00', '14:00'];
var FEATURES_RANDOM = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_RANDOM = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// тут пишем переменную которая содержит в себе кол-во обьявлений(по заданию их 8)
var NUMBER_OF_ADS = 8;

// тут ищем шаблон метки и в ней разметку метки
var similarMapPin = document.querySelector('#pin').content.querySelector('.map__pin');

var cardsTemplate = document.querySelector('#card').content.querySelector('.map__card');
// тут ищем шаблон для карточек обьявлений

var mapBlock = document.querySelector('.map');
var mapFiltersContainer = mapBlock.querySelector('.map__filters-container');
// тут ищем блок куда будем вставлять и перед чем будем вставлять

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

var featuresRandomLength = getRandomInt(0, FEATURES_RANDOM.length);
var photosRandomLength = getRandomInt(0, PHOTOS_RANDOM.length);
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

var RandomArrLengthFeatures = getRandomArrLength(featuresRandomLength, FEATURES_RANDOM);
var RandomArrLengthPhotos = getRandomArrLength(photosRandomLength, PHOTOS_RANDOM);
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
 *  тут пишем функцию которая в зависимости от введеного числа создаёт такое же количество обьектов в массиве.
 * @param {number}NUMBER_OF_ADS число необходимых обьектов в массиве
 * @return {arr} возвращает массив с задданым кол-вом обьектов.
 */

var getAdList = function () {
  // тут обьявим пустой массив в который  - будем толкать элементы
  var adList = [];
  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    var maxWidth = document.querySelector('.map__pins').offsetWidth;
    // --? Дима Почемуто всегда даёт цифру 980.. ,,??
    // --? так она всегда 980 внезависимости от размера окна

    // вынес сюда чтобы адрееc считалься
    var coordinateX = getRandomInt(130, maxWidth);
    var coordinateY = getRandomInt(130, 630);
    adList.push({
      author: {
        avatar: 'img/avatars/user' + '0' + getRandomInt(1, 8) + '.png'
        // тут пишем генерацию случайной адрессной строки для ключа avatar
        // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}}
        // это число от 1 до 8 с ведущим нулём.
        // Например, 01, 02 и т. д. Адреса изображений не повторяются
      },
      location: {
        x: coordinateX,
        y: coordinateY
        // "x": случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
        // --? 130 для x взял от балды или 0 поставит ?
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
 * тут пришем функцию которая в зависимости от данных из массива позиционирует метку+ генерирует подписи и аватарки
 * @param {*} unitGetAdList
 * @return {template} возращает склонируемый шаблон с заполнеными координтам+подписями+картинками
 */
var getCreateAdMapElement = function (unitGetAdList) {
  // тут копируем шаблон
  var adMapElement = similarMapPin.cloneNode(true);
  var pinWidth = document.querySelector('.map__pin').offsetWidth;
  var pinHeight = document.querySelector('.map__pin').offsetHeight;
  // тут пишем переменую которая должна определять размеры блока в котором в котором перетаскивается метка.
  var leftX = unitGetAdList.location.x + pinWidth / 2;
  var topY = unitGetAdList.location.y + pinHeight / 2;
  // это координты из массива + половина метки
  adMapElement.style.left = leftX + 'px';
  adMapElement.style.top = topY + 'px';

  var addImgButton = adMapElement.querySelector('img');
  // тут в шаблоне ищем  Альтернативный текст: alt="{{заголовок объявления}}"
  addImgButton.alt = unitGetAdList.offer.title;
  addImgButton.src = unitGetAdList.author.avatar;
  return adMapElement;
};

/**
 * тут пишем функцию которрая в зависимости от длины массива создаёт метки и циклом накидывает фрагменты
 * @param {arr} cardsArr массив обьектов которых надо отрисовать на страницы
 */
var getRenderAdMapPins = function () {
  var fragment = document.createDocumentFragment();
  // тут создаем переменую fragment которая в содает в document е любой DOM элемент - но он еще не отрисован
  // тут пишем массив который создается из функции getAdList в зависимости от numberOfAds
  var cardsArr = getAdList(NUMBER_OF_ADS);
  for (var i = 0; i < cardsArr.length; i++) {
    fragment.appendChild(getCreateAdMapElement(cardsArr[i]));
    //  а тут в fragment циклом накидиваем детей от функции renderWizard с параметром wizards[i]
  }
  // тут ищем ДОМ элемент куда будем добавлять метку(F12 и там посмотрел)
  var mapPins = document.querySelector('.map__pins');
  // тут к mapPins подкидываем детей
  mapPins.appendChild(fragment);
  // тут ищем класс для открытия карты
  var mapFaded = document.querySelector('.map');
  // удаляем его если находим
  if (mapFaded) {
    mapFaded.classList.remove('map--faded');
  }
};

getRenderAdMapPins();

// /////// задание 3.3.
/**
 * фукция вставки массива !! изображений
 * @param {*} adTemplate шаблон
 * @param {*} addElementArray один элемент массива
 * заполняет шаблон нужным кол-вом фоток
 */
var insertPhotos = function (adTemplate, addElementArray) {
  //   В блок .popup__photos выведите все фотографии из списка offer.photos.
  // Каждая из строк массива photos должна записываться как src соответствующего изображения.
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
  // console.log(removeFeatureItem);
  // --? Дима почему этот консоль лог показвает бред ?
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
 * @param {net} так используються фиксированные значения
 * @return {DOM} заполненный DOM элемент данными из сгенерированного массива
 */
var getMapCard = function () {
  var adMapCard = cardsTemplate.cloneNode(true);
  // тут пишем переменую равную первому элементу сгенерированого массив(условие из задания)
  var cardsArrElement = getAdList(NUMBER_OF_ADS)[1];
  if (cardsArrElement.offer.title) {
    adMapCard.querySelector('.popup__title').textContent = cardsArrElement.offer.title;
    //   Выведите заголовок объявления offer.title в заголовок .popup__title.
  }
  if (cardsArrElement.author.avatar) {
    adMapCard.querySelector('.popup__avatar').src = cardsArrElement.author.avatar;
    //   Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
  }
  if (cardsArrElement.offer.price) {
    adMapCard.querySelector('.popup__text--price').textContent = cardsArrElement.offer.price + '₽/ночь';
    //   Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
  }
  if (cardsArrElement.offer.type === 'flat') {
    cardsArrElement.offer.type = 'Квартира';
  } else if (cardsArrElement.offer.type === 'bungalo') {
    cardsArrElement.offer.type = 'Бунгало';
  } else if (cardsArrElement.offer.type === 'house') {
    cardsArrElement.offer.type = 'Дом';
  } else if (cardsArrElement.offer.type === 'palace') {
    cardsArrElement.offer.type = 'Дворец';
  }
  if (cardsArrElement.offer.type) {
    adMapCard.querySelector('.popup__type').textContent = cardsArrElement.offer.type;
    //   В блок .popup__type выведите тип жилья offer.type:
    // Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
  }
  adMapCard.querySelector('.popup__text--address').textContent = cardsArrElement.offer.address;
  //   Выведите адрес offer.address в блок .popup__text--address.
  // console.log(cardsArrElement.offer.address);
  if (cardsArrElement.offer.rooms || cardsArrElement.offer.quests) {
    // ---если будет время = сделать что бы более по правильно писала
    adMapCard.querySelector('.popup__text--capacity').textContent = cardsArrElement.offer.rooms + ' комнаты для ' + cardsArrElement.offer.quests + ' гостей';
    //   Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity
    //  строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей.
  }
  if (cardsArrElement.offer.checkin || cardsArrElement.offer.checkout) {
    adMapCard.querySelector('.popup__text--time').textContent = 'заезд после ' + cardsArrElement.offer.checkin + ' , выезд до  ' + cardsArrElement.offer.checkout + ' гостей';
    //   Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида
    //  Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
  }
  if (cardsArrElement.offer.description) {
    adMapCard.querySelector('.popup__description').textContent = cardsArrElement.offer.description;
    //   В блок .popup__description выведите описание объекта недвижимости offer.description.
  } else {
    adMapCard.querySelector('.popup__description').textContent = null;
  }
  // Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  // --? Дима,  так скрывать надо ??


  // вставка масиива фото
  insertPhotos(adMapCard, cardsArrElement);

  // вставка удобств
  insertFeatures(adMapCard, cardsArrElement);
  //   В список .popup__features выведите все доступные удобства в объявлении.
  return adMapCard;
};

// console.log(getMapCard());

mapBlock.insertBefore(getMapCard(), mapFiltersContainer);
