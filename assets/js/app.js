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

// initialize custom apis and mobile navigation
$(function () {
  new LeafletApi('leafletMap');

  // mobile navigation
  $('.js--mobile-nav-icon').click(function () {
    var nav = $('.js--main-nav');
    var icon = $('.js--mobile-nav-icon i');

    nav.slideToggle(200);
    if (icon.hasClass('ion-ios-reorder')) {
      icon.removeClass('ion-ios-reorder');
      icon.addClass('ion-ios-close');
    } else {
      icon.removeClass('ion-ios-close');
      icon.addClass('ion-ios-reorder');
    }
  });
});

