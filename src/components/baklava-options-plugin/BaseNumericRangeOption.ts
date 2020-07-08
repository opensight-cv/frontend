import { Prop, Vue, Watch, Component } from "vue-property-decorator";
import { NodeOption } from "@baklavajs/core";

/**
 * Base class for numerical range options
 */
@Component
export default class BaseNumericRangeOption extends Vue {
  MAX_STRING_LENGTH = 9;

  // In string form; lower and upper values separated by a space
  @Prop()
  value!: [number, number];

  @Prop({ type: String })
  name!: string;

  @Prop({ type: Object })
  option!: NodeOption;

  // If it should allow decimal inputs (defaults to true)
  isDecimal = true;

  // Lower/upper values
  valueLower = 0;

  valueUpper = 0;

  // If either value's input is in edit mode
  editModeLower = false;

  editModeUpper = false;

  // If there is invalid input for either value
  invalidLower = false;

  invalidUpper = false;

  // Used when editing numbers directly
  tempValueLower = "0";

  tempValueUpper = "0";

  get min() {
    if (this.option.min === undefined) return 0;
    return this.isDecimal ? parseFloat(this.option.min.toFixed(3)) : this.option.min.toFixed(0);
  }

  get max() {
    if (this.option.max === undefined) return 256;
    return this.isDecimal ? parseFloat(this.option.max.toFixed(3)) : this.option.max.toFixed(0);
  }

  mounted() {
    if (this.option.decimal === false) this.isDecimal = false;
    if (this.value) {
      // if a value was provided
      if (this.validateLower(this.value[0]) && this.validateUpper(this.value[1])) {
        [this.valueLower, this.valueUpper] = this.value;
      }
    } else {
      // values default to min and max
      this.valueLower = this.min;
      this.valueUpper = this.max;
    }

    this.emitValue();
  }

  // Gets the lower value
  get vLower() {
    if (typeof this.valueLower === "string")
      // This shouldn't happen
      return this.isDecimal ? parseFloat(this.valueLower) : parseInt(this.valueLower, 10);
    if (typeof this.valueLower === "number")
      return this.isDecimal ? parseFloat(this.valueLower.toFixed(3)) : Math.round(this.valueLower);
    return 0;
  }

  // Gets the upper value
  get vUpper() {
    if (typeof this.valueUpper === "string")
      // This shouldn't happen
      return this.isDecimal ? parseFloat(this.valueUpper) : parseInt(this.valueUpper, 10);
    if (typeof this.valueUpper === "number")
      return this.isDecimal ? parseFloat(this.valueUpper.toFixed(3)) : Math.round(this.valueUpper);
    return 0;
  }

  get stringRepLower() {
    const s = this.isDecimal ? this.vLower.toFixed(3) : this.vLower.toFixed(0);
    return s.length > this.MAX_STRING_LENGTH
      ? this.vLower.toExponential(this.MAX_STRING_LENGTH - 5)
      : s;
  }

  get stringRepUpper() {
    const s = this.isDecimal ? this.vUpper.toFixed(3) : this.vUpper.toFixed(0);
    return s.length > this.MAX_STRING_LENGTH
      ? this.vUpper.toExponential(this.MAX_STRING_LENGTH - 5)
      : s;
  }

  emitValue() {
    this.$emit("input", [this.vLower, this.vUpper]);
  }

  setLowerValue(newValue: number, triggerEmit: boolean) {
    if (this.validateLower(newValue)) {
      this.valueLower = newValue;
      if (triggerEmit) this.emitValue();
    }
  }

  setUpperValue(newValue: number, triggerEmit: boolean) {
    if (this.validateUpper(newValue)) {
      this.valueUpper = newValue;
      if (triggerEmit) this.emitValue();
    }
  }

  @Watch("tempValueLower")
  resetInvalidLower() {
    this.invalidLower = false;
  }

  @Watch("tempValueUpper")
  resetInvalidUpper() {
    this.invalidUpper = false;
  }

  async enterEditModeLower() {
    if (this.invalidUpper) return;
    this.tempValueLower = this.isDecimal ? this.vLower.toFixed(3) : this.vLower.toFixed(0);
    this.editModeLower = true;
    await this.$nextTick();
    (this.$refs.inputLower as HTMLElement).focus();
  }

  async enterEditModeUpper() {
    if (this.invalidLower) return;
    this.tempValueUpper = this.isDecimal ? this.vUpper.toFixed(3) : this.vUpper.toFixed(0);
    this.editModeUpper = true;
    await this.$nextTick();
    (this.$refs.inputUpper as HTMLElement).focus();
  }

  leaveEditModeLower() {
    const v = this.isDecimal ? parseFloat(this.tempValueLower) : parseInt(this.tempValueLower, 10);
    if (!this.validateLower(v)) {
      this.invalidLower = true;
    } else {
      this.valueLower = v;
      this.emitValue();
      this.editModeLower = false;
    }
  }

  leaveEditModeUpper() {
    const v = this.isDecimal ? parseFloat(this.tempValueUpper) : parseInt(this.tempValueUpper, 10);
    if (!this.validateUpper(v)) {
      this.invalidUpper = true;
    } else {
      this.valueUpper = v;
      this.emitValue();
      this.editModeUpper = false;
    }
  }

  validateLower(v: number) {
    return this.validate(v) && v < this.valueUpper;
  }

  validateUpper(v: number) {
    return this.validate(v) && v > this.valueLower;
  }

  validate(v: number) {
    if (Number.isNaN(v)) {
      return false;
    }
    if (v < this.min) {
      return false;
    }
    if (v > this.max) {
      return false;
    }
    return true;
  }
}
