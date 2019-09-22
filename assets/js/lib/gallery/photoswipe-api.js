'use strict';
import $ from 'jquery';
import { PhotoSwipe } from 'photoswipe/dist/photoswipe';
import { PhotoSwipeUI_Default } from 'photoswipe/dist/photoswipe-ui-default';

/**
 * encapsulation class for photoswipe api
 */
class PhotoSwipeApi {

  /**
   * contruct and intiialize photoswipe api
   *
   * @param {String} initElementId DOM element Id of body element where the pswp html should be loaded into
   */
  constructor(initElementId) {
    this.initElementId = initElementId;

    if ($('#' + this.initElementId).length !== 1) {
      // do nothing if element id is not present in the current document
      // or has been already added
      return;
    }

    // has to be done before initialization of photoswipe
    this._initDOM();
  }

  _initDOM() {
    $('#' + this.initElementId).load('assets/js/lib/gallery/photoswipe-template.html', {}, (response, status, xhr) => {
      if ( status == 'error' ) {
        console.error('PhotoSwipeAPI: error during load of template: ' + xhr.status + ' ' + xhr.statusText);
      } else {
        console.debug('PhotoSwipeAPI: loaded template successfully.');
      }
    });
  }

}
export { PhotoSwipeApi };
