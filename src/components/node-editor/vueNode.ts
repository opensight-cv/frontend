import { NodeBuilder, Node } from '@baklavajs/core';
import { Type, NodeDescription } from './nodeSchema';

function defaultValue(type: Type): any {
  switch (type.name) {
    case 'string':
      return '';
    case 'boolean':
      return false;
    case 'int':
    case 'float':
      return 0;
    case 'intr':
    case 'floatr':
      return () => [0, 0];
  }
}

function optionName(type: Type): string {
  switch (type.name) {
    case 'string':
      return 'TextOption';
    case 'boolean':
      return 'CheckboxOption';
    case 'int':
    case 'float':
      return 'NumberOption';
    case 'intr':
    case 'floatr':
      return 'RangeOption';
  }
}

export function nodeConstructorFromDesc(desc: NodeDescription): {name: string; category: string; type: new() => Node} {
  const builder = new NodeBuilder(desc.name);

  for (const { name, type, showOption } of desc.inputFields) {
    if(showOption) {
      builder.addInputInterface(`in-${name}`, optionName(type), defaultValue(type),
      { type: type.name, displayName: `${name}: ${type.name}` });
    } else {
      builder.addInputInterface(`in-${name}`, undefined, undefined,
      { type: type.name, displayName: `${name}: ${type.name}` });
    }  
  }

  for (const { name, type } of desc.outputFields) {
    builder.addOutputInterface(`out-${name}`, { type: type.name, displayName: `${name}: ${type.name}` });
  }

  for (const { name, type } of desc.settingFields) {
    if (type.name === 'int' || type.name === 'float') {
      builder.addOption(name, optionName(type), defaultValue(type), undefined,
        {
          type: type.name, min: type.values.min, max: type.values.max, numberType: type.name,
        });
    } else {
      builder.addOption(name, optionName(type), defaultValue(type), undefined, { type: type.name });
    }
  }

  return { name: desc.name, category: desc.category, type: builder.build() };
}
