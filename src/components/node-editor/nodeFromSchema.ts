import { NodeBuilder, Node } from "@baklavajs/core";
import { Function } from "@/components/node-editor/funcSchema";

function defaultValue(type: string): unknown {
  switch (type) {
    case "string":
      return "";
    case "boolean":
      return false;
    case "int":
    case "float":
      return 0;
    case "intr":
    case "floatr":
      return () => [0, 0];
    default:
      console.warn(`Type ${type} not registered for a default value`);
      return undefined;
  }
}

function optionName(type: string): string | undefined {
  switch (type) {
    case "string":
      return "TextOption";
    case "boolean":
      return "CheckboxOption";
    case "int":
      return "IntegerOption";
    case "float":
      return "NumberOption";
    case "intr":
    case "floatr":
      return "RangeOption";
    default:
      console.warn(`Type ${type} not registered for an option`);
      return undefined;
  }
}

export default function nodeCtorFromFunction(
  desc: Function
): { name: string; type: new () => Node } {
  const builder = new NodeBuilder(desc.name);

  for (const [name, setting] of Object.entries(desc.settings)) {
    builder.addOption(name, optionName(setting.type)!!, defaultValue(setting.type), undefined, {
      type: setting.type,
      ...setting.params,
    });
  }

  for (const [name, input] of Object.entries(desc.inputs)) {
    builder.addInputInterface(`in-${name}`, optionName(input.type), defaultValue(input.type), {
      type: input.type,
      displayName: `${name}: ${input.type}`,
      ...input.params,
    });
  }

  for (const [name, output] of Object.entries(desc.outputs)) {
    builder.addOutputInterface(`out-${name}`, {
      type: output.type,
      displayName: `${name}: ${output.type}`,
    });
  }

  return { name: desc.name, type: builder.build() };
}
