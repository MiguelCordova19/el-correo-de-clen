import '../css/styles.css';
import { authenticateUser } from './firebase';
import { generateRomanticMessage } from './gemini';
import {
  canOpenToday,
  saveMessage,
  getMessages,
  getTodayMessage,
  exportMessages,
} from './messageService';
import { renderMailbox, playOpenAnimation, updateMailboxState } from './mailbox';
import { renderGallery, filterMessages, renderFullMessage } from './gallery';
import type { Message, MessageType } from '../types';

// Estado de la aplicación
let currentUser: any = null;
let currentView: 'mailbox' | 'gallery' = 'mailbox';
let allMessages: Message[] = [];
let currentFilter: MessageType | 'all' = 'all';

// Elementos del DOM
const mailboxView = document.getElementById('mailbox-view')!;
const galleryView = document.getElementById('gallery-view')!;
const mailboxContainer = document.getElementById('mailbox-container')!;
const galleryContainer = document.getElementById('gallery-container')!;
const statusMessage = document.getElementById('status-message')!;
const messageModal = document.getElementById('message-modal')!;
const loadingOverlay = document.getElementById('loading-overlay')!;
const toggleViewBtn = document.getElementById('btn-toggle-view')!;

/**
 * Inicialización de la aplicación
 */
async function init() {
  try {
    showLoading('Iniciando aplicación...');

    // Autenticar usuario
    currentUser = await authenticateUser();
    console.log('Usuario autenticado:', currentUser.uid);

    // Cargar mensajes
    allMessages = await getMessages(currentUser.uid);

    // Verificar si puede abrir hoy
    const canOpen = await canOpenToday(currentUser.uid);

    if (canOpen) {
      // Puede abrir un mensaje nuevo
      renderMailbox(mailboxContainer, 'available', handleMailboxClick);
      statusMessage.innerHTML = `
        <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
          ✨ ¡Tienes un nuevo mensaje esperándote!
        </p>
      `;
    } else {
      // Ya abrió el mensaje de hoy
      const todayMessage = await getTodayMessage(currentUser.uid);
      renderMailbox(mailboxContainer, 'disabled');
      
      if (todayMessage) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        statusMessage.innerHTML = `
          <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
            💌 Ya recibiste tu mensaje de hoy
          </p>
          <p class="mt-sm" style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            Vuelve mañana a las 00:00 para recibir uno nuevo
          </p>
          <button id="btn-view-today" class="btn btn-primary mt-md">Ver mensaje de hoy</button>
        `;
        
        const viewTodayBtn = document.getElementById('btn-view-today');
        if (viewTodayBtn) {
          viewTodayBtn.addEventListener('click', () => showMessageModal(todayMessage));
        }
      }
    }

    // Configurar botón de alternar vista
    updateToggleButton();
    toggleViewBtn.addEventListener('click', toggleView);

    // Configurar botones de filtro
    setupFilterButtons();

    // Configurar botón de exportar
    document.getElementById('btn-export')?.addEventListener('click', handleExport);

    // Configurar modales
    setupModals();

    hideLoading();
  } catch (error) {
    console.error('Error al inicializar:', error);
    statusMessage.innerHTML = `
      <p style="color: var(--color-text-secondary);">
        ❌ Error al cargar la aplicación. Por favor recarga la página.
      </p>
    `;
    hideLoading();
  }
}

/**
 * Maneja el clic en el buzón
 */
