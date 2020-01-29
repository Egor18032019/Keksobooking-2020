'use strict';

var mapFaded = document.querySelector('.map');
// ищем класс дя открытия карты
if (mapFaded) {
  mapFaded.classList.remove('map--faded');
}
// удаляем его если находим

var similarPin = document.querySelector('#pin').content.querySelector('.map__pin');
// ищем шаблон метки и в ней разметку метки
console.log(similarPin);


var getRandomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// это фиксированные значения обькта
var typeRandom = ['palace', 'flat', 'house', 'bungalo'];
var checkoutRandom = ['12:00', '13:00', '14:00'];
var checkinRandom = ['12:00', '13:00', '14:00'];
var featuresRandom = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosRandom = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// тут пишем рандомную функцию которая будет случайно выбирать элемент из любого массивва
var getRandomElement = function (arr) {
 if(arr) {
  var random = Math.floor(Math.random() * arr.length);
 }
  return arr[random];
};

// тут пишем генерацию случайной адрессной строки для ключа avatar
var avatarRandom = 'img/avatars/user' + '0' + getRandomInt(1, 8) + '.png';

// тут пишем рандомное описание
var getDescriptionRandom = function (skolkoNadoTeksta) {
  var text = ' ';
  var nado = ' Берите не пожалеете ! Дёшево !! Ни где такое не найдете !!! ';
  for (var i = 1; i <= skolkoNadoTeksta; i++) {
    text = text + nado;
  }
  return text;
};

// тут пишем  обьект
var adShablon = {
  author: {
    avatar: avatarRandom
  },
  // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}}
  // это число от 1 до 8 с ведущим нулём.
  // Например, 01, 02 и т. д. Адреса изображений не повторяются


  location: {
    x: location.x,
    y: location.y
  },

  offer: {
    title: 'написать',
    // строка, заголовок предложения
    address: location.x + ', ' + location.y,
    // это из предыдущего обекта
    price: getRandomInt(1000, 1000000),
    // число, стоимость - случайно
    type: getRandomElement(typeRandom),
    // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
    rooms: getRandomInt(1, 10),
    // количество комнат - случайно же ?
    quests: getRandomInt(1, 10),
    // количество гостей, которое можно разместить - слчучайно ? максимум сколько ?
    checkin: getRandomElement(checkinRandom),
    // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00 - случайно
    checkout: getRandomElement(checkoutRandom),
    // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
    features: getRandomElement(featuresRandom),
    // массив строк случайной длины из ниже предложенных:
    // "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
    description: getDescriptionRandom(2),
    // строка с описанием
    photos: getRandomElement(photosRandom)
    // массив строк случайной длины, содержащий адреса фотографий
    //  "http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    //   "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  }
};

console.log(adShablon);
