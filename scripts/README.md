# 🌍 Automatización de Traducciones con IA

Este conjunto de scripts automatiza la traducción de contenido hardcodeado en tu aplicación React/Next.js usando APIs de traducción como Google Translate.

## 🚀 Inicio Rápido

```bash
# 1. Configurar entorno
npm run translate:setup

# 2. Escanear y traducir contenido
npm run translate:scan

# 3. Actualizar componentes
npm run translate:update

# O ejecutar todo el proceso:
npm run translate:all
```

## 📋 Scripts Disponibles

### `translate:setup`
Configura el entorno inicial:
- ✅ Verifica estructura de directorios
- ✅ Instala dependencias necesarias
- ✅ Crea archivos de configuración
- ✅ Configura scripts en package.json

### `translate:scan`
Escanea y traduce contenido:
- 🔍 Busca texto hardcodeado en español
- 🤖 Traduce automáticamente al inglés
- 💾 Actualiza archivos de traducción (locales/es.json, locales/en.json)
- 📊 Genera reporte de progreso

### `translate:update`
Actualiza componentes:
- 🔧 Reemplaza texto hardcodeado con claves de traducción
- ➕ Agrega `useLanguage` hook automáticamente
- 📝 Actualiza imports necesarios
- ✅ Preserva funcionalidad existente

## ⚙️ Configuración

### API de Google Translate (Opcional)

1. **Obtener API Key:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita la Translation API
   - Crea una API key

2. **Configurar variables de entorno:**
   ```bash
   # Crear archivo .env
   echo "GOOGLE_TRANSLATE_API_KEY=tu_api_key_aqui" > .env
   ```

3. **Sin API Key:**
   - Los scripts funcionan con traducciones simuladas básicas
   - Ideal para desarrollo y testing
   - Incluye traducciones comunes pre-configuradas

### Personalización

Edita los archivos de script para ajustar:

```javascript
// translate-automation.js
const DIRECTORIES_TO_SCAN = [
  'components/desktop',
  'components/mobile', 
  'components/sections',
  'components/shared'
];

const SOURCE_LANG = 'es';
const TARGET_LANG = 'en';
```

## 📂 Estructura de Archivos

```
scripts/
├── README.md                 # Esta documentación
├── setup-translation.js     # Configuración inicial
├── translate-automation.js  # Escaneo y traducción
└── update-components.js     # Actualización de componentes

locales/
├── es.json                  # Traducciones en español
└── en.json                  # Traducciones en inglés
```

## 🔍 Cómo Funciona

### 1. Detección de Texto

El script busca texto en español usando patrones regex:
- ✅ Strings con caracteres especiales (á, é, í, ó, ú, ñ, ¡, ¿)
- ✅ Palabras clave comunes en español
- ✅ Contenido JSX con texto
- ❌ Excluye variables, imports, rutas, clases CSS

### 2. Generación de Claves

Las claves de traducción se generan automáticamente:
```
"Soy una diseñadora UX/UI" → "desktop.soy_una_disenadora_ux_ui"
"¡Hola! Gracias por visitar" → "mobile.hola_gracias_por_visitar"
```

### 3. Actualización de Componentes

Transforma el código automáticamente:

**Antes:**
```tsx
export function MiComponente() {
  return <h1>¡Hola! Bienvenido a mi portfolio</h1>
}
```

**Después:**
```tsx
import { useLanguage } from '@/contexts/language-context'

export function MiComponente() {
  const { t } = useLanguage()
  
  return <h1>{t('mobile.hola_bienvenido_a_mi_portfolio')}</h1>
}
```

## 📊 Ejemplo de Salida

```bash
🚀 Iniciando automatización de traducciones...

📂 Escaneando directorio: components/desktop
   Encontrados 15 archivos .tsx
   📄 components/desktop/messages-window.tsx: 8 textos encontrados
   📄 components/desktop/about-me-window.tsx: 12 textos encontrados

📊 Resumen:
   - Archivos escaneados: 45
   - Textos únicos encontrados: 127

🔄 Procesando traducciones...
🔄 Traduciendo: "¡Hola! Gracias por visitar mi portfolio"
   ✓ "Hello! Thanks for visiting my portfolio"
🔄 Traduciendo: "Soy desarrolladora Full-Stack especializada..."
   ✓ "I am a Full-Stack developer specialized..."

✅ Proceso completado:
   - Nuevas traducciones: 89
   - Archivos actualizados: locales/es.json, locales/en.json
```

## 🛠️ Resolución de Problemas

### Error: "GOOGLE_TRANSLATE_API_KEY no está configurada"
- ✅ **Solución:** El script funcionará con traducciones simuladas
- 🔧 **Opcional:** Configura la API key para traducciones más precisas

### Error: "No se encontraron textos para traducir"
- ✅ Los componentes ya están traducidos
- 🔍 Verifica que los directorios especificados existan
- 📝 Ajusta los patrones de búsqueda si es necesario

### Error: "command not found"
- ✅ Ejecuta `npm run translate:setup` primero
- 📦 Verifica que Node.js esté instalado

### Traducciones incorrectas
- 📝 Edita manualmente `locales/en.json`
- 🔄 Las traducciones automáticas son un punto de partida
- 👀 Siempre revisa el resultado final

## 📈 Mejores Prácticas

### Antes de Ejecutar
1. ✅ Haz backup de tu código (`git commit`)
2. ✅ Revisa que la estructura i18n existente funcione
3. ✅ Ejecuta tests para asegurar estabilidad

### Después de Ejecutar
1. 📝 Revisa las traducciones generadas
2. 🧪 Prueba la aplicación en ambos idiomas
3. 🔍 Verifica que no se rompió funcionalidad existente
4. ✨ Ajusta traducciones que necesiten contexto específico

### Mantenimiento
- 🔄 Ejecuta periódicamente para nuevo contenido
- 📊 Mantén consistencia en las claves de traducción
- 🌍 Considera agregar más idiomas en el futuro

## 🤝 Contribuir

Para mejorar los scripts:
1. 🍴 Fork del proyecto
2. 🌿 Crea una rama para tu feature
3. 📝 Agrega tests si es necesario
4. 🚀 Envía un pull request

## 📄 Licencia

Este conjunto de scripts está bajo la misma licencia que tu proyecto principal.

---

**💡 Tip:** Para proyectos grandes, considera ejecutar los scripts por partes, procesando un directorio a la vez para mejor control del proceso.
