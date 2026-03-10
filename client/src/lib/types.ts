export interface Persona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  systemPrompt: string; // To simulate "AI" personality
  color: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatSession {
  personaId: string;
  messages: Message[];
  lastMessage?: string;
  lastTimestamp?: Date;
  unread?: number;
}
