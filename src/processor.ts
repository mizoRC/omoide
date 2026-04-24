import * as fs from "fs";
import * as path from "path";
import { extractPhotoDate, isImageFile, padMonth } from "./metadata";
import { ConcurrencyPool } from "./concurrency";

export interface PhotoFile {
  name: string;
  year: number;
  month: number;
  destFolder: string;
  srcPath: string;
}

export interface ProcessorStats {
  total: number;
  processed: number;
  byYear: Map<number, number>;
  errors: Array<{ file: string; error: string }>;
}

export class PhotoProcessor {
  private pool: ConcurrencyPool;
  private stats: ProcessorStats = {
    total: 0,
    processed: 0,
    byYear: new Map(),
    errors: [],
  };

  constructor(concurrency: number = 8) {
    this.pool = new ConcurrencyPool(concurrency);
  }

  getStats(): ProcessorStats {
    return this.stats;
  }

  async scan(srcFolder: string): Promise<string[]> {
    try {
      const files = fs.readdirSync(srcFolder);
      return files.filter((f) => isImageFile(f)).map((f) => path.join(srcFolder, f));
    } catch (error) {
      console.error(`Error scanning folder: ${error}`);
      return [];
    }
  }

  async processFiles(
    srcFolder: string,
    destFolder: string,
    mode: "year" | "year-month",
    dryRun: boolean = false,
    onProgress?: (stats: ProcessorStats) => void
  ): Promise<ProcessorStats> {
    const files = await this.scan(srcFolder);
    this.stats.total = files.length;

    // Procesar todos los archivos con pool de concurrencia
    const promises = files.map((filePath) =>
      this.pool.run(async () => {
        try {
          const fileName = path.basename(filePath);
          const photoDate = await extractPhotoDate(filePath);

          if (!photoDate) {
            this.stats.errors.push({
              file: fileName,
              error: "No date metadata found",
            });
            this.stats.processed++;
            onProgress?.(this.stats);
            return;
          }

          // Determinar carpeta de destino
          let targetFolder = destFolder;
          if (mode === "year") {
            targetFolder = path.join(destFolder, String(photoDate.year));
          } else {
            const monthStr = padMonth(photoDate.month);
            targetFolder = path.join(
              destFolder,
              String(photoDate.year),
              `${photoDate.year}-${monthStr}`
            );
          }

          // Actualizar stats
          const currentCount = this.stats.byYear.get(photoDate.year) || 0;
          this.stats.byYear.set(photoDate.year, currentCount + 1);

          // Crear carpetas
          if (!dryRun) {
            fs.mkdirSync(targetFolder, { recursive: true });
          }

          // Mover archivo (con evitar sobrescritura)
          const destPath = path.join(targetFolder, fileName);

          if (!dryRun) {
            let finalPath = destPath;
            let counter = 1;

            while (fs.existsSync(finalPath)) {
              const ext = path.extname(fileName);
              const name = path.basename(fileName, ext);
              finalPath = path.join(
                targetFolder,
                `${name}_${counter}${ext}`
              );
              counter++;
            }

            fs.renameSync(filePath, finalPath);
          }

          this.stats.processed++;
          onProgress?.(this.stats);
        } catch (error) {
          const fileName = path.basename(filePath);
          this.stats.errors.push({
            file: fileName,
            error: String(error),
          });
          this.stats.processed++;
          onProgress?.(this.stats);
        }
      })
    );

    await Promise.all(promises);
    await this.pool.waitAll();

    return this.stats;
  }
}
