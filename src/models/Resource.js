const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Resource {
  static get tableName() {
    return 'resources';
  }

  static async create(resourceData) {
    const uuid = uuidv4();
    await db(this.tableName).insert({
      uuid,
      ...resourceData,
      disponible: true,
    });
    
    return this.findByUuid(uuid);
  }

  static async findAll(filters = {}) {
    let query = db(this.tableName);
    
    if (filters.disponible !== undefined) {
      query = query.where('disponible', filters.disponible);
    }
    
    if (filters.type) {
      query = query.where('type', filters.type);
    }
    
    return query.orderBy('created_at', 'desc').select('*');
  }

  static async findByUuid(uuid) {
    const resource = await db(this.tableName)
      .where({ uuid })
      .first();
    
    return resource || null;
  }

  static async updateByUuid(uuid, resourceData) {
    await db(this.tableName)
      .where({ uuid })
      .update({
        ...resourceData,
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

  static async updateAvailability(uuid, disponible) {
    await db(this.tableName)
      .where({ uuid })
      .update({
        disponible,
        updated_at: new Date(),
      });
    
    return this.findByUuid(uuid);
  }

  static async exists(uuid) {
    const resource = await db(this.tableName)
      .where({ uuid })
      .first('id');
    
    return !!resource;
  }
}

module.exports = Resource;