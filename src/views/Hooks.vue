<template>
  <div class="hooks">
    <pref-node title="Hooks">
      <ul>
        <li>opsi.video</li>
      </ul>
    </pref-node>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import PrefNode from "@/components/ui/PrefNode.vue";

export default Vue.extend({
  components: { PrefNode },
});
</script>

<style scoped>
.hooks {
  background-color: #232323;
  color: white;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  padding: 2% 2%;
  box-sizing: border-box;
}

.settings > div {
  margin-right: 2%;
  margin-bottom: 2%;
}
</style>
