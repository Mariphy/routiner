export function generateUniqueId(): string {
    return 'task-' + Math.random().toString(36).substr(2, 9);
  }
