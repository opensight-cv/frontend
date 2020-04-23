<template>
  <div>{{ name }} | Bool Option</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { INodeOption } from '@baklavajs/core/dist/baklavajs-core/types';

@Component
export default class NumberOption extends Vue {
  @Prop({ type: Boolean })
  public value!: boolean;

  @Prop({ type: String })
  public name!: string;
}
</script>

<style scoped>
.v-subheader {
  height: 16px
}
</style>
