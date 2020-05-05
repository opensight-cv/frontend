<template>
  <div :id="data.id" :class="classes" :style="styles">
    <div
      class="__title"
      @mousedown.self.stop="startDrag"
      @contextmenu.self.prevent="openContextMenu"
    >
      <span v-if="!renaming">{{ data.name }}</span>
      <input
        v-else
        v-model="tempName"
        v-click-outside="doneRenaming"
        type="text"
        class="dark-input"
        placeholder="Node Name"
        @keydown.enter="doneRenaming"
      />

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
      <!-- Outputs -->
      <div class="__outputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(output, name) in data.outputInterfaces"
          :key="output.id"
          :name="name"
          :data="output"
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

      <!-- Inputs -->
      <div class="__inputs">
        <component
          :is="plugin.components.nodeInterface"
          v-for="(input, name) in data.inputInterfaces"
          :key="input.id"
          :name="name"
          :data="input"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
import { VueConstructor } from "vue";

import { ViewPlugin, Components, Editor } from "@baklavajs/plugin-renderer-vue";

// eslint-disable-next-line import/no-unresolved, import/extensions
import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";

@Component({})
export default class NodeViewOpsi extends Components.Node {
  @Prop({ type: Boolean, default: false })
  selected!: boolean;

  @Inject("plugin")
  plugin!: ViewPlugin;

  dragging = false;

  renaming = false;

  tempName = "";

  contextMenu = {
    show: false,
    x: 0,
    y: 0,
    items: [
      { value: "delete", label: "Delete" },
      { value: "duplicate", label: "Duplicate" },
    ],
  };

  get classes() {
    return {
      node: true,
      "--selected": this.selected,
      "--dragging": this.dragging,
      "--two-column": !!this.data.twoColumn,
    };
  }

  get styles() {
    return {
      top: `${this.data.position.y}px`,
      left: `${this.data.position.x}px`,
      width: `${this.data.width}px`,
    };
  }

  get options() {
    return Array.from(this.data.options.entries());
  }

  mounted() {
    this.data.events.addInterface.addListener(this, () => this.update());
    this.data.events.removeInterface.addListener(this, () => this.update());
    this.data.events.addOption.addListener(this, () => this.update());
    this.data.events.removeOption.addListener(this, () => this.update());
    this.plugin.hooks.renderNode.execute(this);
  }

  updated() {
    this.plugin.hooks.renderNode.execute(this);
  }

  beforeDestroy() {
    this.data.events.addInterface.removeListener(this);
    this.data.events.removeInterface.removeListener(this);
    this.data.events.addOption.removeListener(this);
    this.data.events.removeOption.removeListener(this);
  }

  update() {
    this.$forceUpdate();
  }

  startDrag() {
    this.dragging = true;
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.stopDrag);
    this.select();
  }

  select() {
    this.$emit("select", this);
  }

  stopDrag() {
    this.dragging = false;
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.stopDrag);
  }

  handleMove(ev: MouseEvent) {
    if (this.dragging) {
      this.data.position.x += ev.movementX / this.plugin.scaling;
      this.data.position.y += ev.movementY / this.plugin.scaling;
    }
  }

  openContextMenu(ev: MouseEvent) {
    this.contextMenu.show = true;
    this.contextMenu.x = ev.offsetX;
    this.contextMenu.y = ev.offsetY;
  }

  onContextMenu(action: string) {
    switch (action) {
      case "delete":
        this.plugin.editor.removeNode(this.data);
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
      node.options.get(name)!.value = value;
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
