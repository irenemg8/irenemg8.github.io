#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para actualizar componentes y reemplazar texto hardcodeado
 * con claves de traducción usando useLanguage hook
 */

// Configuración
const DIRECTORIES_TO_UPDATE = [
  'components/desktop',
  'components/mobile', 
  'components/sections',
  'components/shared'
];

const ES_LOCALE_FILE = 'locales/es.json';

// Función para generar clave de traducción (igual que en translate-automation.js)
function generateTranslationKey(text, context = '') {
  const cleaned = text
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e') 
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
    
  return context ? `${context}.${cleaned}` : cleaned;
}

// Función para encontrar la clave de traducción para un texto
function findTranslationKey(text, translations, context = '') {
  // Buscar clave exacta
  const exactKey = generateTranslationKey(text, context);
  if (getNestedValue(translations, exactKey) === text) {
    return exactKey;
  }

  // Buscar en todas las claves
  function searchInObject(obj, currentPath = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof value === 'string' && value === text) {
        return fullPath;
      } else if (typeof value === 'object' && value !== null) {
        const found = searchInObject(value, fullPath);
        if (found) return found;
      }
    }
    return null;
  }

  return searchInObject(translations);
}

// Función para actualizar un archivo de componente
function updateComponentFile(filePath, translations) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  let addedUseLanguage = false;

  const context = path.basename(path.dirname(filePath));
  
  console.log(`📄 Procesando: ${filePath}`);

  // Verificar si ya usa useLanguage
  const hasUseLanguage = content.includes('useLanguage') && content.includes("const { t } = useLanguage()");
  
  // Patrones para encontrar texto hardcodeado en español
  const patterns = [
    // Strings literales en JSX
    {
      pattern: />((?:[^<])*[áéíóúüñÁÉÍÓÚÜÑ¡¿](?:[^<])*)</g,
      replacement: (match, text) => {
        const cleanText = text.trim();
        if (cleanText.length < 4) return match;
        
        const key = findTranslationKey(cleanText, translations, context);
        if (key) {
          console.log(`   ✓ JSX: "${cleanText}" -> t('${key}')`);
          return `>{t('${key}')}<`;
        }
        return match;
      }
    },
    // Strings literales en props y variables
    {
      pattern: /["'`]([^"'`]*[áéíóúüñÁÉÍÓÚÜÑ¡¿][^"'`]*)["'`]/g,
      replacement: (match, text) => {
        const cleanText = text.trim();
        if (cleanText.length < 4 || 
            cleanText.includes('import') || 
            cleanText.includes('export') ||
            cleanText.startsWith('/') ||
            cleanText.includes('className')) {
          return match;
        }
        
        const key = findTranslationKey(cleanText, translations, context);
        if (key) {
          console.log(`   ✓ String: "${cleanText}" -> t('${key}')`);
          return `t('${key}')`;
        }
        return match;
      }
    }
  ];

  // Aplicar patrones de reemplazo
  patterns.forEach(({ pattern, replacement }) => {
    const newContent = updatedContent.replace(pattern, replacement);
    if (newContent !== updatedContent) {
      updatedContent = newContent;
      hasChanges = true;
    }
  });

  // Si hay cambios y no tiene useLanguage, agregarlo
  if (hasChanges && !hasUseLanguage) {
    // Agregar import si no existe
    if (!updatedContent.includes("import { useLanguage }")) {
      const importMatch = updatedContent.match(/^((?:import.*\n)*)/m);
      if (importMatch) {
        updatedContent = updatedContent.replace(
          importMatch[0],
          importMatch[0] + "import { useLanguage } from '@/contexts/language-context'\n"
        );
      }
    }

    // Agregar hook dentro del componente
    const componentMatch = updatedContent.match(/(export (?:default )?function \w+[^{]*\{)/);
    if (componentMatch) {
      updatedContent = updatedContent.replace(
        componentMatch[0],
        componentMatch[0] + "\n  const { t } = useLanguage()\n"
      );
      addedUseLanguage = true;
    }
  }

  // Guardar archivo si hay cambios
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`   ✅ Archivo actualizado ${addedUseLanguage ? '(+useLanguage)' : ''}`);
    return true;
  } else {
    console.log(`   ⏭️  Sin cambios necesarios`);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🔧 Iniciando actualización de componentes...\n');

  // Cargar traducciones en español
  let esTranslations = {};
  try {
    esTranslations = JSON.parse(fs.readFileSync(ES_LOCALE_FILE, 'utf8'));
    console.log(`📖 Cargadas ${Object.keys(esTranslations).length} categorías de traducción\n`);
  } catch (error) {
    console.error(`❌ Error cargando ${ES_LOCALE_FILE}:`, error.message);
    process.exit(1);
  }

  let totalFiles = 0;
  let updatedFiles = 0;

  // Procesar todos los directorios
  for (const directory of DIRECTORIES_TO_UPDATE) {
    console.log(`📂 Procesando directorio: ${directory}`);
    
    if (!fs.existsSync(directory)) {
      console.log(`⚠️  Directorio no encontrado: ${directory}`);
      continue;
    }

    const files = getAllTsxFiles(directory);
    console.log(`   Encontrados ${files.length} archivos .tsx`);
    
    for (const file of files) {
      totalFiles++;
      const wasUpdated = updateComponentFile(file, esTranslations);
      if (wasUpdated) {
        updatedFiles++;
      }
    }
    
    console.log(''); // Línea en blanco entre directorios
  }

  console.log(`📊 Resumen de actualización:`);
  console.log(`   - Archivos procesados: ${totalFiles}`);
  console.log(`   - Archivos actualizados: ${updatedFiles}`);
  console.log(`   - Archivos sin cambios: ${totalFiles - updatedFiles}`);
  
  if (updatedFiles > 0) {
    console.log(`\n✅ Actualización completada exitosamente!`);
    console.log(`\n📝 Próximos pasos:`);
    console.log(`1. Revisar los cambios con git diff`);
    console.log(`2. Probar la aplicación en ambos idiomas`);
    console.log(`3. Ajustar manualmente cualquier traducción que necesite contexto`);
    console.log(`4. Ejecutar los tests para asegurar que todo funciona`);
  } else {
    console.log(`\n✅ Todos los archivos ya están actualizados!`);
  }
}

// Funciones auxiliares
function getAllTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getNestedValue(obj, key) {
  return key.split('.').reduce((current, k) => current && current[k], obj);
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateComponentFile, findTranslationKey };
