/* eslint-disable */
// ^ Eslint has problems with importing ts modules for some reason &
// the setting that's supposed to fix it doesn't work
// https://github.com/benmosher/eslint-plugin-import/issues/1573

import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { IViewPlugin } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";
import { IEditor } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-core/types";

import * as Options from "./OpsiOptions";

/**
 * Copypasta from the original OptionPlugin class
 * Modified to use our custom options list (OpsiOptions)
 */

export default class OpsiOptionPlugin extends OptionPlugin {
    public register(editor: IEditor) {
        editor.events.usePlugin.addListener(this, (p) => {
            if (p.type === "ViewPlugin") {
                this.OpsiRegisterOptions(p as IViewPlugin); // modified
            }
        });
        editor.plugins.forEach((p) => {
            if (p.type === "ViewPlugin") {
                this.OpsiRegisterOptions(p as IViewPlugin); // modified
            }
        });
    }

    private OpsiRegisterOptions(viewPlugin: IViewPlugin) {
        Object.entries(Options).forEach(([k, v]) => {
            viewPlugin.registerOption(k, v);
        });
        return this;
    }
}
