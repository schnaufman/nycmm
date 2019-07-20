'use strict';
import $ from 'jquery';
import 'cookieconsent/src/cookieconsent'

/**
 * helper class to handle cookie consent question
 */
class CookieConsentHelper {

  /**
   * construct the cookie consent helper
   *
   * @param {boolean} checkTrackEnabled  check if navigator or window disabled tracker, is so we are not adding cookies
   * @param {String} googleTrackingId id for google analytics tracking
   */
  constructor(checkTrackEnabled, googleTrackingId) {
    this.checkTrackEnabled = checkTrackEnabled;
    this.googleTrackingId = googleTrackingId;
    this.gaLoaded = false;

    this._initializeCookieConsent();
  }

  /**
   * Ask the user for cookie consent
   */
  _initializeCookieConsent() {
    const self = this;
    window.cookieconsent.initialise({
      container: document.getElementById('content'),
      palette: {
        popup: {
          background: '#252e39'
        },
        button: {
          background: '#f1d600'
        }
      },
      theme: 'classic',
      type: 'opt-out',
      content: {
        message: 'Wir nutzen Cookies und Google Analytics, um diese Website für Sie so interessant wie möglich zu gestalten. Sind Sie damit einverstanden? (Sie können diese Entscheidung jederzeit widerrufen)',
        deny: 'Ablehnen',
        allow: 'OK, gerne!',
        link: 'Datenschutzerklärung',
        href: 'https://nycmm.netlify.com/datenschutz'
      },
      revokable: true,
      //eslint-disable-next-line no-unused-vars
      onInitialise: function (status) {
        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-out' && didConsent) {
          // enable cookies
          console.debug('CookieConsentHelper|onInitialise: Enabling cookies.');
          self._loadGA(true);
        }
      },
      //eslint-disable-next-line no-unused-vars
      onStatusChange: function (status, chosenBefore) {
        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-out' && didConsent) {
          console.debug('CookieConsentHelper|onStatusChange: Enabling cookie.');
          // enable cookies
          self._loadGA(true);
        } else {
          console.debug('CookieConsentHelper|onStatusChange: Disabling cookies.');
          self._loadGA(false);
        }
      },
      law: {
        regionalLaw: false,
      },
      // disable ipinfo service
      location: false,
      position: 'bottom-left'
    });
  }

  /**
   * load google analytics
   */
  _loadGA(consent) {
    if (!consent) {
      if (this.gaLoaded) {
        // already loaded - we have to unload ga
        console.debug('CookieConsentHelper|_loadGa: Reloading page to disable cookies.');
        location.reload(); // this will trigger a page reload and unload analytics script
      }
      // ga is not loaded - nothin to do - return
      return;
    }

    // when check tracking is enabled we will check the tracking setting of the browser
    // if the browser blocks the tracking - ga won't be loaded
    if (this.checkTrackEnabled === true &&
      (navigator.doNotTrack == 1 || navigator.doNotTrack == 'yes' || window.doNotTrack == 1 || navigator.msDoNotTrack == 0)) {
      console.debug('CookieConsentHelper|_loadGa: Tracking disabled. Cookies will not be enabled.');
      return;
    }

    /* eslint-disable no-undef */
    window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) };
    ga.l = +new Date;
    ga('create', this.googleTrackingId, 'auto');
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview');
    /* eslint-enable no-undef */

    const gascript = document.createElement('script');
    gascript.async = true;
    gascript.src = 'https://www.google-analytics.com/analytics.js';
    $('head').append(gascript);
    this.gaLoaded = true;
  }
}

export { CookieConsentHelper };
