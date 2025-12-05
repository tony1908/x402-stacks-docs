export interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  parentId?: string;
}

export interface NavItem {
  id: string;
  title: string;
  slug?: string; // If it's a page
  children?: NavItem[]; // If it's a section
  isOpen?: boolean; // For UI state
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  isStreaming?: boolean;
}