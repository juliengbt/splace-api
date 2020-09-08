import Category from './category';

interface ISport {
  code: string;

  name: string;

  description: string | null;

  federation: string | null;

  category: Category | null | undefined;
}

class Sport {
  public static tName = 'Sport';

  code: string;

  name: string;

  description: string | null;

  federation: string | null;

  category: Category | null | undefined;

  // eslint-disable-next-line max-len
  constructor(code: string, name: string, description: string | null, federation: string | null, category: Category | null | undefined) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.federation = federation;
    this.category = category;
  }

  public static fromQuery(obj: any): Sport | undefined {
    if (obj && this.tName in obj) {
      return new Sport(obj[Sport.tName].code,
        obj[Sport.tName].name,
        obj[Sport.tName].description,
        obj[Sport.tName].federation,
        obj[Sport.tName].code_category === null ? null : Category.fromQuery(obj));
    }

    return undefined;
  }
}

export { Sport, ISport };
