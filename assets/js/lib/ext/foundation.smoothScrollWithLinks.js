import $ from 'jquery';
import { GetYoDigits } from 'foundation-sites/js/foundation.core.utils';
import { SmoothScroll } from 'foundation-sites/js/foundation.smoothScroll';

/**
 * SmoothScrollWithLinks to navigate to link before scrolling
 */
class SmoothScrollWithLinks extends SmoothScroll {

  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, SmoothScroll.defaults, this.$element.data(), options);
    this.className = 'SmoothScrollWithLinks'; // ie9 back compat
    this.backToTop = '#backToTop';

    this._init();
  }

  /**
   * Initialize the SmoothScroll plugin
   * @private
   */
  _init() {
    const id = this.$element[0].id || GetYoDigits(6, 'smooth-scroll-with-links');
    this.$element.attr({ id });

    this._events();
  }

  /**
   * Initializes events for SmoothScroll.
   * @private
   */
  _events() {
    this._linkClickListener = this._handleLinkClick.bind(this);
    this.$element.on('click.zf.smoothScrollWithLinks', 'a[href*="#"]', this._linkClickListener);
  }

  _handleLinkClick(e) {
    var link = e.currentTarget;

    /* Is the link the same as the current location? */
    /* Is the querystring the same as the current location? */
    if (((link.pathname === location.pathname) || ('/' + link.pathname === location.pathname))
      && (link.search === location.search)) {
      this._inTransition = true;

      if (link.hash === this.backToTop) {
        SmoothScrollWithLinks.scrollToTop(this.options, () => {
          this._inTransition = false;
        });
      } else {
        SmoothScrollWithLinks.scrollToLoc(link.hash, this.options, () => {
          this._inTransition = false;
          // update location hash after scrolling
          window.location.hash = link.hash;
        });
      }

    } else {
      // Follow the link to the specific section if navigation comes from outside page
      window.location.href = link.href;
    }

    e.preventDefault();
  }

  /**
   * Scroll back to top of the page
   *
   * @param {Object} options  - scroll options
   * @param {Function} callback - callbackfunction after scrolling
   */
  static scrollToTop(options = SmoothScroll.defaults, callback) {
    $('html, body').stop().animate(
      { scrollTop: 0 },
      options.animationDuration,
      options.animationEasing,
      () => {
        if (typeof callback === 'function') {
          callback();
        }
      }
    );
  }

  /**
   * Function to scroll to a given location on the page.
   * @param {String} loc - A properly formatted jQuery id selector. Example: '#foo'
   * @param {Object} options - The options to use.
   * @param {Function} callback - The callback function.
   * @static
   * @function
   */
  static scrollToLoc(loc, options = SmoothScroll.defaults, callback) {
    const $loc = $(loc);

    // Do nothing if target does not exist to prevent errors
    if (!$loc.length) return false;

    var scrollPos = Math.round($loc.offset().top - options.threshold / 2 - options.offset);

    $('html, body').stop().animate(
      { scrollTop: scrollPos },
      options.animationDuration,
      options.animationEasing,
      () => {
        if (typeof callback === 'function') {
          callback();
        }
      }
    );
  }

  /**
   * Destroys the SmoothScroll instance.
   * @function
   */
  _destroy() {
    this.$element.off('click.zf.smoothScrollWithLinks', 'a[href*="#"]', this._linkClickListener);
  }
}

export { SmoothScrollWithLinks }
