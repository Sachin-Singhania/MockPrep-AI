import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getStatus(score: number): { status: string} {
    if (score >= 85 && score <= 100) {
        return { status: "Excellent"}
    } else if (score >= 70 && score < 85) {
        return { status: "Good"}
    } else if (score >= 50 && score < 70) {
        return { status: "Average"}
    } else if (score >= 30 && score < 50) {
        return { status: "Below Average"}
    } else {
        return { status: "Poor"}
    }
}