// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import { Foundation } from './lib/foundation-explicit-pieces';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { GMapsApi } from './lib/gmaps/gmaps-api';

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
  new GMapsApi('AIzaSyAQAtkJofXeJ3J5YQgaOsQ7ZgV5utqDhx8', 'gmaps', {
    zoom: 15,
    center: {
      lat: 48.1008369,
      lng: 13.1491808
    }
  });
});
