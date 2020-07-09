import "normalize.css/normalize.css";

import { BaklavaVuePlugin } from "@/plugins/baklavaOpsiVuePlugin";
import Vue from "vue";

import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import "@/styles/node.scss";

import App from "@/App.vue";

// eslint-disable-next-line
import vClickOutside from "v-click-outside"

Vue.use(vClickOutside);

Vue.use(BaklavaVuePlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
