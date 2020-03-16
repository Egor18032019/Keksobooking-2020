'use strict';
// создание карточек...................
(function () {
  // тут ищем ДОМ элемент куда будем добавлять метку
  var mapPins = document.querySelector('.map__pins');
  /**
   * шаблон метки c разметкой метки .map__pin
   */
  var similarMapPin = document.querySelector('#pin').content.querySelector('.map__pin');
  var dialogHandler = mapPins.querySelector('.map__pin');
  /**
   * это ширина блока map__pin в котором перетаскивается метка.
   */
  var pinWidth = dialogHandler.offsetWidth;
  /**
   * это высота блока map__pin в котором перетаскивается метка.
   */
  var pinHeight = dialogHandler.offsetHeight;
  var mapBlock = document.querySelector('.map');
  /**
   *  блок с классом '.map__filters-container'
   */
  var mapFiltersContainer = mapBlock.querySelector('.map__filters-container');

  /**
   * шаблон для карточек обьявлений '.map__card'
   */
  var cardsTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
   * фукция вставки массива!! изображений
   * @param {*} adTemplate шаблон
   * @param {*} addElementArray один элемент массива
   * заполняет шаблон нужным кол-вом фоток
   */
  var insertPhotos = function (adTemplate, addElementArray) {
    var removePhotosItem = adTemplate.querySelector('.popup__photos');
    removePhotosItem.innerHTML = ' ';
    // console.log(addElementArray.offer.photos.length);
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
   * @param {Object} card элемент массива cards
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
      adMapCard.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
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
    window.map.exitPopup();
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
  var getCardRenderAdMapPins = function (cards) {
    var fragment = document.createDocumentFragment();
    // тут создаем переменую fragment которая в содает в document е любой DOM элемент - но он еще не отрисован
    // тут пишем массив который создается из функции getAdList в зависимости от numberOfAds
    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(getCreateAdMapElement(cards[i]));
      //  а тут в fragment циклом накидиваем детей от функции renderWizard с параметром wizards[i]
    }
    mapPins.appendChild(fragment);
  };

  window.card = {
    getRenderAdMapPins: getCardRenderAdMapPins
  };
})();
