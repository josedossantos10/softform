
exports.up = async function(knex) {
  return knex.schema.createTable('answers', function(table) {
    table.increments();
    
    table.string('userId').notNullable();
    table.foreign('userId').references('id').inTable('users');
    
    table.integer('questionId').notNullable().unsigned();
    table.foreign('questionId').references('id').inTable('questions');

    table.text('answer', 'longtext').notNullable();

    table.timestamp('answeredAt').nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('answers');
};
