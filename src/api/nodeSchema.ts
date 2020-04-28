export interface Link {
  name: string;
  id: string;
}

export interface Input {
  link: Link | null;
  value: unknown; // includes null by default
}

export interface Node {
  type: string;
  id: string;
  settings: Record<string, unknown>;
  inputs: Record<string, Input>;
  extras: {
    position?: {
      x: number;
      y: number;
    };
  };
}

export interface Nodetree {
  nodes: Node[];
  extras: {
    panning?: {
      x: number;
      y: number;
    };
    scaling?: number;
  };
}
