export interface Link {
  name: string;
  id: string;
}

export interface Input {
  link?: Link;
  value?: unknown;
}

export interface Node {
  type: string;
  id: string;
  settings: Record<string, unknown>;
  inputs: Record<string, Input>;
}

export interface NodeTree {
  nodes: Node[];
}
