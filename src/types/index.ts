export type MessageType = 'song' | 'poem' | 'scripture';

export interface Message {
  id: string;
  date: Date;
  type: MessageType;
  content: string;
  source: string;
  author: string;
  translation: string | null;
  personalNote: string | null;
  opened: boolean;
}

export interface User {
  id: string;
  lastOpenedDate: Date | null;
  messages: Message[];
}

export interface GeminiResponse {
  type: MessageType;
  content: string;
  source: string;
  author: string;
  translation?: string;
}
