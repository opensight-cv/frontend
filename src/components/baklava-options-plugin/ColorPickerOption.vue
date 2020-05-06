<template>
  <div class="color-picker-container">
    <div class="__label .text-truncate color-picker-label">{{ name }}</div>
    <div
      class="color-picker-box"
      :style="{ backgroundColor: value }"
      tabindex="-1"
      @click="isOpen = true"
      @focusout="isOpen = false"
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
import { Chrome } from "vue-color";

@Component({
  components: { "chrome-picker": Chrome },
})
export default class ColorPickerOption extends Vue {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  value!: string;

  isOpen = false;
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
</style>
