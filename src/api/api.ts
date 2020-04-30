import ky from "ky";
import { Schema } from "@/api/funcSchema";
import { Nodetree } from "@/api/nodeSchema";

const api = ky.create({
  prefixUrl: "/api/",
});

export async function getSchema(): Promise<Schema> {
  return api.get("funcs").json();
}

export async function getNodetree(): Promise<Nodetree> {
  return api.get("nodes").json();
}

export function postNodetree(nodetree: Nodetree) {
  return api.post("nodes", { json: nodetree });
}