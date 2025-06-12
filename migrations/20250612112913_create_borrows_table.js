exports.up = function(knex) {
  return knex.schema.createTable('borrows', function(table) {
    table.increments('id').primary();
    table.uuid('uuid').notNullable().unique().defaultTo(knex.raw('(UUID())'));
    table.integer('utilisateur_id').unsigned().notNullable();
    table.integer('ressource_id').unsigned().notNullable();
    table.date('date_emprunt').notNullable().defaultTo(knex.fn.now());
    table.date('date_retour').notNullable();
    table.date('date_retour_effective').nullable();
    table.timestamps(true, true);
    
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