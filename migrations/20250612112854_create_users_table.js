exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().unique().defaultTo(knex.raw('(UUID())'));
    table.string('nom', 50).notNullable();
    table.string('prenom', 50).notNullable();
    table.string('mail', 100).notNullable().unique();
    table.string('telephone', 20).notNullable();
    table.string('nationalite', 50).notNullable();
    table.timestamps(true, true);
    
    // Index pour améliorer les performances
    table.index(['mail']);
    table.index(['uuid']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};