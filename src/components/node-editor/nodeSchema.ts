export interface NodeDescription {
    category: string;
    name: string;
    settingFields: Field[];
    inputFields: InputField[];
    outputFields: Field[];
}

export interface Field {
    name: string;
    type: Type;
}

export interface InputField extends Field {
    showOption: boolean | undefined;
}

export type Type = IntegralType | FloatType | BooleanType | StringType | IntegralRangeType | FloatRangeType;

export interface IntegralType {
    name: 'int';
    values: { min: number; max: number };
}

export interface FloatType {
    name: 'float';
    values: { min: number; max: number };
}

export interface BooleanType {
    name: 'boolean';
    values: {};
}

export interface StringType {
    name: 'string';
    values: {};
}

export interface IntegralRangeType {
    name: 'intr';
    values: { min: number; max: number };
}

export interface FloatRangeType {
    name: 'floatr';
    values: { min: number; max: number };
}
