;(function(API, $) {

  //TODO:
  // * комменты
  // * добавление скрытых элементов в dropdown
  // * оптимизация

  var timerId;


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
    }
  }

  function horNavEventHandler() {
    var $horNavs = $('.js-hor-nav');

    if($horNavs.length) {
      $horNavs.each(function(index, element) {
        var $horNav = $(element),
            $box = $horNav.find('> .js-hor-nav-box'),
            $toggle = $box.next().find('> .js-dropdown-toggle'),
            $boxChildren,
            $currentChild,
            $itemsArray,
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
            $boxChildren = $box.children();
            $currentChild = $boxChildren.filter('.is-last');
            !$currentChild.length && ($currentChild = $boxChildren.last());
            $itemsArray = $();

            if(currentWidth > maxWidth) {

              isToggleHidden && (currentWidth += getWidthWithMargin($toggle));

              do {
                currentWidth -= getWidthWithMargin($currentChild);
                $itemsArray = $itemsArray.add($currentChild);
                $currentChild = $currentChild.prev();
              } while(currentWidth > maxWidth && $currentChild.length);

              hideItems($itemsArray);
              isToggleHidden && $toggle.show();
            }

            else if(currentWidth < maxWidth && !isToggleHidden) {

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

              isLast && $toggle.hide();
              showItems($itemsArray);
            }
        }
      });
    }
  }

  $(horNavEventHandler);
  $(window).resize(function(){
    clearTimeout(timerId);
    timerId = setTimeout(horNavEventHandler, 250);
  });

})(window.aWebsite, jQuery);
