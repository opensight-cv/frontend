<script lang="ts">
import { Component } from "vue-property-decorator";
import DragNumberOption from "./DragNumberOption.vue";

/**
 * Parameters:
 * defaultValue - default starting value for number input
 * step - how 'fast' the value is decreased/increased when sliding or using the arrow keys
 *      defaults to 1
 * min - minimum value
 *      defaults to -100
 * max - maximum value
 *    defaults to 100
 */
 @Component
export default class DragIntegerOption extends DragNumberOption {
  get stringRep() {
    const s = this.displayValue.toFixed(0);
    return s.length > this.MAX_STRING_LENGTH
      ? this.displayValue.toExponential(this.MAX_STRING_LENGTH - 5)
      : s;
  }
}
</script>
