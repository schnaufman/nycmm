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
   * query if window width is smaller than 992
   * @returns true if smaller otherwise false
   */
  static queryOnMobileDevice () {
    return $(window).width() < 992;
  }
}

export { SiteHelper };
