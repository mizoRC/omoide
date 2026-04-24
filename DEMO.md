# 📺 Demo Visual

## Ejecución típica

### 1. Inicio con dry-run

```bash
$ bun run index.ts ~/Pictures --mode=year --dry-run
```

Output:
```
⠋ Escaneando carpeta...
```

### 2. Procesando

```
📂 Organizador de Fotos

📁 Carpeta: /Users/user/Pictures
⚙️ Modo: Año
🔍 Modo simulación (--dry-run)

📊 Progreso
[███████░░░░░░░░░░░░] 750 / 2500 (30%)

📁 Fotos por año
✔ 2019 → 125 fotos
✔ 2020 → 268 fotos
⏳ 2021 → 357 fotos
```

### 3. Completado

```
📂 Organizador de Fotos

📁 Carpeta: /Users/user/Pictures
⚙️ Modo: Año

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

## Modo interactivo

### Ejecución
```bash
$ bun run index.ts
```

### Output
```
📂 Ingresa ruta de la carpeta de fotos: ~/Pictures

📋 Selecciona modo de organización:

  1) Year (por año)
  2) Year-Month (por año-mes)

Selecciona (1 o 2): 1

⠋ Escaneando carpeta...

[Continúa con procesamiento...]
```

## Con errores

```
📂 Organizador de Fotos

📁 Carpeta: /Users/user/Pictures
⚙️ Modo: Año-Mes

📊 Progreso
[████████████████████] 2500 / 2500 (100%)

📁 Fotos por año
✔ 2019 → 234 fotos
✔ 2020 → 512 fotos
✔ 2021 → 687 fotos
✔ 2022 → 542 fotos

⚠️ Errores (3)
• corrupted.jpg: No valid image
• readonly.png: Permission denied
• broken.heic: Invalid EXIF data

✅ Proceso completado
```

## Estructura de carpetas creada

### Modo year

```
Pictures_organized/
├── 2019/
│   ├── vacation_001.jpg
│   ├── vacation_002.jpg
│   └── family_photo.png
├── 2020/
│   ├── new_year.jpg
│   ├── anniversary.jpg
│   └── ...
├── 2021/
│   ├── birthday_1.jpg
│   ├── birthday_2.jpg
│   ├── birthday_3.jpg
│   ├── sunset.png
│   └── ...
└── 2022/
    ├── summer_trip_1.jpg
    ├── summer_trip_2.jpg
    └── ...
```

### Modo year-month

```
Pictures_organized/
├── 2019/
│   ├── 2019-01/
│   │   ├── photo.jpg
│   │   └── ...
│   ├── 2019-02/
│   │   └── ...
│   ├── 2019-07/
│   │   ├── vacation_001.jpg
│   │   ├── vacation_002.jpg
│   │   └── vacation_003.jpg
│   └── ...
├── 2020/
│   ├── 2020-01/
│   │   ├── new_year.jpg
│   │   └── ...
│   ├── 2020-02/
│   │   ├── anniversary.jpg
│   │   └── ...
│   └── ...
└── 2021/
    ├── 2021-01/
    ├── 2021-02/
    ├── 2021-05/
    │   ├── birthday_1.jpg
    │   ├── birthday_2.jpg
    │   └── birthday_3.jpg
    └── ...
```

## Ejemplos de comandos

### Caso 1: Fotos del celular
```bash
bun run index.ts ~/Downloads/Camera --mode=year-month --dry-run
# Verifica primero
bun run index.ts ~/Downloads/Camera --mode=year-month
# Se crean: ~/Downloads/Camera_organized/2025/2025-04/...
```

### Caso 2: Fotos de cámara profesional
```bash
bun run index.ts /Volumes/ExternalDrive/RAW_Photos --mode=year --dry-run
# Las fotos RAW se organizan por año
```

### Caso 3: Organizar después de viaje
```bash
bun run index.ts ~/Dropbox/vacation_photos --mode=year-month
# Se agrupa por año y luego por mes
```

### Caso 4: Archivar por año (simple)
```bash
bun run index.ts ~/Pictures/Archive --mode=year
# Solo por año para simplicidad
```

## Información técnica visible

Mientras procesa, se ve:

1. **Spinner animado**: `⠋ ⠙ ⠹ ⠸` (indica procesamiento)
2. **Progress bar**: Actualiza cada 200ms
3. **Contador total**: `X / Y (Z%)`
4. **Por año**: Muestra cantidad de fotos procesadas por año
5. **Errores**: Lista archivos que no se pudieron procesar
6. **Finalización**: Mensaje "✅ Proceso completado"

## Velocidades esperadas

- **100 fotos**: < 1 segundo
- **1,000 fotos**: 2-5 segundos
- **5,000 fotos**: 10-20 segundos
- **10,000+ fotos**: 30-90 segundos

(Depende del tipo de disco: SSD más rápido, HDD más lento)

## Colores en terminal

```
Cyan  : 📁 Carpeta, ⚙️ Modo
Green : ✔ Completado, ✅ Finalización
Yellow: ⚠️ Errores, 🔍 Dry-run
Blue  : 📊 Progreso, 📁 Fotos por año
Blanco: Información general
```

---

**¡Visual intuitiva y amigable!** 🎨
