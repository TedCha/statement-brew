import Tesseract, { createScheduler, createWorker } from 'tesseract.js';

/**
 * Converts jagged array to CSV encoded string
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
 * Converts jagged array to a blob and creates a URI
 * @param data Formatted in array of arrays structure
 * @returns URI of CSV data
 */
export const makeCSVFile = (data: string[][]): string => {
  // convert jagged array to CSV encoded content
  // and then create blob URL from CSV content
  return URL.createObjectURL(
    new Blob([arrayToCSV(data)], { type: 'text/csv;charset=utf-8;' })
  );
};

/**
 * Builds a jagged array
 * @param n Number of array elements to populate jagged array
 * @returns Jagged array
 */
export const makeJaggedArray = (n: number): string[][] => {
  return Array.from(new Array(n), () => []);
};

/**
 * Creates a tesseract scheduler with workers
 * @param opts Options for creating the scheduler/workers
 * @returns Promise that resolves a tesseract scheduler
 */
export const setupTesseractScheduler = async (opts: {
  workers: number;
}): Promise<Tesseract.Scheduler> => {
  // setup tesseract scheduler/workers for image OCR processing
  const scheduler = createScheduler();
  const workers = Array.from(new Array(opts.workers), () => createWorker());
  workers.forEach((worker) => scheduler.addWorker(worker));

  await Promise.all(
    workers.map(async (worker) => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
    })
  );

  return scheduler;
};
