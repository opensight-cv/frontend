import { Connection, Editor, NodeInterface, NodeOption, Node } from "@baklavajs/core";
import { Input, Link, Nodetree } from "@/api/nodeSchema";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { IViewNode } from "@baklavajs/plugin-options-vue/dist/baklavajs-plugin-renderer-vue/types";

function linkFromNodeInterface(intf: NodeInterface): Link {
  // NodeInterface is stored as a Map<string, NodeInterface> in INode, where string
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
function saveConnections(
  map: Record<string, NodeInterface>,
  connections: Map<NodeInterface, Connection>
): Record<string, Input> {
  const obj: Record<string, Input> = {};
  for (const [name, nodeInterface] of Object.entries(map)) {
    if (name !== "__proto__") {
      const otherConnection = connections.get(nodeInterface);
      if (otherConnection !== undefined) {
        // delete the 'in-' part of the name
        obj[name.substr(3)] = {
          link: linkFromNodeInterface(otherConnection.from),
          value: null,
        };
      } else {
        // delete the 'in-' part of the name
        obj[name.substr(3)] = {
          value: nodeInterface.value,
          link: null,
        };
      }
    }
  }
  return obj;
}

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

export function saveNodetree(editor: Editor, view: ViewPlugin): Nodetree {
  return {
    nodes: editor.nodes.map((n) => {
      return {
        id: n.id,
        type: n.type,
        settings: saveNodeOptions(n.options),
        inputs: saveConnections(
          n.inputInterfaces,
          new Map(editor.connections.map((a) => [a.to, a]))
        ),
        extras: {
          position: ((n as unknown) as IViewNode).position,
        },
      };
    }),
    extras: {
      panning: view.panning,
      scaling: view.scaling,
    },
  };
}

export function loadNodeTree(editor: Editor, view: ViewPlugin, nodetree: Nodetree) {
  view.panning = nodetree.extras.panning ?? view.panning;
  view.scaling = nodetree.extras.scaling ?? view.scaling;

  for (let i = editor.connections.length - 1; i >= 0; i--) {
    editor.removeConnection(editor.connections[i]);
  }

  for (let i = editor.nodes.length - 1; i >= 0; i--) {
    editor.removeNode(editor.nodes[i]);
  }

  const linkMap = new Map<Node, { toName: string; fromName: string; fromId: string }[]>();
  const nodeMap = new Map<string, Node>();

  for (const n of nodetree.nodes) {
    const NodeType = editor.nodeTypes.get(n.type);
    if (!NodeType) {
      // eslint-disable-next-line no-console
      console.warn(`Node type ${n.type} is not registered`);
      continue;
    }

    const node = new NodeType() as Node;
    node.id = n.id;
    editor.addNode(node);

    nodeMap.set(node.id, node);

    for (const [name, value] of Object.entries(n.settings)) {
      node.options.get(name)!.value = value;
    }

    for (const [name, value] of Object.entries(n.inputs)) {
      if (value.value) {
        node.interfaces.get(`in-${name}`)!.value = value.value;
      } else if (value.link) {
        const arr = linkMap.get(node) ?? [];
        arr.push({
          fromName: `out-${value.link.name}`,
          fromId: value.link.id,
          toName: `in-${name}`,
        });
        linkMap.set(node, arr);
      }
    }

    ((node as unknown) as IViewNode).position =
      n.extras.position ?? ((node as unknown) as IViewNode).position;
  }

  for (const [node, linkArr] of linkMap) {
    for (const { fromName, fromId, toName } of linkArr) {
      const toInterface = node.getInterface(toName);
      const fromInterface = nodeMap.get(fromId)!.getInterface(fromName);

      editor.addConnection(fromInterface, toInterface);
    }
  }
}
