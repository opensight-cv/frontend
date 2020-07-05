<template>
  <div class="mainApp">
    <Sidebar style="width: 6%;" />
    <NodeEditor style="width: 94%;" />
  </div>
</template>

<script lang="ts">
import NodeEditor from "@/views/Editor.vue";
import Sidebar from "@/views/Sidebar.vue";
import Vue from "vue";

export default Vue.extend({
  components: { 
    NodeEditor, Sidebar
  },
});
</script>

<style scoped>
.mainApp {
  height: 100%;
  display: flex;
}
</style>
