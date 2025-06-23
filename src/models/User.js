const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static get tableName() {
    return 'users';
  }

  static async create(userData) {
    const uuid = uuidv4();
    await db(this.tableName).insert({
      uuid,
      ...userData,
    });
    
    return this.findByUuid(uuid);
  }

  static async findAll(options = {}) {
    let query = db(this.tableName);
    
    if (options.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || 'asc');
    } else {
      query = query.orderBy('created_at', 'desc');
    }
    
    return query.select('*');
  }

  static async findByUuid(uuid) {
    const user = await db(this.tableName)
      .where({ uuid })
      .first();
    
    return user || null;
  }

  static async findByEmail(mail) {
    const user = await db(this.tableName)
      .where({ mail })
      .first();
    
    return user || null;
  }

  static async updateByUuid(uuid, userData) {
    await db(this.tableName)
      .where({ uuid })
      .update({
        ...userData,
        updated_at: new Date(),
      });
    
    return this.findByUuid(uuid);
  }

  static async deleteByUuid(uuid) {
    const deletedRows = await db(this.tableName)
      .where({ uuid })
      .del();
    
    return deletedRows > 0;
  }

  static async exists(uuid) {
    const user = await db(this.tableName)
      .where({ uuid })
      .first('id');
    
    return !!user;
  }
}

module.exports = User;