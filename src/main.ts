import Vue from "vue";
import "normalize.css/normalize.css";
import { BaklavaVuePlugin } from "@/plugins/baklavaOpsiVuePlugin";
import "@baklavajs/plugin-renderer-vue/dist/styles.css";

import App from "@/App.vue";

Vue.use(BaklavaVuePlugin);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
