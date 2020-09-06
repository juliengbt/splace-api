import Category from "./category";

export default class Sport {
    public static tName = 'Sport';

    code: string;
    name: string;
    description: string;
    federation: string;
    category: Category | null | string;

    constructor(code: string, name: string, description: string, federation: string, category: Category | null | string) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.federation = federation;
        this.category = category;
    }

    public static fromJSON(obj: any): Sport | null | string {

        if (obj && this.tName in obj) {
            return new Sport(obj[Sport.tName]['code'],
                obj[Sport.tName]['name'],
                obj[Sport.tName]['description'],
                obj[Sport.tName]['federation'],
                obj[Sport.tName]['code_category'] === null ? null : Category.fromJSON(obj)
            );
        }

        return "LazyLoad";
    }
}