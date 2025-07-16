import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import pdf from 'pdf-parse'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function parsePdfIfMaxTwoPages(pdfInput: Buffer | string): Promise<string> {
  let buffer: Buffer;

  if (typeof pdfInput === 'string') {
    buffer = Buffer.from(pdfInput, 'base64');
  } else {
    buffer = pdfInput;
  }

  const data = await pdf(buffer);

  if (data.numpages > 2) {
    throw new Error(`PDF has ${data.numpages} pages (maximum allowed is 2).`);
  }

  return data.text.trim();
}
