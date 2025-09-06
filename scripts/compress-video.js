#!/usr/bin/env node

/**
 * Script para comprimir videos grandes para uso en GitHub Pages
 * Requiere FFmpeg instalado en el sistema
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'public/hackathon/aura/Aura-Demo.mp4';
const OUTPUT_FILE = 'public/hackathon/aura/Aura-Demo-compressed.mp4';

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkFFmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

function compressVideo() {
    console.log('🎬 Iniciando compresión de video...');
    
    // Verificar si FFmpeg está instalado
    if (!checkFFmpeg()) {
        console.error('❌ FFmpeg no está instalado o no está en el PATH');
        console.log('📥 Para instalar FFmpeg:');
        console.log('   - Windows: Descargar desde https://ffmpeg.org/download.html');
        console.log('   - macOS: brew install ffmpeg');
        console.log('   - Linux: sudo apt install ffmpeg');
        process.exit(1);
    }
    
    // Verificar si el archivo existe
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ El archivo ${INPUT_FILE} no existe`);
        process.exit(1);
    }
    
    // Obtener tamaño del archivo original
    const originalStats = fs.statSync(INPUT_FILE);
    console.log(`📁 Archivo original: ${formatBytes(originalStats.size)}`);
    
    try {
        // Comando FFmpeg para comprimir el video manteniendo buena calidad
        const ffmpegCommand = [
            'ffmpeg',
            '-i', `"${INPUT_FILE}"`,
            '-c:v libx264',           // Codec de video H.264
            '-crf 28',                // Factor de calidad (18-28 es bueno, 28 más compresión)
            '-preset medium',         // Preset de velocidad vs compresión
            '-c:a aac',              // Codec de audio AAC
            '-b:a 128k',             // Bitrate de audio
            '-movflags +faststart',   // Optimización para streaming web
            '-y',                     // Sobrescribir archivo de salida
            `"${OUTPUT_FILE}"`
        ].join(' ');
        
        console.log('⚙️  Ejecutando compresión...');
        console.log(`📝 Comando: ${ffmpegCommand}`);
        
        execSync(ffmpegCommand, { stdio: 'inherit' });
        
        // Verificar el archivo comprimido
        if (fs.existsSync(OUTPUT_FILE)) {
            const compressedStats = fs.statSync(OUTPUT_FILE);
            const compressionRatio = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(2);
            
            console.log('✅ Compresión completada!');
            console.log(`📁 Archivo comprimido: ${formatBytes(compressedStats.size)}`);
            console.log(`📊 Reducción: ${compressionRatio}%`);
            
            if (compressedStats.size < 100 * 1024 * 1024) { // Menos de 100MB
                console.log('🎉 El archivo comprimido es adecuado para GitHub Pages');
            } else {
                console.log('⚠️  El archivo aún es grande, considera usar un CRF más alto (30-32)');
            }
            
            console.log('\n📋 Próximos pasos:');
            console.log('1. Verifica la calidad del video comprimido');
            console.log('2. Si está bien, reemplaza el archivo original');
            console.log('3. Actualiza las referencias en el código si es necesario');
            console.log('4. Haz commit y push de los cambios');
            
        } else {
            console.error('❌ Error: No se pudo crear el archivo comprimido');
        }
        
    } catch (error) {
        console.error('❌ Error durante la compresión:', error.message);
        process.exit(1);
    }
}

// Ejecutar el script
compressVideo();
