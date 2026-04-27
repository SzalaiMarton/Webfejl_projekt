export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  if (typeof password !== 'string') {
    return false;
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return strongPasswordRegex.test(password);
}

export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateProjectName(name) {
  return Boolean(name && name.trim().length > 0 && name.trim().length <= 100);
}

export function validateProjectDescription(description) {
  return description === undefined || description === null || String(description).trim().length <= 800;
}

export function validateIssueTitle(title) {
  return Boolean(title && title.trim().length > 0 && title.trim().length <= 200);
}

export function validateIssueDescription(description) {
  return description === undefined || description === null || String(description).trim().length <= 2000;
}

export function validateHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export function validateCommentContent(content) {
  return Boolean(content && content.trim().length > 0 && content.trim().length <= 2000);
}

export function validatePriority(priority) {
  return ['low', 'medium', 'high', 'critical'].includes(priority);
}

export function validateStatus(status) {
  return ['open', 'in_progress', 'blocked', 'resolved', 'closed'].includes(status);
}

export function validateProjectStatus(status) {
  return ['active', 'inactive', 'archived', 'completed'].includes(status);
}
