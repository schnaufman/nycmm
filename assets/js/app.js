// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import {SmoothScroll} from 'foundation-sites/js/foundation.smoothScroll';
import {Foundation} from './lib/foundation-explicit-pieces';

//
// Custom JS
// --------------------------------------------------


/**
 * SmoothScrollWithLinks to navigate to link before scrolling
 */
class SmoothScrollWithLinks extends SmoothScroll {

  _setup(element, options) {
    this.$element = element;
    this.options = $.extend({}, SmoothScroll.defaults, this.$element.data(), options);
    this.className = 'SmoothScrollWithLinks'; // ie9 back compat

    this._init();
  }

  /**
   * Initializes events for SmoothScroll.
   * @private
   */
  _events() {
    this._linkClickListener = this._handleLinkClick.bind(this);
    this.$element.on('click.smoothScrollWithLinks', 'a[href*="#"]', this._linkClickListener);
  }

  _handleLinkClick(e) {
    var link = e.currentTarget;

    /* Is the link the same as the current location? */
    /* Is the querystring the same as the current location? */
    if (((link.pathname === location.pathname) || ('/' + link.pathname === location.pathname))
      && (link.search === location.search)) {
      this._inTransition = true;
      SmoothScrollWithLinks.scrollToLoc(link.hash, this.options, () => {
        this._inTransition = false;
      });

    } else {
      // Follow the link to the specific section if navigation comes from outside page
      window.location.href = link.href;
    }

    e.preventDefault();
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

    $('html, body').stop(true).animate(
      {scrollTop: scrollPos},
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
    this.$element.off('click.smoothScrollWithLinks', 'a[href*="#"]', this._linkClickListener);
  }
}

Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

//
// Initialize Foundation
// --------------------------------------------------

$(document).foundation();

