import ky from "ky";
import { Schema } from "@/api/funcSchema";
import { Nodetree } from "@/api/nodeSchema";
import { FrontendSettings, NetworkSettings } from "@/api/settingSchemma";

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

export function getSettings(): Promise<FrontendSettings> {
  return api.get("config").json();
}

export function postNetworkSettings(settings: NetworkSettings) {
  return api.post("network", { json: settings });
}

// Code below adapted from https://github.com/jcoreio/async-throttle/tree/master/src
/*
The MIT License (MIT)

Copyright (c) 2016-present Andy Edwards

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(ms, 0));
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttle<V>(
  fn: (...args: any[]) => Promise<V>,
  waitMs: number,
  getNextArgs: (args0: any[], args1: any[]) => any[] = (prev, next) => next
): (...args: any[]) => Promise<V> {
  let lastPromise: Promise<any> = delay(0);
  let nextPromise: Promise<V> | null;
  let nextArgs: any[] | null;
  let lastInvokeTime: number;

  function invoke(): Promise<V> {
    lastInvokeTime = Date.now();
    nextPromise = null;
    const args = nextArgs;
    if (!args) throw new Error("unexpected error: nextArgs is null");
    nextArgs = null;
    lastPromise = fn(...args);
    return lastPromise;
  }

  return async (...args: any[]): Promise<V> => {
    nextArgs = nextArgs ? getNextArgs(nextArgs, args) : args;
    if (!nextPromise) {
      nextPromise = Promise.all([lastPromise, delay(lastInvokeTime + waitMs - Date.now())]).then(
        invoke,
        invoke
      );
    }
    return nextPromise;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
// End code adapted from https://github.com/jcoreio/async-throttle/tree/master/src
