import test from "node:test";
import assert from "node:assert/strict";
import { buildStoredSession, isSessionLocallyValid } from "../../src/frontend/services/authHelpers.js";

function createStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
  };
}

test("buildStoredSession normalizes auth response for storage", () => {
  const result = buildStoredSession({
    user: { id: "user-123" },
    expiresAt: 1234567890,
  });

  assert.deepEqual(result, {
    userId: JSON.stringify("user-123"),
    expiresAt: "1234567890",
  });
});

test("isSessionLocallyValid returns true for active session", () => {
  const storage = createStorage({
    userId: JSON.stringify("user-123"),
    expiresAt: "5000",
  });

  assert.equal(isSessionLocallyValid(storage, 3000), true);
});

test("isSessionLocallyValid returns false when expiration is missing or stale", () => {
  const missingExpiry = createStorage({ userId: JSON.stringify("user-123") });
  const expired = createStorage({
    userId: JSON.stringify("user-123"),
    expiresAt: "1000",
  });

  assert.equal(isSessionLocallyValid(missingExpiry, 3000), false);
  assert.equal(isSessionLocallyValid(expired, 3000), false);
});
