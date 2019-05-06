// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import { Foundation } from './lib/foundation-explicit-pieces';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { GMapsApi } from './lib/maps/gmaps-api';

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
  new GMapsApi('${NYCMM_ENV_GMAPS_API_KEY}', 'gmaps', {
    zoom: 15,
    center: {
      lat: 48.1008369,
      lng: 13.1491808
    }
  });
});
