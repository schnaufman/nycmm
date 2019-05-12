// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import { Foundation } from './lib/foundation-explicit-pieces';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { LeafletApi } from './lib/maps/leaflet-api';

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

//
// Initialize Foundation after document ready
// --------------------------------------------------
$(document).foundation();

// initialize custom apis
$(function () {
  new LeafletApi('leafletMap');
});
