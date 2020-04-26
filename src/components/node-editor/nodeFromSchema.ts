import { NodeBuilder, Node } from "@baklavajs/core";
import { Function, InputOutput } from "@/components/node-editor/funcSchema";

function defaultValue(io: InputOutput): unknown {
  if ("default" in io.params) {
    return io.params.default;
  }
  switch (io.type) {
    case "str":
      return "";
    case "bool":
      return false;
    case "int":
    case "float":
    case "Slide":
      return io.params.min ?? 0;
    case "Enum":
      return (io.params.items as unknown[])[0];
    default:
      return undefined;
  }
}

function optionName(io: InputOutput): string | undefined {
  switch (io.type) {
    case "str":
      return "InputOption";
    case "bool":
      return "CheckboxOption";
    case "int":
      return "IntegerOption";
    case "float":
      return "NumberOption";
    case "Slide":
      return "SliderOption";
    case "Enum":
      return "SelectOption";
    default:
      return undefined;
  }
}

export default function nodeCtorFromFunction(
  desc: Function
): { name: string; type: new () => Node } {
  const builder = new NodeBuilder(desc.type);
  builder.setName(desc.name);

  for (const [name, setting] of Object.entries(desc.settings)) {
    builder.addOption(name, optionName(setting)!!, defaultValue(setting), undefined, {
      type: setting.type,
      ...setting.params,
    });
  }

  for (const [name, input] of Object.entries(desc.inputs)) {
    builder.addInputInterface(`in-${name}`, optionName(input), defaultValue(input), {
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

  return { name: desc.type, type: builder.build() };
}
