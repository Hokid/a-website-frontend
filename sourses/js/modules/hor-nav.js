;(function(API, $) {

  //TODO:
  // * комменты
  // * оптимизация

  var timerId,
      $items,
      length,
      index,
      dropdown = API.modules.dropdown;

  function getWidthWithMargin($element) {
    var hMargins;

    !($element instanceof $) && ($element = $($element));

    hMargins = parseInt($element.css('margin-left'))
               +
               parseInt($element.css('margin-right'));

    return $element.outerWidth() + hMargins;
  }

  function hideItems(items) {
    var $lastItem,
        $prevItem;

    if(items instanceof $ && items.length) {
      $lastItem = items.last();
      $prevItem = items.first().prev();

      if($lastItem.is('.is-last')) {
        $lastItem.removeClass('is-last');
      }

      items.hide();

      if($prevItem.length) {
        $prevItem.addClass('is-last');
      }

      return items;
    }
  }

  function showItems(items) {
    var $lastItem,
        $prevItem,
        $nextItem;

    if(items instanceof $ && items.length) {
      $lastItem = items.last();
      $prevItem = items.first().prev();

      if($prevItem.length && $prevItem.is('.is-last')) {
        $prevItem.removeClass('is-last');
      }

      items.show();

      if($lastItem.next().length) {
        $lastItem.addClass('is-last');
      }

      return items;
    }
  }

  function run(element) {
    var $horNav = $(element),
        $box = $horNav.find('> .js-hor-nav-box'),
        $toggle = $box.next().find('> .js-dropdown-toggle'),
        $dropdown,
        $boxChildren,
        $currentChild,
        $itemsArray,
        length,
        isLast = false,
        maxWidth,
        boxOuterWidth,
        isToggleHidden,
        toggleOuterWidth,
        currentWidth;

    if($box.length === 1 && $toggle.length === 1) {
      maxWidth = $horNav.width();
      boxOuterWidth = getWidthWithMargin($box);
      isToggleHidden = $toggle.css('display') === 'none';

      if(isToggleHidden && (boxOuterWidth < maxWidth)){
        return;
      }

      toggleOuterWidth = isToggleHidden ? 0 : getWidthWithMargin($toggle);
      currentWidth = boxOuterWidth + toggleOuterWidth;
      $currentChild = $box.find('> .is-last');
      !$currentChild.length && ($currentChild = $box.find('> :last'));
      $itemsArray = $();
      $dropdown = $toggle.next();

      if(currentWidth > maxWidth) {

        isToggleHidden && (currentWidth += getWidthWithMargin($toggle));

        do {
          currentWidth -= getWidthWithMargin($currentChild);
          $itemsArray = $itemsArray.add($currentChild);
          $currentChild = $currentChild.prev();
        } while(currentWidth > maxWidth && $currentChild.length);


        hideItems($itemsArray);
        isToggleHidden && $toggle.show();

        $dropdown.prepend(
          $itemsArray.map(
            function(index, element) {
              return dropdown.createItem($(element).contents().clone()); /* !!! */
            }
          )
        );

      }

      else if(currentWidth < maxWidth) {

        while(!isLast) {

          $currentChild = $currentChild.next();
          currentWidth += getWidthWithMargin($currentChild);

          if($currentChild.is(':last-child')) {

            if(currentWidth - toggleOuterWidth < maxWidth) {
              isLast = true;
            }

            else {
              break;
            }
          }

          if(isLast || currentWidth < maxWidth) {
            $itemsArray = $itemsArray.add($currentChild);
          }
        }

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

  function runHandler() {
    if(length > index) {
      run($items[index++]);
      timerId = setTimeout(runHandler, 0);
    }
    // else {
    //   console.timeEnd('===');
    //   return window.next && window.next();
    // }
  }

  function horNavEventHandler() {
    //console.time('===');
    clearTimeout(timerId);

    $items = $('.js-hor-nav');
    length = $items.length;
    index = 0;

    timerId = setTimeout(runHandler, 250);
  }

  $(horNavEventHandler);
  $(window).resize(horNavEventHandler);

  // window.test = function(time, size) {
  //   var time = time;
  //   var defaultSize = false;
  //   var $cnt = $('#COL');
  //   var size = size;

  //   window.next = function() {
  //     if(defaultSize) {
  //       $cnt.css('width', 'auto');
  //       defaultSize = false;
  //     }
  //     else {
  //       $cnt.css('width', size);
  //       defaultSize = true;
  //     }
  //     --time && horNavEventHandler();
  //   };

  //   horNavEventHandler();
  // }

  // window.next;
  // window.stop = function() {
  //   window.next = undefined;
  // }

})(window.aWebsite, jQuery);
