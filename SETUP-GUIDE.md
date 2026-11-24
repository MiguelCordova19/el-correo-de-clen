# 📬 El Correo de CLEN - Guía de Configuración

Esta guía te llevará paso a paso para configurar Firebase, Gemini API y desplegar tu aplicación en GitHub Pages.

---

## 📋 Requisitos Previos

- Node.js instalado (v20 o superior recomendado)
- Una cuenta de Google (para Firebase y Gemini)
- Una cuenta de GitHub (para deployment)
- Git instalado en tu computadora

---

## 🔥 Paso 1: Configurar Firebase

### 1.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** (o "Create a project")
3. Nombre del proyecto: `el-correo-de-clen` (o el que prefieras)
4. Desactiva Google Analytics (no es necesario para este proyecto)
5. Haz clic en **"Crear proyecto"**

### 1.2 Configurar Firebase Authentication

1. En el menú lateral, ve a **"Authentication"** (Autenticación)
2. Haz clic en **"Get started"** (Comenzar)
3. En la pestaña **"Sign-in method"** (Método de inicio de sesión):
   - Busca **"Anonymous"** (Anónimo)
   - Haz clic en el lápiz para editar
   - **Activa** el toggle
   - Guarda los cambios

### 1.3 Configurar Firestore Database

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Create database"** (Crear base de datos)
3. Selecciona **"Start in production mode"** (Iniciar en modo producción)
4. Elige la ubicación más cercana a tu región (ej: `us-central1`, `southamerica-east1`)
5. Haz clic en **"Enable"** (Habilitar)

### 1.4 Configurar Reglas de Seguridad de Firestore

1. Ve a la pestaña **"Rules"** (Reglas)
2. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuarios anónimos autenticados lean/escriban solo sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publish"** (Publicar)

### 1.5 Obtener las Credenciales de Firebase

1. En la consola de Firebase, haz clic en el ícono de **engranaje ⚙️** > **"Project settings"** (Configuración del proyecto)
2. En la sección **"Your apps"** (Tus aplicaciones), haz clic en el ícono **"</>"** (Web)
3. Nombre de la app: `El Correo de CLEN Web`
4. **NO** marques "Firebase Hosting"
5. Haz clic en **"Register app"** (Registrar aplicación)
6. Copia la configuración de Firebase que aparece. Se verá algo así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

7. **Guarda estos valores**, los necesitarás en el Paso 3.

---

## 🤖 Paso 2: Configurar Google Gemini API

### 2.1 Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Get API key"** (Obtener clave de API)
4. Haz clic en **"Create API key"** (Crear clave de API)
5. Selecciona tu proyecto de Firebase o crea uno nuevo
6. Copia la API key que aparece (empieza con `AIza...`)

⚠️ **IMPORTANTE**: 
- Esta API key es **GRATUITA** para el modelo `gemini-3.5-flash-lite`
- Tiene un límite generoso de requests por día
- **NO compartas esta clave públicamente**

### 2.2 Verificar que Gemini está disponible

1. En Google AI Studio, ve a la pestaña **"Pricing"**
2. Verifica que el modelo **"Gemini 3.5 Flash-Lite"** aparece como **"Free of charge"**
3. Puedes probar el modelo en la pestaña **"Chat"** para verificar que funciona

---

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env

1. En la raíz de tu proyecto, crea un archivo llamado `.env` (sin extensión)
2. Copia el contenido de `.env.example`:

```bash
cp .env.example .env
```

O en Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

### 3.2 Completar el archivo .env

Abre el archivo `.env` y reemplaza los valores con tus credenciales:

```env
# Firebase Configuration (del Paso 1.5)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Google Gemini API (del Paso 2.1)
VITE_GEMINI_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **IMPORTANTE**: 
- **NUNCA** subas el archivo `.env` a GitHub
- El archivo `.env` ya está en `.gitignore`
- Las variables **DEBEN** empezar con `VITE_` para que Vite las reconozca

---

## 🧪 Paso 4: Probar Localmente

### 4.1 Instalar dependencias

```bash
npm install
```

### 4.2 Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación debería abrirse en `http://localhost:5173`

### 4.3 Verificar que todo funciona

✅ Checklist de pruebas:
- [ ] La página carga sin errores en la consola
- [ ] El buzón aparece con animación de brillo
- [ ] Al hacer clic en el buzón, se ejecuta la animación completa
- [ ] Aparece el modal para agregar nota personal
- [ ] Se genera un mensaje con Gemini (revisa la consola)
- [ ] El mensaje se guarda y aparece en la galería
- [ ] El buzón queda deshabilitado después de abrir
- [ ] La galería muestra el mensaje guardado
- [ ] El botón "Exportar" descarga un archivo JSON

Si algo falla:
1. Revisa la consola del navegador (F12) para ver errores
2. Verifica que las API keys estén correctas en `.env`
3. Verifica que Firebase Auth y Firestore estén habilitados

---

## 🚀 Paso 5: Desplegar a GitHub Pages

