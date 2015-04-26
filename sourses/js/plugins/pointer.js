;(function($){

  function inHeader(toggle) {
    return Boolean($(toggle).closest(".header,.l-header").length);
  }

  function navEventHandler(e, data) {
    if(data.context !== document || !inHeader(data.toggle)) return;

    if(e.namespace === "open") {
      $(data.toggle).parent().addClass("pointer");
    }

    else if(e.namespace === "close") {
      $(data.toggle).parent().removeClass("pointer");
    }
  }

  $(document).on("dropdown.open dropdown.close",  navEventHandler);

})(jQuery);
