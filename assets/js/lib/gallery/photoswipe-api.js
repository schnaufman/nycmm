'use strict';
import $ from 'jquery';
const PhotoSwipe = require('photoswipe/dist/photoswipe');
const PhotoSwipeUI_Default = require('photoswipe/dist/photoswipe-ui-default');

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
    // loop through all gallery elements and bind events
    const galleryElements = $('.' + galleryElClass);

    for (let i = 0, l = galleryElements.length; i < l; i++) {
      let galleryElement = galleryElements[i];
      $(galleryElement).attr('data-pswp-uid', i + 1);
      galleryElement.onclick = this._onThumbnailsClick.bind(this);
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    const hashData = this._photoSwipeParseHash();
    if (hashData.pid && hashData.gid) {
      this._openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
  }

  _parseThumbnailElements(galleryEl) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    const items = $(galleryEl).find('figure')
      .map(function () {
        const $linkEl = $(this).children('a').first();
        const itemSize = $linkEl.attr('data-size').split('x');
        const itemHref = $linkEl.attr('href');

        // thumbnail element
        const $linkImgEl = $($linkEl).children('img').first();
        const itemThumbnailUrl = $linkImgEl ? $linkImgEl.attr('src') : null;

        // item title
        const $figcaptionEl = $(this).children('figcaption').first();
        const itemTitle = $figcaptionEl ? $figcaptionEl.text() : null;

        //create slide object
        return {
          src: itemHref,
          w: parseInt(itemSize[0], 10),
          h: parseInt(itemSize[1], 10),
          title: itemTitle,
          msrc: itemThumbnailUrl,
          el: this
        }
      })
      .get();
    return items;
  }

  // find nearest parent element
  _closest(el, fn) {
    return el && (fn(el) ? el : this._closest(el.parentNode, fn));
  }

  _onThumbnailsClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    const eTarget = e.target || e.srcElement;

    // find root element of slide
    const $clickedListItem = $(eTarget).closest('figure').first();

    if ($clickedListItem.length < 0) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute TODO: refactor this
    const $clickedGallery = $clickedListItem.parents('.photoSwipe').first();
    const $childNodes = $clickedGallery.find('figure');

    let nodeIndex = 0, index;
    for (let i = 0; i < $childNodes.length; i++) {
      if($childNodes.get(i) === $clickedListItem.get(0)) {
          index = nodeIndex;
          break;
      }
      nodeIndex++;
  }

    if (index >= 0) {
      // open PhotoSwipe if valid index found
      this._openPhotoSwipe(index, $clickedGallery.get(0));
    }

    return false;
  }

  _photoSwipeParseHash() {
    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    const hash = window.location.hash.substring(1);
    let params = {};

    if (hash.length < 5) {
      return params;
    }

    const vars = hash.split('&');

    for (let variable in vars) {
      if (!variable) {
        continue;
      }
      var pair = variable.split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  }

  _createGalleryOptions(galleryElement, thumbnailItems) {
    return {
      // define gallery index (for URL)
      galleryUID: $(galleryElement).attr('data-pswp-uid'),

      getThumbBoundsFn: (index) => {
        // See Options -> getThumbBoundsFn section of documentation for more info
        const thumbnail = $(thumbnailItems[index].el).find('img').first().get(0); // find thumbnail
        const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        const rect = thumbnail.getBoundingClientRect();

        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      }
    };
  }

  _openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    const pswpElement = $('.pswp').get(0);
    let gallery, options, items;

    items = this._parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = this._createGalleryOptions(galleryElement, items);

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }
}
export { PhotoSwipeApi };
