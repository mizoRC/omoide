# 🚀 QUICKSTART

## 1️⃣ Requisitos

- Tener Bun instalado: https://bun.sh
- Una carpeta con fotos

## 2️⃣ Instalación

```bash
cd omoide
bun install
# ¡Listo! React + Ink instalados
```

## 3️⃣ Prueba sin riesgo

```bash
bun run index.ts ~/Pictures --mode=year --dry-run
```

✅ Esto simula sin mover nada - ¡100% seguro!

## 4️⃣ Ejecutar de verdad

```bash
bun run index.ts ~/Pictures --mode=year
```

Las fotos se organizarán en `Pictures_organized/`

## 5️⃣ Modo interactivo

```bash
bun run index.ts
# Te pedirá la ruta y el modo
```

## 📊 Ejemplos rápidos

```bash
# Por año (carpetas como 2020/, 2021/, etc)
bun run index.ts ~/Photos --mode=year

# Por año-mes (carpetas como 2020/2020-01/, etc)
bun run index.ts ~/Photos --mode=year-month

# Simular primero (RECOMENDADO)
bun run index.ts ~/Photos --mode=year --dry-run

# Interactivo (te guía paso a paso)
bun run index.ts
```

## ⏱️ ¿Cuánto tarda?

- 100 fotos: < 1 segundo
- 1000 fotos: 2-5 segundos
- 10000 fotos: 10-30 segundos
- Depende de tu disco duro (HDD es más lento)

## 🛡️ Safety first

1. **Siempre prueba con `--dry-run` primero**
2. **Haz backup de tus fotos**
3. **Verifica que funcione con algunos archivos**
4. **Luego úsalo con toda tu librería**

## 📁 Salida

```
// Antes
~/Pictures/
├── photo1.jpg
├── photo2.png
├── vacation_photo.jpg
├── ...

// Después (con --mode=year)
~/Pictures_organized/
├── 2020/
│   ├── photo1.jpg
│   ├── photo2.png
│   └── ...
├── 2021/
│   ├── vacation_photo.jpg
│   └── ...
└── ...

// Después (con --mode=year-month)
~/Pictures_organized/
├── 2020/
│   ├── 2020-01/
│   │   ├── photo1.jpg
│   │   └── ...
│   ├── 2020-02/
│   │   ├── photo2.png
│   │   └── ...
│   └── ...
└── ...
```

## ❓ Preguntas

**P: ¿Es seguro?**
A: Usa `--dry-run` primero para estar 100% seguro.

**P: ¿Qué pasa con archivos duplicados?**
A: Se renombran automáticamente (photo.jpg → photo_1.jpg)

**P: ¿Funciona con HEIC, RAW, TIFF?**
A: ¡Sí! Soporta casi todos los formatos de imagen.

**P: ¿Y si la foto no tiene EXIF?**
A: Usa la fecha del archivo (mtime automáticamente).

**P: ¿Puedo cancelar?**
A: Presiona Ctrl+C en cualquier momento.

---

**¡Listo! Solo ejecuta y disfruta tus fotos organizadas.** 📸
