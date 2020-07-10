<template>
  <div class="__sidebar">
    <router-link to="/nodeEditor"><img src="@/img/nodetree.png" /></router-link>
    <router-link to="/settings"><img src="@/img/settings.png" /></router-link>
    <router-link to="/hooks"><img src="@/img/hooks.png" /></router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend();
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

.__sidebar img {
  margin: 20% 12.5%;
  width: 75%;
}
</style>
