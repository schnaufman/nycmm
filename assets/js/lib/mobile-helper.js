'use strict';
import $ from 'jquery';


/**
 * Helper class for responsive website support
 */
class MobileHelper {

  /**
   * if window width is smaller than 600 remove the autoplay attribute from the video
   */
  static disableVideoAutoplayOnMobile() {
    let screenWidth = $(window).width();
    if (screenWidth < 600) {
      let $headerVideo = $('.c-header-video video');
      if ($headerVideo.length > 0) {
        $headerVideo.get(0).pause();
        $headerVideo.removeAttr('autoplay');
      }
    }
  }

  /**
   * if window width is smaller than 992 center map to marker
   * @param {String} mapElementId DOM element ID of the map
   */
  static centerMapMarkerOnMobile(mapElementId) {
    let screenWidth = $(window).width();
    if (screenWidth < 992) {
      const $map = $('#' + mapElementId);
      if ($map.length > 0) {
        $map.attr('center-to-marker', 'true');
      }
    }
  }
}

export { MobileHelper };
