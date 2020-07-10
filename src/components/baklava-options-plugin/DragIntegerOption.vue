<script lang="ts">
import { Component } from "vue-property-decorator";
import DragNumberOption from "./DragNumberOption.vue";

/**
 * Parameters:
 * step?: how fast the value changes when sliding or using the arrow keys; defaults to 1
 * default?: default value
 * min?: minimum value
 * max?: maximum value
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
