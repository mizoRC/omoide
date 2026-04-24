#!/bin/bash

# 📸 Omoide - Photo Organizer Examples

echo "=== Omoide Photo Organizer Examples ==="
echo ""

# Example 1: Organize by year
echo "1️⃣  Organize photos by year:"
echo "   bun run index.ts ./fotos --mode=year"
echo ""

# Example 2: Organize by year-month
echo "2️⃣  Organize photos by year-month:"
echo "   bun run index.ts ./fotos --mode=year-month"
echo ""

# Example 3: Dry run (simulation)
echo "3️⃣  Dry run (simulate without moving):"
echo "   bun run index.ts ./fotos --mode=year --dry-run"
echo ""

# Example 4: Interactive mode
echo "4️⃣  Interactive mode (asks for folder and mode):"
echo "   bun run index.ts"
echo ""

# Example 5: With different paths
echo "5️⃣  Different folder paths:"
echo "   bun run index.ts ~/Pictures --mode=year-month"
echo "   bun run index.ts /Volumes/ExternalDrive/Photos --mode=year"
echo ""

echo "📖 Features:"
echo "   ✅ Reads EXIF metadata (DateTimeOriginal)"
echo "   ✅ Fallback to file modification time"
echo "   ✅ Parallel processing (8 workers)"
echo "   ✅ Real-time progress display"
echo "   ✅ Automatic duplicate renaming"
echo "   ✅ Error handling for corrupted files"
echo ""
