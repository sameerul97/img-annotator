import $ from "jquery";

var animationPopoverIn = "",
  animationPopoverOut = "";

const Marker = {
  getImageMetric: function (this_image, callback) {
    var image = new Image();

    image.src = $(".imageMarker").find(".target").attr("src");
    image.onload = function () {
      var _width = image.naturalWidth,
        _height = image.naturalHeight,
        _getWidthLess = $(".imageMarker img").width(),
        _setPersenWidth = (_getWidthLess / _width) * 100;

      let data = {
        width: _width,
        height: _height,
        getWidthLess: $(".imageMarker img").width(),
        setPersenWidth: (_getWidthLess / _width) * 100,
        setHeight: (_height * _setPersenWidth) / 100,
      };
      // console.log(data);

      callback(data);
    };
  },

  positionMarkers: function (itemsRef) {
    Marker.getImageMetric($(".imageMarker"), function (imageMetrics) {
      for (let i = 0; i < itemsRef.current.length; i++) {
        try {
          if (itemsRef.current[i] !== null) {
            var markerDataTop =
              (parseFloat(itemsRef.current[i].attributes["data-top"].value) *
                imageMetrics.setPersenWidth) /
              100;
            var markerDataLeft =
              (parseFloat(itemsRef.current[i].attributes["data-left"].value) *
                imageMetrics.setPersenWidth) /
              100;

            itemsRef.current[i].setAttribute("data-x", 0);
            itemsRef.current[i].setAttribute("data-y", 0);

            $(".imageMarker .circle").css("transform", "translate(0px , 0px)");

            $(itemsRef.current[i]).css({
              top: markerDataTop,
              left: markerDataLeft,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  },

  positionPopup: async (position, callback) => {
    Marker.getImageMetric($(".imageMarker"), function (imageMetrics) {
      var markerDataTop =
        (parseInt(position.top) * imageMetrics.setPersenWidth) / 100;
      var markerDataLeft =
        (parseInt(position.left) * imageMetrics.setPersenWidth) / 100;

      callback({
        top: parseInt(markerDataTop),
        left: parseInt(markerDataLeft),
      });
    });
  },

  adjustPopupBoxContainer: function (popupEl, position, callback) {
    Marker.getImageMetric($(".imageMarker"), function (imageMetrics) {
      var markerDataTop =
        (parseFloat(position.top) * imageMetrics.setPersenWidth) / 100;
      var markerDataLeft =
        (parseFloat(position.left) * imageMetrics.setPersenWidth) / 100;

      var popupBox = $("#popup" + popupEl),
        popupBoxArrow = $(popupBox).find(".pointBoxArrow");

      $(popupBoxArrow).find(".pointBoxArrowRight").hide();
      $(popupBoxArrow).find(".pointBoxArrowLeft").hide();

      $(popupBoxArrow).css({ right: "" });
      $(popupBoxArrow).css({ left: "" });

      $(popupBox).css({
        top: "",
        right: "",
        left: "",
      });

      if (window.innerWidth > 768) {
        if (markerDataLeft >= (imageMetrics.getWidthLess / 100) * 58) {
          $(popupBox).css({
            top: markerDataTop / 2,
            right: $(".imageMarker").width() - markerDataLeft + 25,
          });

          $(popupBoxArrow).find(".pointBoxArrowRight").show();
          $(popupBoxArrow).css({ right: -20 });
        } else {
          $(popupBox).css({
            top: markerDataTop / 2,
            left: markerDataLeft,
          });

          $(popupBoxArrow).find(".pointBoxArrowLeft").show();
          $(popupBoxArrow).css({ left: -17 });
        }
      }

      $(popupBoxArrow).css({
        top:
          (parseFloat(position.top) * imageMetrics.setPersenWidth) / 100 / 2 +
          25,
      });
      callback();
    });
  },

  registerOnClick: function (item_points_in_this_product_click) {
    $(item_points_in_this_product_click).each(function (index, toggleItem) {
      $(toggleItem, this).on("click", function (e) {
        e.preventDefault();

        var content = $(this).closest(".item-point").data("popupid"),
          id = $(content);

        id.addClass("d-block");
        id.addClass("showflip");

        var target = $(this).closest(".item-point").data("popupid"),
          idTarget = $(target);

        idTarget.find(".exit").on("click", function (e) {
          e.preventDefault();

          $('[data-popupid="' + target + '"]').removeClass("active");
          idTarget.removeClass(animationPopoverIn);
          idTarget.addClass(animationPopoverOut);
          id.removeClass("d-block");
          id.removeClass("showflip");
          $(idTarget).fadeOut();
        });
      });
    });
  },

  imageMarker: function () {
    $($(".imageMarker")).each(function (index, this_image) {
      var marker_in_this_image = $(this_image).find(".item-point");

      Marker.positionMarkerAndPopup(
        marker_in_this_image,
        this_image,
        function () {
          $(this_image).find(".toggle");
        }
      );
    });
  },
};

export default Marker;
