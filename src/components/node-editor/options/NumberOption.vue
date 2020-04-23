<template>
  <div>{{ name }} | Number Option</div>

</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { INodeOption } from '@baklavajs/core/dist/baklavajs-core/types';

@Component
export default class NumberOption extends Vue {
  @Prop()
  public option!: INodeOption;

  @Prop({ type: Number })
  public value!: number;

  @Prop({ type: String })
  public name!: string;

  get min() {
    return this.option.min || -100;
  }

  get max() {
    return this.option.max || 100;
  }

  get numberType() {
    return this.option.numberType || 'float';
  }

  public onInput(value: string) {
    let num = this.numberType === 'float' ? parseFloat(value) : parseInt(value, 10);
    num = Math.min(Math.max(num, this.min), this.max);

    this.$emit('input', 0);
    //this.$nextTick(() => this.$emit('input', num));  //commented out to prevent error replace with line below
    this.$nextTick(() => this.$emit('input', 0));
  }

}
</script>
\

<style scoped>
.v-subheader {
  height: 16px
}
</style>
