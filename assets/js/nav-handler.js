'use strict';
import $ from 'jquery';

/**
 * navigation handler
 *
 * should hide and show navigation menus
 */
class NavHandler {

  /**
   * Construct navigation handler
   *
   * @param {String} dropDownMenuElClass DOM element class of the dropdown menu
   * @param {String} dropDownMenuIconElClass DOM element class of the dropdown menu icon
   */
  constructor(dropDownMenuElClass, dropDownMenuIconElClass) {
    this.iconMenuOpen = 'ion-md-menu';
    this.iconMenuClose = 'ion-md-close';

    this.dropDownMenuElClass = dropDownMenuElClass;
    this.dropDownMenuIconElClass = dropDownMenuIconElClass;

    this._initialize();
  }

  /**
   * initialize handler by selection menu elements assign functionality
   */
  _initialize() {
    // mobile navigation
    const $dropDownNavIcon = $('.' + this.dropDownMenuIconElClass);
    if ($dropDownNavIcon.length > 0) {
      $dropDownNavIcon.get(0).onclick = this._handleDropDownClick.bind(this);
    } else {
      console.error('NavHandler: Couldn\'t find nav icon \'.' + this.dropDownMenuElClass + '\' in document.');
    }
  }

  _handleDropDownClick() {
    const $dropDownNavMenu = $('.' + this.dropDownMenuElClass);
    const $icon = $('.' + this.dropDownMenuIconElClass + ' i');

    if ($dropDownNavMenu.length > 0 && $icon.length > 0) {
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
