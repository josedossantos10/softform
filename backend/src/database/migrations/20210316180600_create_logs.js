
exports.up = async function(knex) {
  return knex.schema.createTable('logs', function(table) {
    table.increments();
    
    table.string('userId').notNullable();
    table.foreign('userId').references('id').inTable('users');

    table.text('message', 'longtext').notNullable();

    table.timestamp('timestamp').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logs');
};
