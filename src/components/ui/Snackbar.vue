<template>
   <transition name="snackbar-anim">
      <div 
        v-if="snackbarActive"
        :style="{ backgroundColor }"
        class="snackbar">
        <span class="snackbar-text">{{ text }}</span>
      </div>
    </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Snackbar extends Vue {
  text = ""

  backgroundColor = "#ff5050";

  snackbarActive = false;

  static async sleep(ms: number) {
    return new Promise((res, rej) => {
      setTimeout(res, ms);
    }); 
  }

  mounted() {
    this.$root.$on("snackbar-success", async (text: string) => {
      this.text = text;
      this.backgroundColor = "#00AA00";
      this.snackbarActive = true;
      await Snackbar.sleep(4000);
      this.snackbarActive = false;
    });
    this.$root.$on("snackbar-error", async (text : string) => {
      this.text = text;
      this.backgroundColor = "#FF5050";

      this.snackbarActive = true;
      await Snackbar.sleep(4000);
      this.snackbarActive = false;
    })
  }

  style() {
    console.log("style");
    return {
      backgroundColor: this.backgroundColor,
    }
  }
}
</script>

<style scoped>
.snackbar {
  color: #fff;
  font-family: "Lato", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  min-height: 1rem;
  padding: 1rem 2rem;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2rem;
}

.snackbar-anim-enter-active, .snackbar-anim-leave-active {
  transition: all .4s ease;
}
.snackbar-anim-enter, .snackbar-anim-leave-to {
  opacity: 0;
  transform: translateY(100%) translateX(-50%);
}
</style>
