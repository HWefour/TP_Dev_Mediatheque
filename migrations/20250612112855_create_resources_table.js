exports.up = function(knex) {
  return knex.schema.createTable('resources', function(table) {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().unique().defaultTo(knex.raw('(UUID())'));
    table.string('titre', 200).notNullable();
    table.enum('type', ['Livre', 'Jeu', 'Film', 'Autre']).notNullable();
    table.string('auteur', 100).notNullable();
    table.boolean('disponible').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    // Index pour améliorer les performances
    table.index(['type']);
    table.index(['disponible']);
    table.index(['uuid']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('resources');
};