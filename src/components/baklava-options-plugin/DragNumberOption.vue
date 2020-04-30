<template>
  <div class="dark-num-input" @mousedown="startDrag()">
    <div class="__button --dec" @click="decrement">
      <i-arrow></i-arrow>
    </div>
    <div v-if="!editMode" class="__content">
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
        style="text-align: right;"
        @blur="leaveEditMode"
        @keydown.enter="leaveEditMode"
      />
    </div>
    <div class="__button --inc" @click="increment">
      <i-arrow></i-arrow>
    </div>
  </div>
</template>

<script lang="ts">
import { NumberOption } from "@baklavajs/plugin-options-vue";

// Set the speed to an integer for integer input and to a real number for real input
export default class DragIntegerOption extends NumberOption {
  handleMouseMove(e: MouseEvent) {
    const speed = this.option.speed || 1;
    this.setValue(this.v + e.movementX * speed);
  }

  get stringRep() {
    const speed = this.option.speed || 1;

    const s = speed % 1 === 0 ? this.v.toFixed(0) : this.v.toFixed(3);

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
}
</script>
