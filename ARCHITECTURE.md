# 🏗️ Arquitectura técnica

## Visión general

```
┌─────────────┐
│  index.ts   │ ← Entrada principal (punto de inicio)
└──────┬──────┘
       │
       ├─→ cli.ts          (Parseador de argumentos)
       │   └─→ readline (entrada interactiva)
       │
       └─→ ui.ts           (Interfaz terminal)
           └─→ PhotoProcessor
               ├─→ concurrency.ts  (Pool de tareas)
               ├─→ processor.ts    (Lógica principal)
               └─→ metadata.ts     (Extracción EXIF)
```

## Módulos

### `index.ts` - Punto de entrada
- Parsea argumentos CLI
- Inicializa UI
- Ejecuta flujo principal

### `src/cli.ts` - Parser de argumentos
- Lee: `<ruta> [--mode=...] [--dry-run]`
- Input interactivo si faltan parámetros
- Validación de carpeta

```typescript
// Entrada
bun run index.ts ~/fotos --mode=year --dry-run

// Salida
{ folder: '/Users/user/fotos', mode: 'year', dryRun: true }
```

### `src/metadata.ts` - Extracción de metadatos
- **Estrategia 1**: Lee buffer EXIF (primeros 64KB)
- **Estrategia 2**: Busca DateTimeOriginal (tag 0x9003)
- **Fallback**: Usa mtime si no hay EXIF

```typescript
// Busca: YYYY:MM:DD en datos binarios
// Retorna: { year, month, day }
```

### `src/processor.ts` - Lógica de procesamiento
- Lee archivos de carpeta
- Filtra solo imágenes válidas
- Procesa en paralelo
- Organiza en destino
- Evita sobrescrituras

```typescript
PhotoProcessor.processFiles(
  src: string,
  dest: string,
  mode: 'year' | 'year-month',
  dryRun: boolean,
  onProgress: (stats) => void
)
```

### `src/concurrency.ts` - Pool de concurrencia
- Mantiene máximo N tareas simultáneas
- Cola de espera para tareas adicionales
- Control de workers

```typescript
const pool = new ConcurrencyPool(8);
await pool.run(async () => {
  // Tarea async (máx 8 simultáneas)
});
```

### `src/ui.ts` - Interfaz terminal
- ANSI colors (sin dependencias)
- Progress bar dinámico
- Actualización en tiempo real (cada 200ms)
- Spinner de carga

```
📂 Organizador de Fotos
📁 Carpeta: /ruta
⚙️ Modo: Año
📊 Progreso
[████████░░░░░░░░░░░░] 2000 / 5000 (40%)
```

## Flujo de datos

```
1. CLI Parser
   ↓
2. Validación de carpeta
   ↓
3. Escaneo de archivos
   ├─→ Obtiene lista de fotos
   ├─→ Filtra por extensión válida
   └─→ Total: N fotos
   ↓
4. Pool de Concurrencia (máx 8 workers)
   ├─→ Worker 1: photo1.jpg
   ├─→ Worker 2: photo2.jpg
   ├─→ Worker 3: photo3.jpg
   ├─→ ...
   └─→ (actualiza progreso cada 200ms)
   ↓
5. Por cada foto:
   a. Extrae metadatos EXIF
   b. Fallback a mtime si necesario
   c. Determina carpeta destino
   d. Crea carpetas (si no --dry-run)
   e. Mueve archivo (si no --dry-run)
   f. Maneja duplicados
   g. Registra errores
   ↓
6. UI actualiza estadísticas
   ├─→ Contador de fotos procesadas
   ├─→ Fotos por año
   ├─→ Errores encontrados
   └─→ Progreso total
   ↓
7. Reporte final
```

## Performance

### Concurrencia
- **Workers simultáneos**: 8 (configurable)
- **No se bloquea**: Interfaz siempre responsiva
- **Control de carga**: Evita saturar CPU/disco

### Tiempos típicos
- 100 fotos: < 1s
- 1000 fotos: 2-5s
- 10000 fotos: 20-60s
- (Depende del disco duro)

### Optimizaciones
- Lectura de solo 64KB por archivo (EXIF)
- No carga imagen completa en memoria
- Batch updates de UI (cada 200ms)
- Procesamiento paralelo nativo

## Manejo de errores

```typescript
// Cada foto:
try {
  // Procesa
} catch (error) {
  stats.errors.push({
    file: 'photo.jpg',
    error: 'No date metadata found'
  });
  // Continúa con siguiente
}

// Errores comunes:
- Archivo corruppo → Continúa
- Sin EXIF → Usa mtime
- Permisos denegados → Registra
- Archivo duplicado → Renombra automático
```

## Estructura de carpetas destino

### Modo Year
```
dest/
├── 2020/
│   ├── photo1.jpg
│   └── photo2.png
├── 2021/
│   ├── vacation.jpg
│   └── ...
└── 2022/
```

### Modo Year-Month
```
dest/
├── 2020/
│   ├── 2020-01/
│   │   ├── photo1.jpg
│   │   └── ...
│   ├── 2020-02/
│   │   └── ...
│   └── ...
└── 2021/
    ├── 2021-01/
    └── ...
```

## Metadata EXIF

### Búsqueda de DateTimeOriginal
```
1. Lee primeros 64KB del archivo
2. Busca marcador 0xFFE1 (EXIF)
3. Busca tag 0x9003 (DateTimeOriginal)
4. Busca patrón: YYYY:MM:DD HH:MM:SS
5. Si no encuentra → fallback a mtime
```

### Validación
```
- Year: 1990 ≤ year ≤ current_year + 1
- Month: 1 ≤ month ≤ 12
- Day: 1 ≤ day ≤ 31
```

## Archivos soportados

```typescript
[
  '.jpg', '.jpeg', '.png', '.gif', '.bmp',
  '.webp', '.tiff', '.heic', '.raw',
  '.cr2', '.nef', '.arw'
]
```

## Sin dependencias externas

✅ Solo Bun (incluye TypeScript)
✅ APIs nativas: fs, path, readline
✅ ANSI codes para colores
✅ Parsing manual de EXIF

## Desarrollo

### Agregar nueva funcionalidad
1. Actualiza tipos en `processor.ts`
2. Implementa lógica
3. Integra con pool de concurrencia
4. Prueba con `--dry-run`

### Debug
```bash
# Watch mode
bun run --watch index.ts ./fotos --mode=year --dry-run

# Con console.log
// Agrupa logs por worker para no mezclar
```

### Testing
```bash
# Crea carpeta test con 10 fotos fake
mkdir -p /tmp/test_photos
touch /tmp/test_photos/{1..10}.jpg

# Prueba sin mover
bun run index.ts /tmp/test_photos --mode=year --dry-run

# Verifica estructura
ls -R /tmp/test_photos_organized/
```
