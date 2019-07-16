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
   * @param {String} navTopMenuElClass DOM element class of the top sticky menu
   * @param {String} backToTopButtonElClass DOM element class of the back to top button
   */
  constructor(dropDownMenuElClass, dropDownMenuIconElClass, navTopMenuElClass, backToTopButtonElClass) {
    this.iconMenuOpen = 'ion-md-menu';
    this.iconMenuClose = 'ion-md-close';

    this.dropDownMenuElClass = dropDownMenuElClass;
    this.dropDownMenuIconElClass = dropDownMenuIconElClass;
    this.navTopMenuElClass = navTopMenuElClass;
    this.backToTopButtonElClass = backToTopButtonElClass;

    this._initialize();
  }

  /**
   * initialize handler by selection menu elements assign functionality
   */
  _initialize() {
    // mobile navigation
    const $dropDownNavIcon = $('.' + this.dropDownMenuIconElClass);
    if ($dropDownNavIcon.length) {
      $dropDownNavIcon.get(0).onclick = this._handleDropDownClick.bind(this);
    } else {
      console.error('NavHandler: Couldn\'t find nav icon \'.' + this.dropDownMenuElClass + '\' in document.');
    }

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

  _handleDropDownClick() {
    const $dropDownNavMenu = $('.' + this.dropDownMenuElClass);
    const $icon = $('.' + this.dropDownMenuIconElClass + ' i');

    if ($dropDownNavMenu.length && $icon.length) {
      // open dropdown
      $dropDownNavMenu.slideToggle(200);

      if ($icon.hasClass(this.iconMenuOpen)) {
        $icon.removeClass(this.iconMenuOpen);
        $icon.addClass(this.iconMenuClose);
      } else {
        $icon.removeClass(this.iconMenuClose);
        $icon.addClass(this.iconMenuOpen);
      }
    } else {
      console.error('NavHandler: Couldn\'t find dropDownNavMenu or icon \'.' + this.dropDownMenuElClass + '\' \'.' + this.dropDownMenuIconElClass + '\' in document.');
    }

  }
}
export { NavHandler };
