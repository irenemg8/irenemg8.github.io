#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de automatización para traducir contenido hardcodeado
 * usando Google Translate API
 */

// Configuración
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const SOURCE_LANG = 'es';
const TARGET_LANG = 'en';

// Directorios a procesar
const DIRECTORIES_TO_SCAN = [
  'components/desktop',
  'components/mobile', 
  'components/sections',
  'components/shared'
];

// Archivos de traducción
const ES_LOCALE_FILE = 'locales/es.json';
const EN_LOCALE_FILE = 'locales/en.json';

// Patrones para detectar texto hardcodeado en español
const SPANISH_TEXT_PATTERNS = [
  // Strings literales en español
  /["'`]([^"'`]*[áéíóúüñÁÉÍÓÚÜÑ¡¿][^"'`]*)["'`]/g,
  // Strings que contienen palabras comunes en español
  /["'`]([^"'`]*(?:soy|estoy|tengo|hacer|proyecto|experiencia|trabajo|sobre|acerca|hola|gracias|por favor|descripción|detalles|técnicos|desarrolladora|diseñadora)[^"'`]*)["'`]/gi,
  // JSX con texto en español
  />([^<]*[áéíóúüñÁÉÍÓÚÜÑ¡¿][^<]*)</g,
  // Comentarios con texto en español
  /\/\*([^*]*[áéíóúüñÁÉÍÓÚÜÑ¡¿][^*]*)\*\//g,
  ///\/([^/]*[áéíóúüñÁÉÍÓÚÜÑ¡¿][^/]*)/g
];

// Función para traducir texto usando Google Translate API
async function translateText(text, sourceLang = SOURCE_LANG, targetLang = TARGET_LANG) {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('⚠️  GOOGLE_TRANSLATE_API_KEY no está configurada. Usando traducciones simuladas.');
    // Fallback: usar traducciones básicas simuladas
    return simulateTranslation(text);
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error(`Error traduciendo "${text}":`, error.message);
    return simulateTranslation(text);
  }
}

// Función de fallback para simular traducciones básicas
function simulateTranslation(text) {
  const basicTranslations = {
    // Saludos y básicos
    'Hola': 'Hello',
    'Gracias': 'Thanks',
    'Por favor': 'Please',
    'Sí': 'Yes',
    'No': 'No',
    'Cerrar': 'Close',
    'Abrir': 'Open',
    
    // Profesionales
    'Soy una diseñadora UX/UI y desarrolladora frontend': 'I am a UX/UI designer and frontend developer',
    'Sobre Mí': 'About Me',
    'Sobre mí': 'About me',
    'Proyectos': 'Projects',
    'Experiencia': 'Experience',
    'Trabajo': 'Work',
    'Habilidades': 'Skills',
    'Contacto': 'Contact',
    'Portfolio': 'Portfolio',
    
    // Descripciones comunes
    'apasionada por crear experiencias digitales': 'passionate about creating digital experiences',
    'que no solo funcionen perfectamente': 'that not only work perfectly',
    'sino que también emocionen e inspiren': 'but also excite and inspire',
    'Descripción del proyecto y detalles técnicos': 'Project description and technical details',
    'Me encanta': 'I love',
    'Especializada en': 'Specialized in',
    'Desarrolladora Full-Stack': 'Full-Stack Developer',
    
    // Mensajes
    '¡Hola! 👋 Gracias por visitar mi portfolio': 'Hello! 👋 Thanks for visiting my portfolio',
    'Soy desarrolladora Full-Stack especializada en React, Next.js y aplicaciones móviles': 'I am a Full-Stack developer specialized in React, Next.js and mobile applications',
    '¿Te interesa alguno de mis proyectos? Me encantaría saber tu opinión 🚀': 'Are you interested in any of my projects? I would love to know your opinion 🚀',
    'También puedes contactarme por email': 'You can also contact me by email',
    
    // Arte y creatividad
    'Explora mis obras': 'Explore my works',
    'Estas obras digitales han sido creadas con mi pasión por el diseño y la creatividad digital': 'These digital works have been created with my passion for design and digital creativity',
    
    // Trabajo
    'Universidad Politécnica de Valencia': 'Polytechnic University of Valencia',
    'Teaching Assistant': 'Teaching Assistant',
    'Tiempo parcial': 'Part-time',
    'Apoyo docente en asignaturas de programación e ingeniería informática': 'Teaching support in programming and computer engineering subjects',
    'tutorías y desarrollo de material educativo': 'tutorials and educational material development',
    'Asistencia en clases prácticas de programación': 'Assistance in practical programming classes',
    'Tutorías personalizadas a estudiantes': 'Personalized student tutoring',
    'Corrección de ejercicios y exámenes': 'Exercise and exam correction',
    'Desarrollo de material didáctico': 'Didactic material development',
    'Apoyo en proyectos de investigación': 'Support in research projects',
  };

  // Buscar traducción exacta
  if (basicTranslations[text]) {
    return basicTranslations[text];
  }

  // Buscar traducciones parciales
  for (const [spanish, english] of Object.entries(basicTranslations)) {
    if (text.includes(spanish)) {
      return text.replace(spanish, english);
    }
  }

  // Si no encuentra traducción, devolver el texto original
  console.warn(`⚠️  No se encontró traducción para: "${text}"`);
  return text;
}

