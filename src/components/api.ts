import ky from "ky";
import { Schema } from "@/components/node-editor/funcSchema";
import { Nodetree } from "@/components/node-editor/nodeSchema";

const api = ky.create({
  prefixUrl: "/api/",
});

export async function getSchema(): Promise<Schema> {
  return api.get("funcs").json();
}

export function postSchema(nodetree: Nodetree) {
  return api.post("nodes", { json: nodetree });
}
