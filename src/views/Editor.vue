<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from '@baklavajs/core';
import { ViewPlugin } from '@baklavajs/plugin-renderer-vue';
import nodeConstructorFromDesc from '@/components/node-editor/vueNode';

import Vue from 'vue';
import { InterfaceTypePlugin } from '@baklavajs/plugin-interface-types';
import { OptionPlugin } from '@baklavajs/plugin-options-vue';

import funcs from '@/funcs.json';
import funcToNode from '@/funcToNode';

export default Vue.extend({
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
    };
  },
  created() {
    this.editor.use(this.viewPlugin);
    this.editor.use(new InterfaceTypePlugin());
    this.editor.use(new OptionPlugin());

    funcs.funcs.forEach((oldFunc) => {
      const newElement: any = funcToNode(oldFunc);
      const { name, category, type } = nodeConstructorFromDesc(newElement);
      this.editor.registerNodeType(name, type, category);
    });
    this.editor.events.addNode.addListener({}, () => {
      console.log(JSON.stringify(this.editor.save()));
    });
    this.editor.events.removeNode.addListener({}, () => {
      console.log(JSON.stringify(this.editor.save()));
    });
  },
});
</script>

<style scoped>
/*.node-editor {*/
/*  background-repeat: repeat;*/
/*}*/
</style>
