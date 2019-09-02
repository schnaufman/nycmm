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
   * @param {String} googleTrackingId id for google analytics tracking
   */
  constructor(googleTrackingId) {
    this.googleTrackingId = googleTrackingId;
    this.gaLoaded = false;

    this.cookieOptionsInfo = this._createCookiePopupOptions('info');
    // same options as info instead of the intialise function.
    this.cookieOptionsOptOut = {
      ...this._createCookiePopupOptions('opt-out'),
      autoOpen: false,
      layout: 'basic-header',
      content: {
        message: 'Möchten Sie die weitere Verwendung von Cookies und Google Analytics erlauben?',
        dismiss: 'Ja',
        deny: 'Nein',
        link: 'Datenschutzerklärung',
        href: '/datenschutz/',
        header: 'Cookienutzung'
      },
      //eslint-disable-next-line no-unused-vars
      onPopupOpen: function () {
        if (window.cookieconsent.infoPopup) {
          window.cookieconsent.infoPopup.close();
        }
        console.debug('CookieConsentHelper|onInitialise: Initializing Opt-Out.');
      }
    };

    // use popup instead
    //window.cookieconsent.initialise(this.cookieOptions);

    // create popup
    window.cookieconsent.infoPopup = new window.cookieconsent.Popup(this.cookieOptionsInfo);
    window.cookieconsent.optOutPopup = new window.cookieconsent.Popup(this.cookieOptionsOptOut);
  }

  /**
   * generate cookie popup options
   *
   * @param {String} type cookieconsent popup type ('opt-out' or 'info')
   */
  _createCookiePopupOptions(type) {
    const self = this;
    const options = {
      container: document.getElementById('content'),
      palette: {
        popup: {
          background: '#1e262f'
        },
        button: {
          background: '#f4c500'
        }
      },
      theme: 'classic',
      compliance: {
        'info': '<div class="cc-compliance">{{dismiss}}</div>',
        'opt-in': '<div class="cc-compliance cc-highlight">{{dismiss}}{{allow}}</div>',
        'opt-out': '<div class="cc-compliance cc-highlight">{{deny}}{{dismiss}}</div>',
      },
      type: type,
      layouts: {
        'basic-header': '{{header}}{{message}}{{link}}{{compliance}}',
        'info-layout': '{{header}}{{message}}<div style="padding-bottom: 10px">{{link}}{{link_optout}}</div>{{compliance}}'
      },
      elements: {
        link: '<a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a>',
        link_optout: '<a aria-label="opt out" tabindex="1" onclick="javascript:window.cookieconsent.optOutPopup.open();" class="cc-link">{{link_optout}}</a>',
      },
      layout: 'info-layout',
      content: {
        message: 'Wir nutzen Cookies und Google Analytics, um diese Website für Sie so interessant wie möglich zu gestalten. (Sie können diese Entscheidung jederzeit widerrufen)',
        dismiss: 'OK',
        deny: 'Ablehnen',
        link: 'Datenschutzerklärung',
        link_optout: 'Opt-Out',
        href: '/datenschutz/',
        header: 'Cookienutzung'
      },
      revokable: false,
      // hide revokebutton for opt-in
      revokeBtn: '<div class="c-cookie-revoke-disabled"></div>',
      //eslint-disable-next-line no-unused-vars
      onPopupOpen: function () {
        //const type = this.options.type;
        const didConsent = this.hasConsented();
        if (didConsent) {
          // enable cookies
          console.debug('CookieConsentHelper|onInitialise: Enabling cookies.');
          self._loadGA(true);
        } else {
          console.debug('CookieConsentHelper|onInitialise: Cookies are disabled.');
        }
      },
      //eslint-disable-next-line no-unused-vars
      onStatusChange: function (status, chosenBefore) {
        //const type = this.options.type;
        const didConsent = this.hasConsented();
        if (didConsent) {
          console.debug('CookieConsentHelper|onStatusChange: Enabling cookies.');
          // enable cookies
          self._loadGA(true);
        } else {
          console.debug('CookieConsentHelper|onStatusChange: Disabling cookies.');
          self._loadGA(false);
        }
      },
      law: {
        regionalLaw: true
      },
      // disable ipinfo service
      //location: false,
      position: 'bottom-left'
    };

    return options;
  }

  /**
   * load google analytics
   */
  _loadGA(consent) {
    if (!consent && this.gaLoaded) {
      // already loaded - we have to unload ga
      console.debug('CookieConsentHelper|_loadGa: Reloading page to disable cookies.');
      location.reload(); // this will trigger a page reload and unload analytics script
      return;
    }

    // when check tracking is enabled we will check the tracking setting of the browser
    // if the browser blocks the tracking - ga won't be loaded
    if (navigator.doNotTrack == 1 || navigator.doNotTrack == 'yes' || window.doNotTrack == 1 || navigator.msDoNotTrack == 0) {
      console.debug('CookieConsentHelper|_loadGa: Tracking blocked in browser. Cookies will not be enabled.');
      return;
    }

    // if the script has already been loaded there is nothing to do
    if (this.gaLoaded) {
      console.debug('CookieConsentHelper|_loadGa: Analytics script has already been loaded.');
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
