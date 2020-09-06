export default class Department {
    public static tName = 'Department';

    id: string;
    name: string;
    num: string;

    constructor(id: string, name: string, num: string) {
        this.id = id;
        this.name = name;
        this.num = num;
    }

    public static fromJSON(obj: any): Department | null {

        if (obj && this.tName in obj) {
            return new Department(
                obj[this.tName]['id'].toString('hex'),
                obj[this.tName]['name'],
                obj[this.tName]['num']
            );
        }

        return null;
    }
}