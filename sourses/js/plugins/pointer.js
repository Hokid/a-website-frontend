;(function($){

  function isInHeader(toggle) {
    return $(toggle).parents(".header,.l-header").length;
  }

  function navEventHandler(e, data) {
    if(!isInHeader(data.toggle)) return;

    if(e.namespace === "open") {
      $(data.toggle).addClass("pointer");
    }

    else if(e.namespace === "close") {
      $(data.toggle).removeClass("pointer");
    }
  }

  $(document).on("dropdown.open dropdown.close",  navEventHandler);

})(jQuery);
