import { InternalServerError } from "infra/errors";
import authorization from "models/authorization.js";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("Without `user`", async () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", async () => {
      const createdUser = {
        username: "userWithoutFeatures",
      };
      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("With unknown `feature`", async () => {
      const createdUser = {
        features: [],
      };
      expect(() => {
        authorization.can(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("With valid  `user` and `feature`", async () => {
      const createdUser = {
        features: ["create:user"],
      };
      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutPut()", () => {
    test("Without `user`", async () => {
      expect(() => {
        authorization.filterOutPut();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", async () => {
      const createdUser = {
        username: "userWithoutFeatures",
      };
      expect(() => {
        authorization.filterOutPut(createdUser);
      }).toThrow(InternalServerError);
    });

    test("With unknown `feature`", async () => {
      const createdUser = {
        features: [],
      };
      expect(() => {
        authorization.filterOutPut(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("With valid  `user` and `feature` and `resource`", async () => {
      const createdUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "resource",
        email: "resource@resource.com",
        passowrd: "password",
        features: ["read:user"],
        created_at: "2026-0101T00:00:00.000Z",
        updated_at: "2026-0101T00:00:00.000Z",
      };

      const result = authorization.filterOutPut(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-0101T00:00:00.000Z",
        updated_at: "2026-0101T00:00:00.000Z",
      });
    });

    test("With valid `user`, know `feature` but no `resource`", async () => {
      const createdUser = {
        features: ["read:user"],
      };
      expect(() => {
        authorization.filterOutPut(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });
  });
});
