'use strict';

var getRandomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// это фиксированные значения обьктов
var typeRandom = ['palace', 'flat', 'house', 'bungalo'];
var checkoutRandom = ['12:00', '13:00', '14:00'];
var checkinRandom = ['12:00', '13:00', '14:00'];
var featuresRandom = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosRandom = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// тут пишем рандомную функцию которая будет случайно выбирать элемент из любого массивва
var getRandomElement = function (arr) {
  if (arr) {
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

// тут пишем переменую которая должна определять размеры блока в котором в котором перетаскивается метка.
var maxWidth = document.querySelector('.map__pins').offsetWidth;
// --? Почемуто всегда даёт цифру 980.. ,,??

//  тут пишем функцию которая в зависимости от введеного числа создаёт такое же количество обьектов в массиве.
var getAdList = function (number) {
  // тут обьявим пустой массив в который  - будем толкать элементы
  var adList = [];
  for (var i = 0; i < number; i++) {
    adList[i] = {
      author: {
        avatar: avatarRandom
      },
      // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}}
      // это число от 1 до 8 с ведущим нулём.
      // Например, 01, 02 и т. д. Адреса изображений не повторяются


      location: {
        x: getRandomInt(130, maxWidth),
        y: getRandomInt(130, 630)
        // "x": случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
        // --? 130 для x взял от балды или 0 поставит ?
        // "y": случайное число, координата y метки на карте от 130 до 630.
      },

      offer: {
        title: 'Что сюда написать ?  массив с которого будут дергаться в случайном порядке элементы ?',
        // строка, заголовок предложения
        address: location.x + ' , ' + location.y,
        // --? поучему он не подтаскивает значения с соседненго обьекта ? location цпециально выше положил ?
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
  }
  return adList;
};
getAdList(8);
console.log(getAdList(8));
// тут ищем класс для открытия карты
var mapFaded = document.querySelector('.map');
// удаляем его если находим
if (mapFaded) {
  mapFaded.classList.remove('map--faded');
}


// тут ищем шаблон метки и в ней разметку метки
var similarMapPin = document.querySelector('#pin').content.querySelector('.map__pin');

// тут копируем шаблон
var adMapElement = similarMapPin.cloneNode(true);
// Координаты:
// style="left: {{location.x + смещение по X}}px;
// top: {{location.y + смещение по Y}}px;"
adMapElement.style.left = '30px';
adMapElement.style.top = "50px"
// тут в шаблоне ищем  Альтернативный текст: alt="{{заголовок объявления}}"
adMapElement.querySelectorAll('img').item(0).alt = getAdList(8)[1].offer.title;
// src="{{author.avatar}}"
adMapElement.querySelectorAll('img').item(0).src = getAdList(8)[2].author.avatar;

console.log(adMapElement);
console.log(adMapElement.querySelectorAll('img').item(0).src);
console.log(adMapElement.style.left)

// тут создаём дом элементы заполненые из getAdList


//     На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива.
//     Итоговую разметку метки .map__pin можно взять из шаблона #pin.

//     У метки укажите:

//     Координаты: style="left: {{location.x + смещение по X}}px; top: {{location.y + смещение по Y}}px;"

//     Обратите внимание. Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки,
//     а координаты, на которые указывает метка своим острым концом. Чтобы найти эту координату нужно учесть размеры элемента с меткой.

//
// 4 Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
