
exports.up = async function(knex) {
  return knex.schema.createTable('alternatives', function(table) {
    table.increments();
    
    table.integer('questionId').notNullable().unsigned();
    table.foreign('questionId').references('id').inTable('questions');

    table.text('text', 'longtext');
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('alternatives');
};
