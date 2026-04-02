/**
 * Validatori függvények
 */

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateUsername(username) {
  // Username: 3-20 karakter, csak betű, szám, alulvonás
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateProjectName(name) {
  return name && name.trim().length > 0 && name.trim().length <= 100;
}

export function validateIssueTitle(title) {
  return title && title.trim().length > 0 && title.trim().length <= 200;
}

export function validateHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export function validateCommentContent(content) {
  return content && content.trim().length > 0;
}

export function validatePriority(priority) {
  return ['low', 'medium', 'high', 'critical'].includes(priority);
}

export function validateStatus(status) {
  return ['open', 'in_progress', 'blocked', 'resolved', 'closed'].includes(status);
}

export function validateProjectStatus(status) {
  return ['active', 'archived', 'completed'].includes(status);
}
