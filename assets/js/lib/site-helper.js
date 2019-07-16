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
    let screenWidth = $(window).width();
    if (screenWidth < 992) {
      const $headerVideo = $('.js--header-video');
      if ($headerVideo.length) {
        $headerVideo.hide();
      }
    }
  }

  /**
   * fill action attribute of contact FormSpree form
   * also with broken up email to make it more obscure for spambots
   *
   * @param {String} contactFormElementId DOM element ID of the contact form
   * @param {String} mail the email adress without domain and @ (@gmail.com)
   * @param {String} mailDomain the email domain (gmail.com,gmx.at)
   */
  static setFormSpreeContactFormAction(contactFormElementId, mail, mailDomain) {
    const $contactForm = $('#' + contactFormElementId);
    const formSpreePreString = '//formspree.io/';

    // element present
    if ($contactForm.length) {
      $contactForm.attr('action', formSpreePreString + mail + '@' + mailDomain);
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
      if ($map.length) {
        $map.attr('center-to-marker', 'true');
      }
    }
  }
}

export { SiteHelper };
