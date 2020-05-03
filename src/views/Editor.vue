<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import NodeOpsi from "@/components/node-editor/NodeOpsi.vue";
import NodeInterfaceOpsi from "@/components/node-editor/NodeInterfaceOpsi.vue";

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
    this.viewPlugin.components.nodeInterface = NodeInterfaceOpsi;
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
        await this.save();
      });
    });
    this.editor.events.addNode.addListener({}, async (node) => {
      node.events.update.addListener(this, async () => {
        await this.save();
      });
      await this.save();
    });
    this.editor.events.removeNode.addListener({}, async (node) => {
      node.events.update.removeListener(this);
      await this.save();
    });
    this.editor.events.addConnection.addListener({}, async () => {
      await this.save();
    });
    this.editor.events.removeConnection.addListener({}, async () => {
      await this.save();
    });
  },
  methods: {
    async save() {
      const data = saveNodetree(this.editor, this.viewPlugin);
      console.log(data.nodes[data.nodes.length - 1].extras.position?.x);
      console.log(JSON.stringify(data));

      await postNodetree(data);
    },
  },
});
</script>
