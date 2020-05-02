<script lang="ts">
import DragNumberOption from "./DragNumberOption.vue";

/**
 * Parameters:
 * step - how 'fast' the value is decreased/increased when sliding or using the arrow keys
 *      defaults to 1
 */
export default class DragIntegerOption extends DragNumberOption {
  get stringRep() {
    const s = this.v.toFixed(0);
    return s.length > this.MAX_STRING_LENGTH ? this.v.toExponential(this.MAX_STRING_LENGTH - 5) : s;
  }
}
</script>
