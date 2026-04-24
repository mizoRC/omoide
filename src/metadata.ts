import * as fs from "fs";
import * as path from "path";

export interface PhotoDate {
  year: number;
  month: number;
  day: number;
}

function parseExifDate(dateString: string): PhotoDate | null {
  // EXIF format: YYYY:MM:DD HH:MM:SS
  const match = dateString.match(/^(\d{4}):(\d{2}):(\d{2})/);
  if (match) {
    return {
      year: parseInt(match[1]),
      month: parseInt(match[2]),
      day: parseInt(match[3]),
    };
  }
  return null;
}

function parseExifBuffer(buffer: Buffer): PhotoDate | null {
  try {
    // Buscar el marcador EXIF (FFE1)
    const exifStart = buffer.indexOf(Buffer.from([0xff, 0xe1]));
    if (exifStart === -1) return null;

    // Buscar el tag DateTimeOriginal (0x9003)
    const exifMarker = buffer.indexOf(Buffer.from([0x90, 0x03]), exifStart);
    if (exifMarker === -1) return null;

    // Buscar fechas en formato YYYY:MM:DD
    const datePattern = /(\d{4}):(\d{2}):(\d{2})/g;
    const matches = buffer.toString("binary").match(datePattern);

    if (matches && matches.length > 0) {
      return parseExifDate(matches[0]);
    }
  } catch {
    // Ignorar errores de parsing
  }
  return null;
}

export async function extractPhotoDate(
  filePath: string
): Promise<PhotoDate | null> {
  try {
    // Leer primeros 64KB del archivo (suficiente para EXIF)
    const fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(65536);
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length);
    fs.closeSync(fd);

    const exifDate = parseExifBuffer(buffer.slice(0, bytesRead));
    if (exifDate) {
      // Validar que la fecha sea razonable
      if (
        exifDate.year >= 1990 &&
        exifDate.year <= new Date().getFullYear() + 1 &&
        exifDate.month >= 1 &&
        exifDate.month <= 12 &&
        exifDate.day >= 1 &&
        exifDate.day <= 31
      ) {
        return exifDate;
      }
    }

    // Fallback a mtime
    const stats = fs.statSync(filePath);
    const modDate = new Date(stats.mtimeMs);
    return {
      year: modDate.getFullYear(),
      month: modDate.getMonth() + 1,
      day: modDate.getDate(),
    };
  } catch {
    // Si hay error, usar mtime
    try {
      const stats = fs.statSync(filePath);
      const modDate = new Date(stats.mtimeMs);
      return {
        year: modDate.getFullYear(),
        month: modDate.getMonth() + 1,
        day: modDate.getDate(),
      };
    } catch {
      return null;
    }
  }
}

export function isImageFile(filePath: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".tiff",
    ".heic",
    ".raw",
    ".cr2",
    ".nef",
    ".arw",
  ];
  const ext = path.extname(filePath).toLowerCase();
  return imageExtensions.includes(ext);
}

export function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}
