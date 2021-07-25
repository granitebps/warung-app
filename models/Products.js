import * as SQLite from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";

export default class Product extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("warung.db");
  }

  static get tableName() {
    return "products";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
      name: { type: types.TEXT, not_null: true },
      code: { type: types.TEXT, not_null: true },
      price: { type: types.TEXT },
      timestamp: { type: types.INTEGER, default: () => Date.now() },
    };
  }
}
