'use strict';
import $ from 'jquery';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { Foundation } from './lib/foundation-explicit-pieces';
import { NavHandler } from './lib/nav-handler';
import { GMapsApi } from './lib/maps/gmaps-api';
import { CookieConsentHelper } from './lib/cookie-consent-helper';
import { GalleriaApi } from './lib/gallery/galleria-api';
//import { PhotoSwipeApi } from './lib/gallery/photoswipe-api';

const LazyLoad = require('lazyload/lazyload');
const AOS = require('aos/dist/aos');

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

// lazyloading the pics must be the last thing to do, otherwise the scroll positions will be messed up
let lazyload = null;
SmoothScrollWithLinks.initSessionNavScrollHash('content', () => {
  if (lazyload) {
    //already done
    return;
  }
  console.debug('Lazyload: Init...');
  lazyload = new LazyLoad();
});

/**
 * for external libs it's necessary to initialize them after the script has been executed
 * this is on document ready
 */
$(document).ready(function () {
  // init foundation js
  $(document).foundation();

  // init animate on scroll
  AOS.init({
    disable: 'mobile'
  });

  // FIREFOX/SAFARI MOBILE SCROLL Bugfix with 100vh and navigation bar included in css height
  // force header height to window size (fix for firefox mobile scroll)
  $('#site-header').height($(window).height());

  // init custom apis
  const gmapsApi = new GMapsApi('${NYCMM_ENV_GMAPS_API_KEY}', 'gmapsMap');
  new CookieConsentHelper('${NYCMM_ENV_GOOGLE_TRACKING_ID}');
  new GalleriaApi('galleria');
  new NavHandler(
    'js--nav-dropdown',
    'js--nav-dropdown-icon',
    'js--nav-dropdown-item-section-dropdown',
    'js--nav-dropdown-item-section-dropdown-icon',
    'js--nav-container-sticky',
    'js--nav-back-to-top-container');

  // init gmaps at this point due to the dynamic script append in the api
  gmapsApi.initialize();
});


