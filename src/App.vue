<template>
  <div class="mainApp">
    <Sidebar style="width: 5%;" />
    <transition name="fade" mode="out-in">
      <router-view style="width: 95%;"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueRouter from "vue-router";

import NodeEditor from "@/views/Editor.vue";
import Sidebar from "@/views/Sidebar.vue";
import Settings from "./views/Settings.vue";
import Hooks from "./views/Hooks.vue";


const routes = [
  { path: "/", component: NodeEditor },
  { path: "/nodeEditor", component: NodeEditor },
  { path: "/settings", component: Settings },
  { path: "/hooks", component: Hooks },
];

const router = new VueRouter({
  routes,
});
Vue.use(VueRouter);

export default Vue.extend({
  components: { Sidebar },
  router,
});
</script>

<style scoped>
.mainApp {
  height: 100%;
  display: flex;
  background-color: #232323;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease-in-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
