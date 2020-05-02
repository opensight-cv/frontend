<script lang="ts">
import DragNumberOption from "./DragNumberOption.vue";

/**
 * Parameters:
 * defaultValue - default starting value for number input
 * step - how 'fast' the value is decreased/increased when sliding or using the arrow keys
 *      defaults to 1
 * floatPrecision - precision to which the float should be shown
 *      defaults to 3
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
