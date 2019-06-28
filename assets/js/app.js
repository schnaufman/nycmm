// --------------------------------------------------
// APP.JS
// --------------------------------------------------
'use strict';
import $ from 'jquery';
import { Foundation } from './lib/foundation-explicit-pieces';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { LeafletApi } from './lib/maps/leaflet-api';
import { NavHandler } from './lib/nav-handler';
import { MobileHelper } from './lib/mobile-helper';

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

// init foundation js
$(document).foundation();

// initialize custom apis and mobile navigation
$(function () {
  MobileHelper.centerLeafletMapMarkerOnMobile('leafletMap');

  new LeafletApi('leafletMap');
  new NavHandler('js--dropdown-nav-menu', 'js--dropdown-nav-icon');

  MobileHelper.disableVideoAutoplayOnMobile();
});
