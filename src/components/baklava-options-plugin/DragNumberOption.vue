<template>
  <div class="dark-num-input">
    <div class="__button --dec" @click="decrementVal()">
      <i-arrow></i-arrow>
    </div>
    <div v-if="!editMode" class="__content" @mousedown="startDrag()">
      <div class="__label .text-truncate">{{ name }}</div>
      <div class="__value">{{ stringRep }}</div>
    </div>
    <div v-else class="__content">
      <input
        ref="input"
        v-model="tempValue"
        type="number"
        class="dark-input"
        :class="{ '--invalid': invalid }"
        style="text-align: right; -moz-appearance: textfield;"
        @blur="leaveEditMode"
        @keydown.enter="leaveEditMode"
      />
    </div>
    <div class="__button --inc" @click="incrementVal()">
      <i-arrow></i-arrow>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component } from "vue-property-decorator";
import { NumberOption } from "@baklavajs/plugin-options-vue";
import DragIntegerOption from "./DragIntegerOption.vue";

/**
 * Superclass for DragIntegerOption and DragFloatOption
 */
@Component
export default class DragNumberOption extends NumberOption {
  displayValue = 0;

  @Watch("editMode")
  updateVals() {
    this.displayValue = this.v;
  }

  handleMouseMove(e: MouseEvent) {
    const step = this.option.step || 1;
    this.displayValue += e.movementX * step;
  }

  created() {
    if (this.option.defaultValue) this.displayValue = this.option.defaultValue;
  }

  startDrag() {
    const moveListener = this.handleMouseMove.bind(this);
    const originalVal = this.displayValue;

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", moveListener);
      document.removeEventListener("mouseup", handleMouseUp);

      this.setVal(this.displayValue);

      // if no change from the mouse events, it was probably a click, so enter edit mode
      if (originalVal === this.displayValue) this.enterEditMode();
      if (this instanceof DragIntegerOption) this.tempValue = this.displayValue.toFixed(0);
    };

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", handleMouseUp);
  }

  incrementVal() {
    const step = this.option.step || 1;
    this.setVal(this.v + step);
  }

  decrementVal() {
    const step = this.option.step || 1;
    this.setVal(this.v - step);
  }

  setVal(value: number) {
    this.setValue(value);
    this.displayValue = value;
  }
}
</script>
