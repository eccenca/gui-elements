/** Removes leading and trailing spaces. In addition converts multiple subsequent spaces to a single space. */
export const removeExtraSpaces = (text: string) => text.replace(/\s+/g, " ").trim();
