const { v4: uuidv4 } = require('uuid');

exports.up = function(knex) {
  return knex.schema.createTable('resources', function(table) {
    table.increments('id').primary();
    table.string('uuid', 36).notNullable().unique();
    table.string('titre', 200).notNullable();
    table.enum('type', ['Livre', 'Jeu', 'Film', 'Autre']).notNullable();
    table.string('auteur', 100).notNullable();
    table.boolean('disponible').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Index pour améliorer les performances
    table.index(['type']);
    table.index(['disponible']);
    table.index(['uuid']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('resources');
};