async function handleMailboxClick() {
  try {
    showLoading('Preparando tu mensaje...');

    // Verificar que realmente puede abrir
    const canOpen = await canOpenToday(currentUser.uid);
    if (!canOpen) {
      hideLoading();
      alert('Ya abriste tu mensaje de hoy. Vuelve mañana para recibir uno nuevo.');
      return;
    }

    // Cambiar estado del buzón
    updateMailboxState(mailboxContainer, 'opening');

    // Ejecutar animación del buzón
    await playOpenAnimation(mailboxContainer);

    // Generar mensaje con Gemini
    showLoading('Generando tu mensaje especial...');
    const geminiResponse = await generateRomanticMessage(allMessages);

    // Guardar mensaje sin nota personal
    showLoading('Guardando tu mensaje...');
    const savedMessage = await saveMessage(currentUser.uid, geminiResponse, null);
    allMessages.push(savedMessage);

    // Mostrar mensaje completo
    hideLoading();
    showMessageModal(savedMessage);

    // Actualizar estado del buzón
    updateMailboxState(mailboxContainer, 'disabled');
    statusMessage.innerHTML = `
      <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
        ✅ ¡Mensaje recibido! Vuelve mañana para recibir uno nuevo
      </p>
    `;
  } catch (error) {
    console.error('Error al abrir buzón:', error);
    hideLoading();
    alert('Hubo un error al generar tu mensaje. Por favor intenta de nuevo.');
    updateMailboxState(mailboxContainer, 'available');
  }
}

/**
 * Alterna entre vista de buzón y galería
 */
function toggleView() {
  if (currentView === 'mailbox') {
    // Cambiar a galería
    mailboxView.classList.add('hidden');
    galleryView.classList.remove('hidden');
    currentView = 'gallery';
    
    // Renderizar galería
    const filteredMessages = filterMessages(allMessages, currentFilter);
    renderGallery(galleryContainer, filteredMessages, showMessageModal);
  } else {
    // Cambiar a buzón
    galleryView.classList.add('hidden');
    mailboxView.classList.remove('hidden');
    currentView = 'mailbox';
  }
  
  updateToggleButton();
}

/**
 * Actualiza el texto del botón de alternar vista
 */
function updateToggleButton() {
  if (currentView === 'mailbox') {
    toggleViewBtn.textContent = `📚 Ver Galería (${allMessages.length})`;
  } else {
    toggleViewBtn.textContent = '📬 Volver al Buzón';
  }
}

/**
 * Configura los botones de filtro
 */
function setupFilterButtons() {
  const filterButtons = {
    'btn-filter-all': 'all' as const,
    'btn-filter-songs': 'song' as const,
    'btn-filter-poems': 'poem' as const,
    'btn-filter-scriptures': 'scripture' as const,
  };

  Object.entries(filterButtons).forEach(([btnId, filterType]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        currentFilter = filterType;
        const filteredMessages = filterMessages(allMessages, currentFilter);
        renderGallery(galleryContainer, filteredMessages, showMessageModal);
        
        // Actualizar estado visual de botones
        Object.keys(filterButtons).forEach((id) => {
          document.getElementById(id)?.classList.remove('btn-primary');
          document.getElementById(id)?.classList.add('btn-secondary');
        });
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      });
    }
  });
}

/**
 * Muestra el modal de mensaje completo
 */
function showMessageModal(message: Message) {
  const modalBody = document.getElementById('modal-body')!;
  renderFullMessage(modalBody, message);
  messageModal.classList.remove('hidden');
  messageModal.classList.add('animate-fade-in');
}

/**
 * Configura los modales
 */
function setupModals() {
  // Cerrar modal de mensaje
  const messageCloseBtn = messageModal.querySelector('.modal-close');
  const messageBackdrop = messageModal.querySelector('.modal-backdrop');
  
  messageCloseBtn?.addEventListener('click', () => {
    messageModal.classList.add('hidden');
  });
  
  messageBackdrop?.addEventListener('click', () => {
    messageModal.classList.add('hidden');
  });

  // ESC para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      messageModal.classList.add('hidden');
    }
  });
}

/**
 * Maneja la exportación de mensajes
 */
async function handleExport() {
  try {
    await exportMessages(currentUser.uid);
    alert('✅ Mensajes exportados exitosamente');
  } catch (error) {
    console.error('Error al exportar:', error);
    alert('❌ Error al exportar mensajes');
  }
}

/**
 * Muestra overlay de carga
 */
function showLoading(message: string = 'Cargando...') {
  const loadingText = loadingOverlay.querySelector('p');
  if (loadingText) {
    loadingText.textContent = message;
  }
  loadingOverlay.classList.remove('hidden');
}

/**
 * Oculta overlay de carga
 */
function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
