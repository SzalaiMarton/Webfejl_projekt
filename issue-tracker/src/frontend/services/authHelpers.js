export function isSessionLocallyValid(storage = window.localStorage, now = Date.now()) {
  const userId = storage.getItem('userId');
  const expiresAt = Number(storage.getItem('expiresAt'));

  if (!userId || !Number.isFinite(expiresAt)) {
    return false;
  }

  return expiresAt > now;
}

export function buildStoredSession(response) {
  return {
    userId: JSON.stringify(response.user.id),
    expiresAt: String(response.expiresAt),
  };
}
