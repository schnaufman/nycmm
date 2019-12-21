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

    e.preventDefault();

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
          // reset scroll position to saved pos, so that we can set the hash in the url
          const topPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.location.hash = link.hash;
          document.documentElement.scrollTop = topPos;
        });
      }

    } else {
      // Follow the link to the specific section if navigation comes from outside page
      window.location.href = link.pathname;
      // store hash in session storage for scroll after page load
      window.sessionStorage.setItem(SmoothScrollWithLinks.navScrollHash, link.hash);
    }

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
   *
   * @param {String} contentId the content id hash (string WITHOUT the HASH sign) to scroll to when its not the landing page.
   * @param {Function} callback after scrolling is done this function will be called
   */
  static initSessionNavScrollHash(contentId, callback) {
    if (document.readyState === 'complete') {
      console.debug('SmoothScrollWithLinks: Page already loaded.')
      this._scrollToLocationHash(contentId);
    } else {
      console.debug('SmoothScrollWithLinks: Page still loading, attaching handlers...')
      // handle scroll event
      $(window).on('scroll', SmoothScrollWithLinks._onUserScroll);

      //scroll to location if this has been passed with location.hash
      $(window).on('load', SmoothScrollWithLinks._scrollToLocationHash.bind(null, contentId, callback));
    }
  }

  static _onUserScroll() {
    // only if the session storage is filled user cancels scroll
    if (window.sessionStorage.getItem(SmoothScrollWithLinks.navScrollHash)) {
      console.debug('SmoothScrollWithLinks: Nav scroll cancelled by user scroll. Cancelling...')
      navScrollCancelled = true;
    }

    try {
      $(window).off('scroll', SmoothScrollWithLinks._onUserScroll);
    } catch (error) {
      console.error('SmoothScrollWithLinks: ' + error);
    }
  }

  static _scrollToLocationHash(contentId, callback) {
    let navScrollHash;

    if (window.location && window.location.hash) {
      navScrollHash = window.location.hash;
    } else {
      navScrollHash = window.sessionStorage.getItem(SmoothScrollWithLinks.navScrollHash);
    }

    if (navScrollCancelled) {
      // return on nav scroll cancelled
      console.debug('SmoothScrollWithLinks: Scroll cancelled');
      if (typeof callback === 'function') {
        callback();
      }
      return;
    }

    if (navScrollHash && window.location) {
      console.debug('SmoothScrollWithLinks: Scroll to location hash.')
      SmoothScrollWithLinks.scrollToLoc(navScrollHash, {
        animationDuration: 1000,
        animationEasing: 'swing',
        threshold: 50,
        offset: 0
      }, () => {
        // reset scroll position to saved pos, so that we can set the hash in the url
        const topPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.location.hash = navScrollHash;
        document.documentElement.scrollTop = topPos;
        window.sessionStorage.removeItem(SmoothScrollWithLinks.navScrollHash);
        if (typeof callback === 'function') {
          callback();
        }
      });

      try {
        $(window).off('scroll', SmoothScrollWithLinks._onUserScroll);
      } catch (error) {
        console.error('SmoothScrollWithLinks: ' + error);
      }
      // in case of navigation to a page which is not the landing page, we autoscroll to the content
    } else if (window.location.pathname !== '/' && window.location.pathname !== '/en/') {
      SmoothScrollWithLinks.scrollToLoc('#' + contentId, {
        animationDuration: 1000,
        animationEasing: 'swing',
        threshold: 50,
        offset: 0
      }, callback);
    } else {
      if (typeof callback === 'function') {
        callback();
      }
    }
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
    console.debug('SmoothScrollWithLinks: scrolling to pos: ' + scrollPos);

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
