'use strict';
import $ from 'jquery';


/**
 * Helper class for responsive website support
 */
class SiteHelper {

  /**
   * if window width is smaller than 600 remove the autoplay attribute from the video
   */
  static disableVideoAutoplayOnMobile() {
    if (this.queryOnMobileDevice()) {
      const $headerVideo = $('.js--header-video');
      if ($headerVideo.length) {
        $headerVideo.hide();
      }
    }
  }

  /**
   * query if window width is smaller than 992
   * @returns true if smaller otherwise false
   */
  static queryOnMobileDevice () {
    return $(window).width() < 992;
  }
}

export { SiteHelper };
