<template>
  <div class="pref-node">
    <div class="pref-node-title">
      <span style="width: 80%;">{{ title }}</span>
    </div>

    <div class="pref-node-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class PrefNode extends Vue {
  @Prop({ type: String })
  title!: string;
}
</script>

<style scoped>
.pref-node {
  background-color: #3f3f3fcc;
  border-radius: 4px;
  filter: drop-shadow(0 0 3px #000000cc);
  color: white;
  min-width: 200px;

  font-family: "Lato", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
}

.pref-node-title {
  background-color: #000000;
  color: white;

  padding: 0.4em 0.75em;
  border-radius: 4px 4px 0 0;
  user-select: none;
}

.pref-node-content {
  padding: 0.4em 0.75em;
}

.pref-node a {
  color: white;
  text-decoration: underline;
}
</style>
