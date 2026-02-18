const { exec } = require("node:child_process");

function checkPostgres() {
  // comando --host para consertar a race condition do pg_iready -> conexão Socket UNIX
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando postgres aceitar conexões ");
checkPostgres();
