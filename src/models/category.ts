import { Code } from '../ts/types/code';

interface ICategory {
  code?: Code;

  name?: string;
}

class Category {
  public static tName = 'Category';

  code!: Code;

  name!: string;

  constructor(code: Code, name: string) {
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

export { Category, ICategory };
