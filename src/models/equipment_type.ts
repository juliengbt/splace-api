export default class EquipmentType {
  public static tName = 'Equipment_Type';

  code: string;

  label: string;

  constructor(code: string, label: string) {
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
