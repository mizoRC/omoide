import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { PhotoProcessor } from "../src/processor";
import * as fs from "fs";
import * as path from "path";
import { tmpdir } from "os";

describe("PhotoProcessor", () => {
  const testDir = path.join(tmpdir(), "omoide-test-" + Math.random().toString(36).slice(2));
  const srcDir = path.join(testDir, "src");
  const destDir = path.join(testDir, "dest");

  beforeAll(() => {
    fs.mkdirSync(srcDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
    
    // Create some dummy image files
    fs.writeFileSync(path.join(srcDir, "photo1.jpg"), "dummy content");
    fs.writeFileSync(path.join(srcDir, "photo2.png"), "dummy content");
    fs.writeFileSync(path.join(srcDir, "not-an-image.txt"), "dummy content");
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test("scan identifies only image files", async () => {
    const processor = new PhotoProcessor();
    const files = await processor.scan(srcDir);
    expect(files.length).toBe(2);
    expect(files.some(f => f.endsWith("photo1.jpg"))).toBe(true);
    expect(files.some(f => f.endsWith("photo2.png"))).toBe(true);
    expect(files.some(f => f.endsWith("not-an-image.txt"))).toBe(false);
  });

  test("processFiles in dry-run mode doesn't move files", async () => {
    const processor = new PhotoProcessor();
    const stats = await processor.processFiles(srcDir, destDir, "year", true);
    
    expect(stats.total).toBe(2);
    expect(stats.processed).toBe(2);
    expect(fs.readdirSync(destDir).length).toBe(0);
    expect(fs.readdirSync(srcDir).length).toBe(3);
  });

  test("processFiles organizes files correctly", async () => {
    const processor = new PhotoProcessor();
    const stats = await processor.processFiles(srcDir, destDir, "year", false);
    
    expect(stats.total).toBe(2);
    expect(stats.processed).toBe(2);
    
    const year = new Date().getFullYear();
    const yearPath = path.join(destDir, String(year));
    
    expect(fs.existsSync(yearPath)).toBe(true);
    const organizedFiles = fs.readdirSync(yearPath);
    expect(organizedFiles.length).toBe(2);
  });
});
