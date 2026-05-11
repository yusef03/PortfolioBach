#!/bin/bash
echo "Konvertiere Bilder zu WebP..."
find images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) | while read img; do
    webp_path="${img%.*}.webp"
    if [ ! -f "$webp_path" ]; then
        echo "Konvertiere: $img -> $webp_path"
        ffmpeg -i "$img" -c:v libwebp -quality 80 "$webp_path" -loglevel error
    else
        echo "Existiert bereits: $webp_path"
    fi
done
echo "Fertig!"
