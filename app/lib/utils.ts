import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ALLOWED_FILE_TYPES = ["text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

export enum SCHOLAR_STATUS {
  GRADUATED = 'Graduated',
  ACTIVE = 'Active',
  DROPPED_GPA = 'Dropped - GPA',
  DROPPED_MAJOR = 'Dropped - Major',
  DROPPED = 'Dropped'
}