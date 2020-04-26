<template>
  <baklava-editor :plugin="viewPlugin" />
</template>

<script lang="ts">
import { Editor, NodeInterface, NodeOption, Connection } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import Vue from "vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";

import nodeCtorFromFunction from "@/components/node-editor/nodeFromSchema";
import { getSchema, postSchema } from "@/components/api";
import { Input, Link, Nodetree } from "@/components/node-editor/nodeSchema";
import OptionPlugin from "@/components/OptionPlugin"

function saveNodeOptions(map: Map<string, NodeOption>): Record<string, unknown> {
  // This gets the value as `unknown` out of each NodeOption and maps it to a new object.
  const obj: Record<string, unknown> = {};
  for (const [k, v] of map) {
    if (k !== "__proto__") {
      // This line maps the NodeOption to the value that the NodeOption holds
      obj[k] = v.value;
    }
  }
  return obj;
}

function linkFromNodeInterface(intf: NodeInterface): Link {
  // NodeInterface is stored as a Record<string, NodeInterface> in INode, where string
  // is the name (machine, not human-readable) of the interface
  for (const [k, v] of intf.parent.interfaces) {
    if (v === intf) {
      // delete the 'out-' part of the name
      return { id: intf.parent.id, name: k.substr(4) };
    }
  }
  throw new Error(`NodeInterface ${intf} has inconsistent parent`);
}

// Connections is a map of the target of a connection to the Connection. This map
// assumes that only one connection can be made to any `Input` NodeInterface.
function saveNodeInterfaces(
  map: Record<string, NodeInterface>,
  connections: Map<NodeInterface, Connection>
): Record<string, Input> {
  const obj: Record<string, Input> = {};
  Object.entries(map).forEach(([name, nodeInterface]) => {
    if (name !== "__proto__") {
      const otherConnection = connections.get(nodeInterface);
      if (otherConnection !== undefined) {
        // delete the 'in-' part of the name
        obj[name.substr(3)] = { link: linkFromNodeInterface(otherConnection.from) };
      } else {
        // delete the 'in-' part of the name
        obj[name.substr(3)] = { value: nodeInterface.value };
      }
    }
  });
  return obj;
}

function saveNodetree(editor: Editor): Nodetree {
  return {
    nodes: editor.nodes.map((n) => {
      return {
        id: n.id,
        type: n.type,
        settings: saveNodeOptions(n.options),
        inputs: saveNodeInterfaces(
          n.inputInterfaces,
          new Map(editor.connections.map((a) => [a.to, a]))
        ),
      };
    }),
  };
}

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
    console.log(schema);
    schema.modules.forEach((module) => {
      module.funcs.forEach((func) => {
        const { name, type } = nodeCtorFromFunction(func);
        this.editor.registerNodeType(name, type, module.package);
      });
    });

    this.editor.events.addNode.addListener({}, async (node) => {
      node.events.update.addListener(this, async () => {
        console.log(`1${JSON.stringify(saveNodetree(this.editor))}`);
        await postSchema(saveNodetree(this.editor));
      });
      console.log(`2${JSON.stringify(saveNodetree(this.editor))}`);
      await postSchema(saveNodetree(this.editor));
    });
    this.editor.events.removeNode.addListener({}, async (node) => {
      node.events.update.removeListener(this);
      console.log(`3${JSON.stringify(saveNodetree(this.editor))}`);
      await postSchema(saveNodetree(this.editor));
    });
    this.editor.events.addConnection.addListener({}, async () => {
      console.log(`4${JSON.stringify(saveNodetree(this.editor))}`);
      await postSchema(saveNodetree(this.editor));
    });
    this.editor.events.removeConnection.addListener({}, async () => {
      console.log(`5${JSON.stringify(saveNodetree(this.editor))}`);
      await postSchema(saveNodetree(this.editor));
    });
  },
});
</script>
