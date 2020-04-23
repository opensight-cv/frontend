export default function funcToNode(oldElement: any) {
  const newSetting = Object.keys(oldElement.settings).map((key, _) => {
    const item = oldElement.settings[key];
    const type = {
      name: 'int',
      values: {},
    };
    switch (item.type) {
      case 'slide':
        type.name = 'intr';
        type.values = {
          min: item.params.min,
          max: item.params.max,
        };
        break;
      case 'int':
        type.name = 'int';
        type.values = {
          min: item.params.min,
          max: item.params.max,
        };
        break;
      case 'bol':
        type.name = 'boolean';
        break;
      case 'str':
        type.name = 'string';
        break;

      default:
        break;
    }
    return {
      name: key,
      type,
    };
  });

  const newImput = Object.keys(oldElement.inputs).map((key, _) => {
    const item = oldElement.inputs[key];

    return {
      name: key,
      type: {
        name: item.type,
        values: {},
      },
    };
  });

  const newOutput = Object.keys(oldElement.outputs).map((key, _) => {
    const item = oldElement.outputs[key];

    return {
      name: key,
      type: {
        name: item.type,
        values: {},
      },
    };
  });

  return {
    category: oldElement.type.split('/')[0],
    name: oldElement.name,
    settingFields: newSetting,
    inputFields: newImput,
    outputFields: newOutput,
  };
}
