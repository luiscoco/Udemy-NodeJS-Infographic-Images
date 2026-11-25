import { transaction } from "./postgres.mjs";
export async function createReport(pool, id, owner = "user-a") {
  return transaction(pool, async (client) => {
    const inserted = await client.query(
      "INSERT INTO reports(id,owner_id,status) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING RETURNING id",
      [id, owner, "pending"],
    );
    if (inserted.rowCount)
      await client.query(
        "INSERT INTO outbox(id,topic,payload) VALUES($1,$2,$3)",
        [id, "report.requested", { reportId: id }],
      );
  });
}
export async function publishResult(pool, eventId, reportId) {
  return transaction(pool, async (client) => {
    const inserted = await client.query(
      "INSERT INTO processed_events(id) VALUES($1) ON CONFLICT DO NOTHING RETURNING id",
      [eventId],
    );
    if (inserted.rowCount)
      await client.query("UPDATE reports SET status=$1,result=$2 WHERE id=$3", [
        "complete",
        { total: 42 },
        reportId,
      ]);
    return inserted.rowCount;
  });
}
