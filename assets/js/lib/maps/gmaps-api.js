'use strict';
import $ from 'jquery';
import { SiteHelper } from '../site-helper';

const GMapsMarkerPopupState = {
  alwaysOpened: 'always_opened',
  alwaysClosed: 'always_closed',
  closedOnMobile: 'closed_on_mobile',
  openedOnMobile: 'opened_on_mobile'
};

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

    this.gMapsInitPromise.then((value) => {
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
    if ($gmaps.length) {
      console.debug('GMapsApi: Found \'#' + this.elementId + '\' element in document.');
      console.debug('GMapsApi: initializing...');

      const $lng = $gmaps.attr('lng');
      const $lat = $gmaps.attr('lat');
      const $zoom = $gmaps.attr('zoom');
      const $mobileZoom = $gmaps.attr('mobile-zoom') || $zoom;
      const zoom = SiteHelper.queryOnMobileDevice() ? $mobileZoom  : $zoom;

      if (!$lng || !$lat || !$zoom) {
        console.error('GmapsApi: Please set lat,lng,zoom attribute on \'#' + this.elementId + '\' element in document.');
        return null;
      }

      // eslint-disable-next-line no-undef
      gMapsClient = new google.maps.Map($gmaps.get(0), {
        zoom: Number(zoom),
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

      // create optional marker(s)
      const $lngMarker = $gmaps.attr('lng-marker');
      const $latMarker = $gmaps.attr('lat-marker');
      const $popup = $gmaps.attr('marker-popup');
      const $popupState = $gmaps.attr('marker-popup-state');
      const $title = $gmaps.attr('marker-title');
      const $centerOnMobile = $gmaps.attr('marker-center-on-mobile');
      const $markers = $gmaps.attr('markers');

      let centerToMarker = $centerOnMobile === 'true' ? SiteHelper.queryOnMobileDevice() : false;
      let markerSettings;
      if ($markers) {
        try {
          markerSettings = ($markers && JSON.parse($markers)) || undefined;
        } catch (error) {
          console.error('GmapsApi: Element \'#' + this.elementId + ' unable to parse JSON: ' + $markers);
        }
      } else if ($latMarker && $lngMarker) {
        markerSettings = [
          {
            lat: $latMarker,
            lng: $lngMarker,
            popup: {
              content: $popup,
              state: $popupState
            },
            center: centerToMarker,
            title: $title
          }
        ];
      } else {
        // in this case, no markers where configured
        markerSettings = undefined;
      }

      if (markerSettings) {
        this._createMapMarkers(gMapsClient, markerSettings);
      }

      // this is a fix for the gray box which will appear on reload
      // now map is only displayed when it's initialized
      $gmaps.show();

      console.debug('GmapsApi: Element \'#' + this.elementId + '\' successfully initialized');
    } else {
      console.error('GmapsApi: Element \'#' + this.elementId + '\' couldn\'t be found in document.');
      return null;
    }

    return gMapsClient;
  }

  _createMapMarkers(gMapsClient, markerSettingsArray) {
    markerSettingsArray.forEach((markerSettings) => {
      // eslint-disable-next-line no-undef
      const gmapsMarker = new google.maps.Marker({
        position: {
          lat: Number(markerSettings.lat),
          lng: Number(markerSettings.lng)
        },
        title: markerSettings.title
      });

      if (markerSettings.popup) {
        // eslint-disable-next-line no-undef
        const infowindow = new google.maps.InfoWindow({
          content: markerSettings.popup.content
        });

        let openPopup;
        switch (this._parseGMapsMarkerPopupState(markerSettings.popup.state)) {
          default:
          case GMapsMarkerPopupState.alwaysOpened: {
            openPopup = true;
            break;
          }
          case GMapsMarkerPopupState.alwaysClosed: {
            openPopup = false;
            break;
          }
          case GMapsMarkerPopupState.closedOnMobile: {
            openPopup = !SiteHelper.queryOnMobileDevice();
            break;
          }
          case GMapsMarkerPopupState.openedOnMobile: {
            openPopup = SiteHelper.queryOnMobileDevice();
            break;
          }
        }

        if (openPopup) {
          infowindow.open(gMapsClient, gmapsMarker);
        }

        gmapsMarker.addListener('click', function () {
          infowindow.open(gMapsClient, gmapsMarker);
        });
      }

      gmapsMarker.setMap(gMapsClient);

      if (markerSettings.center) {
        const latLng = gmapsMarker.getPosition(); // returns LatLng object
        gMapsClient.setCenter(latLng); // setCenter takes a LatLng object
      }
    });
  }

  _parseGMapsMarkerPopupState(state) {
    for (let key in GMapsMarkerPopupState) {
      if (GMapsMarkerPopupState[key] === state) {
        return GMapsMarkerPopupState[key];
      }
    }
    return null;
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
