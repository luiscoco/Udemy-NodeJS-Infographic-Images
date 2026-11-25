exports.up = (pgm) => {
  pgm.createTable("migration_notes", {
    id: "id",
    title: { type: "text", notNull: true },
  });
};
exports.down = (pgm) => {
  pgm.dropTable("migration_notes");
};
