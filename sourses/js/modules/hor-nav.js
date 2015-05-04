/**
 * -------------------------------------
 * Горизонтальная навигаци
 * с подстраиванием под ширину экрана.
 * -------------------------------------
 */

/**
 * -----------------------------------
 * |1                                |
 * |  ----------------- ------------ |
 * | |2               | | 4        | |
 * | | --------       | |          | |
 * | | | 3    |       | ------------ |
 * | | --------       |              |
 * | |________________|              |
 * |                                 |
 * |_________________________________|
 *
 *
 *
 *  [1] - контейнер соответствующий селектору `.js-hor-nav`.
 *        Значения свойства `white-space` у этого контейнера равно `nowrap`,
 *        т.е. инлайновым элементам запрещается переноситься на новую строку.
 *
 *  [2] - контейнер типа inline-block, в котором содержатся item(s).
 *
 *  [3] - элементы навигации item. На данный момент предполагается,
 *        что item(s) это inline-block.
 *
 *  [4] - контейнер типа inline-block и относительным позиционированием.
 *      Он предназначен для dropdown и прилагающегося к нему toggle.
 *
 *
 *
 *  Описание действий:
 *
 *    1. Вычисляется ширина контента контейнера [1] - (w1).
 *
 *    2. Вычисляется ширина контейнера [2], включающаяя margin, border,
 *       padding - (w2).
 *
 *    3. Проверяется скрыт ли контейнер [4].
 *
 *    4. Если действие в п.3 дало отрицительный результат(false),
 *       то вычисляется ширина контейнера [4], включающая margin, border,
 *       padding - (w3). В противном случае (w3 = 0).
 *
 *    4. Вычисляется общая ширина потомков контейнера [1] - (w4 = w2 + w3).
 *
 *    5. Если (w4 > w1), то определяется необходимое кол-во item(s),
 *       которые надо скрыть, чтобы удовлетворить выражению (w1 >= w4).
 *
 *    6. Если (w4 < w1), то определяется необходимое кол-во item(s),
 *       которые надо показать, и при этом удовлетворить выражению (w1 >= w4).
 *
 *  !!! Это краткое описание, здесь опущены детали, такие как учет видимости
 *  контейнера [4] в п. 5-6. и т.п. Эти действия выполняются функцией `run`
 *
 */

