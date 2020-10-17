import { Code } from '../ts/types/code';

interface IEquipmentLevel {
  code?: Code;

  label?: string;
}

class EquipmentLevel {
  public static tName = 'Equipment_Level';

  code!: Code;

  label!: string;

  constructor(code: Code, label: string) {
    this.code = code;
    this.label = label;
  }

  public static fromQuery(obj: any): EquipmentLevel | undefined {
    if (obj && this.tName in obj) {
      return new EquipmentLevel(
        obj[this.tName].code,
        obj[this.tName].label,
      );
    }

    return undefined;
  }
}

export { EquipmentLevel, IEquipmentLevel };
