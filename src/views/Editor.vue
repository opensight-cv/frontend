<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import Vue from "vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import nodeCtorFromFunction from "@/components/node-editor/vueNode";
import { getSchema } from "@/components/api";

export default Vue.extend({
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      interfacePlugin: new InterfaceTypePlugin(),
    };
  },
  async created() {
    this.editor.use(this.viewPlugin);
    this.editor.use(this.interfacePlugin);
    this.editor.use(new OptionPlugin());

    const schema = await getSchema();
    schema.modules.forEach((module) => {
      module.funcs.forEach((func) => {
        const { name, type } = nodeCtorFromFunction(func);
        this.editor.registerNodeType(name, type, module.package);
      });
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