;(function(API, $) {

  var timerId,
      $items,
      length,
      index,
      dropdown = API.modules.dropdown;



  /**
   * --------------------------------
   *             Реализация
   * --------------------------------
   */

  /**
   * Получить ширину элемента вместе с полями(margin).
   *
   * @param  {jObject, element} $element
   * @return {int, undefined}
   *  * undefined если $element не является или не содержит element.
   */

  function getWidthWithMargin($element) {
    var lMargin,
        rMargin;

    if(!($element instanceof $)) {
      $element = $($element);
    }

    if(!$element.length) {
      return undefined;
    }

    lMargin = parseInt($element.css('margin-left'))
    rMargin  = parseInt($element.css('margin-right'));

    isNaN(lMargin) && (lMargin = 0);
    isNaN(rMargin) && (rMargin = 0);

    return $element.outerWidth() + lMargin + rMargin;
  }

  /**
   * Скрывает элементы и ставить указатель 'is-last'
   * на последний видимый элемент(исключая случай когда скрывается даже
   * тот элемент, который соответствует селектору ':first-child').
   * Если всё прошло успосшно, то функция должна вернуть скрытые элементы.
   *
   * @param  {jObject} $items
   * @return {jObject, undefined}
   */

  function hideItems($items) {

    var $lastItem,
        $prevItem;

    if($items instanceof $ && $items.length) {
      $lastItem = $items.last();
      $prevItem = $items.first().prev();

      if($lastItem.is('.is-last')) {
        $lastItem.removeClass('is-last');
      }

      $items.hide();

      if($prevItem.length) {
        $prevItem.addClass('is-last');
      }

      return $items;
    }
  }

  /**
   * Показывает элементы и ставить указатель 'is-last'
   * на последний видимый элемент(исключая случай когда показывается даже
   * тот элемент, который соответствует селектору ':last-child').
   * Если всё прошло успосшно, то функция должна вернуть показанные элементы.
   *
   * @param  {jObject} $items
   * @return {jObject, undefined}
   */

  function showItems($items) {

    var $lastItem,
        $prevItem,
        $nextItem;

    if($items instanceof $ && $items.length) {
      $lastItem = $items.last();
      $prevItem = $items.first().prev();

      if($prevItem.length && $prevItem.is('.is-last')) {
        $prevItem.removeClass('is-last');
      }

      $items.show();

      if($lastItem.next().length) {
        $lastItem.addClass('is-last');
      }

      return $items;
    }
  }

  /**
   * Функция выполняет все необходимые расчеты и действия, описаные вначале.
   * Принимает в качестве параметра element соответствующий селектору
   * '.js-hor-nav'.
   *
   * @param  {element} element
   * @return {undefined}
   */

  function run(element) {

    var $horNav = $(element),
        $box = $horNav.find('> .js-hor-nav-box'),
        $toggle = $box.next().find('> .js-dropdown-toggle'),
        $dropdown,
        $currentItem,
        $itemsArray,
        length,
        isLast = false,
        maxWidth,
        boxWidth,
        isToggleHidden,
        toggleWidth,
        currentWidth;



    if(!($box.length - $toggle.length)) {

      maxWidth = $horNav.width();
      boxWidth = getWidthWithMargin($box);

      isToggleHidden = $toggle.css('display') === 'none';
      if(isToggleHidden && (boxWidth < maxWidth)){
        return;
      }

      toggleWidth = isToggleHidden ? 0 : getWidthWithMargin($toggle);
      currentWidth = boxWidth + toggleWidth;

      $currentItem = $box.find('> .is-last');
      if(!$currentItem.length) {
        $currentItem = $box.find('> :last');
      }

      $itemsArray = $();
      $dropdown = $toggle.next();



      if(currentWidth > maxWidth) {

        if(isToggleHidden) {
          currentWidth += getWidthWithMargin($toggle);
        }

        do {
          currentWidth -= getWidthWithMargin($currentItem);
          $itemsArray = $itemsArray.add($currentItem);
          $currentItem = $currentItem.prev();
        } while(currentWidth > maxWidth && $currentItem.length);

        hideItems($itemsArray);

        if(isToggleHidden) {
          $toggle.show();
        }

        $dropdown.prepend(
          $itemsArray.map(
            function(index, element) {
              return dropdown.createItem($(element).contents().clone());
            }
          )
        );

      }



      else if(currentWidth < maxWidth) {

        do {

          $currentItem = $currentItem.next();
          currentWidth += getWidthWithMargin($currentItem);

          if($currentItem.is(':last-child')) {
            if(currentWidth - toggleWidth < maxWidth) {
              isLast = true;
              $itemsArray = $itemsArray.add($currentItem);
            }
            break;
          }
          else if(currentWidth < maxWidth) {
            $itemsArray = $itemsArray.add($currentItem);
          }

        } while(currentWidth < maxWidth);

        if(isLast) {
          dropdown.closeAndClearData($dropdown[0]);
          $toggle.hide();
        }

        if(length = $itemsArray.length) {
          showItems($itemsArray);

          while(length--) {
            $dropdown.find('> :first').remove();
          }
        }
      }
    }
  }

  /**
   * Управление запуском функции `run`.
   */

  function runHandler() {
    if(length > index) {
      run($items[index++]);
      timerId = setTimeout(runHandler, 0);
    }
  }

  /**
   * Функция, передаваемая в качестве handler-а события.
   * Останавливает текущую деятельность `runHandler`, затем
   * запускает `runHandler` снова.
   */

  function horNavEventHandler() {
    clearTimeout(timerId);

    $items = $('.js-hor-nav');
    length = $items.length;
    index = 0;

    timerId = setTimeout(runHandler, 250);
  }



  // Делаем обход после загрузки DOM
  $(horNavEventHandler);

  // Ставим обработчик на ресайз
  $(window).resize(horNavEventHandler);

})(window.aWebsite, jQuery);
