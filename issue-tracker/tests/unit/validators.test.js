import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCommentContent,
  validateEmail,
  validateIssueDescription,
  validateIssueTitle,
  validatePassword,
  validateProjectDescription,
  validateProjectName,
  validateProjectStatus,
  validatePriority,
  validateStatus,
  validateUsername,
} from "../../src/backend/src/utils/validators.js";

test("validateEmail accepts standard email format", () => {
  assert.equal(validateEmail("user@example.com"), true);
});

test("validateEmail rejects malformed email", () => {
  assert.equal(validateEmail("bad-email"), false);
});

test("validatePassword accepts strong passwords", () => {
  assert.equal(validatePassword("StrongPass1!"), true);
});

test("validatePassword rejects weak passwords", () => {
  assert.equal(validatePassword("weak"), false);
});

test("validateUsername accepts safe usernames", () => {
  assert.equal(validateUsername("valid_user_1"), true);
});

test("validateProjectName enforces non-empty capped values", () => {
  assert.equal(validateProjectName("Sprint board"), true);
  assert.equal(validateProjectName(""), false);
});

test("validateProjectDescription limits oversized descriptions", () => {
  assert.equal(validateProjectDescription("A short description"), true);
  assert.equal(validateProjectDescription("x".repeat(801)), false);
});

test("validateIssueTitle enforces title length", () => {
  assert.equal(validateIssueTitle("Broken login flow"), true);
  assert.equal(validateIssueTitle(" "), false);
});

test("validateIssueDescription limits oversized descriptions", () => {
  assert.equal(validateIssueDescription("Helpful details"), true);
  assert.equal(validateIssueDescription("x".repeat(2001)), false);
});

test("priority and status validators accept only known values", () => {
  assert.equal(validatePriority("critical"), true);
  assert.equal(validatePriority("urgent"), false);
  assert.equal(validateStatus("open"), true);
  assert.equal(validateStatus("done"), false);
});

test("comment and project status validators enforce allowed values", () => {
  assert.equal(validateCommentContent("Looks good to me"), true);
  assert.equal(validateCommentContent(" "), false);
  assert.equal(validateProjectStatus("inactive"), true);
  assert.equal(validateProjectStatus("paused"), false);
});
