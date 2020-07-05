<template>
  <div class="__sidebar">
    <img src="@/img/nodetree.png" />
    <img src="@/img/settings.png" />
    <img src="@/img/preview.png" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  
});
</script>

<style scoped>
.__sidebar {
  background-color: #141414;
  padding-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.__sidebar > img {
  margin: 20% 0;
  width: 75%;
}
</style>
