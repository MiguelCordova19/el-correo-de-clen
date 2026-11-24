import type { Message, MessageType } from '../types';

const typeIcons: Record<MessageType, string> = {
  song: '🎵',
  poem: '📜',
  scripture: '✝️',
};

const typeLabels: Record<MessageType, string> = {
  song: 'Canción',
  poem: 'Poema',
  scripture: 'Escritura',
};

/**
 * Renderiza la galería de mensajes
 * @param container Contenedor de la galería
 * @param messages Array de mensajes
 * @param onCardClick Callback cuando se hace clic en una tarjeta
 */
export function renderGallery(
  container: HTMLElement,
  messages: Message[],
  onCardClick: (message: Message) => void
): void {
  container.innerHTML = '';

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="padding: var(--spacing-3xl);">
        <svg width="100" height="100" viewBox="0 0 100 100" style="margin: 0 auto var(--spacing-lg);">
          <circle cx="50" cy="50" r="45" fill="var(--color-secondary)" stroke="var(--color-accent)" stroke-width="2"/>
          <text x="50" y="65" text-anchor="middle" font-size="40" fill="var(--color-darker)">📭</text>
        </svg>
        <h3>Aún no tienes mensajes</h3>
        <p class="mt-md" style="color: var(--color-text-secondary);">
          Abre el buzón para recibir tu primer mensaje de amor
        </p>
      </div>
    `;
    return;
  }

  // Ordenar mensajes por fecha (más reciente primero)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  sortedMessages.forEach((message, index) => {
    const card = createMessageCard(message, index);
    card.addEventListener('click', () => onCardClick(message));
    container.appendChild(card);
  });
}

/**
 * Crea una tarjeta de mensaje
 */
function createMessageCard(message: Message, index: number): HTMLElement {
  const card = document.createElement('div');
  card.className = 'message-card stagger-item';
  card.style.animationDelay = `${index * 100}ms`;

  const date = new Date(message.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  card.innerHTML = `
    <div class="message-card-header">
      <span class="message-card-date">${formattedDate}</span>
      <span class="message-card-icon">${typeIcons[message.type]}</span>
    </div>
    <div class="message-card-preview">${message.content}</div>
    <div class="message-card-source">
      ${message.source} - ${message.author}
    </div>
  `;

  return card;
}

/**
 * Filtra mensajes por tipo
 * @param messages Array completo de mensajes
 * @param type Tipo de mensaje o 'all'
 * @returns Mensajes filtrados
 */
export function filterMessages(
  messages: Message[],
  type: MessageType | 'all'
): Message[] {
  if (type === 'all') {
    return messages;
  }
  return messages.filter((msg) => msg.type === type);
}

/**
 * Renderiza el mensaje completo en un modal
 * @param container Contenedor del modal
 * @param message Mensaje a mostrar
 */
export function renderFullMessage(container: HTMLElement, message: Message): void {
  const date = new Date(message.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  container.innerHTML = `
    <div class="message-full">
      <div class="message-type-badge">
        ${typeIcons[message.type]} ${typeLabels[message.type]}
      </div>
      
      <div class="message-metadata-item mb-md">
        <span class="message-metadata-label">📅 Fecha:</span> ${formattedDate}
      </div>

      <div class="message-content">
        "${message.content}"
      </div>

      <div class="message-metadata">
        <div class="message-metadata-item">
          <span class="message-metadata-label">
            ${message.type === 'song' ? '🎵 Canción:' : message.type === 'poem' ? '📖 Poema:' : '📖 Referencia:'}
          </span>
          ${message.source}
        </div>
        <div class="message-metadata-item">
          <span class="message-metadata-label">
            ${message.type === 'scripture' ? '📍 Ubicación:' : '✍️ Autor:'}
          </span>
          ${message.author}
        </div>
      </div>

      ${
        message.translation
          ? `
        <div class="message-translation mt-lg">
          <div class="message-metadata-label mb-sm">🌐 Traducción:</div>
          <div>${message.translation}</div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
