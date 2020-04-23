<template>
  <div>
    {{ name }} | Text Option
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { INodeOption } from '@baklavajs/core/dist/baklavajs-core/types';

@Component
export default class TextOption extends Vue {
  @Prop()
  public option!: INodeOption;

  @Prop({ type: String, default: '' })
  public value!: string;

  @Prop({ type: String })
  public name!: string;

  public onInput(value: string) {
    this.$emit('input', value);
  }
}
</script>

<style scoped>
.v-subheader {
  height: 16px
}
</style>
