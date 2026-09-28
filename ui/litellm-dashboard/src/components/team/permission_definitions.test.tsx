import { describe, expect, it } from "vitest";
import { getMethodForEndpoint, getPermissionInfo } from "./permission_definitions";

type Translator = Parameters<typeof getPermissionInfo>[1];

const t = ((key: string, values?: Record<string, unknown>) =>
  values === undefined ? key : `${key}:${JSON.stringify(values)}`) as unknown as Translator;

describe("permission_definitions", () => {
  describe("getMethodForEndpoint", () => {
    it("should return GET for info endpoints", () => {
      expect(getMethodForEndpoint("/key/info")).toBe("GET");
    });

    it("should return GET for list endpoints", () => {
      expect(getMethodForEndpoint("/key/list")).toBe("GET");
    });

    it("should return GET for activity endpoints", () => {
      expect(getMethodForEndpoint("/team/daily/activity")).toBe("GET");
    });

    it("should return POST for other endpoints", () => {
      expect(getMethodForEndpoint("/key/generate")).toBe("POST");
      expect(getMethodForEndpoint("/key/update")).toBe("POST");
      expect(getMethodForEndpoint("/key/delete")).toBe("POST");
    });
  });

  describe("getPermissionInfo", () => {
    it("resolves an exact endpoint to its description key and method", () => {
      const expected = {
        method: "POST",
        endpoint: "/key/generate",
        description: "perm.keyGenerate",
        route: "/key/generate",
      };

      expect(getPermissionInfo("/key/generate", t)).toStrictEqual(expected);
    });

    it("resolves GET endpoints to their description keys", () => {
      expect(getPermissionInfo("/key/info", t).description).toBe("perm.keyInfo");
      expect(getPermissionInfo("/key/list", t).description).toBe("perm.keyList");
      const expected = {
        method: "GET",
        endpoint: "/team/daily/activity",
        description: "perm.teamDailyActivity",
        route: "/team/daily/activity",
      };

      expect(getPermissionInfo("/team/daily/activity", t)).toStrictEqual(expected);
      expect(getPermissionInfo("/spend/logs", t).description).toBe("perm.spendLogs");
    });

    it("resolves a hyphenated service account endpoint to its description key", () => {
      expect(getPermissionInfo("/key/service-account/generate", t).description).toBe("perm.keyServiceAccountGenerate");
    });

    it("resolves both regenerate endpoint shapes to the same description key", () => {
      expect(getPermissionInfo("/key/regenerate", t).description).toBe(
        getPermissionInfo("/key/{key_id}/regenerate", t).description,
      );
    });

    it("falls back to a partial endpoint match when there is no exact key", () => {
      expect(getPermissionInfo("/key/info/detail", t).description).toBe("perm.keyInfo");
    });

    it("falls back to the access description with the raw endpoint for an unknown permission", () => {
      const result = getPermissionInfo("/unknown/endpoint", t);

      expect(result.method).toBe("POST");
      expect(result.endpoint).toBe("/unknown/endpoint");
      expect(result.description).toBe('perm.accessEndpoint:{"endpoint":"/unknown/endpoint"}');
      expect(result.route).toBe("/unknown/endpoint");
    });
  });
});
