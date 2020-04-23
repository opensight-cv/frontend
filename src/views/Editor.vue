<template>
  <baklava-editor :plugin="viewPlugin"></baklava-editor>
</template>

<script>
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { nodeConstructorFromDesc } from "../components/node-editor/vueNode";

import NumberOption from '@/components/node-editor/options/NumberOption.vue';
import CheckboxOption from '@/components/node-editor/options/CheckboxOption.vue';
import TextOption from '@/components/node-editor/options/TextOption.vue';
import RangeOption from '@/components/node-editor/options/RangeOption.vue';

export default {
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin()
    };
  },
  created() {
    this.editor.use(this.viewPlugin);

    this.viewPlugin.registerOption('NumberOption', NumberOption);
    this.viewPlugin.registerOption('CheckboxOption', CheckboxOption);
    this.viewPlugin.registerOption('TextOption', TextOption);
    this.viewPlugin.registerOption('RangeOption', RangeOption);

    const { name, category, type } = nodeConstructorFromDesc(
      JSON.parse(
        '{"category":"default","name":"Add","settingFields":[{"name":"AAA","type":{"name": "boolean","values":{}}}, {"name":"BBB","type":{"name": "intr","values":{}}}, {"name":"CCC","type":{"name": "string","values":{}}}, {"name":"asad","type":{"name": "int","values":{}}}],"inputFields":[{"name":"a","showOption":true,"type":{"name":"int","values":{}}}],"outputFields":[{"name":"a","type":{"name":"int","values":{}}}]}'
      )
    );
    this.editor.registerNodeType(name, type, category);
  }
};
</script>

<style scoped>
.node-editor {
  background-repeat: repeat;
}
</style>