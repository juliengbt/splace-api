export default class Picture {
  public static tName = 'Picture';

  id!: string;

  path!: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }

  public static fromQuery(obj: any): Picture | undefined {
    if (obj && this.tName in obj) {
      return new Picture(
        obj[this.tName].id,
        obj[this.tName].path,
      );
    }

    return undefined;
  }
}
