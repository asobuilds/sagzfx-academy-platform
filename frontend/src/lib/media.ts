/**
 * SAGZFX ACADEMY - Cloudinary URL builder.
 *
 * All images are hosted on Cloudinary under cloud `nirybrdh`.
 * Files are named with the convention:
 *   sagzfx-<category>-<descriptor>-<number>
 *
 * Examples:
 *   sagzfx-campus-exterior-01
 *   sagzfx-classroom-whiteboard-01
 *   sagzfx-equipment-laptops-01
 *
 * Usage:
 *   mediaUrl("sagzfx-campus-exterior-01")             → default 1200px wide
 *   mediaUrl("sagzfx-campus-exterior-01", { w: 600 }) → 600px wide
 *   mediaUrl("sagzfx-campus-exterior-01", { w: 200, h: 200, crop: "fill" }) → square
 */

const CLOUD_NAME = "nirybrdh";

export type MediaOptions = {
  /** Target width in pixels. Default 1200. */
  w?: number;
  /** Optional height in pixels. Requires `crop`. */
  h?: number;
  /** Crop mode. Default "limit" (keeps aspect ratio, no upscaling). */
  crop?: "limit" | "fill" | "fit" | "scale";
  /** Optional quality override. Default "auto". */
  q?: string;
  /** Optional format override. Default "auto" (WebP where supported). */
  f?: string;
};

export function mediaUrl(name: string, opts: MediaOptions = {}): string {
  const { w = 1200, h, crop = "limit", q = "auto", f = "auto" } = opts;

  const parts = [`f_${f}`, `q_${q}`, `w_${w}`, `c_${crop}`];
  if (h) parts.push(`h_${h}`);

  const transform = parts.join(",");
  const cleanName = name.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${cleanName}`;
}

/**
 * Preset gallery image URL — 1200px wide, auto format, auto quality.
 * Use this for full-size images in the lightbox.
 */
export function galleryFull(name: string): string {
  return mediaUrl(name, { w: 1600 });
}

/**
 * Preset thumbnail URL — 600px wide, auto format, auto quality.
 * Use this for grid thumbnails.
 */
export function galleryThumb(name: string): string {
  return mediaUrl(name, { w: 600 });
}

/**
 * Curated list of media shown on the campus gallery page.
 * Edit this list to add or remove photos.
 */
export type MediaItem = {
  name: string;
  caption: string;
  category: "campus" | "classroom" | "equipment" | "students";
};

export const CAMPUS_MEDIA: MediaItem[] = [
  {
    name: "sagzfx-campus-exterior-01",
    caption: "SAGZFX ACADEMY — Shop 5 Aib Plaza, Keffi, Abuja Express Way",
    category: "campus",
  },
  {
    name: "sagzfx-campus-interior-01",
    caption: "The classroom and study space where live sessions are held",
    category: "campus",
  },
  {
    name: "sagzfx-classroom-session-01",
    caption: "Instructor-led session on market structure",
    category: "classroom",
  },
  {
    name: "sagzfx-classroom-whiteboard-01",
    caption: "Whiteboard breakdown of supply, demand and liquidity",
    category: "classroom",
  },
  {
    name: "sagzfx-equipment-laptops-01",
    caption: "Trading workstations used during practical sessions",
    category: "equipment",
  },
  {
    name: "sagzfx-equipment-books-01",
    caption: "Printed course material and reference guides",
    category: "equipment",
  },
  {
    name: "sagzfx-students-cohort-01",
    caption: "A recent cohort completing the beginner track",
    category: "students",
  },
  {
    name: "sagzfx-students-graduation-01",
    caption: "Graduation day at the Abuja campus",
    category: "students",
  },
];

/**
 * Optional: YouTube video ID for the campus tour modal.
 * Set this to the video ID (the part after `watch?v=` or `youtu.be/`).
 * Leave empty string to hide the video button on the landing page.
 */
export const CAMPUS_TOUR_VIDEO_ID = "";
