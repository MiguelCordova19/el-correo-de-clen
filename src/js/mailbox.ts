import mailboxSvg from '../assets/images/mailbox.svg?raw';

export type MailboxState = 'available' | 'disabled' | 'opening';

/**
 * Renderiza el buzón en el contenedor especificado
 * @param container Elemento donde se renderizará el buzón
 * @param state Estado actual del buzón
 * @param onClick Callback para cuando se hace clic
 */
export function renderMailbox(
  container: HTMLElement,
  state: MailboxState,
  onClick?: () => void
): void {
  const wrapper = document.createElement('div');
  wrapper.className = 'mailbox-wrapper';
  wrapper.innerHTML = mailboxSvg;

  const mailboxElement = wrapper.querySelector('svg');
  if (!mailboxElement) return;

  // Aplicar estado visual
  switch (state) {
    case 'available':
      mailboxElement.classList.add('mailbox-available', 'animate-glow', 'animate-float');
      wrapper.style.cursor = 'pointer';
      if (onClick) {
        wrapper.addEventListener('click', onClick);
      }
      break;
    case 'disabled':
      mailboxElement.classList.add('mailbox-disabled');
      mailboxElement.style.opacity = '0.5';
      mailboxElement.style.filter = 'grayscale(50%)';
      wrapper.style.cursor = 'not-allowed';
      break;
    case 'opening':
      mailboxElement.classList.add('mailbox-opening');
      wrapper.style.cursor = 'default';
      break;
  }

  // Limpiar contenedor y agregar buzón
  container.innerHTML = '';
  container.appendChild(wrapper);
}

/**
 * Ejecuta la animación completa de apertura del buzón
 * @param container Contenedor del buzón
 * @returns Promise que se resuelve cuando termina la animación
 */
export async function playOpenAnimation(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const wrapper = container.querySelector('.mailbox-wrapper');
    if (!wrapper) {
      resolve();
      return;
    }

    const mailbox = wrapper.querySelector('svg');
    const door = mailbox?.querySelector('#mailbox-door');
    
    if (!mailbox || !door) {
      resolve();
      return;
    }

    // Remover animaciones anteriores
    mailbox.classList.remove('animate-glow', 'animate-float');

    // Crear sobre que saldrá del buzón
    const envelope = createEnvelope();
    wrapper.appendChild(envelope);

    // Secuencia de animaciones
    let step = 0;
    const duration = 3500; // Duración total de la animación

    // Paso 1: Abrir puerta del buzón (800ms)
    setTimeout(() => {
      const doorElement = door as SVGGraphicsElement;
      doorElement.style.transition = 'transform 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      doorElement.style.transformOrigin = '150px 200px'; // Punto superior de la puerta
      doorElement.style.transform = 'rotateX(90deg)'; // Abre hacia abajo
      step++;
    }, 0);

    // Paso 2: Sobre emerge (1000ms) - empieza a los 400ms
    setTimeout(() => {
      envelope.style.animation = 'envelope-emerge 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
      step++;
    }, 400);

    // Paso 3: Sobre rota hacia el usuario (600ms) - empieza a los 1400ms
    setTimeout(() => {
      envelope.style.animation = 'envelope-rotate 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
      step++;
    }, 1400);

    // Paso 4: Papel se despliega (1000ms) - empieza a los 2000ms
    setTimeout(() => {
      const paper = createPaper();
      wrapper.appendChild(paper);
      paper.style.animation = 'paper-unfold 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
      step++;
    }, 2000);

    // Finalizar animación
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

/**
 * Crea el elemento del sobre para la animación
 */
function createEnvelope(): HTMLElement {
  const envelope = document.createElement('div');
  envelope.className = 'envelope';
  envelope.innerHTML = `
    <svg width="150" height="100" viewBox="0 0 150 100" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <rect x="10" y="20" width="130" height="70" rx="5" fill="#F3E8FF" stroke="#A78BFA" stroke-width="2"/>
      <path d="M10 20 L75 60 L140 20" fill="#E6D5F5" stroke="#A78BFA" stroke-width="2"/>
      <path d="M10 20 L75 60 L140 20" fill="none" stroke="#C4B5FD" stroke-width="1.5"/>
    </svg>
  `;
  envelope.style.position = 'absolute';
  envelope.style.top = '60%';
  envelope.style.left = '50%';
  envelope.style.transform = 'translate(-50%, 0) scale(0.8)';
  envelope.style.opacity = '0';
  envelope.style.zIndex = '10';
  
  return envelope;
}

/**
 * Crea el elemento del papel para la animación
 */
function createPaper(): HTMLElement {
  const paper = document.createElement('div');
  paper.className = 'paper';
  paper.innerHTML = `
    <svg width="180" height="240" viewBox="0 0 180 240" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%);">
      <rect x="10" y="10" width="160" height="220" rx="8" fill="#FEFCFF" stroke="#A78BFA" stroke-width="2"/>
      <line x1="30" y1="40" x2="150" y2="40" stroke="#DDD6FE" stroke-width="2"/>
      <line x1="30" y1="60" x2="150" y2="60" stroke="#DDD6FE" stroke-width="2"/>
      <line x1="30" y1="80" x2="150" y2="80" stroke="#DDD6FE" stroke-width="2"/>
      <line x1="30" y1="100" x2="130" y2="100" stroke="#DDD6FE" stroke-width="2"/>
      <!-- Corazón decorativo -->
      <path d="M90 140 C85 135, 75 135, 70 145 C70 155, 85 165, 90 170 C95 165, 110 155, 110 145 C110 135, 100 135, 95 140 Z" fill="#F9A8D4" opacity="0.6"/>
    </svg>
  `;
  paper.style.position = 'absolute';
  paper.style.top = '30%';
  paper.style.left = '50%';
  paper.style.transform = 'translate(-50%, -50%) scaleY(0)';
  paper.style.transformOrigin = 'top';
  paper.style.zIndex = '20';
  
  return paper;
}

/**
 * Actualiza el estado visual del buzón
 * @param container Contenedor del buzón
 * @param state Nuevo estado
 */
export function updateMailboxState(container: HTMLElement, state: MailboxState): void {
  const wrapper = container.querySelector('.mailbox-wrapper');
  if (!wrapper) return;

  const mailbox = wrapper.querySelector('svg');
  if (!mailbox) return;

  // Remover clases anteriores
  mailbox.classList.remove('mailbox-available', 'mailbox-disabled', 'mailbox-opening');
  mailbox.classList.remove('animate-glow', 'animate-float');

  // Aplicar nuevo estado
  switch (state) {
    case 'available':
      mailbox.classList.add('mailbox-available', 'animate-glow', 'animate-float');
      wrapper.classList.add('cursor-pointer');
      mailbox.style.opacity = '1';
      mailbox.style.filter = 'none';
      break;
    case 'disabled':
      mailbox.classList.add('mailbox-disabled');
      wrapper.classList.remove('cursor-pointer');
      mailbox.style.opacity = '0.5';
      mailbox.style.filter = 'grayscale(50%)';
      break;
    case 'opening':
      mailbox.classList.add('mailbox-opening');
      wrapper.classList.remove('cursor-pointer');
      break;
  }
}
