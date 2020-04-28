// Just a test, not used anywhere right now

<template>
  <div class="dark-num-input">
    <div class="__button --dec" @click="decrement">
      <i-arrow></i-arrow>
    </div>
    <div v-if="!editMode" class="__content" @click="enterEditMode">
      <div class="__label .text-truncate">{{ name }}</div>
      <div class="__value">{{ stringRepresentation }}</div>
    </div>
    <div v-else class="__content">
      <input
        ref="input"
        v-model="tempValue"
        type="number"
        class="dark-input"
        :class="{ '--invalid': invalid }"
        style="text-align: right;"
        @blur="leaveEditMode"
        @keydown.enter="leaveEditMode"
        @mousedown="clicking = true"
      />
    </div>
    <div class="__button --inc" @click="increment">
      <i-arrow></i-arrow>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch } from "vue-property-decorator";
import { NumberOption } from "@baklavajs/plugin-options-vue";
// import Arrow from "@baklavajs/plugin-options-vue/dist/baklavajs-plugin-options-vue/src/Arrow.vue.d"

// @Component({
//   components: {
//     "i-arrow": Arrow,
//   },
// })

export default class DragNumberOption extends NumberOption {
  clicking = false;

  // @Model('change', { type: Number }) readonly clicking!: boolean

  @Watch("clicking")
  sayHi(val: string, oldVal: string) {
    console.log(val, oldVal);
    return this;
  }

  increment() {
    this.setValue(this.v + 0.1);
  }

  decrement() {
    this.setValue(this.v - 0.1);
  }
}
</script>
