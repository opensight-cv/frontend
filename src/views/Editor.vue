<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import NodeOpsi from "@/components/node-editor/NodeOpsi.vue";

import Vue from "vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import OptionPlugin from "@/components/baklava-options-plugin/optionPlugin";

import nodeCtorFromFunction from "@/components/node-editor/nodeFromSchema";
import { getNodetree, getSchema, postNodetree } from "@/api/api";
import { loadNodeTree, saveNodetree } from "@/components/node-editor/nodeTreeSerialize";

export default Vue.extend({
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      interfacePlugin: new InterfaceTypePlugin(),
    };
  },
  async created() {
    this.viewPlugin.components.node = NodeOpsi;
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

    loadNodeTree(this.editor, this.viewPlugin, await getNodetree());
    console.log(await getNodetree());

    this.editor.nodes.forEach((node) => {
      node.events.update.addListener(this, async () => {
        this.save();
      });
    });
    this.editor.events.addNode.addListener({}, async (node) => {
      node.events.update.addListener(this, async () => {
        this.save();
      });
      this.save();
    });
    this.editor.events.removeNode.addListener({}, async (node) => {
      node.events.update.removeListener(this);
      this.save();
    });
    this.editor.events.addConnection.addListener({}, async () => {
      this.save();
    });
    this.editor.events.removeConnection.addListener({}, async () => {
      this.save();
    });
  },
  methods: {
    async save() {
      console.log(saveNodetree(this.editor, this.viewPlugin));
      console.log(JSON.stringify(saveNodetree(this.editor, this.viewPlugin)));

      console.log(await postNodetree(saveNodetree(this.editor, this.viewPlugin)));
      console.log(await getNodetree());
    },
  },
});
</script>
