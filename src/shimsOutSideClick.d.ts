/* eslint-disable */
declare module "v-click-outside" {
  import { VueConstructor } from "vue";

  const plugin: {
    install(Vue: VueConstructor, args?: any): void;
    directive: Record<string, any>;
  };

  export default plugin;
}
