import Vue from 'vue';

// Import Froala CSS files
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
//import all Froala plugins
import "froala-editor/js/plugins.pkgd.min.js";

import VueFroala from './vue-froala';

Vue.use(VueFroala);
window.VueFroala = VueFroala;