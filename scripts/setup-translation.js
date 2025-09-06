#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de configuración inicial para la automatización de traducciones
 */

console.log('🚀 Configurando automatización de traducciones...\n');

// 1. Verificar estructura de directorios
console.log('📁 Verificando estructura de directorios...');
const requiredDirs = ['scripts', 'locales', 'components'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   ✓ Creado directorio: ${dir}`);
  } else {
    console.log(`   ✓ Directorio existe: ${dir}`);
  }
});

// 2. Verificar archivos de traducción
console.log('\n📖 Verificando archivos de traducción...');
const localeFiles = ['locales/es.json', 'locales/en.json'];
localeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ Archivo existe: ${file}`);
  } else {
    console.log(`   ❌ Archivo faltante: ${file}`);
  }
});

// 3. Instalar dependencias necesarias
console.log('\n📦 Verificando dependencias...');
const packageJsonPath = 'package.json';
let packageJson = {};

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Error leyendo package.json');
  process.exit(1);
}

const requiredDeps = ['node-fetch'];
const missingDeps = requiredDeps.filter(dep => 
  !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
);

if (missingDeps.length > 0) {
  console.log(`   📦 Instalando dependencias faltantes: ${missingDeps.join(', ')}`);
  try {
    execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('   ✓ Dependencias instaladas');
  } catch (error) {
    console.error('   ❌ Error instalando dependencias');
  }
} else {
  console.log('   ✓ Todas las dependencias están instaladas');
}

// 4. Crear archivo .env.example si no existe
console.log('\n🔐 Configurando variables de entorno...');
const envExamplePath = '.env.example';
const envExampleContent = `# Configuración para automatización de traducciones
# Opcional: API Key de Google Translate para traducciones automáticas
# Si no se proporciona, se usarán traducciones simuladas básicas
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here

# Configuración de idiomas
SOURCE_LANGUAGE=es
TARGET_LANGUAGE=en
`;

if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('   ✓ Creado .env.example');
} else {
  console.log('   ✓ .env.example ya existe');
}

// 5. Hacer scripts ejecutables (en sistemas Unix)
console.log('\n⚙️  Configurando permisos de scripts...');
const scripts = [
  'scripts/translate-automation.js',
  'scripts/update-components.js',
  'scripts/setup-translation.js'
];

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    try {
      fs.chmodSync(script, 0o755);
      console.log(`   ✓ Permisos configurados: ${script}`);
    } catch (error) {
      console.log(`   ⚠️  No se pudieron configurar permisos para: ${script}`);
    }
  }
});

// 6. Crear scripts en package.json
console.log('\n📜 Agregando scripts a package.json...');
const newScripts = {
  'translate:scan': 'node scripts/translate-automation.js',
  'translate:update': 'node scripts/update-components.js',
  'translate:setup': 'node scripts/setup-translation.js',
  'translate:all': 'npm run translate:scan && npm run translate:update'
};

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

let scriptsAdded = 0;
Object.entries(newScripts).forEach(([key, value]) => {
  if (!packageJson.scripts[key]) {
    packageJson.scripts[key] = value;
    scriptsAdded++;
  }
});

if (scriptsAdded > 0) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`   ✓ Agregados ${scriptsAdded} scripts nuevos a package.json`);
} else {
  console.log('   ✓ Scripts ya configurados en package.json');
}

// 7. Mostrar resumen y próximos pasos
console.log('\n✅ Configuración completada!\n');
console.log('📋 Scripts disponibles:');
console.log('   npm run translate:setup  - Configurar entorno');
console.log('   npm run translate:scan   - Escanear y traducir texto');
console.log('   npm run translate:update - Actualizar componentes');
console.log('   npm run translate:all    - Proceso completo');

console.log('\n🔑 Configuración opcional de Google Translate API:');
console.log('1. Obtén una API key de Google Cloud Translation API');
console.log('2. Crea un archivo .env con: GOOGLE_TRANSLATE_API_KEY=tu_api_key');
console.log('3. Si no configuras la API, se usarán traducciones básicas simuladas');

console.log('\n🚀 Próximos pasos:');
console.log('1. npm run translate:scan   - Para escanear y generar traducciones');
console.log('2. Revisar locales/en.json  - Para ajustar traducciones si es necesario');
console.log('3. npm run translate:update - Para actualizar componentes');
console.log('4. Probar la aplicación en ambos idiomas');

console.log('\n📚 Para más información, consulta scripts/README.md');
