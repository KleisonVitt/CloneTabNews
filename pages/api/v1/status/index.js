// /api/status
import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersion = (await database.query("SELECT version();")).rows[0]
    .version;

  const maxConnections = (
    await database.query(
      "SELECT setting::int AS max_connections FROM pg_settings WHERE name = 'max_connections';",
    )
  ).rows[0].max_connections;

  const dbConnections = (
    await database.query("SELECT count(*)::int FROM pg_stat_activity;")
  ).rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: maxConnections,
        connections: dbConnections,
      },
    },
  });
}

export default status;
