export interface InputOutput {
  type: string;
  params: Record<string, unknown>;
}

export interface Function {
  name: string;
  type: string;
  settings: Record<string, InputOutput>;
  inputs: Record<string, InputOutput>;
  outputs: Record<string, InputOutput>;
}

export interface Module {
  package: string;
  version: string;
  funcs: Function[];
}

export interface Schema {
  modules: Module[];
}
