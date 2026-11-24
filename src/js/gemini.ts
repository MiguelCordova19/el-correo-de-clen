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

    const prompt = `Eres un generador de mensajes románticos para "El Correo de CLEN". 
Debes generar UN SOLO mensaje romántico que puede ser de uno de estos tipos:

1. **CANCIÓN DE AMOR**: Un fragmento significativo de una balada o canción romántica (en español o inglés). 
   - Si es en inglés, DEBES incluir la traducción al español.
   - Incluye el nombre de la canción y el artista.
   - Elige fragmentos emotivos del coro o versos memorables.

2. **POEMA**: Un poema romántico clásico o contemporáneo.
   - Puede ser completo si es corto, o un fragmento significativo si es largo.
   - Incluye el nombre del poema y el autor.

3. **ESCRITURA SAGRADA**: Un versículo sobre el amor de la Biblia o del Libro de Mormón.
   - Incluye el libro, capítulo y versículo.
   - Debe transmitir un mensaje de amor, esperanza o compañía.

**IMPORTANTE**: 
- NO uses ninguno de estos contenidos previos:
${previousContents || 'Ninguno aún (es el primer mensaje)'}

- El mensaje debe ser único, emotivo y significativo.
- RESPONDE ÚNICAMENTE con un objeto JSON válido en este formato exacto:

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
  ];

  // Filtrar mensajes que no se hayan usado
  const usedContents = new Set(previousMessages.map((msg) => msg.content));
  const availableMessages = fallbackMessages.filter(
    (msg) => !usedContents.has(msg.content)
  );

  // Si ya se usaron todos, reiniciar con el primero
  if (availableMessages.length === 0) {
    return fallbackMessages[0];
  }

  // Retornar un mensaje aleatorio de los disponibles
  return availableMessages[Math.floor(Math.random() * availableMessages.length)];
}