// Función para escanear archivos y encontrar texto hardcodeado
function scanFileForSpanishText(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const foundTexts = new Set();
  
  SPANISH_TEXT_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      // Filtrar textos muy cortos, variables, imports, etc.
      if (text.length > 3 && 
          !text.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/) && // No variables
          !text.startsWith('/') && // No rutas
          !text.includes('import') && // No imports
          !text.includes('export') && // No exports
          !text.match(/^[0-9]+$/) && // No números
          !text.includes('className') && // No clases CSS
          text.match(/[áéíóúüñÁÉÍÓÚÜÑ¡¿]|(?:soy|estoy|tengo|hacer|proyecto|experiencia|trabajo|sobre|acerca|hola|gracias)/i)
      ) {
        foundTexts.add(text);
      }
    }
  });
  
  return Array.from(foundTexts);
}

// Función para generar clave de traducción
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

// Función principal
async function main() {
  console.log('🚀 Iniciando automatización de traducciones...\n');

  // Verificar que node-fetch esté instalado (opcional)
  let nodeHasFetch = false;
  try {
    require.resolve('node-fetch');
    nodeHasFetch = true;
    console.log('✅ node-fetch disponible para traducciones avanzadas');
  } catch (e) {
    console.log('⚠️  node-fetch no disponible, usando traducciones simuladas básicas');
    console.log('   Para traducciones más precisas, instala: npm install node-fetch');
  }

  // Cargar archivos de traducción existentes
  let esTranslations = {};
  let enTranslations = {};
  
  try {
    esTranslations = JSON.parse(fs.readFileSync(ES_LOCALE_FILE, 'utf8'));
    enTranslations = JSON.parse(fs.readFileSync(EN_LOCALE_FILE, 'utf8'));
  } catch (error) {
    console.log('⚠️  Error cargando archivos de traducción existentes');
  }

  const allFoundTexts = new Map(); // text -> {files: [filePaths], context: string}
  let totalFiles = 0;

  // Escanear todos los directorios
  for (const directory of DIRECTORIES_TO_SCAN) {
    console.log(`📂 Escaneando directorio: ${directory}`);
    
    if (!fs.existsSync(directory)) {
      console.log(`⚠️  Directorio no encontrado: ${directory}`);
      continue;
    }

    const files = getAllTsxFiles(directory);
    console.log(`   Encontrados ${files.length} archivos .tsx`);
    
    for (const file of files) {
      const spanishTexts = scanFileForSpanishText(file);
      totalFiles++;
      
      if (spanishTexts.length > 0) {
        console.log(`   📄 ${file}: ${spanishTexts.length} textos encontrados`);
        
        spanishTexts.forEach(text => {
          if (!allFoundTexts.has(text)) {
            allFoundTexts.set(text, { files: [], context: path.basename(directory) });
          }
          allFoundTexts.get(text).files.push(file);
        });
      }
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   - Archivos escaneados: ${totalFiles}`);
  console.log(`   - Textos únicos encontrados: ${allFoundTexts.size}`);

  if (allFoundTexts.size === 0) {
    console.log('✅ No se encontraron textos para traducir.');
    return;
  }

  // Procesar traducciones
  console.log(`\n🔄 Procesando traducciones...`);
  const newTranslations = {};
  let translatedCount = 0;

  for (const [text, info] of allFoundTexts.entries()) {
    const key = generateTranslationKey(text, info.context);
    
    // Verificar si ya existe la traducción
    const existingTranslation = getNestedValue(enTranslations, key);
    if (existingTranslation) {
      console.log(`✓ Ya existe traducción para: "${text}"`);
      continue;
    }

    console.log(`🔄 Traduciendo: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    try {
      const translation = await translateText(text);
      setNestedValue(newTranslations, key, translation);
      setNestedValue(esTranslations, key, text); // También agregar al español
      translatedCount++;
      
      console.log(`   ✓ "${translation.substring(0, 50)}${translation.length > 50 ? '...' : ''}"`);
      
      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  // Fusionar traducciones nuevas con las existentes
  const updatedEnTranslations = mergeDeep(enTranslations, newTranslations);

  // Guardar archivos actualizados
  console.log(`\n💾 Guardando archivos de traducción...`);
  
  fs.writeFileSync(ES_LOCALE_FILE, JSON.stringify(esTranslations, null, 2), 'utf8');
  fs.writeFileSync(EN_LOCALE_FILE, JSON.stringify(updatedEnTranslations, null, 2), 'utf8');
  
  console.log(`✅ Proceso completado:`);
  console.log(`   - Nuevas traducciones: ${translatedCount}`);
  console.log(`   - Archivos actualizados: ${ES_LOCALE_FILE}, ${EN_LOCALE_FILE}`);
  
  // Mostrar instrucciones para el siguiente paso
  console.log(`\n📝 Próximos pasos:`);
  console.log(`1. Revisar manualmente las traducciones en ${EN_LOCALE_FILE}`);
  console.log(`2. Ejecutar el script de actualización de componentes:`);
  console.log(`   node scripts/update-components.js`);
  console.log(`3. Probar la aplicación en ambos idiomas`);
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

function setNestedValue(obj, key, value) {
  const keys = key.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, k) => {
    if (!current[k]) current[k] = {};
    return current[k];
  }, obj);
  target[lastKey] = value;
}

function mergeDeep(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { translateText, scanFileForSpanishText, generateTranslationKey };