### 5.1 Preparar el repositorio

1. Crea un repositorio en GitHub:
   - Ve a [github.com/new](https://github.com/new)
   - Nombre: `el-correo-de-clen` (o el que prefieras)
   - Visibilidad: **Public** (para usar GitHub Pages gratis)
   - **NO** inicialices con README
   - Haz clic en **"Create repository"**

2. Conecta tu proyecto local al repositorio:

```bash
git init
git add .
git commit -m "Initial commit: El Correo de CLEN"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/el-correo-de-clen.git
git push -u origin main
```

### 5.2 Configurar GitHub Actions para Deploy Automático

1. Crea la carpeta `.github/workflows`:

```bash
mkdir -p .github/workflows
```

En Windows PowerShell:
```powershell
New-Item -ItemType Directory -Force -Path ".github\workflows"
```

2. Crea el archivo `.github/workflows/deploy.yml` con este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env file
        run: |
          echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env
          echo "VITE_FIREBASE_AUTH_DOMAIN=${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}" >> .env
          echo "VITE_FIREBASE_PROJECT_ID=${{ secrets.VITE_FIREBASE_PROJECT_ID }}" >> .env
          echo "VITE_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}" >> .env
          echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}" >> .env
          echo "VITE_FIREBASE_APP_ID=${{ secrets.VITE_FIREBASE_APP_ID }}" >> .env
          echo "VITE_GEMINI_API_KEY=${{ secrets.VITE_GEMINI_API_KEY }}" >> .env

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. Guarda y sube el archivo:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow"
git push
```

### 5.3 Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **"Settings"** (Configuración)
3. En el menú lateral, click en **"Secrets and variables"** > **"Actions"**
4. Click en **"New repository secret"** y agrega estos secrets uno por uno:

| Name | Value (desde tu archivo .env) |
|------|-------------------------------|
| `VITE_FIREBASE_API_KEY` | Tu Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Tu Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Tu Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Tu Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Tu Firebase App ID |
| `VITE_GEMINI_API_KEY` | Tu Gemini API Key |

### 5.4 Habilitar GitHub Pages

1. En tu repositorio, ve a **"Settings"** > **"Pages"**
2. En **"Source"**, selecciona **"GitHub Actions"**
3. Guarda los cambios

### 5.5 Verificar el Deploy

1. Ve a la pestaña **"Actions"** de tu repositorio
2. Deberías ver un workflow corriendo llamado "Deploy to GitHub Pages"
3. Espera a que termine (toma 1-3 minutos)
4. Una vez completado, tu sitio estará disponible en:
   ```
   https://TU-USUARIO.github.io/el-correo-de-clen/
   ```

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios al código:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Actions automáticamente:
1. Compilará tu código
2. Desplegará a GitHub Pages
3. Tu sitio se actualizará en 1-3 minutos

---

## 🐛 Solución de Problemas Comunes

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que copiaste correctamente la API key de Firebase
- Asegúrate de que las variables en `.env` empiecen con `VITE_`

### Error: "Failed to fetch" al generar mensaje
- Verifica que la Gemini API key sea válida
- Revisa que tengas conexión a internet
- Verifica que el modelo `gemini-3.5-flash-lite` esté disponible

### El buzón no responde al click
- Abre la consola del navegador (F12) para ver errores
- Verifica que Firebase Auth esté habilitado y funcional
- Revisa que las reglas de Firestore permitan lectura/escritura

### GitHub Pages muestra página en blanco
- Verifica que todos los secrets estén configurados correctamente
- Revisa los logs de GitHub Actions para ver errores
- Asegúrate de que `vite.config.ts` tenga `base: './'`

### "Permission denied" en Firestore
- Verifica que las reglas de Firestore estén correctamente configuradas
- Asegúrate de que el usuario esté autenticado (revisa en la consola)

---

## 📞 Soporte Adicional

### Documentación Oficial:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Documentation](https://docs.github.com/pages)

### Verificar Status:
- [Firebase Status](https://status.firebase.google.com/)
- [Google Cloud Status](https://status.cloud.google.com/)
- [GitHub Status](https://www.githubstatus.com/)

---

## ✅ Checklist Final

Antes de considerar el proyecto completamente configurado:

- [ ] Firebase proyecto creado
- [ ] Firebase Auth (Anonymous) habilitado
- [ ] Firestore Database creado con reglas configuradas
- [ ] Gemini API key obtenida
- [ ] Archivo `.env` creado con todas las credenciales
- [ ] Aplicación funciona localmente sin errores
- [ ] Repositorio de GitHub creado
- [ ] GitHub Actions workflow configurado
- [ ] Secrets de GitHub configurados
- [ ] GitHub Pages habilitado
- [ ] Sitio desplegado y funcionando en GitHub Pages

---

¡Felicidades! 🎉 Tu aplicación **El Correo de CLEN** está lista y funcionando.

Cada día a las 00:00 podrás abrir el buzón y recibir un mensaje romántico especial generado por IA.
