import Knex from "knex";

export default class DAO {
    public db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }
}