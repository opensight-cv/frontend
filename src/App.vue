<template>
    <div class="mainApp">
        <NodeEditor />
    </div>
</template>

<script>
//import { Editor } from "@baklavajs/core";
//import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import NodeEditor from "./views/Editor.vue"

export default {
    data() {
        return {
            test:"Test"
        }
    },
    components: {NodeEditor},
}
</script>

<style scoped>
.mainApp {
    height: 100%;
}


</style>
