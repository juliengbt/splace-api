export default class Category {
    public static tName = 'Category';

    code: string;
    name: string;

    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }

    public static fromJSON(obj: any): Category | string {

        if (obj && this.tName in obj) {
            return new Category(obj[this.tName]['code'], obj[this.tName]['name'])
        }

        return "LazyLoad";
    }
}