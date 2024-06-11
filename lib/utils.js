export function stripHtmlTags(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str.replace(/<[^>]*>/g, '');
  }
  