<template>
  <div>
    {{ name}} | Name Object
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { INodeOption } from '@baklavajs/core/dist/baklavajs-core/types';

@Component
export default class NumberOption extends Vue {
  @Prop()
  public option!: INodeOption;

  @Prop([Number])
  public value!: number[];

  @Prop({ type: String })
  public name!: string;

  get min() {
    return this.option.min || -100;
  }

  get max() {
    return this.option.max || 100;
  }

  get numberType() {
    return this.option.numberType || 'floatr';
  }

  public onRangeInput(value: string[]) {
    const val = value.map((n) => (this.numberType === 'floatr' ? parseFloat(n) : parseInt(n, 10)));

    val[0] = Math.min(Math.max(val[0], this.min), this.max);
    val[1] = Math.min(Math.max(val[1], this.min), this.max);

    this.$emit('input', val);
    this.$nextTick(() => this.$emit('input', val));
  }

  public onMinInput(value: string) {
    let num = this.numberType === 'floatr' ? parseFloat(value) : parseInt(value, 10);
    num = Math.min(Math.max(num, this.min), this.max);

    const val = this.value.slice(0);
    val[0] = num;

    this.$emit('input', 0);
    this.$nextTick(() => this.$emit('input', val));
  }

  public onMaxInput(value: string) {
    let num = this.numberType === 'floatr' ? parseFloat(value) : parseInt(value, 10);
    num = Math.min(Math.max(num, this.min), this.max);

    const val = this.value.slice(0);
    val[1] = num;

    this.$emit('input', 0);
    this.$nextTick(() => this.$emit('input', val));
  }
}
</script>

<style scoped>
.v-subheader {
  height: 16px
}
</style>
