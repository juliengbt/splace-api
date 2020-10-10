export default class SoilType {
  public static tName = 'Soil_Type';

  code!: string;

  label!: string;

  constructor(code: string, label: string) {
    this.code = code;
    this.label = label;
  }

  public static fromQuery(obj: any): SoilType | undefined {
    if (obj && this.tName in obj) {
      return new SoilType(
        obj[this.tName].code,
        obj[this.tName].label,
      );
    }

    return undefined;
  }
}
