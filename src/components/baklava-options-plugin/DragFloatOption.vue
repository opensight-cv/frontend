<script lang="ts">
import DragNumberOption from "./DragNumberOption.vue";

/**
 * Parameters:
 * step?: how fast the value changes when sliding or using the arrow keys; defaults to 1
 * default?: default value
 * min?: minimum value
 * max?: maximum value
 */
export default class DragIntegerOption extends DragNumberOption {
  get stringRep() {
    const floatPrecision = this.option.floatPrecision || 3;
    const s = this.displayValue.toFixed(floatPrecision);
    return s.length > this.MAX_STRING_LENGTH
      ? this.displayValue.toExponential(this.MAX_STRING_LENGTH - 5)
      : s;
  }
}
</script>
