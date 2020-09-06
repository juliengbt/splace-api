import Knex from "knex";
import DAO from "./DAO";
import Sport from "../models/sport";
import Category from "../models/category";

export default class SportDAO extends DAO {

    constructor(db: Knex) {
        super(db);
    }

    public all(category: string | undefined, lazy: boolean): Promise<(Sport | null | string)[]> {
        const query = this.db.from(Sport.tName)
            .options({ nestTables: true, rowMode: 'array' });

        if (!lazy) {
            query.innerJoin(Category.tName, Category.tName + '.code', Sport.tName + '.code_category');
        }
        if (category) {
            query.where(Sport.tName+'.code_category', category);
        }

        return query.then((res) => res.map(x => Sport.fromJSON(x)));
    }

    public findByCode(code: string, lazy: boolean): Promise<Sport | null | string> {
        const query = this.db.from(Sport.tName)
            .where(Sport.tName + '.code', code)
            .options({ nestTables: true, rowMode: 'array' });

        if (!lazy) {
            query.innerJoin(Category.tName, Category.tName + '.code', Sport.tName + '.code_category');
        }

        return query.then((res) => Sport.fromJSON(res[0]));
    }

}