import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiResponse, Message } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

/**
 * Genera un mensaje romántico único usando Gemini AI
 * @param previousMessages Mensajes ya generados para evitar repetición
 * @returns Promise con el mensaje generado
 */
export async function generateRomanticMessage(
  previousMessages: Message[]
): Promise<GeminiResponse> {
  try {
    // Crear lista de contenidos previos para evitar repetición
    const previousContents = previousMessages
      .map((msg) => `"${msg.content.substring(0, 50)}..." - ${msg.source}`)
      .join('\n');

    // Agregar variabilidad con un número aleatorio y timestamp
    const randomSeed = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();
    
    // Seleccionar aleatoriamente qué tipo de mensaje queremos
    const messageTypes = ['canción', 'poema', 'escritura'];
    const preferredType = messageTypes[Math.floor(Math.random() * messageTypes.length)];

    const prompt = `Eres un generador de mensajes románticos para "El Correo de CLEN". 
    
IMPORTANTE: Cada mensaje debe ser COMPLETAMENTE ÚNICO y DIFERENTE. 

Genera UN SOLO mensaje romántico que puede ser de uno de estos tipos:

1. **CANCIÓN DE AMOR**: Un fragmento significativo de una balada o canción romántica (en español o inglés). 
   - Si es en inglés, DEBES incluir la traducción al español.
   - Incluye el nombre de la canción y el artista.
   - Elige fragmentos emotivos del coro o versos memorables.
   - Puede ser de cualquier época: clásicas, modernas, latinas, anglosajonas, baladas, boleros, etc.

2. **POEMA**: Un poema romántico clásico o contemporáneo.
   - Puede ser completo si es corto, o un fragmento significativo si es largo.
   - Incluye el nombre del poema y el autor.
   - Autores sugeridos: Pablo Neruda, Rubén Darío, Gustavo Adolfo Bécquer, Mario Benedetti, Gabriela Mistral, Octavio Paz, Federico García Lorca, etc.

3. **ESCRITURA SAGRADA**: Un versículo sobre el amor de la Biblia o del Libro de Mormón.
   - Incluye el libro, capítulo y versículo.
   - Debe transmitir un mensaje de amor, esperanza o compañía.
   - Ejemplos: 1 Corintios 13, Cantar de los Cantares, 1 Juan 4, Moroni 7, etc.

**RESTRICCIONES IMPORTANTES**: 
- NO uses ninguno de estos contenidos previos:
${previousContents || 'Ninguno aún (es el primer mensaje)'}

- El mensaje debe ser ÚNICO y DIFERENTE a cualquier otro que hayas generado.
- Prioriza generar un mensaje de tipo: ${preferredType}
- Usa esta semilla aleatoria para garantizar variedad: ${randomSeed}
- Timestamp actual: ${timestamp}

**INSTRUCCIONES DE VARIEDAD**:
- Si ya generaste una canción de los 80s, elige una moderna o latina
- Si ya generaste un poema de Neruda, elige otro autor
- Si ya generaste 1 Corintios, elige otro libro bíblico
- Varía entre idiomas (español e inglés)
- Varía entre épocas y estilos

RESPONDE ÚNICAMENTE con un objeto JSON válido en este formato exacto:

{
  "type": "song" | "poem" | "scripture",
  "content": "El texto completo del fragmento o versículo",
  "source": "Nombre de la canción/poema/libro",
  "author": "Artista/Autor/Referencia bíblica",
  "translation": "Traducción al español (solo si el contenido está en inglés, sino null)"
}

NO agregues texto adicional, solo el JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Limpiar el texto para extraer solo el JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta');
    }

    const parsedResponse: GeminiResponse = JSON.parse(jsonMatch[0]);

    // Validar que tenga todos los campos requeridos
    if (!parsedResponse.type || !parsedResponse.content || !parsedResponse.source || !parsedResponse.author) {
      throw new Error('Respuesta de Gemini incompleta');
    }

    console.log('✅ Mensaje generado:', parsedResponse.type);
    return parsedResponse;
  } catch (error) {
    console.error('❌ Error al generar mensaje con Gemini:', error);
    // Mensaje de respaldo en caso de error
    return getFallbackMessage(previousMessages);
  }
}

/**
 * Mensajes de respaldo en caso de fallo de la API
 */
function getFallbackMessage(previousMessages: Message[]): GeminiResponse {
  const fallbackMessages: GeminiResponse[] = [
    {
      type: 'song',
      content: 'Eres tú, como el agua de mi fuente\nEres tú, el fuego de mi hogar\nAlgo así, eres tú\nAlgo así como el fuego de mi hoguera',
      source: 'Eres Tú',
      author: 'Mocedades',
      translation: undefined,
    },
    {
      type: 'poem',
      content: 'Amor, del alma mía eterna llave,\nde mi cuerpo ligera vestidura,\nroma a la suave voz, dulce a la grave,\nque mis oscuras noches transfigura.',
      source: 'Amor',
      author: 'Rubén Darío',
      translation: undefined,
    },
    {
      type: 'scripture',
      content: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.',
      source: '1 Corintios 13:4',
      author: 'Biblia',
      translation: undefined,
    },
    {
      type: 'song',
      content: "I could hold you for a million years\nTo make you feel my love\nTo make you feel my love",
      source: 'Make You Feel My Love',
      author: 'Adele',
      translation: 'Podría abrazarte por un millón de años\nPara hacerte sentir mi amor\nPara hacerte sentir mi amor',
    },
    {
      type: 'poem',
      content: 'Me gustas cuando callas porque estás como ausente,\ny me oyes desde lejos, y mi voz no te toca.\nParece que los ojos se te hubieran volado\ny parece que un beso te cerrara la boca.',
      source: 'Poema 15',
      author: 'Pablo Neruda',
      translation: undefined,
    },
    {
      type: 'song',
      content: 'Cuando me enamoro, se detiene el tiempo\nY cuando tú me miras, se ilumina el cielo\nCuando tú me abrazas, yo siento que vuelo\nSi me das un beso, el mundo es perfecto',
      source: 'Cuando Me Enamoro',
      author: 'Enrique Iglesias',
      translation: undefined,
    },
    {
      type: 'poem',
      content: 'Tú me quieres blanca,\nme quieres de espumas,\nme quieres de nácar.\nQue sea azucena\nsobre todas, casta.',
      source: 'Tú me quieres blanca',
      author: 'Alfonsina Storni',
      translation: undefined,
    },
    {
      type: 'scripture',
      content: 'Pon tu amor, cual sello, sobre tu corazón, como una marca sobre tu brazo. Porque fuerte es como la muerte el amor.',
      source: 'Cantar de los Cantares 8:6',
      author: 'Biblia',
      translation: undefined,
    },
    {
      type: 'song',
      content: "Every little thing she does is magic\nEverything she do just turns me on\nEven though my life before was tragic\nNow I know my love for her goes on",
      source: 'Every Little Thing She Does Is Magic',
      author: 'The Police',
      translation: 'Cada pequeña cosa que ella hace es mágica\nTodo lo que hace simplemente me enciende\nAunque mi vida antes era trágica\nAhora sé que mi amor por ella continúa',
    },
    {
      type: 'poem',
      content: 'Amor mío, si muero y tú no mueres,\namor mío, si mueres y no muero,\nno demos al dolor más territorio:\nno hay extensión como la que vivimos.',
      source: 'Si Tú Me Olvidas',
      author: 'Pablo Neruda',
      translation: undefined,
    },
  ];

  // Filtrar mensajes que no se hayan usado
  const usedContents = new Set(previousMessages.map((msg) => msg.content));
  const availableMessages = fallbackMessages.filter(
    (msg) => !usedContents.has(msg.content)
  );

  // Si ya se usaron todos, seleccionar uno aleatorio de todos
  const pool = availableMessages.length > 0 ? availableMessages : fallbackMessages;
  
  // Retornar un mensaje aleatorio
  return pool[Math.floor(Math.random() * pool.length)];
}
