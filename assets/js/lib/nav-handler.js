'use strict';
import $ from 'jquery';

/**
 * navigation handler
 *
 * hide and shows navigation menus
 * hide and shows back top button
 */
class NavHandler {

  /**
   * Construct navigation handler
   *
   * @param {String} dropDownMenuElClass DOM element class of the dropdown menu
   * @param {String} dropDownMenuIconElClass DOM element class of the dropdown menu icon
   * @param {String} dropDownSectionExpandElClass DOM element class of the section expand button
   * @param {String} dropDownSectionExpandIconElClass DOM element class of the section expand icon
   * @param {String} navTopMenuElClass DOM element class of the top sticky menu
   * @param {String} backToTopButtonElClass DOM element class of the back to top button
   */
  constructor(dropDownMenuElClass, dropDownMenuIconElClass, dropDownSectionExpandElClass, dropDownSectionExpandIconElClass, navTopMenuElClass, backToTopButtonElClass) {
    this.iconMenuOpenClass = 'ion-md-menu';
    this.iconMenuCloseClass = 'ion-md-close';

    this.iconExpandClass = 'ion-md-add';
    this.iconCollapseClass = 'ion-md-remove';

    this.dropDownMenuElClass = dropDownMenuElClass;
    this.dropDownMenuIconElClass = dropDownMenuIconElClass;

    this.dropDownSectionExpandElClass = dropDownSectionExpandElClass;
    this.dropDownSectionExpandIconElClass = dropDownSectionExpandIconElClass;

    this.navTopMenuElClass = navTopMenuElClass;
    this.backToTopButtonElClass = backToTopButtonElClass;

    this._initialize();
  }

  /**
   * initialize handler by selection menu elements assign functionality
   */
  _initialize() {
    // mobile navigation
    const $dropDownNavBtn = $('.' + this.dropDownMenuIconElClass);
    if ($dropDownNavBtn.length) {
      $dropDownNavBtn.get(0).onclick = this._handleDropDownClick.bind(
        this,
        $('.' + this.dropDownMenuElClass),
        $dropDownNavBtn.children('i'),
        this.iconMenuOpenClass,
        this.iconMenuCloseClass);
    } else {
      console.error('NavHandler: Couldn\'t find element \'.' + this.dropDownMenuIconElClass + '\' in document.');
      return;
    }

    const $dropDownSectionExpandIconBtn = $('.' + this.dropDownSectionExpandIconElClass);

    if (!$dropDownSectionExpandIconBtn.length) {
      console.error('NavHandler: Drop down section expand icon must exist. Class: \'' + this.dropDownSectionExpandIconElClass + '\'');
      return;
    }

    //iterate all queried elements
    $dropDownSectionExpandIconBtn.each(function (index, element) {
      element.onclick = this._handleDropDownClick.bind(
                                  this,
                                  // unfortunately I found no other way to get the next child with a given class
                                  $(element).parent().children('.' + this.dropDownSectionExpandElClass),
                                  $(element).children('i'),
                                  this.iconExpandClass,
                                  this.iconCollapseClass);

    }.bind(this));

    const $navTop = $('.' + this.navTopMenuElClass);
    if ($navTop.length) {
      const $backToTop = $('.' + this.backToTopButtonElClass);

      if ($backToTop.length) {
        // event handlers for sticky menu
        $navTop.on('sticky.zf.stuckto:top', () => $backToTop.show());
        $navTop.on('sticky.zf.unstuckfrom:top', () => $backToTop.hide());
      } else {
        console.error('NavHandler: Couldn\'t find back to top button \'.' + this.backToTopButtonElClass + '\' in document.');
      }
    }
  }

  /**
   * handle a click on the given dropdown menu and slide toogle the contents
   *
   * @param {Object} $dropDownMenuEl- JQuery Object which contains the dropdown elements
   * @param {Object} $dropDownMenuIconEl- JQuery Object which should trigger the slide toogle
   * @param {String} iconOpenClass - DOM Element with should indicate the open state by icon
   * @param {String} iconCloseClass - DOM Element which should indicate the close state by icon
   */
  _handleDropDownClick($dropDownMenuEl, $dropDownMenuIconEl, iconOpenClass, iconCloseClass) {
    // open dropdown
    $dropDownMenuEl.slideToggle(200);

    if ($dropDownMenuIconEl.hasClass(iconOpenClass)) {
      $dropDownMenuIconEl.removeClass(iconOpenClass);
      $dropDownMenuIconEl.addClass(iconCloseClass);
    } else {
      $dropDownMenuIconEl.removeClass(iconCloseClass);
      $dropDownMenuIconEl.addClass(iconOpenClass);
    }
  }
}
export { NavHandler };
