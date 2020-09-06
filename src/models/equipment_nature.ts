export default class EquipmentNature {
    public static tName = 'Equipment_Nature';

    code: string;
    label: string;

    constructor(code: string, label: string) {
        this.code = code;
        this.label = label;
    }

    public static fromJSON(obj: any): EquipmentNature | null {

        if (obj && this.tName in obj) {
            return new EquipmentNature(
                obj[this.tName]['code'],
                obj[this.tName]['label']
            );
        }

        return null;
    }
}