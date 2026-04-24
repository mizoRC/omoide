import * as readline from "readline";
import * as path from "path";
import * as fs from "fs";

interface ParsedArgs {
  folder: string;
  mode: "year" | "year-month";
  dryRun: boolean;
}

function getInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectMode(): Promise<"year" | "year-month"> {
  console.log("\n📋 Selecciona modo de organización:\n");
  console.log("  1) Year (por año)");
  console.log("  2) Year-Month (por año-mes)\n");

  const answer = await getInput("Selecciona (1 o 2): ");
  return answer === "2" ? "year-month" : "year";
}

export async function parseArgs(args: string[]): Promise<ParsedArgs> {
  let folder: string | null = null;
  let mode: "year" | "year-month" | null = null;
  let dryRun = false;

  // Parse argumentos
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--mode=")) {
      const value = args[i].slice(7);
      if (value === "year" || value === "year-month") {
        mode = value;
      }
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (!args[i].startsWith("--")) {
      folder = args[i];
    }
  }

  // Solicitar folder si no se proporcionó
  if (!folder) {
    folder = await getInput("📂 Ingresa ruta de la carpeta de fotos: ");
  }

  // Validar que la carpeta existe
  const resolvedFolder = path.resolve(folder);
  if (!fs.existsSync(resolvedFolder)) {
    console.error(`❌ Error: La carpeta "${resolvedFolder}" no existe`);
    process.exit(1);
  }

  // Solicitar modo si no se proporcionó
  if (!mode) {
    mode = await selectMode();
  }

  return { folder: resolvedFolder, mode, dryRun };
}
