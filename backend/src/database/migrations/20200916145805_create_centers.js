
exports.up = function(knex) {
  return knex.schema.createTable('centers', function(table) {
    table.string('id').primary();

    table.string('url').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('centers');
};
