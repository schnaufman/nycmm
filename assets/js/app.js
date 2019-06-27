// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import { Foundation } from './lib/foundation-explicit-pieces';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { LeafletApi } from './lib/maps/leaflet-api';
import { NavHandler } from './nav-handler';
import { MobileHelper } from './mobile-helper';

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

// initialize custom apis and mobile navigation
$(function () {
  // cache jQuery object for window.document
  var $document = $(document);

  // init foundation js
  $document.foundation();

  // other stuff
  $document.ready(function () {
    MobileHelper.centerLeafletMapMarkerOnMobile('leafletMap');

    new LeafletApi('leafletMap');
    new NavHandler('js--dropdown-nav-menu', 'js--dropdown-nav-icon');

    MobileHelper.disableVideoAutoplayOnMobile();

  });

});
