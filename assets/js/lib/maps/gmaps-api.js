'use strict';
import $ from 'jquery';

/**
 * encapsulation for gmaps api access
 */
class GMapsApi {

  /**
   * Construct GMapsApi
   *
   * @param {String} apiKey google Maps API Key
   * @param {String} elementId DOM element ID of the maps element
   * @param {Object} gMapsOptions google Maps options
   * (see https://developers.google.com/maps/documentation/javascript/adding-a-google-map#map)
   */
  constructor(apiKey, elementId, gMapsOptions) {
    //properties
    this.apiKey = apiKey;
    this.elementId = elementId;
    this.gMapsOptions = gMapsOptions;

    // we make a new Promise -> we promise a initialization of the google Maps API
    this.gMapsInitPromise = new Promise(
      // the executor function is called with the ability to resolve or reject the promise
      (resolve, reject) => {
        console.debug('GMapsApi: Started promise for initialization');
        window.gMapsCallback = function () {
          resolve('Callback promise fulfilled.');
        }

        try {
          // dynamically add script element to dom
          this._addGMapsApiDomContent();
        } catch (error) {
          reject(error);
        }
      }
    );

    this.gMapsInitPromise.then(value => {
      console.debug('GMapsApi: ' + value);

      this._initialize();
    }).catch(reason => {
      console.error('GMapsApi: Promise failed: ' + reason);
    });
  }

  /**
   * initialize gmaps with given options
   */
  _initialize() {
    const $gmaps = $('#' + this.elementId);
    let gMapsClient = null;

    // element present
    if ($gmaps.length > 0) {
      console.debug('GMapsApi: Found \'#' + this.elementId + '\' element in document.');
      console.debug('GMapsApi: initializing...');

      // eslint-disable-next-line no-undef
      gMapsClient = new google.maps.Map($gmaps.get(0), this.gMapsOptions);

      console.debug('GmapsApi: Element \'#' + this.elementId + '\' successfully initialized');
    } else {
      console.error('GmapsApi: Element \'#' + this.elementId + '\' couldn\'t be found in document.');
    }
    return gMapsClient;
  }

  /**
   * dynamically add GMapsApi by creating script element in DOM
   * see https://developers.google.com/maps/documentation/javascript/adding-a-google-map
   */
  _addGMapsApiDomContent() {
    console.debug('GMapsApi: adding dom content.');

    // get language element from html
    let lang = $('html').attr('lang');
    if (!lang) {
      lang = 'en';
    }
    console.debug('GMapsApi: selected language: \'' + lang + '\'');

    // create script element
    const domScript = document.createElement('script');
    domScript.type = 'text/javascript';
    domScript.src = 'https://maps.googleapis.com/maps/api/js?callback=gMapsCallback&key=' + this.apiKey + '&language=' + lang;
    $('head').append(domScript);
  }
}

export { GMapsApi };
