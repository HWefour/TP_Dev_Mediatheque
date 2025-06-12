const { v4: uuidv4 } = require('uuid');

exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('uuid', 36).notNullable().unique();
    table.string('nom', 50).notNullable();
    table.string('prenom', 50).notNullable();
    table.string('mail', 100).notNullable().unique();
    table.string('telephone', 20).notNullable();
    table.string('nationalite', 50).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Index pour améliorer les performances
    table.index(['mail']);
    table.index(['uuid']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};