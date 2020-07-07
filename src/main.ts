import "normalize.css/normalize.css";

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import Vue from "vue";

import "@baklavajs/plugin-renderer-vue/dist/styles.css";
import "@/styles/node.scss";

import App from "@/App.vue";

Vue.use(BaklavaVuePlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
