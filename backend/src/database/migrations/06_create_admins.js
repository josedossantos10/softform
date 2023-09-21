exports.up = function(knex) {
    return knex.schema.createTable('admins', function(table) {
        table.string('id').primary();
        table.string('password');
        table.boolean('active');
        table.timestamp('lastAcess').nullable();
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('admins');
};
