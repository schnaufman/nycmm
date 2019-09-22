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

    // has to be done before initialization of photoswipe
    this._initDOM();
  }

  _initDOM() {
    $(this.initElementId).load('assets/js/lib/gallery/photoswipe-template.html');
  }

}
export { PhotoSwipeApi };
