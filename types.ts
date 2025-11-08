export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  base64: string;
  previewUrl: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  file?: FileAttachment;
  isLoading?: boolean;
  timestamp?: number;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: number;
}
