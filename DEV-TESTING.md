# 🧪 Guía de Testing para Desarrollo

## Cómo probar el buzón múltiples veces durante desarrollo

Durante el desarrollo, necesitarás probar el flujo completo varias veces. Como la aplicación solo permite abrir un mensaje por día, aquí están las opciones para testing:

---

## Opción 1: Eliminar usuario en Firebase Console (Recomendada)

### Pasos:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. En la colección `users`, busca tu documento de usuario
5. Haz clic en los tres puntos **⋮** del documento
6. Selecciona **"Delete document"**
7. Recarga la página web (`F5`)
8. Ahora podrás abrir el buzón de nuevo

---

## Opción 2: Usar la Consola del Navegador

### Pasos:

1. Abre la consola del navegador (`F12`)
2. Ve a la pestaña **Console**
3. Pega este código y presiona Enter:

```javascript
// Eliminar datos locales y recargar
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Nota**: Esto solo limpia el almacenamiento local del navegador, pero los datos seguirán en Firestore. Después de recargar, se creará un nuevo usuario anónimo.

---

## Opción 3: Modo Incógnito

### Pasos:

1. Abre una ventana de incógnito (`Ctrl+Shift+N` en Chrome/Edge)
2. Ve a tu aplicación (`http://localhost:5173`)
3. Cada vez que cierres y abras una nueva ventana de incógnito, tendrás un usuario nuevo

**Ventaja**: No necesitas eliminar nada, cada ventana de incógnito es un usuario nuevo.

---

## Opción 4: Script de Reset Rápido (Avanzado)

### Crear un archivo de utilidades para desarrollo:

Puedes agregar temporalmente estas funciones al código para desarrollo:

```typescript
// Agregar al final de src/js/main.ts (solo durante desarrollo)

// Función para resetear el usuario (solo desarrollo)
(window as any).resetUser = async function() {
  if (!confirm('¿Resetear usuario? Esto eliminará todos los mensajes guardados.')) {
    return;
  }
  
  try {
    const userId = currentUser.uid;
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('✅ Usuario reseteado');
    location.reload();
  } catch (error) {
    console.error('❌ Error al resetear:', error);
  }
};

// Función para simular nuevo día (solo desarrollo)
(window as any).simulateNextDay = async function() {
  try {
    const userId = currentUser.uid;
    const userRef = doc(db, 'users', userId);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    await updateDoc(userRef, {
      lastOpenedDate: Timestamp.fromDate(yesterday)
    });
    
    console.log('✅ Fecha actualizada a ayer');
    location.reload();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

console.log('🧪 Funciones de desarrollo disponibles:');
console.log('- resetUser() - Elimina todos los datos del usuario actual');
console.log('- simulateNextDay() - Simula que ya pasó un día');
```

Luego en la consola del navegador puedes usar:
```javascript
resetUser()         // Elimina todo y recarga
simulateNextDay()   // Permite abrir otro mensaje
```

**⚠️ IMPORTANTE**: Recuerda **ELIMINAR** estas funciones antes de hacer el build para producción.

---

## Opción 5: Cambiar Reglas de Firestore Temporalmente (No Recomendada)

Puedes temporalmente cambiar las reglas para permitir escritura sin autenticación, pero **NO ES SEGURO** y solo debe usarse en proyectos de testing.

---

## Recomendación para Tu Caso

Dado que estás en desarrollo y probando constantemente, te recomiendo:

### **Combinación: Opción 1 + Opción 3**

1. **Durante desarrollo activo**: Usa **ventanas de incógnito** para probar rápidamente con diferentes usuarios
2. **Cuando quieras probar el flujo completo de un usuario**: Usa **Firebase Console** para eliminar el documento del usuario

### Flujo de trabajo sugerido:

```
1. Desarrollo inicial:
   - Usar ventanas de incógnito
   - Cada ventana = usuario nuevo = mensaje nuevo

2. Testing de un usuario específico:
   - Usar navegador normal
   - Ver que el buzón se deshabilita correctamente
   - Eliminar en Firebase Console cuando quieras resetear
   
3. Testing de galería y múltiples mensajes:
   - Eliminar en Firebase Console
   - Abrir mensaje
   - Cambiar fecha en Firestore manualmente a ayer
   - Abrir otro mensaje
   - Repetir para tener varios mensajes
```

---

## Atajo Rápido: Bookmarklet

Puedes crear un bookmarklet en tu navegador:

1. Crea un nuevo marcador/favorito
2. En la URL, pega esto:

```javascript
javascript:(function(){if(confirm('¿Limpiar y recargar?')){localStorage.clear();sessionStorage.clear();location.reload();}})();
```

3. Dale un nombre como "🧪 Reset Tinku"
4. Cuando quieras resetear, solo haz clic en el marcador

---

## Verificar Estado Actual

Para ver el estado actual de tu usuario en la consola:

```javascript
// Ver ID de usuario
console.log('User ID:', firebase.auth().currentUser?.uid);

// Ver última fecha de apertura (requiere importar desde tu código)
// Esta info estará visible en las herramientas de desarrollo de Firebase
```

---

## Resumen de Opciones

| Opción | Velocidad | Limpia Todo | Requiere Firebase Console |
|--------|-----------|-------------|---------------------------|
| Eliminar en Firebase | Media | ✅ Sí | ✅ Sí |
| Consola del navegador | Rápida | ⚠️ Parcial | ❌ No |
| Modo incógnito | Muy rápida | ✅ Sí (cada ventana) | ❌ No |
| Script de desarrollo | Muy rápida | ✅ Sí | ❌ No |
| Bookmarklet | Rápida | ⚠️ Parcial | ❌ No |

**Mi recomendación personal**: Usa **Modo Incógnito** mientras desarrollas. Es lo más rápido y no necesitas tocar Firebase.

---

¡Espero que esto te ayude con el testing! 🚀
