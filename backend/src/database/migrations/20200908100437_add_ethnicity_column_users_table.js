exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('ethnicity');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('ethnicity');
  })
};
