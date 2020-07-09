declare module "v-click-outside" {
  import { VueConstructor } from "vue";

  const plugin: pluginType;

  export default plugin;

  type pluginType = {
    install(Vue: VueConstructor, args?: any): void;
    directive: Record<string, any>;
  };
}
