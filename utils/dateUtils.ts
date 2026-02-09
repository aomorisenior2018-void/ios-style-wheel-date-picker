
/**
 * Returns the number of days in a given month and year.
 * Handles leap years correctly.
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Validates if a date is within a specific range.
 */
export const isDateInRange = (date: Date, min: Date, max: Date): boolean => {
  return date >= min && date <= max;
};
