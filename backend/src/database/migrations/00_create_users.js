exports.up = async function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.string('id').primary();
    table.string('occupation');
    table.string('gender');
    table.integer('age');
    table.integer('a').nullable();
    table.integer('b').nullable();
    table.integer('c').nullable();
    table.integer('d').nullable();
    table.boolean('active').defaultTo(true);
    table.timestamp('termsAcceptedAt').nullable();
    table.timestamp('finishedAt').nullable();
  })
};

exports.down = async function(knex) {
  return knex.schema.dropTable('users');
};
