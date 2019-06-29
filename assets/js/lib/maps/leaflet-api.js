'use strict';
import $ from 'jquery';
import { createMap } from 'leaflet/src/map/Map';
import { toLatLng } from 'leaflet/src/geo/LatLng';
import { toLatLngBounds } from 'leaflet/src/geo/LatLngBounds';
import { tileLayer } from 'leaflet/src/layer/tile/TileLayer';
import { attribution } from 'leaflet/src/control/Control.Attribution';
import { marker } from 'leaflet/src/layer/marker/Marker';
// !!! necessary due to bindpopup function !!!
//eslint-disable-next-line no-unused-vars
import { popup } from 'leaflet/src/layer/Popup';

/**
 * encapsulation for leaflet maps api access
 */
class LeafletApi {

  /**
   * Construct  LeafletApi
   * @param {String} elementId DOM element ID of the maps element
   */
  constructor(elementId) {
    //properties
    this.elementId = elementId;

    // initialize leaflet
    this.leafletMap = this._initialize();
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
      // console.debug('LeafletApi: Found \'#' + this.elementId + '\' element in document.');
      // console.debug('LeafletApi: initializing...');
      // eslint-disable-next-line no-undef
      leafletClient = createMap($leaflet.get(0), { attributionControl: false });

      const $lng = $leaflet.attr('lng');
      const $lat = $leaflet.attr('lat');
      const $zoom = $leaflet.attr('zoom');
      const $popup = $leaflet.attr('popup');
      const $centerToMarker = $leaflet.attr('center-to-marker');

      if (!$lng || !$lat || !$zoom) {
        console.error('LeafletApi: Please set lat,lng,zoom attribute on \'#' + this.elementId + '\' element in document.');
        return null;
      }

      // eslint-disable-next-line no-undef
      const latlng = toLatLng($lat, $lng);

      /* create tile layer
      {s} means one of the available subdomains
      (used sequentially to help with browser parallel requests per domain limitation;
        subdomain values are specified in options; a, b or c by default, can be omitted)
      {z} — zoom level
      {x} and {y} — tile coordinates.
      {r} can be used to add "@2x" to the URL to load retina tiles.*/
      // console.debug('LeafletApi: Creating tile layers for map...');
      const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const osm = tileLayer(osmUrl, { minZoom: 8, maxZoom: 19, detectRetina: true });

      // setup view, layer
      leafletClient.setView(latlng, $zoom);
      leafletClient.addLayer(osm);

      // add attribution control where users can access openstreetmap within map
      const osmAttrib = `Map data © <a href="https://openstreetmap.org/#map=${$zoom}/${$lat}/${$lng}">OpenStreetMap</a> contributors`;
      const attributionCtrl = attribution({ prefix: false, position: 'bottomleft' });
      attributionCtrl.addAttribution(osmAttrib);
      leafletClient.addControl(attributionCtrl);

      // create optional marker
      const $lngMarker = $leaflet.attr('lng-marker');
      const $latMarker = $leaflet.attr('lat-marker');

      if ($latMarker && $lngMarker) {
        // create marker on current location
        // console.debug('LeafletApi: Creating marker...');
        const latlngMarker = toLatLng($latMarker, $lngMarker);
        const mapMarker = marker(latlngMarker).addTo(leafletClient);

        if ($centerToMarker === 'true') {
          const markerBounds = toLatLngBounds([mapMarker.getLatLng()]);
          leafletClient.fitBounds(markerBounds);
        }

        if ($popup) {
          // console.debug(`LeafletApi: Creating popup '${$popup}'`);
          mapMarker.bindPopup($popup).openPopup();
        }
      }

    }

    return leafletClient;
  }
}

export { LeafletApi };
