export function getPriorityIndex(priority) {
  const priorityMap = {
    'critical': 0,
    'high': 1,
    'medium': 2,
    'low': 3
  };
  return priorityMap[priority] || 3;
}

export function getStatusIndex(status) {
  const statusMap = {
    'open': 0,
    'in_progress': 1,
    'blocked': 2,
    'resolved': 3,
    'closed': 4
  };
  return statusMap[status] || 0;
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

export function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString();
}

export function getTimeDifference(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'most';
  if (diffMins < 60) return `${diffMins} perce`;
  if (diffHours < 24) return `${diffHours} órája`;
  if (diffDays < 7) return `${diffDays} napja`;
  
  return formatDateShort(dateString);
}
