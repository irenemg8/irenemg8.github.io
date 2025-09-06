# Optimización de Videos para GitHub Pages

## Problema Identificado

El video `Aura-Demo.mp4` tiene un tamaño de **1.5GB**, que es demasiado grande para GitHub Pages. Este servicio tiene limitaciones que impiden cargar archivos de este tamaño correctamente.

## Soluciones Implementadas

### 1. Script de Compresión Automática

Se ha creado un script (`compress-video.js`) que utiliza FFmpeg para comprimir videos manteniendo buena calidad.

#### Instalación de FFmpeg

**Windows:**
1. Descargar desde [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extraer y agregar al PATH del sistema

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install ffmpeg
```

#### Uso del Script

```bash
# Ejecutar compresión
npm run compress:video
```

El script:
- Comprime el video usando H.264 con CRF 28
- Optimiza para streaming web
- Reduce significativamente el tamaño manteniendo calidad aceptable
- Proporciona estadísticas de compresión

### 2. Mejoras en el Componente MediaViewer

Se han implementado mejoras en el manejo de errores de video:
- Detección automática de errores de carga
- Mensaje informativo cuando el video no se puede cargar
- Enlace para abrir el video en nueva pestaña como fallback
- Mejor experiencia de usuario con mensajes claros

### 3. Alternativas Recomendadas

#### Opción A: Video Comprimido Local
1. Ejecutar `npm run compress:video`
2. Verificar la calidad del video comprimido
3. Reemplazar el archivo original si la calidad es aceptable

#### Opción B: Servicio Externo (Recomendado para videos grandes)
Para videos que deben mantener alta calidad:

1. **YouTube (Privado/No listado):**
   ```tsx
   // En lugar del video local, usar iframe de YouTube
   <iframe
     src="https://www.youtube.com/embed/VIDEO_ID"
     frameBorder="0"
     allowFullScreen
   />
   ```

2. **Vimeo:**
   ```tsx
   <iframe
     src="https://player.vimeo.com/video/VIDEO_ID"
     frameBorder="0"
     allowFullScreen
   />
   ```

3. **GitHub Releases:**
   - Subir el video como asset en un release
   - Usar la URL directa del asset

## Configuración Recomendada para Videos Web

Para futuros videos, usar estos parámetros de codificación:

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -maxrate 1M \
  -bufsize 2M \
  output.mp4
```

## Límites de GitHub Pages

- **Tamaño de archivo individual:** ~100MB (recomendado)
- **Tamaño total del repositorio:** 1GB
- **Ancho de banda:** 100GB/mes

## Próximos Pasos

1. ✅ Identificar el problema (archivo de 1.5GB)
2. ⏳ Ejecutar compresión del video
3. ⏳ Verificar calidad del video comprimido  
4. ⏳ Actualizar referencias en el código si es necesario
5. ⏳ Hacer commit y push de los cambios
6. ⏳ Verificar funcionamiento en GitHub Pages

## Monitoreo

Para verificar que el video se carga correctamente:
1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña Network
3. Intentar cargar el video
4. Verificar que no hay errores 404 o timeouts
