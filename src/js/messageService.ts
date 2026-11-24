import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Message, MessageType } from '../types';

/**
 * Verifica si el usuario puede abrir un mensaje hoy
 * @param userId ID del usuario
 * @returns true si puede abrir, false si no
 */
export async function canOpenToday(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      // Usuario nuevo, puede abrir
      return true;
    }

    const data = userDoc.data();
    const lastOpened = data.lastOpenedDate?.toDate();

    if (!lastOpened) {
      return true;
    }

    // Verificar si es un día diferente
    const today = new Date();
    const isSameDay =
      lastOpened.getDate() === today.getDate() &&
      lastOpened.getMonth() === today.getMonth() &&
      lastOpened.getFullYear() === today.getFullYear();

    return !isSameDay;
  } catch (error) {
    console.error('❌ Error al verificar si puede abrir:', error);
    return false;
  }
}

/**
 * Obtiene la última fecha de apertura
 * @param userId ID del usuario
 * @returns Fecha de última apertura o null
 */
export async function getLastOpenedDate(userId: string): Promise<Date | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return data.lastOpenedDate?.toDate() || null;
  } catch (error) {
    console.error('❌ Error al obtener última fecha:', error);
    return null;
  }
}

/**
 * Guarda un nuevo mensaje en Firestore
 * @param userId ID del usuario
 * @param message Datos del mensaje generado por Gemini
 * @param personalNote Nota personal opcional
 * @returns Promise con el mensaje guardado
 */
export async function saveMessage(
  userId: string,
  message: { type: MessageType; content: string; source: string; author: string; translation?: string },
  personalNote: string | null = null
): Promise<Message> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      date: new Date(),
      type: message.type,
      content: message.content,
      source: message.source,
      author: message.author,
      translation: message.translation || null,
      personalNote,
      opened: true,
    };

    if (!userDoc.exists()) {
      // Crear documento de usuario nuevo
      await setDoc(userRef, {
        lastOpenedDate: serverTimestamp(),
        messages: [newMessage],
        createdAt: serverTimestamp(),
      });
    } else {
      // Actualizar usuario existente
      const currentMessages = userDoc.data().messages || [];
      await updateDoc(userRef, {
        lastOpenedDate: serverTimestamp(),
        messages: [...currentMessages, newMessage],
      });
    }

    console.log('✅ Mensaje guardado:', newMessage.id);
    return newMessage;
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error);
    throw error;
  }
}

/**
 * Obtiene todos los mensajes del usuario
 * @param userId ID del usuario
 * @returns Array de mensajes
 */
export async function getMessages(userId: string): Promise<Message[]> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return [];
    }

    const messages = userDoc.data().messages || [];
    
    // Convertir timestamps de Firestore a Date
    return messages.map((msg: any) => ({
      ...msg,
      date: msg.date?.toDate ? msg.date.toDate() : new Date(msg.date),
    }));
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    return [];
  }
}

/**
 * Obtiene el mensaje del día actual (si existe)
 * @param userId ID del usuario
 * @returns Mensaje de hoy o null
 */
export async function getTodayMessage(userId: string): Promise<Message | null> {
  try {
    const messages = await getMessages(userId);
    const today = new Date();
    
    const todayMessage = messages.find((msg) => {
      const msgDate = new Date(msg.date);
      return (
        msgDate.getDate() === today.getDate() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getFullYear() === today.getFullYear()
      );
    });

    return todayMessage || null;
  } catch (error) {
    console.error('❌ Error al obtener mensaje de hoy:', error);
    return null;
  }
}

/**
 * Exporta todos los mensajes como JSON
 * @param userId ID del usuario
 */
export async function exportMessages(userId: string): Promise<void> {
  try {
    const messages = await getMessages(userId);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      userId,
      totalMessages: messages.length,
      messages: messages.map((msg) => ({
        ...msg,
        date: msg.date.toISOString(),
      })),
    };

    // Crear blob y descargar
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `correo-clen-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Mensajes exportados');
  } catch (error) {
    console.error('❌ Error al exportar mensajes:', error);
    throw error;
  }
}
