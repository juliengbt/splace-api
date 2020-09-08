export default class EquipmentLevel {
  public static tName = 'Equipment_Level';

  code: string;

  label: string;

  constructor(code: string, label: string) {
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
