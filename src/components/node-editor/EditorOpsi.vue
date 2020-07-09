<template>
  <div
    tabindex="-1"
    :class="[
      'node-editor',
      { 'ignore-mouse': !!temporaryConnection, '--temporary-connection': !!temporaryConnection },
    ]"
    @mousemove="mouseMoveHandler"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    @wheel.self="mouseWheel"
    @keydown="keyDown"
    @keyup="keyUp"
    @contextmenu.self.prevent="openContextMenu"
  >
    <svg class="connections-container">
      <g v-for="connection in connections" :key="connection.id">
        <slot name="connections" :connection="connection">
          <component :is="plugin.components.connection" :connection="connection"></component>
        </slot>
      </g>
      <component
        :is="plugin.components.tempConnection"
        v-if="temporaryConnection"
        :connection="temporaryConnection"
      ></component>
    </svg>

    <div class="node-container" :style="styles">
      <component
        :is="plugin.components.node"
        v-for="node in nodes"
        :key="node.id"
        :data="node"
        :selected="selectedNodes.includes(node)"
        @select="selectNode(node)"
      >
      </component>
    </div>

    <component
      :is="plugin.components.contextMenu"
      v-model="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="contextMenu.items"
      flippable
      @click="onContextMenuClick"
    ></component>

    <component :is="plugin.components.sidebar"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { VueConstructor } from "vue";

// eslint-disable-next-line import/no-unresolved, import/extensions
import {
  IEditor,
  INode,
  ITransferConnection,
  INodeInterface,
  ITemporaryConnection,
  TemporaryConnectionState,
  // eslint-disable-next-line import/no-unresolved, import/extensions
} from "@baklavajs/core/dist/baklavajs-core/types";
import { Editor } from "@baklavajs/plugin-renderer-vue";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { IMenuItem } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/src/components/ContextMenu.vue";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";

@Component
export default class EditorView extends Editor {
  @Watch("plugin.nodeTypeAliases")
  updateContextMenu() {
    const categories = Array.from(this.plugin.editor.nodeCategories.keys())
      .filter((c) => c !== "default")
      .map((c) => {
        const nodes = Array.from(this.plugin.editor.nodeCategories.get(c)!).map((n) => ({
          value: `addNode:${n}`,
          label: this.plugin.nodeTypeAliases[n] || n,
        }));
        return { label: c, submenu: nodes };
      });

    const defaultNodes = this.plugin.editor.nodeCategories.get("default")!.map((n) => ({
      value: `addNode:${n}`,
      label: this.plugin.nodeTypeAliases[n] || n,
    }));

    const addNodeSubmenu: IMenuItem[] = [...categories];
    if (categories.length > 0 && defaultNodes.length > 0) {
      addNodeSubmenu.push({ isDivider: true });
    }
    addNodeSubmenu.push(...defaultNodes);

    this.contextMenu.items = [
      {
        label: "Add Node",
        submenu: addNodeSubmenu,
      },
    ] as IMenuItem[];
  }

  onContextMenuClick(action: string) {
    if (action.startsWith("addNode:")) {
      const nodeName = action.substring(action.indexOf(":") + 1);
      const Nt = this.plugin.editor.nodeTypes.get(nodeName);
      if (Nt) {
        const node = this.plugin.editor.addNode(new Nt()) as IViewNode;
        if (node) {
          node.position.x = this.contextMenu.x / this.plugin.scaling - this.plugin.panning.x;
          node.position.y = this.contextMenu.y / this.plugin.scaling - this.plugin.panning.y;
        }
      }
    } else if (action === "copy" && this.selectedNodes.length > 0) {
      this.clipboard.copy(this.selectedNodes);
    } else if (action === "paste" && !this.clipboard.isEmpty) {
      this.clipboard.paste();
    }
  }
}
</script>
