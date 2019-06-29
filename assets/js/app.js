// --------------------------------------------------
// APP.JS
// --------------------------------------------------
'use strict';
import $ from 'jquery';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { Foundation } from './lib/foundation-explicit-pieces';
import { MobileHelper } from './lib/mobile-helper';
import { NavHandler } from './lib/nav-handler';
import { GMapsApi } from './lib/maps/gmaps-api';

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

// init foundation js
$(document).foundation();

// initialize custom apis and mobile navigation
$(function () {
  MobileHelper.centerMapMarkerOnMobile('gmapsMap');

  new GMapsApi('${NYCMM_ENV_GMAPS_API_KEY}', 'gmapsMap');
  new NavHandler('js--dropdown-nav-menu', 'js--dropdown-nav-icon');

  MobileHelper.disableVideoAutoplayOnMobile();
});
