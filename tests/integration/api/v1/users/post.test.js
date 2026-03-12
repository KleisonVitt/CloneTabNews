import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "teste",
          email: "teste@email.com",
          password: "123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id, //tunelar o valor
        username: "teste",
        email: "teste@email.com",
        password: responseBody.password,
        features: [],
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("teste");
      const correctPasswordMatch = await password.compare(
        "123",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "SenhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'e-mail'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedUser",
          email: "duplicatedEmail1@email.com",
          password: "123",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "notDuplicatedUser",
          email: "DuplicatedEmail1@email.com",
          password: "123",
        }),
      });
      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O e-mail informado já está sendo utilizado.",
        action: "Utilize outro e-mail para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedusername",
          email: "testemail@email.com",
          password: "123",
        }),
      });
      expect(response1.status).toBe(201);

      const response3 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedUsername",
          email: "e@email.com",
          password: "123",
        }),
      });
      expect(response3.status).toBe(400);

      const response3Body = await response3.json();

      expect(response3Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });
  });
});
