<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import NodeOpsi from "@/components/node-editor/NodeOpsi.vue";
import NodeInterfaceOpsi from "@/components/node-editor/NodeInterfaceOpsi.vue";
import ContextMenuOpsi from "@/components/node-editor/ContextMenuOpsi.vue";

import Vue from "vue";
import OptionPlugin from "@/components/baklava-options-plugin/optionPlugin";

import nodeCtorFromFunction from "@/components/node-editor/nodeFromSchema";
import { getNodetree, getSchema, postNodetree, throttle } from "@/api/api";
import { loadNodeTree, saveNodetree } from "@/components/node-editor/nodeTreeSerialize";
import { InterfaceTypePlugin } from "@/components/node-editor/nodeInterfacePlugin";

export default Vue.extend({
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      interfacePlugin: new InterfaceTypePlugin(),
    };
  },
  async created() {
    this.viewPlugin.components.node = NodeOpsi as any;
    this.viewPlugin.components.nodeInterface = NodeInterfaceOpsi as any;
    this.viewPlugin.components.contextMenu = ContextMenuOpsi as any;

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

    const nodetree = await getNodetree();
    loadNodeTree(this.editor, this.viewPlugin, nodetree);

    this.editor.nodes.forEach((node) => {
      node.events.update.addListener(this, throttledSave);
    });
    this.editor.events.addNode.addListener({}, async (node) => {
      node.events.update.addListener(this, throttledSave);
      await throttledSave();
    });
    this.editor.events.removeNode.addListener({}, async (node) => {
      node.events.update.removeListener(this);
      await throttledSave();
    });
    this.editor.events.addConnection.addListener({}, throttledSave);
    this.editor.events.removeConnection.addListener({}, throttledSave);
  },
  methods: {
    async save() {
      return postNodetree(saveNodetree(this.editor, this.viewPlugin));
    },
  },
});
</script>
