exports.up = async function (knex) {
  return knex.schema.createTable('risk', function (table) {
    table.string('userId').primary();
    table.string('occupation');
    table.string('gender');
    table.integer('age');
    table.integer('a').nullable();
    table.integer('b').nullable();
    table.integer('c').nullable();
    table.integer('d').nullable();
    table.string('1').nullable();
    table.string('2').nullable();
    table.string('3').nullable();
    table.string('4').nullable();
    table.string('5').nullable();
    table.string('6').nullable();
    table.string('7').nullable();
    table.string('8').nullable();
    table.string('9').nullable();
    table.string('10').nullable();
    table.string('11').nullable();
    table.string('12').nullable();
    table.string('13').nullable();
    table.string('14').nullable();
    table.string('15').nullable();
    table.timestamp('startedAt').nullable();
    table.timestamp('finishedAt').nullable();
  })
};


exports.down = async function (knex) {
  return knex.schema.dropTable('risk');
};