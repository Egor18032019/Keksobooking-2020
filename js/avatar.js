// загрузка на клиенте
'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  /**
   * константа размера аватарки
   * равна длине контейнера(avatarPreview) 70 - 2*15 paddingа
   */
  var AVATAR_WIDTH_IMG = 40;

  var AVATAR_HEIGH_IMG = AVATAR_WIDTH_IMG;
  /**
   * константа длины фотографии жилья
   * равна длине контейнера(photoPreview) а падингов в этом случаи нет
   */
  var PHOTO_WIDTH_IMG = 70;
  var PHOTO_HEIGHT_IMG = PHOTO_WIDTH_IMG;
  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');

  /**
   * функция отрисовки на клиенте загружаемой картинки
   * @param {*} fileChooser с чего грузим файлы
   * @param {*} preview контейнер где будет отображаться загруженая картинка
   * @param {*} widthImg длина загружаемой картинки
   * @param {*} heightImg высота загружаемой картики
   */
  var fileReader = function (fileChooser, preview, widthImg, heightImg) {
    // ограничиваем на всякий случай, тем что берем только первый элемент
    var file = fileChooser.files[0];
    // переписываем имя файла маленькими буквами
    var fileName = file.name.toLowerCase();
    // если в массиве FILE_TYPES текущий обрабатываемый элемент массива содержиться в конце fileName то возвратит true
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      // создам новый спец объект FileReader , цель которого читать данные загружаемого файла
      // так  что ли ?
      var reader = new FileReader();
      // и когда на этом неизвесто где существующем обьекте происходит событие загрузки
      // то он делает все дальше по списку
      reader.addEventListener('load', function () {
        // создаем новый файл img - так как иногда в разметки его может  и небыть
        var img = document.createElement('img');
        img.src = reader.result;
        img.width = widthImg;
        img.height = heightImg;
        preview.innerHTML = '';
        preview.appendChild(img);
        // ? ? спросить у Димы про new FileReader() правильно ли я понял его
        // console.log(reader);
      });
      //  переписываем у reader с помощью метода readAsDataURL значение у ключа .result
      //  = равную URL у file загружаемого файла
      reader.readAsDataURL(file);
    }
  };

  avatarFileChooser.addEventListener('change', function () {
    fileReader(avatarFileChooser, avatarPreview, AVATAR_WIDTH_IMG, AVATAR_HEIGH_IMG);
  });

  photoFileChooser.addEventListener('change', function () {
    fileReader(photoFileChooser, photoPreview, PHOTO_WIDTH_IMG, PHOTO_HEIGHT_IMG);
  });

})();
