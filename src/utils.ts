/**
 * Converts a array of arrays to CSV encoded string
 * @param data Array of arrays
 * @returns CSV encoded string
 */
const arrayToCSV = (data: string[][]): string => {
  return data
    .map(
      (row) =>
        row
          .map((val) => `"${val.replaceAll('"', '""')}"`) // escape double quotes, and quote value
          .join(',') // join values together with comma seperator
    )
    .join('\r\n'); // join rows together with newlines
};

/**
 * Converts array of arrays data to a blob and creates a URI
 * @param data Array of arrays
 * @returns Blob URI
 */
export const buildCSV = (data: string[][]): string => {
  // convert array of array data to CSV encoded content
  // and then create blob URL from CSV content
  return URL.createObjectURL(
    new Blob([arrayToCSV(data)], { type: 'text/csv;charset=utf-8;' })
  );
};
