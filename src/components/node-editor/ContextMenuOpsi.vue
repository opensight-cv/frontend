<template>
  <div v-show="value" v-click-outside="vcoConfig" :class="classes" :style="styles">
    <template v-for="(item, index) in _items">
      <div v-if="item.isDivider" :key="index" class="divider"></div>

      <div
        v-else
        :key="index"
        :class="{ item: true, submenu: !!item.submenu, '--disabled': !!item.disabled }"
        class="d-flex align-items-center"
        @mouseenter="onMouseEnter($event, index)"
        @mouseleave="onMouseLeave($event, index)"
        @click.stop.prevent="onClick(item)"
      >
        <div class="flex-fill">{{ item.label }}</div>
        <div v-if="item.submenu" class="ml-3" style="line-height: 1em;">&#9205;</div>
        <context-menu
          v-if="item.submenu"
          :value="activeMenu === index"
          :items="item.submenu"
          :is-nested="true"
          :is-flipped="{ x: flippedX, y: flippedY }"
          :flippable="flippable"
          @click="onChildClick"
        ></context-menu>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Components } from "@baklavajs/plugin-renderer-vue";

import ClickOutside from "v-click-outside";

@Component({
  directives: {
    ClickOutside: ClickOutside.directive,
  },
})
export default class ContextMenu extends Components.ContextMenu {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  onClickOutside(e: MouseEvent) {
    if (this.value) {
      this.$emit("input", false);
    }
  }

  vcoConfig = {
    handler: this.onContextOutside,
    events: ["mousedown", "click"],
    // Note: The default value is true, but in case you want to activate / deactivate
    //       this directive dynamically use this attribute.
    isActive: true,
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  onContextOutside(e: MouseEvent) {
    if (this.value) {
      this.$emit("input", false);
    }
  }

  created() {
    if (this.$options.components) {
      this.$options.components["context-menu"] = Vue.extend(ContextMenu);
    } else {
      this.$options.components = { "context-menu": Vue.extend(ContextMenu) };
    }

    document.documentElement.addEventListener("contextmenu", this.onContextOutside, true);
  }

  destroyed() {
    document.documentElement.removeEventListener("contextmenu", this.onContextOutside, true);
  }
}
</script>
