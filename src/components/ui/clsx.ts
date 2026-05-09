type Argument = string | number | boolean | null | undefined;

/**
 * Conditionally join classNames into a single string
 */
function cx(...args: Argument[]): string {
  let str = '';

  for (const arg of args) {
    if (arg && typeof arg === 'string') {
      if (str) {
        str += ' ';
      }
      str += arg;
    }
  }

  return str;
}

export { cx };
