# 📬 El Correo de CLEN

Una aplicación web romántica que te entrega un mensaje de amor cada día. Fragmentos de canciones, poemas y versículos bíblicos generados por IA para alegrar tu día.

![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## ✨ Características

- 📮 **Un mensaje por día**: Abre el buzón cada día a partir de las 00:00
- 🎵 **Contenido variado**: Canciones de amor, poemas románticos y versículos bíblicos
- 🤖 **Generado por IA**: Usa Google Gemini para crear mensajes únicos
- 📚 **Galería de recuerdos**: Guarda y revisa todos tus mensajes recibidos
- 💾 **Exportación**: Descarga tus mensajes como JSON
- 🎨 **Diseño romántico**: Colores lila pastel y animaciones suaves
- 📱 **Responsive**: Funciona perfectamente en móvil y desktop

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js (v20 o superior)
- Una cuenta de Google (para Firebase y Gemini API)
- Una cuenta de GitHub (para deployment)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/el-correo-de-clen.git
   cd el-correo-de-clen
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Sigue la [**Guía de Configuración Completa**](SETUP-GUIDE.md) para:
   - Crear proyecto en Firebase
   - Obtener API key de Gemini
   - Configurar las variables de entorno

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   
   Ve a `http://localhost:5173`

## 📖 Documentación

Para instrucciones detalladas de configuración, deployment y troubleshooting, consulta:

👉 **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Guía completa paso a paso

## 🛠️ Tecnologías

- **Frontend**: TypeScript, Vite, CSS3
- **Backend**: Firebase (Authentication, Firestore)
- **IA**: Google Gemini API (3.5 Flash-Lite)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 Estructura del Proyecto

```
el-correo-de-clen/
├── src/
│   ├── css/
│   │   ├── variables.css      # Variables de diseño
│   │   ├── animations.css     # Animaciones
│   │   └── styles.css         # Estilos principales
│   ├── js/
│   │   ├── main.ts            # Punto de entrada
│   │   ├── firebase.ts        # Configuración Firebase
│   │   ├── gemini.ts          # Integración Gemini API
│   │   ├── messageService.ts  # Lógica de mensajes
│   │   ├── mailbox.ts         # Componente buzón
│   │   └── gallery.ts         # Componente galería
│   ├── assets/
│   │   └── images/
│   │       └── mailbox.svg    # SVG del buzón
│   └── types/
│       └── index.ts           # Definiciones TypeScript
├── index.html
├── vite.config.ts
├── .env.example
└── SETUP-GUIDE.md
```

## 🎨 Screenshots

### Vista Principal
El buzón interactivo con animaciones suaves

### Galería
Todos tus mensajes guardados en tarjetas organizadas

### Mensaje del Día
Vista completa del mensaje con traducción y nota personal

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 💌 Contacto

¿Preguntas o sugerencias? Abre un [issue](https://github.com/tu-usuario/el-correo-de-clen/issues)

---

Hecho con 💜 y ☕
