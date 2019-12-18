'use strict';
import $ from 'jquery';
import { SmoothScrollWithLinks } from './lib/ext/foundation.smoothScrollWithLinks';
import { Foundation } from './lib/foundation-explicit-pieces';
import { NavHandler } from './lib/nav-handler';
import { GMapsApi } from './lib/maps/gmaps-api';
import { CookieConsentHelper } from './lib/cookie-consent-helper';
import { GalleriaApi } from './lib/gallery/galleria-api';
//import { PhotoSwipeApi } from './lib/gallery/photoswipe-api';

//
// Custom JS
// --------------------------------------------------

Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

// scroll to location if passed by session storage
SmoothScrollWithLinks.initSessionNavScrollHash('content');

// init animate on scroll
// eslint-disable-next-line no-undef
AOS.init({
  disable: 'mobile'
});

// initialize custom apis and mobile navigation
$(document).ready(function () {

  // init foundation js
  $(document).foundation();

  // lazyload images
  // eslint-disable-next-line no-undef
  lazyload();

  // map init - currently there's the limitation to have exactly ONE gmapsMap Element in the DOM
  const gmapsApi = new GMapsApi('${NYCMM_ENV_GMAPS_API_KEY}', 'gmapsMap');

  new CookieConsentHelper('${NYCMM_ENV_GOOGLE_TRACKING_ID}');

  new GalleriaApi('galleria');

  // FIREFOX/SAFARI MOBILE SCROLL Bugfix with 100vh and navigation bar included in css height
  // force header height to window size (fix for firefox mobile scroll)
  $('#site-header').height($(window).height());

  new NavHandler(
    'js--nav-dropdown',
    'js--nav-dropdown-icon',
    'js--nav-dropdown-item-section-dropdown',
    'js--nav-dropdown-item-section-dropdown-icon',
    'js--nav-container-sticky',
    'js--nav-back-to-top-container');

  gmapsApi.initialize();
  // when using formspree
  // const contactMailParts = '${NYCMM_ENV_CONTACT_MAIL}'.split('@');
  // const mailAdress = contactMailParts[0];
  // const mailDomain = contactMailParts[1];

  // SiteHelper.setFormSpreeContactFormAction('formSpreeContactForm', mailAdress, mailDomain);
});


