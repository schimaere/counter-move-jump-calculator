/**
 * Formats a number to a specified number of decimal places, removing trailing zeros
 * Supports both English (.) and German (,) decimal separators
 * @param value - The number to format (can be string with . or , as decimal separator)
 * @param decimals - Maximum number of decimal places (default: 2)
 * @returns Formatted string without trailing zeros
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  let num: number;
  
  if (typeof value === "string") {
    // Handle German format (comma as decimal separator)
    const normalizedValue = value.replace(",", ".");
    num = parseFloat(normalizedValue);
  } else {
    num = value;
  }
  
  if (isNaN(num)) return value.toString();
  
  // Format to specified decimal places, then remove trailing zeros
  return num.toFixed(decimals).replace(/\.?0+$/, "");
}

