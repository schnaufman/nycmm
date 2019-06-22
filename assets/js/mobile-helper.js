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

  static centerLeafletMapMarkerOnMobile(leafletMapId) {
    let screenWidth = $(window).width();
    if (screenWidth < 600) {
      let $leafletMap = $('#' + leafletMapId);
      if ($leafletMap.length > 0) {
        $leafletMap.attr('center-to-marker', 'true');
      }
    }
  }
}

export { MobileHelper };
