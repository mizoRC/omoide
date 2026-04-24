import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { PhotoProcessor, ProcessorStats } from "./processor";

interface AppProps {
  folder: string;
  mode: "year" | "year-month";
  dryRun: boolean;
}

export const Spinner: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const frames = ["⠋", "⠙", "⠹", "⠸"];
  return <Text>{frames[frame]}</Text>;
};

export const ProgressBar: React.FC<{ processed: number; total: number }> = ({
  processed,
  total,
}) => {
  const width = 20;
  const filled = Math.floor((processed / total) * width);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const percent = Math.round((processed / total) * 100);

  return (
    <Text>
      [{bar}] {processed.toLocaleString()} / {total.toLocaleString()} ({percent}%)
    </Text>
  );
};

export const YearStats: React.FC<{ stats: ProcessorStats; done: boolean }> = ({
  stats,
  done,
}) => {
  const years = Array.from(stats.byYear.keys()).sort();

  return (
    <Box flexDirection="column">
      {years.map((year) => {
        const count = stats.byYear.get(year) || 0;
        const status = done ? "✔" : "⏳";
        return (
          <Text key={year}>
            {status} {year} → {count.toLocaleString()} fotos
          </Text>
        );
      })}
    </Box>
  );
};

export const ErrorList: React.FC<{ errors: Array<{ file: string; error: string }> }> = ({
  errors,
}) => {
  if (errors.length === 0) return null;

  return (
    <Box marginBottom={1} flexDirection="column">
      <Text color="yellow" bold>
        ⚠️ Errores ({errors.length})
      </Text>
      {errors.slice(0, 5).map((err, i) => (
        <Text key={i} color="yellow">
          • {err.file}: {err.error}
        </Text>
      ))}
      {errors.length > 5 && (
        <Text color="yellow">... y {errors.length - 5} errores más</Text>
      )}
    </Box>
  );
};

export const App: React.FC<AppProps> = ({ folder, mode, dryRun }) => {
  const [stats, setStats] = useState<ProcessorStats | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const processor = new PhotoProcessor(8);
        const destFolder = folder + "_organized";

        const result = await processor.processFiles(
          folder,
          destFolder,
          mode,
          dryRun,
          (updatedStats) => {
            setStats({ ...updatedStats });
          }
        );

        setStats(result);
        setDone(true);
      } catch (err) {
        setError(String(err));
        setDone(true);
      }
    };

    run();
  }, [folder, mode, dryRun]);

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">❌ Error: {error}</Text>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text color="cyan">
            <Spinner /> Escaneando carpeta...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="green">
          📂 Organizador de Fotos
        </Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text color="cyan">📁 Carpeta: {folder}</Text>
        <Text color="cyan">
          ⚙️ Modo: {mode === "year" ? "Año" : "Año-Mes"}
        </Text>
        {dryRun && <Text color="yellow">🔍 Modo simulación (--dry-run)</Text>}
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="blue">
          📊 Progreso
        </Text>
        <ProgressBar processed={stats.processed} total={stats.total} />
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text bold color="blue">
          📁 Fotos por año
        </Text>
        <YearStats stats={stats} done={done} />
      </Box>

      <ErrorList errors={stats.errors} />

      {done && (
        <Box marginTop={1}>
          <Text bold color="green">
            ✅ Proceso completado
          </Text>
        </Box>
      )}
    </Box>
  );
};
