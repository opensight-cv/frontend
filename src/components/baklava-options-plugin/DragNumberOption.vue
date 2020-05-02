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
import { NumberOption } from "@baklavajs/plugin-options-vue";

/**
 * Parameters:
 * step - how 'fast' the value is decreased/increased when sliding or using the arrow keys
 *      defaults to 1
 * float - if it is float input or not
 *      defaults to false
 * floatPrecision - precision to which the number should be shown
 *      defaults to 3
 *      ignored if float is false
 */
export default class DragIntegerOption extends NumberOption {
  handleMouseMove(e: MouseEvent) {
    const step = this.option.step || 1;
    this.setValue(this.v + e.movementX * step);
  }

  get stringRep() {
    const isFloat = this.option.float; // default to false (if undef)

    // default to .001 precision
    const floatPrecision = this.option.floatPrecision || 3;

    const s = isFloat ? this.v.toFixed(floatPrecision) : this.v.toFixed(0);

    return s.length > this.MAX_STRING_LENGTH ? this.v.toExponential(this.MAX_STRING_LENGTH - 5) : s;
  }

  startDrag() {
    const moveListener = this.handleMouseMove.bind(this);
    const originalVal = this.v;

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", moveListener);
      document.removeEventListener("mouseup", handleMouseUp);

      const newVal = this.v;

      // if no change from the mouse events, it was probably a click, so enter edit mode
      if (originalVal === newVal) this.enterEditMode();
      this.tempValue = this.v.toFixed(0);
    };

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", handleMouseUp);
  }

  incrementVal() {
    const step = this.option.step || 1;
    this.setValue(this.v + step);
  }

  decrementVal() {
    const step = this.option.step || 1;
    this.setValue(this.v - step);
  }
}
</script>
