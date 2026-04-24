# 📸 Omoide - Photo Organizer CLI

Organizador de fotos CLI completo con Bun + Ink. Organiza miles de fotos por año o año-mes, extrayendo metadatos EXIF con procesamiento paralelo.

## 🚀 Instalación rápida

```bash
# Instalar dependencias
bun install

# Ejecutar directamente
cd omoide
bun run index.ts ./fotos --mode=year
```

## 📖 Uso

### Con argumentos

```bash
# Organizar por año
bun run index.ts ./fotos --mode=year

# Organizar por año-mes
bun run index.ts ./fotos --mode=year-month

# Simulación sin mover archivos
bun run index.ts ./fotos --mode=year --dry-run
```

### Modo interactivo

```bash
# Sin argumentos - solicita ruta y modo
bun run index.ts

# Ingresa: /ruta/a/fotos
# Selecciona: 1 (year) o 2 (year-month)
```

## ⚙️ Opciones

| Opción | Descripción | Ejemplo |
|--------|-----------|---------|
| `<ruta>` | Ruta de carpeta con fotos | `./fotos` |
| `--mode=year` | Organizar solo por año | `--mode=year` |
| `--mode=year-month` | Organizar por año/mes | `--mode=year-month` |
| `--dry-run` | Simular sin mover | `--dry-run` |

## ✨ Características

✅ **Extracción de metadatos EXIF** - Lee `DateTimeOriginal`  
✅ **Fallback a mtime** - Si no existe EXIF usa fecha de modificación  
✅ **Procesamiento paralelo** - Pool de 8 workers por defecto  
✅ **Evita sobrescritura** - Renombra automático si existe  
✅ **Manejo robusto de errores** - Ignora archivos corruptos  
✅ **TUI con Ink** - Progreso, estadísticas, spinner  
✅ **Modo simulación** - Prueba sin mover archivos  
✅ **Compatibilidad** - JPG, PNG, HEIC, RAW, TIFF, etc.  
✅ **React + Ink** - Interfaz moderna y responsiva  

## 📁 Estructura de carpetas

### Organizadas por año (`--mode=year`)
```
fotos_organized/
├── 2020/
│   ├── photo1.jpg
│   ├── photo2.png
│   └── ...
├── 2021/
│   ├── photo1.jpg
│   └── ...
└── 2022/
    └── ...
```

### Organizadas por año-mes (`--mode=year-month`)
```
fotos_organized/
├── 2020/
│   ├── 2020-01/
│   │   ├── photo1.jpg
│   │   └── ...
│   ├── 2020-02/
│   │   └── ...
│   └── ...
├── 2021/
│   ├── 2021-01/
│   │   └── ...
│   └── ...
└── ...
```

## 🔄 Flujo de ejecución

1. **Parseo** - Lee argumentos o solicita input interactivo
2. **Escaneo** - Detecta todas las imágenes
3. **Extracción de metadatos** - Lee EXIF o mtime
4. **Procesamiento paralelo** - Pool de máx 8 workers simultáneos
5. **Organización** - Crea carpetas y mueve archivos
6. **Reporte** - Muestra estadísticas finales

## 📈 Performance

- Procesa miles de fotos sin bloqueos
- Límite de concurrencia: 8 (configurable)
- Control automático de CPU/disco
- Actualización de UI cada 200ms

## 🛡️ Manejo de errores

- **Sin EXIF** → usa fecha de modificación (mtime)
- **Archivos corruptos** → registra error y continúa
- **Permisos insuficientes** → maneja excepciones
- **Archivos duplicados** → renombra automáticamente

## 📊 Ejemplo de salida

```
📂 Organizador de Fotos

📁 Carpeta: /Users/user/Pictures
⚙️ Modo: Año
🔍 Modo simulación (--dry-run)

📊 Progreso
[████████████████████] 2500 / 2500 (100%)

📁 Fotos por año
✔ 2019 → 234 fotos
✔ 2020 → 512 fotos
✔ 2021 → 687 fotos
✔ 2022 → 542 fotos
✔ 2023 → 525 fotos

✅ Proceso completado
```

## 📋 Requisitos

- **Bun 1.0+** - [Instalar desde https://bun.sh](https://bun.sh)

## 📝 Ejemplos de uso

```bash
# Probar sin mover (recomendado primero)
bun run index.ts ~/Pictures --mode=year --dry-run

# Organizar por año
bun run index.ts ~/Pictures --mode=year

# Organizar por año-mes desde drive externo
bun run index.ts /Volumes/ExternalDrive/Photos --mode=year-month

# Modo interactivo
bun run index.ts
```

## 📂 Estructura del proyecto

```
omoide/
├── index.ts              # Entrada principal
├── package.json          # Configuración Bun
├── tsconfig.json         # Configuración TypeScript
├── src/
│   ├── cli.ts            # Parseo de argumentos
│   ├── metadata.ts       # Extracción de EXIF
│   ├── processor.ts      # Lógica de procesamiento
│   ├── concurrency.ts    # Pool de concurrencia
│   └── ui.ts             # Interfaz terminal
└── README.md
```

## 🔧 Desarrollo

```bash
# Watch mode (recarga automática)
bun run --watch index.ts ./fotos --mode=year --dry-run

# Ejecutar con argumentos específicos
bun run index.ts ~/Pictures --mode=year-month
```

## 💡 Consejos

1. **Siempre prueba con `--dry-run`** antes de mover archivos reales
2. **Haz backup** de tus fotos antes de usar en producción
3. **Carpeta de destino** se crea automáticamente con sufijo `_organized`
4. **Archivos duplicados** se renombran automáticamente (photo.jpg → photo_1.jpg)

## 🐛 Troubleshooting

**Error: "La carpeta no existe"**
- Verifica que la ruta sea correcta: `bun run index.ts /ruta/correcta`

**Proceso lento**
- Usa `--dry-run` primero para ver estructura
- Si hay miles de fotos, es normal que tarde (pero sin bloqueos)

**Archivos no movidos**
- Verifica permisos: `ls -la carpeta/`
- Intenta con `--dry-run` primero para diagnosticar

## 📄 Licencia

MIT

## ✍️ Autor

Omoide - Photo Organizer CLI

