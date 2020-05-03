<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import Vue from "vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import OptionPlugin from "@/components/baklava-options-plugin/optionPlugin";

import nodeCtorFromFunction from "@/components/node-editor/nodeFromSchema";
import { getNodetree, getSchema, postNodetree, throttle } from "@/api/api";
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
    this.editor.use(this.viewPlugin);
    this.editor.use(this.interfacePlugin);
    this.editor.use(new OptionPlugin());

    this.editor.events.addConnection.addListener(this, (c) => {
      // as only one connection to an input interface is allowed
      // Delete all other connections to the target interface
      this.editor.connections
        .filter((conn) => conn !== c && conn.to === c.to)
        .forEach((conn) => this.editor.removeConnection(conn));
    });

    const schema = await getSchema();

    const throttledSave = throttle(this.save, 500);

    schema.modules.forEach((module) => {
      module.funcs.forEach((func) => {
        const { name, type } = nodeCtorFromFunction(func);
        this.editor.registerNodeType(name, type, module.package);
      });
    });

    console.log(await getNodetree());
    loadNodeTree(this.editor, this.viewPlugin, await getNodetree());

    this.editor.nodes.forEach((node) => {
      node.events.update.addListener(this, async () => {
        await throttledSave();
      });
    });
    this.editor.events.addNode.addListener({}, async (node) => {
      node.events.update.addListener(this, async () => {
        await throttledSave();
      });
      await throttledSave();
    });
    this.editor.events.removeNode.addListener({}, async (node) => {
      node.events.update.removeListener(this);
      await throttledSave();
    });
    this.editor.events.addConnection.addListener({}, async () => {
      await throttledSave();
    });
    this.editor.events.removeConnection.addListener({}, async () => {
      await throttledSave();
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
