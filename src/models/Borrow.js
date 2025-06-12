const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Borrow {
  static get tableName() {
    return 'borrows';
  }

  static async create(borrowData) {
    const uuid = uuidv4();
    const [id] = await db(this.tableName).insert({
      uuid,
      ...borrowData,
    });
    
    return this.findByUuidWithRelations(uuid);
  }

  static async findAll(filters = {}) {
    let query = db(this.tableName)
      .leftJoin('users', 'borrows.utilisateur_id', 'users.id')
      .leftJoin('resources', 'borrows.ressource_id', 'resources.id')
      .select(
        'borrows.*',
        'users.uuid as user_uuid',
        'users.nom',
        'users.prenom',
        'users.mail',
        'resources.uuid as resource_uuid',
        'resources.titre',
        'resources.type',
        'resources.auteur'
      );
    
    if (filters.actif === true) {
      query = query.whereNull('borrows.date_retour_effective');
    } else if (filters.actif === false) {
      query = query.whereNotNull('borrows.date_retour_effective');
    }
    
    return query.orderBy('borrows.created_at', 'desc');
  }

  static async findByUuid(uuid) {
    const borrow = await db(this.tableName)
      .where({ uuid })
      .first();
    
    return borrow || null;
  }

  static async findByUuidWithRelations(uuid) {
    const borrow = await db(this.tableName)
      .leftJoin('users', 'borrows.utilisateur_id', 'users.id')
      .leftJoin('resources', 'borrows.ressource_id', 'resources.id')
      .where('borrows.uuid', uuid)
      .select(
        'borrows.*',
        'users.uuid as user_uuid',
        'users.nom',
        'users.prenom',
        'users.mail',
        'users.telephone',
        'users.nationalite',
        'resources.uuid as resource_uuid',
        'resources.titre',
        'resources.type',
        'resources.auteur',
        'resources.disponible'
      )
      .first();
    
    return borrow || null;
  }

  static async updateByUuid(uuid, borrowData) {
    await db(this.tableName)
      .where({ uuid })
      .update({
        ...borrowData,
        updated_at: new Date(),
      });
    
    return this.findByUuidWithRelations(uuid);
  }

  static async deleteByUuid(uuid) {
    const deletedRows = await db(this.tableName)
      .where({ uuid })
      .del();
    
    return deletedRows > 0;
  }

  static async markAsReturned(uuid, dateRetourEffective = new Date()) {
    return this.updateByUuid(uuid, {
      date_retour_effective: dateRetourEffective,
    });
  }

  static async exists(uuid) {
    const borrow = await db(this.tableName)
      .where({ uuid })
      .first('id');
    
    return !!borrow;
  }

  static async getUserIdByUuid(userUuid) {
    const user = await db('users')
      .where({ uuid: userUuid })
      .first('id');
    
    return user ? user.id : null;
  }

  static async getResourceIdByUuid(resourceUuid) {
    const resource = await db('resources')
      .where({ uuid: resourceUuid })
      .first('id');
    
    return resource ? resource.id : null;
  }
}

module.exports = Borrow;