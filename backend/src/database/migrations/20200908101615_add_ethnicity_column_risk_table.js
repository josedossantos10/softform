
exports.up = function(knex) {
  return knex.schema.table('risk', function(table) {
    table.string('ethnicity');
  });
};

exports.down = function(knex) {
  return knex.schema.table('risk', function(table) {
    table.dropColumn('ethnicity');
  })
};
