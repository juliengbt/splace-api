interface IOwner {
  code?: string;

  label?: string;
}

class Owner {
  public static tName = 'Owner';

  code!: string;

  label!: string;

  constructor(code: string, label: string) {
    this.code = code;
    this.label = label;
  }

  public static fromQuery(obj: any): Owner | undefined {
    if (obj && this.tName in obj) {
      return new Owner(
        obj[this.tName].code,
        obj[this.tName].label,
      );
    }

    return undefined;
  }
}

export { Owner, IOwner };
