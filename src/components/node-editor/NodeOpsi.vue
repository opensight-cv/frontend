<template>
  <div :id="data.id" :class="classes" :style="styles">
    <div
      class="__title"
      :style="{
        display: 'grid',
        gridTemplateColumns: 'auto min-content',
        paddingRight: '5.2px',
      }"
      @mousedown.self.stop.left="startDrag"
      @contextmenu.self.prevent="openContextMenu"
    >
      <span style="width: 80%;">{{ data.name }}</span>

      <div style="cursor: pointer;" @click="deleteNode">
        <svg
          width="13.9"
          height="13.9"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="times"
          class="svg-inline--fa fa-times fa-w-11"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
        >
          <path
            fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
          ></path>
        </svg>
      </div>

      <component
        :is="plugin.components.contextMenu"
        v-model="contextMenu.show"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :items="contextMenu.items"
        @click="onContextMenu"
      ></component>
    </div>

    <div class="__content" @mousedown.self.stop="startDrag">
      <!-- Inputs -->
      <div class="__inputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(input, name) in data.inputInterfaces"
          :key="input.id"
          :name="name"
          :data="input"
          @drag-down="startDrag"
        ></component>
      </div>

      <!-- Outputs -->
      <div class="__outputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(output, name) in data.outputInterfaces"
          :key="output.id"
          :name="name"
          :data="output"
          @drag-down="startDrag"
        ></component>
      </div>

      <!-- Options -->
      <div class="__options" @mousedown.self.stop="startDrag">
        <template v-for="[name, option] in options">
          <component
            :is="plugin.components.nodeOption"
            :key="name"
            :name="name"
            :option="option"
            :component-name="option.optionComponent"
            :node="data"
            @openSidebar="openSidebar(name)"
          ></component>

          <portal
            v-if="
              plugin.sidebar.nodeId === data.id &&
              plugin.sidebar.optionName === name &&
              option.sidebarComponent
            "
            :key="'sb_' + name"
            to="sidebar"
          >
            <component
              :is="plugin.components.nodeOption"
              :key="data.id + name"
              :name="name"
              :option="option"
              :component-name="option.sidebarComponent"
              :node="data"
            ></component>
          </portal>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import { Components } from "@baklavajs/plugin-renderer-vue";

// eslint-disable-next-line import/no-unresolved, import/extensions
import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";

@Component
export default class NodeViewOpsi extends Components.Node {
  contextMenu = {
    show: false,
    x: 0,
    y: 0,
    items: [
      { value: "delete", label: "Delete" },
      { value: "duplicate", label: "Duplicate" },
    ],
  };

  deleteNode() {
    this.plugin.editor.removeNode(this.data);
  }

  startDrag() {
    this.contextMenu.show = false;
    this.dragging = true;
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.stopDrag);
    this.select();
  }

  onContextMenu(action: string) {
    switch (action) {
      case "delete":
        this.deleteNode();
        break;
      case "duplicate": {
        this.duplicateNode();

        /* const newData = this.data;
        newData.id = this.plugin.editor.generateId("Node_");
        this.plugin.editor.addNode(newData); */
        break;
      }
      default:
        break;
    }
  }

  duplicateNode() {
    // Get the save of the current node's inlcluding name, type and options
    const nodeSave = this.data.save();

    // Create a new node based on the node type of the existing node and check if it exists
    const NodeType = this.plugin.editor.nodeTypes.get(nodeSave.type);
    if (!NodeType) {
      console.warn(`Node type ${nodeSave.type} is not registered`);
      return;
    }

    // Add that node to the editor
    const node = new NodeType() as IViewNode;
    this.plugin.editor.addNode(node);

    // Set the node options based on the original node
    for (const option of Object.entries(nodeSave.options)) {
      const [name, value] = option[1];

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node.setOptionValue(name, value);
    }

    node.position = {
      x: this.data.position.x + this.data.width,
      y: this.data.position.y,
    };
  }

  doneRenaming() {
    this.data.name = this.tempName;
    this.renaming = false;
  }

  openSidebar(optionName: string) {
    this.plugin.sidebar.nodeId = this.data.id;
    this.plugin.sidebar.optionName = optionName;
    this.plugin.sidebar.visible = true;
  }
}
</script>
