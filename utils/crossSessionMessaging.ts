import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface PrivateChat {
  id: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantAvatar: string;
  unreadCount: number;
  lastMessage?: Message;
}

interface GroupData {
  name: string;
  description?: string;
  members: Array<{ id: string; name: string; role: 'admin' | 'member' }>;
  createdBy: string;
}

interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'member';
  }>;
  unreadCount: number;
  createdAt: string;
  createdBy: string;
}

export class CrossSessionMessaging {
  private storageKey = 'cross_session_messages';

  getRecentChats(userId: string): PrivateChat[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const allChats = JSON.parse(data);
      return allChats.filter((chat: PrivateChat) => 
        chat.participantId === userId || chat.id === userId
      );
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  }

  async sendMessage(senderId: string, recipientId: string, messageData: any): Promise<boolean> {
    try {
      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId,
        senderName: messageData.senderName || 'Unknown',
        senderAvatar: messageData.senderAvatar,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        type: messageData.type || 'text',
        fileAttachment: messageData.fileAttachment
      };

      // Store in localStorage for now
      const storageKey = `messages_${senderId}_${recipientId}`;
      const existing = localStorage.getItem(storageKey);
      const messages = existing ? JSON.parse(existing) : [];
      messages.push(message);
      localStorage.setItem(storageKey, JSON.stringify(messages));

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    try {
      const storageKey = `messages_${userId}_${otherUserId}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  async getGroups(): Promise<ChatGroup[]> {
    try {
      const data = localStorage.getItem('chat_groups');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  }

  async createGroup(groupData: GroupData): Promise<boolean> {
    try {
      const group: ChatGroup = {
        id: `group_${Date.now()}`,
        name: groupData.name,
        description: groupData.description,
        members: groupData.members.map(m => ({
          ...m,
          email: `${m.id}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`
        })),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: groupData.createdBy
      };

      const existing = localStorage.getItem('chat_groups');
      const groups = existing ? JSON.parse(existing) : [];
      groups.push(group);
      localStorage.setItem('chat_groups', JSON.stringify(groups));

      return true;
    } catch (error) {
      console.error('Error creating group:', error);
      return false;
    }
  }

  async sendGroupMessage(senderId: string, groupId: string, messageData: any): Promise<boolean> {
    try {
      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId,
        senderName: messageData.senderName || 'Unknown',
        senderAvatar: messageData.senderAvatar,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        type: messageData.type || 'text',
        fileAttachment: messageData.fileAttachment
      };

      const storageKey = `group_messages_${groupId}`;
      const existing = localStorage.getItem(storageKey);
      const messages = existing ? JSON.parse(existing) : [];
      messages.push(message);
      localStorage.setItem(storageKey, JSON.stringify(messages));

      return true;
    } catch (error) {
      console.error('Error sending group message:', error);
      return false;
    }
  }

  async getGroupMessages(groupId: string): Promise<Message[]> {
    try {
      const storageKey = `group_messages_${groupId}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading group messages:', error);
      return [];
    }
  }

  onMessage(callback: (messages: Message[]) => void): () => void {
    // Simple polling mechanism for localStorage changes
    const interval = setInterval(() => {
      // This is a simplified version - in production, use proper event listeners
      const allMessages: Message[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('messages_') || key?.startsWith('group_messages_')) {
          const data = localStorage.getItem(key);
          if (data) {
            allMessages.push(...JSON.parse(data));
          }
        }
      }
      callback(allMessages);
    }, 2000);

    return () => clearInterval(interval);
  }
}

export const supabaseCrossSessionMessaging = new CrossSessionMessaging();
