// Just a test

<template>
  <div>
    <input type="text" class="dark-input" :value="value" :placeholder="name" v-on="listeners" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class InputOption extends Vue {
  @Prop({ type: String, default: "" })
  value!: string;

  @Prop({ type: String })
  name!: string;

  get listeners(): any {
    return {
      ...this.$listeners,
      input: (ev: any) => this.$emit("input", ev.target.value),
    };
  }
}
</script>
