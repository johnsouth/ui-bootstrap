angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, "position") || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    /**
     * Temporarily swap CSS properties in, and perform an operation. Based on jQuery's
     * internal 'jQuery.swap' routine.
     *
     * @param element
     * @param css object containing css property keys and values to swap in
     * @callback operation to perform while the CSS properties are swapped in
     */
    var swapCss = function (element, css, callback) {
      var ret, prop, old = {};
      element = angular.element(element);
      args = Array.prototype.slice.call(arguments, 3);

      for (prop in css) {
        old[prop] = element[0].style[prop];
        element[0].style[prop] = css[prop];
      }

      ret = callback.apply(element, args);

      for (prop in css) {
        element[0].style[prop] = old[prop];
      }

      return ret;
    };

    var swapDisplay = /^(none|table(?!-c[ea]).+)/;
    var cssShow = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    };

    /**
     * Return offsetWidth or offsetHeight of an element.
     */
    var widthOrHeight = function(element, name) {
      if (typeof element === 'string') {
        name = element;
        element = this;
      }
      return element[0][('offset' + name.charAt(0).toUpperCase() + name.substr(1))];
    };

    var service = {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        return {
          width: element.prop('offsetWidth'),
          height: element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: element.prop('offsetWidth'),
          height: element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft  || $document[0].documentElement.scrollLeft)
        };
      }
    };

    angular.forEach(['width', 'height'], function(name) {
      service[name] = function(element, value) {
        element = angular.element(element);
        if (arguments.length > 1) {
          return element.css(name, value);
        }
        if (element[0].offsetWidth === 0 && swapDisplay.test(getStyle(element[0], 'display'))) {
          return swapCss(element, cssShow, widthOrHeight, name);
        }
        return widthOrHeight(element, name);
      };
    });

    return service;
  }]);
