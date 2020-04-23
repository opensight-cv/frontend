import Vue from 'vue';
import { BaklavaVuePlugin } from '@baklavajs/plugin-renderer-vue';
import '@baklavajs/plugin-renderer-vue/dist/styles.css';

import App from '@/App.vue';

Vue.use(BaklavaVuePlugin);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
