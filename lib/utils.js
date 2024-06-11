export function stripHtmlTags(str) {
    if (str === null || str === '') return '';
    return str.replace(/<[^>]*>/g, '');
  }
  
  export default stripHtmlTags;
  