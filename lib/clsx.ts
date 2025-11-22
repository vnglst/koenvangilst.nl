type Argument = string | number | boolean | null | undefined;

/**
 * Conditionally join classNames into a single string
 * @param args The expressions to evaluate
 * @returns The joined classNames
 */
function cx(...args: Argument[]): string {
  let str = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
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
