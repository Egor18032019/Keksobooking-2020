'use strict';
// создание данных..............................
(function () {

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
   * @description  Как так то?
   * функция которая в зависимости от NUMBER_OF_ADS создаёт такое же количество обьектов в массиве.
   * @return {arr} возвращает массив с задданым кол-вом обьектов.
   */
  window.getAdList = function () {

    // тут обьявим пустой массив в который  - будем толкать элементы
    var adList = [];
    for (var i = 1; i <= window.NUMBER_OF_ADS; i++) {
      /**
       *  случайный массив строк для массива с фотками
       */
      var RandomArrLengthPhotos = getRandomArrLength(getRandomInt(0, window.PHOTOS_RANDOM.length), window.PHOTOS_RANDOM);
      /**
       * случайный массив строк для списка удобств
       */
      var RandomArrLengthFeatures = getRandomArrLength(getRandomInt(0, window.FEATURES_RANDOM.length), window.FEATURES_RANDOM);

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
          type: getRandomElement(window.TYPE_RANDOM),
          // строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
          rooms: getRandomInt(1, 10),
          // количество комнат - случайно же ?
          quests: getRandomInt(1, 10),
          // количество гостей, которое можно разместить - слчучайно ? максимум сколько ?
          checkin: getRandomElement(window.CHECKIN_RANDOM),
          // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00 - случайно
          checkout: getRandomElement(window.CHECKOUT_RANDOM),
          // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
          features: getRemoveDuplicates(RandomArrLengthFeatures),
          // массив строк случайной длины из ниже предложенных:
          // "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
          description: getDescriptionRandom(getRandomInt(21, 58)),
          // строка с описанием
          photos: getRemoveDuplicates(RandomArrLengthPhotos)
          // массив строк случайной длины, содержащий адреса фотографий
        }
      });
    }
    return adList;
  };
})();
