<template>
  <div class="mainApp">
    <NodeEditor />
  </div>
</template>

<script lang="ts">
import NodeEditor from '@/views/Editor.vue';
import Vue from 'vue';

export default Vue.extend({
  components: { NodeEditor },
  data() {
    return {
      test: 'Test',
    };
  },
});
</script>

<style scoped>
.mainApp {
  height: 100%;
}
</style>
