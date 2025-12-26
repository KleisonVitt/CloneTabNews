test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(typeof responseBody.dependencies.database.version).toBe("string");

  expect(
    Number.isInteger(responseBody.dependencies.database.max_connections),
  ).toBe(true);

  expect(Number.isInteger(responseBody.dependencies.database.connections)).toBe(
    true,
  );

  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(0);

  expect(responseBody.dependencies.database.connections).toBeLessThanOrEqual(
    responseBody.dependencies.database.max_connections,
  );
});
