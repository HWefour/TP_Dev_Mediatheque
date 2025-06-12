const { v4: uuidv4 } = require('uuid');

exports.up = function(knex) {
  return knex.schema.createTable('borrows', function(table) {
    table.increments('id').primary();
    table.string('uuid', 36).notNullable().unique();
    table.integer('utilisateur_id').unsigned().notNullable();
    table.integer('ressource_id').unsigned().notNullable();
    table.date('date_emprunt').notNullable();
    table.date('date_retour').notNullable();
    table.date('date_retour_effective').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Clés étrangères
    table.foreign('utilisateur_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('ressource_id').references('id').inTable('resources').onDelete('CASCADE');
    
    // Index pour améliorer les performances
    table.index(['utilisateur_id']);
    table.index(['ressource_id']);
    table.index(['date_emprunt']);
    table.index(['uuid']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('borrows');
};