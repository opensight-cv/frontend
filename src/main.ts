import Vue from "vue";
import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import "@baklavajs/plugin-renderer-vue/dist/styles.css";

Vue.use(BaklavaVuePlugin);

import App from "@/App.vue";

new Vue({
  render: (h: any) => h(App),
}).$mount("#app");
