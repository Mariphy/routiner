export function generateUniqueId(): string {
    return 'task-' + Math.random().toString(36).substr(2, 9);
  }
  
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  export function parseDate(dateString: string): Date {
    return new Date(dateString);
  }