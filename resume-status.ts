import fs from "node:fs";
import path from "node:path";
import { resume } from "@/data/resume";

/**
 * Server-only: true when the resume PDF exists in /public.
 * Used to hide resume controls rather than link to a missing file.
 */
export function isResumeAvailable(): boolean {
  try {
    const file = path.join(process.cwd(), "public", resume.href);
    const stat = fs.statSync(file);
    return stat.isFile() && stat.size > 0;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[resume] ${resume.href} not found in /public — resume buttons are hidden.`);
    }
    return false;
  }
}
