import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const backendCwd = path.resolve("src/backend");
const serverEntry = path.resolve(backendCwd, "server.js");
const port = 3100;

async function waitForServer(url, timeoutMs = 10000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.status < 500) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error("Server did not start in time");
}

test("E2E: register, login, read current user, and logout", async (t) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "issue-tracker-e2e-"));
  let cookie = "";

  const server = spawn(process.execPath, [serverEntry], {
    cwd: backendCwd,
    env: {
      ...process.env,
      NODE_ENV: "development",
      PORT: String(port),
      DATA_DIR: tempDir,
      FRONTEND_URL: "http://localhost:5173",
      SESSION_SECRET: "test-secret",
    },
    stdio: "ignore",
  });

  t.after(async () => {
    server.kill();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  await waitForServer(`http://127.0.0.1:${port}/api/auth/currentid`);

  const registerResponse = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "tester_user",
      email: "tester@example.com",
      password: "StrongPass1!",
    }),
  });
  assert.equal(registerResponse.status, 201);

  const loginResponse = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "tester@example.com",
      password: "StrongPass1!",
    }),
  });
  assert.equal(loginResponse.status, 200);
  cookie = loginResponse.headers.get("set-cookie")?.split(";")[0] || "";
  assert.ok(cookie);

  const meResponse = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  assert.equal(meResponse.status, 200);
  const meBody = await meResponse.json();
  assert.equal(meBody.user.email, "tester@example.com");

  const logoutResponse = await fetch(`http://127.0.0.1:${port}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookie },
  });
  assert.equal(logoutResponse.status, 200);

  const meAfterLogout = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  assert.equal(meAfterLogout.status, 401);
});
