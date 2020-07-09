<template>
  <div :id="data.id" :class="classes" @mousedown.self="onDragDown">
    <div class="__port" @mouseover="startHover" @mouseout="endHover"></div>
    <span
      v-if="data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)"
      class="align-middle"
      @mousedown.self="onDragDown"
    >
      {{ displayName }}
    </span>
    <component
      :is="getOptionComponent(data.option)"
      v-else
      :option="data"
      :value="value"
      :name="displayName"
      @input="data.value = $event"
    ></component>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { Components } from "@baklavajs/plugin-renderer-vue";

@Component
export default class NodeInterfaceView extends Components.NodeInterface {
  onDragDown() {
    this.$emit("drag-down");
  }
}
</script>
