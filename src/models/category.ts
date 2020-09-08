export default class Category {
  public static tName = 'Category';

  code: string;

  name: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }

  public static fromQuery(obj: any): Category | undefined {
    if (obj && this.tName in obj) {
      return new Category(obj[this.tName].code, obj[this.tName].name);
    }

    return undefined;
  }
}
