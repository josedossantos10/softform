
exports.up = async function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.increments();
    table.integer('order').unique().unsigned().notNullable();
    table.string('question').notNullable();
    table.string('questionType').notNullable();
    table.boolean('monitoring').defaultTo(false);
    table.string('jumpAlternative');
    table.integer('jumpToQuestionId');
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('questions');
};
