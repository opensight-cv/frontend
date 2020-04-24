import ky from "ky";
import { Schema } from "@/components/node-editor/funcSchema";

const api = ky.create({
  prefixUrl:
    process.env.NODE_ENV === "production" ? "http://opensight.local/api/" : "http://localhost/api/",
});

export async function getSchema(): Promise<Schema> {
  return api.get("funcs").json();
}

export function postSchema() {
  return api.get("");
}
