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
// --? Дима, почему получаються 8 массивов с одинкоыми данными 7?
// тут пишем переменную которая содержит в себе кол-во обьявлений(по заданию их 8)
var numberOfAds = 8;
// тут пишем массив который создается из функции getAdList в зависимости от numberOfAds
var cards = getAdList(numberOfAds);
// тут ищем класс для открытия карты
var mapFaded = document.querySelector('.map');
// удаляем его если находим
if (mapFaded) {
  mapFaded.classList.remove('map--faded');
}

// тут ищем ДОМ элемент куда будем добавлять метку(F12 и там посмотрел)
var mapPins = document.querySelector('.map__pins');

// тут ищем шаблон метки и в ней разметку метки
var similarMapPin = document.querySelector('#pin').content.querySelector('.map__pin');

var pinWidth = document.querySelector('.map__pin').offsetWidth;
var pinHeight = document.querySelector('.map__pin').offsetHeight;

// тут пришем функцию которая в зависимости от данных из массива cards создаёт метку(1)
var createAdMapElement = function (unitGetAdList) {
  // тут копируем шаблон
  var adMapElement = similarMapPin.cloneNode(true);
  // тут подставляем данные из элемента(обьекта) массива adList/cards
  adMapElement.style.left = unitGetAdList.location.x + pinWidth / 2;
  adMapElement.style.top = unitGetAdList.location.y + pinHeight / 2;
  // это координты из массива + половина метки
  // тут в шаблоне ищем  Альтернативный текст: alt="{{заголовок объявления}}"
  adMapElement.querySelectorAll('img').item(0).alt = unitGetAdList.offer.title;
  adMapElement.querySelectorAll('img').item(0).src = unitGetAdList.author.avatar;
  // это src="{{author.avatar}}"
  // -? Дима, правильно ли Я написал изменние пути к рисунку ??
  return adMapElement;
};

// тут пишем функцию которрая в зависимости от длины массива создаёт метки и циклом накидывает фрагменты
var renderAdMapPins = function (arrAd) {
  // тут создаем переменую fragment которая в содает в document е любой DOM элемент - но он еще не отрисован
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrAd.length; i++) {
    fragment.appendChild(createAdMapElement(arrAd[i]));
    //  а тут в fragment циклом накидиваем детей от функции renderWizard с параметром wizards[i]
  }
  // тут к mapPins подкидываем детей
  mapPins.appendChild(fragment);
};

renderAdMapPins(cards);

