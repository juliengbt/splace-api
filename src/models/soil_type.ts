import { Code } from '../ts/types/code';

interface ISoilType {
  code?: Code;

  label?: string;
}

class SoilType {
  public static tName = 'Soil_Type';

  code!: Code;

  label!: string;

  constructor(code: Code, label: string) {
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

export { SoilType, ISoilType };
