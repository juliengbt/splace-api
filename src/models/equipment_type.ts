import { Code } from '../ts/types/code';

interface IEquipmentType {
  code?: Code;

  label?: string;
}

class EquipmentType {
  public static tName = 'Equipment_Type';

  code!: Code;

  label!: string;

  constructor(code: Code, label: string) {
    this.code = code;
    this.label = label;
  }

  public static fromQuery(obj: any): EquipmentType | undefined {
    if (obj && this.tName in obj) {
      return new EquipmentType(
        obj[this.tName].code,
        obj[this.tName].label,
      );
    }

    return undefined;
  }
}

export { EquipmentType, IEquipmentType };
