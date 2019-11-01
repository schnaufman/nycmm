import $ from 'jquery';
import { GetYoDigits } from 'foundation-sites/js/foundation.core.utils';
import { Plugin } from 'foundation-sites/js/foundation.core.plugin';

let navScrollCancelled = false;

/**
 * SmoothScrollWithLinks to navigate to link before scrolling
 */
class SmoothScrollWithLinks extends Plugin {

  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, SmoothScrollWithLinks.defaults, this.$element.data(), options);
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
          // update location hash after scrolling
          window.location.hash = '#';
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
      window.location.href = link.pathname;
      // store hash in session storage for scroll after page load
      window.sessionStorage.setItem(SmoothScrollWithLinks.navScrollHash, link.hash);
    }

    e.preventDefault();
  }

  /**
   * Scroll back to top of the page
   *
   * @param {Object} options  - scroll options
   * @param {Function} callback - callbackfunction after scrolling
   */
  static scrollToTop(options = SmoothScrollWithLinks.defaults, callback) {
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
   * Register window events to scroll to passed link hash from session storage
   * This will be used to scroll to a specific link hash after page loading cause
   * jumping with window.location.href will fuck up the location position.
   */
  static initSessionNavScrollHash() {
    // handle scroll event
    $(window).on('scroll', () => {

      // only if the session storage is filled user cancels scroll
      if (window.sessionStorage.getItem(SmoothScrollWithLinks.navScrollHash)) {
        console.debug('SmoothScrollWithLinks: Nav scroll cancelled by user scroll')
        navScrollCancelled = true;
      }

      $(window).off('scroll');
    });

    //scroll to location if this has been passed with location.hash
    window.onload = () => {
      let navScrollHash;

      if(window.location && window.location.hash) {
        navScrollHash = window.location.hash;
      } else {
        navScrollHash = window.sessionStorage.getItem(SmoothScrollWithLinks.navScrollHash);
      }

      if (navScrollHash && !navScrollCancelled && window.location) {
        console.debug('SmoothScrollWithLinks: Page is fully loaded - scroll to location.')
        SmoothScrollWithLinks.scrollToLoc(navScrollHash, {
          animationDuration: 200,
          animationEasing: 'swing',
          threshold: 50,
          offset: -25
        }, () => {
          window.location.hash = navScrollHash;
          window.sessionStorage.removeItem(SmoothScrollWithLinks.navScrollHash);
        });
        $(window).off('scroll');
      }
    };
  }

  /**
   * Function to scroll to a given location on the page.
   * @param {String} loc - A properly formatted jQuery id selector. Example: '#foo'
   * @param {Object} options - The options to use.
   * @param {Function} callback - The callback function.
   * @static
   * @function
   */
  static scrollToLoc(loc, options = SmoothScrollWithLinks.defaults, callback) {
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

SmoothScrollWithLinks.navScrollHash = 'navScrollHash';

/**
 * Default settings for plugin.
 */
SmoothScrollWithLinks.defaults = {
  /**
   * Amount of time, in ms, the animated scrolling should take between locations.
   * @option
   * @type {number}
   * @default 500
   */
  animationDuration: 500,
  /**
   * Animation style to use when scrolling between locations. Can be `'swing'` or `'linear'`.
   * @option
   * @type {string}
   * @default 'linear'
   * @see {@link https://api.jquery.com/animate|Jquery animate}
   */
  animationEasing: 'linear',
  /**
   * Number of pixels to use as a marker for location changes.
   * @option
   * @type {number}
   * @default 50
   */
  threshold: 50,
  /**
   * Number of pixels to offset the scroll of the page on item click if using a sticky nav bar.
   * @option
   * @type {number}
   * @default 0
   */
  offset: 0
}

export { SmoothScrollWithLinks }
