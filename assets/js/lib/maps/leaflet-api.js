'use strict';
import $ from 'jquery';
import L from '../../../vendors/leaflet/leaflet';

/**
 * encapsulation for leaflet maps api access
 */
class LeafletApi {

  /**
   * Construct  LeafletApi
   * @param {String} accessToken access token for mapbox overlay
   * @param {String} elementId DOM element ID of the maps element
   */
  constructor(accessToken, elementId) {
    //properties
    this.accessToken = accessToken;
    this.elementId = elementId;

    // initialize leaflet
    this._initialize();
  }

  /**
   * initialize leaflet with given options
   * https://leafletjs.com/examples/quick-start/
   */
  _initialize() {
    const $leaflet = $('#' + this.elementId);
    let leafletClient = null;

    // element present
    if ($leaflet.length > 0) {
      console.debug('LeafletApi: Found \'#' + this.elementId + '\' element in document.');
      console.debug('LeafletApi: initializing...');
      // eslint-disable-next-line no-undef
      const leafletMap = new L.Map($leaflet.get(0));

      const $lng = $leaflet.attr('lng');
      const $lat = $leaflet.attr('lat');
      const $zoom = $leaflet.attr('zoom');

      if (!$lng || !$lat || !$zoom) {
        console.error('LeafletApi: Please set lat,lng,zoom attribute on \'#' + this.elementId + '\' element in document.');
        return null;
      }

      // eslint-disable-next-line no-undef
      const latlng = L.latLng($lat, $lng);

      // setup view
      leafletMap.setView(latlng, $zoom);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: this.accessToken
      }).addTo(leafletMap);

      L.marker(latlng).addTo(leafletMap);

    } else {
      console.error('LeafletApi: Element \'#' + this.elementId + '\' couldn\'t be found in document.');
    }

    return leafletClient;
  }
}

export { LeafletApi };
