exports.up = async function (knex) {
  return knex.schema.createTable("monitoring", function (table) {
    table.string("userId").nullable();
    table.string("16").nullable();
    table.string("17").nullable();
    table.string("18").nullable();
    table.string("19").nullable();
    table.string("20").nullable();
    table.string("21").nullable();
    table.string("22").nullable();
    table.string("23").nullable();
    table.string("24").nullable();
    table.string("25").nullable();
    table.string("26").nullable();
    table.string("27").nullable();
    table.string("28").nullable();
    table.string("29").nullable();
    table.string("30").nullable();
    table.string("31").nullable();
    table.string("32").nullable();
    table.string("33").nullable();
    table.string("34").nullable();
    table.string("35").nullable();
    table.text("36", "longtext").nullable();
    table.string("37").nullable();
    table.text("38", "longtext").nullable();
    table.text("39", "longtext").nullable();
    table.text("40", "longtext").nullable();
    table.string("41").nullable();
    table.string("42").nullable();
    table.string("43").nullable();
    table.timestamp("startedAt").nullable();
    table.timestamp("finishedAt").nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("monitoring");
};
