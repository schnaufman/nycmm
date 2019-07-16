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

    if (!$('#' + this.elementId).length) {
      // do nothing if element id is not present in the current document
      return;
    }

    // we make a new Promise -> we promise a initialization of the google Maps API
    this.gMapsInitPromise = new Promise(
      // the executor function is called with the ability to resolve or reject the promise
      (resolve, reject) => {
        // console.debug('GMapsApi: Started promise for initialization');
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

    this.gMapsInitPromise.then(() => {
      // console.debug('GMapsApi: ' + value);

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
    if ($gmaps.length) {
      // console.debug('GMapsApi: Found \'#' + this.elementId + '\' element in document.');
      // console.debug('GMapsApi: initializing...');

      const $lng = $gmaps.attr('lng');
      const $lat = $gmaps.attr('lat');
      const $zoom = $gmaps.attr('zoom');

      if (!$lng || !$lat || !$zoom) {
        console.error('GmapsApi: Please set lat,lng,zoom attribute on \'#' + this.elementId + '\' element in document.');
        return null;
      }

      // eslint-disable-next-line no-undef
      gMapsClient = new google.maps.Map($gmaps.get(0), {
        zoom: Number($zoom),
        center: {
          lat: Number($lat),
          lng: Number($lng)
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
          // eslint-disable-next-line no-undef
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          // eslint-disable-next-line no-undef
          position: google.maps.ControlPosition.LEFT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
          // eslint-disable-next-line no-undef
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          // eslint-disable-next-line no-undef
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
      });

      // create optional marker
      const $lngMarker = $gmaps.attr('lng-marker');
      const $latMarker = $gmaps.attr('lat-marker');
      const $popup = $gmaps.attr('popup');
      const $centerToMarker = $gmaps.attr('center-to-marker');

      if ($latMarker && $lngMarker) {
        // eslint-disable-next-line no-undef
        const marker = new google.maps.Marker({
          position: {
            lat: Number($latMarker),
            lng: Number($lngMarker)
          },
          title: 'NYCMM'
        });

        // eslint-disable-next-line no-undef
        const infowindow = new google.maps.InfoWindow({
          content: $popup
        });

        infowindow.open(gMapsClient, marker);

        marker.addListener('click', function () {
          infowindow.open(gMapsClient, marker);
        });

        marker.setMap(gMapsClient);

        if ($centerToMarker === 'true') {
          const latLng = marker.getPosition(); // returns LatLng object
          gMapsClient.setCenter(latLng); // setCenter takes a LatLng object
        }
      }

      // console.debug('GmapsApi: Element \'#' + this.elementId + '\' successfully initialized');
    } else {
      console.error('GmapsApi: Element \'#' + this.elementId + '\' couldn\'t be found in document.');
      return null;
    }

    return gMapsClient;
  }

  /**
   * dynamically add GMapsApi by creating script element in DOM
   * see https://developers.google.com/maps/documentation/javascript/adding-a-google-map
   */
  _addGMapsApiDomContent() {
    // console.debug('GMapsApi: adding dom content.');

    // get language element from html
    let lang = $('html').attr('lang');
    if (!lang) {
      lang = 'en';
    }
    // console.debug('GMapsApi: selected language: \'' + lang + '\'');

    // create script element
    const domScript = document.createElement('script');
    domScript.type = 'text/javascript';
    domScript.src = 'https://maps.googleapis.com/maps/api/js?callback=gMapsCallback&key=' + this.apiKey + '&language=' + lang;
    $('head').append(domScript);
  }
}

export { GMapsApi };
