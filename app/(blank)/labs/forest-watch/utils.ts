/**
 * Generates an array of years from the current year to the number of years back
 * @param yearsBack number of years to go back
 * @returns a list of years
 *
 * @example
 * generateYears(5) // [2019, 2020, 2021, 2022, 2023] if current year is 2023
 */
export function generateYears(yearsBack: number): number[] {
  const years: number[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= yearsBack; i++) {
    years.push(currentYear - yearsBack + i);
  }

  return years;
}

export function formatDate(date?: Date): string {
  if (!date) return '';

  return date.toLocaleDateString('en-GD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
