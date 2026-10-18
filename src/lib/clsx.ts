type Argument = string | number | boolean | null | undefined;

/**
 * Conditionally join classNames into a single string
 * @param args The expressions to evaluate
 * @returns The joined classNames
 */
function cx(...args: Argument[]): string {
  return args.filter((arg) => typeof arg === 'string' && arg).join(' ');
}

export { cx };
