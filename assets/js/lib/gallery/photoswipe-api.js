'use strict';
import $ from 'jquery';
import { PhotoSwipe } from 'photoswipe/dist/photoswipe';
import { PhotoSwipeUI_Default } from 'photoswipe/dist/photoswipe-ui-default';

/**
 * enable photoswipe on page by setting photoswipe: true in page frontmatter
 * encapsulation class for photoswipe api
 */
class PhotoSwipeApi {

  /**
   * Constructs and intializes PhotoSwipeAPI
   *
   * @param {String} Gallery element class in the DOM
   */
  constructor(galleryElClass) {
    const galleryItems = this._parseThumbnail(galleryElClass);

    console.debug(`PhotoSwipeApi: Parsed thumbnails and created gallery objects: ${galleryItems}`);
  }

  _parseThumbnail(galleryElClass) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    const $thumbElements = $('.' + galleryElClass + ' > figure');

    const items = $thumbElements
      .map(($figureEl) => {
        const $linkEl = $figureEl.children('a').first();
        const itemSize = $linkEl.getAttribute('data-size').split('x');
        const itemHref = $linkEl.getAttribute('href');

        // thumbnail element
        const $linkImgEl = $linkEl.children('img').first();
        const itemThumbnailUrl = $linkImgEl ? $linkImgEl.getAttribute('src') : null;

        // item title
        const $figcaptionEl = $figureEl.children('figcaption').first();
        const itemTitle = $figcaptionEl ? $figcaptionEl.getHtml() : null;

        //create slide object
        return {
          src: itemHref,
          w: parseInt(itemSize[0], 10),
          h: parseInt(itemSize[1], 10),
          title: itemTitle,
          msrc: itemThumbnailUrl,
          el: $figureEl
        }
      })
      .get();
    return items;
  }

}
export { PhotoSwipeApi };
