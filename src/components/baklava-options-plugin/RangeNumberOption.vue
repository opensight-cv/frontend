<template>
  <div style="margin-bottom: 8px;">
    <div class="__label">{{ name }}</div>
    <div
      class="dark-slider"
      :class="{ 'ignore-mouse': !editModeLower && !editModeUpper }"
      style="height: 24px; margin: 4px 0; border-radius: 12px;"
      @mousedown="mousedownTrigger"
      @mouseup="mouseupTrigger"
      @mousemove="mousemove"
      @mouseleave="mouseleave"
    >
      <div
        class="__slider"
        :style="{ width: width + '%', marginLeft: offset + '%', borderRadius: '12px' }"
      ></div>
    </div>
    <div style="display: flex;">
      <div v-if="!editModeLower" class="__content">
        <input
          v-model="stringRepLower"
          readonly="readonly"
          class="dark-input"
          style="cursor: pointer;"
          @mousedown="mouseDownInputLower"
          @mouseup="mouseUpInputLower"
        />
      </div>
      <div v-else class="__content">
        <input
          ref="inputLower"
          v-model="tempValueLower"
          type="number"
          class="dark-input"
          :class="{ '--invalid': invalidLower }"
          @blur="leaveEditModeLower"
          @keydown.enter="leaveEditModeLower"
        />
      </div>
      <div v-if="!editModeUpper" class="__content">
        <input
          v-model="stringRepUpper"
          readonly="readonly"
          class="dark-input"
          style="text-align: right; cursor: pointer;"
          @mousedown="mouseDownInputUpper"
          @mouseup="mouseUpInputUpper"
        />
      </div>
      <div v-else class="__content">
        <input
          ref="inputUpper"
          v-model="tempValueUpper"
          type="number"
          class="dark-input"
          :class="{ '--invalid': invalidUpper }"
          style="text-align: right;"
          @blur="leaveEditModeUpper"
          @keydown.enter="leaveEditModeUpper"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseNumericRangeOption from "./BaseNumericRangeOption";

/**
 * Range number option (sliding input)
 *
 * Parameters:
 * min - number; denotes minimum allowed value, inclusive; defaults to 0
 * max - number; denotes maximum allowed value, inclusive; defaults to 256
 * decimal - boolean; denotes if it is float input or not; defaults to true
 *
 * All float values rounded to 3 places
 */
@Component
export default class RangeNumberOption extends BaseNumericRangeOption {
  isMouseDown = false; // If the mouse was down on the slider

  isMouseDownInputLower = false; // If mouse was down on lower input

  isMouseDownInputUpper = false; // If mouse was down on upper input

  editingUpperBound = false; // if the current dragging motion is editing the upper bound

  // Gets the width of the bar (as a percentage)
  get width() {
    return Math.min(100, Math.max(0, ((this.vUpper - this.vLower) * 100) / (this.max - this.min)));
  }

  // Gets the offset of the bar from the left (as a percentage)
  get offset() {
    return Math.min(100, Math.max(0, (this.vLower * 100) / (this.max - this.min)));
  }

  // Triggers when mouse down on slider
  mousedownTrigger(ev: MouseEvent) {
    // No drag inputs allowed when invalid input
    if (this.invalidLower || this.invalidUpper) return;

    const v = Math.max(
      this.min,
      Math.min(this.max, (this.max - this.min) * (ev.offsetX / this.$el.clientWidth) + this.min)
    );

    // Drag event targets the closer bound
    const distanceFromLower = Math.abs(v - this.vLower);
    const distanceFromUpper = Math.abs(v - this.valueUpper);
    this.editingUpperBound = distanceFromUpper < distanceFromLower;

    this.isMouseDown = true;
  }

  // Triggers when mouse down on lower input
  mouseDownInputLower() {
    this.isMouseDownInputLower = true;
  }

  // Triggers when mouse down on upper input
  mouseDownInputUpper() {
    this.isMouseDownInputUpper = true;
  }

  // Triggers when mouse up on lower input
  mouseUpInputLower() {
    if (this.isMouseDownInputLower) {
      this.isMouseDownInputLower = false;
      this.enterEditModeLower();
    }
  }

  // Triggers when mouse up on upper input
  mouseUpInputUpper() {
    if (this.isMouseDownInputUpper) {
      this.isMouseDownInputUpper = false;
      this.enterEditModeUpper();
    }
  }

  // Triggers on mouse up on slider
  mouseupTrigger(ev: MouseEvent) {
    if (!this.isMouseDown) return;

    const v = Math.max(
      this.min,
      Math.min(this.max, (this.max - this.min) * (ev.offsetX / this.$el.clientWidth) + this.min)
    );
    if (this.editingUpperBound) {
      this.setUpperValue(v, true);
    } else {
      this.setLowerValue(v, true);
    }

    this.isMouseDown = false;
  }

  // Triggers when mouse leaves slider
  mouseleave(ev: MouseEvent) {
    if (!this.isMouseDown) return;

    if (ev.offsetX >= this.$el.clientWidth) {
      this.setUpperValue(this.max, true);
    } else if (ev.offsetX <= 0) {
      this.setLowerValue(this.min, true);
    } else {
      this.emitValue();
    }

    this.isMouseDown = false;
  }

  // Triggers when mouse moves on slider
  mousemove(ev: MouseEvent) {
    if (!this.isMouseDown) return;

    const v = Math.max(
      this.min,
      Math.min(this.max, (this.max - this.min) * (ev.offsetX / this.$el.clientWidth) + this.min)
    );
    if (this.editingUpperBound) {
      this.setUpperValue(v, false);
    } else {
      this.setLowerValue(v, false);
    }
  }
}
</script>
