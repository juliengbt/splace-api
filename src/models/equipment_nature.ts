import { Code } from '../ts/types/code';

interface IEquipmentNature {
  code?: Code;

  label?: string;
}

class EquipmentNature {
  public static tName = 'Equipment_Nature';

  code!: Code;

  label!: string;

  constructor(code: Code, label: string) {
    this.code = code;
    this.label = label;
  }

  public static fromQuery(obj: any): EquipmentNature | undefined {
    if (obj && this.tName in obj) {
      return new EquipmentNature(
        obj[this.tName].code,
        obj[this.tName].label,
      );
    }

    return undefined;
  }
}

export { EquipmentNature, IEquipmentNature };
