// --------------------------------------------------
// APP.JS
// --------------------------------------------------
import $ from 'jquery';
import {Foundation} from './lib/foundation-explicit-pieces';
import {SmoothScrollWithLinks} from './lib/ext/foundation.smoothScrollWithLinks';

//
// Custom JS
// --------------------------------------------------
Foundation.plugin(SmoothScrollWithLinks, 'SmoothScrollWithLinks');

//
// Initialize Foundation
// --------------------------------------------------
$(document).foundation();
