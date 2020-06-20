<template>
  <div class="color-picker-container">
    <div class="__label .text-truncate color-picker-label">{{ name }}</div>
    <div
      class="color-picker-box"
      :style="{ backgroundColor: value }"
      tabindex="-1"
      @click="isOpen = true"
      @focusout="focusout"
    >
      <chrome-picker
        v-show="isOpen"
        class="color-picker"
        :value="value"
        @input="$emit('input', $event.hex)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: { "chrome-picker": () => import("./chrome") },
})
export default class ColorPickerOption extends Vue {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  value!: string;

  isOpen = false;

  focusout(event: any) {
    if(event.relatedTarget.className !== "vc-input__input")  // Prevent dialog from closing when clicking an input
      this.isOpen = false;
  }
}
</script>

<style>
.color-picker-container {
  display: flex;
  align-items: center;
  height: 24px;
}

.color-picker-label {
  white-space: nowrap;
}

.color-picker-box {
  height: 100%;
  border-radius: 4px;
  margin-left: 4px;
  flex-grow: 1;
  outline: none;
}

.color-picker {
  position: absolute;
  left: 100%;
  top: 0%;
  z-index: 999;
}

.vc-chrome {
  background-color: unset !important;
  background: unset !important;
}

.vc-chrome-body {
  background-color: #333333 !important;
}

.vc-chrome-fields .vc-input__input {
  color: #ffffff !important;
  background-color: rgb(44, 44, 44) !important;
  box-shadow: unset !important;
  font-family: Lato,Segoe UI,Tahoma,Geneva,Verdana,sans-serif !important;
}

.vc-input__label {
  font-family: Lato,Segoe UI,Tahoma,Geneva,Verdana,sans-serif !important;
}

.vc-chrome-toggle-icon {
  filter: brightness(100); /* Changing color of SVG */
}

.vc-chrome-hue-wrap {
  margin-top: 10px;
}

.vc-chrome-alpha-wrap {
  display: none;
}

.vc-chrome-hue-wrap .vc-hue-picker {
  background-color: #232323 !important;
}
</style>
