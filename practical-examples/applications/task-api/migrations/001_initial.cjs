exports.up = (pgm) =>
  pgm.sql(
    "CREATE SCHEMA IF NOT EXISTS course_app;\nSET search_path=course_app;\nCREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);\nCREATE TABLE IF NOT EXISTS tasks(id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,owner_id TEXT NOT NULL REFERENCES users(id),version INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now());\nCREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,status TEXT NOT NULL,result JSONB);\nCREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,topic TEXT NOT NULL,payload JSONB NOT NULL,published BOOLEAN NOT NULL DEFAULT false);\nCREATE TABLE IF NOT EXISTS processed_events(id TEXT PRIMARY KEY);\nCREATE TABLE IF NOT EXISTS room_events(id BIGSERIAL PRIMARY KEY,room_id TEXT NOT NULL,payload JSONB NOT NULL);\n",
  );
exports.down = () => {
  throw Error(
    "Forward-only baseline: use a reviewed migration or restore procedure",
  );
};
