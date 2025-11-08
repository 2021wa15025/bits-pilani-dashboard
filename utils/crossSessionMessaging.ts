// Cross-session messaging using localStorage with a polling mechanism
// This creates a shared message store that works across different browser sessions

import { getStudentById } from '../data/studentsData';

export class CrossSessionMessaging {
  private static MESSAGES_KEY = 'global_chat_messages';
  private static CHATS_KEY = 'global_chat_list';
  private listeners: ((messages: any[]) => void)[] = [];
  private pollInterval: NodeJS.Timeout | null = null;
  private lastMessageCount = 0;

  constructor() {
    this.initializeStorage();
    this.startPolling();
    console.log('🔧 CrossSessionMessaging initialized');
  }

  private initializeStorage() {
    if (!localStorage.getItem(CrossSessionMessaging.MESSAGES_KEY)) {
      localStorage.setItem(CrossSessionMessaging.MESSAGES_KEY, JSON.stringify({}));
      console.log('📦 Initialized messages storage');
    }
    if (!localStorage.getItem(CrossSessionMessaging.CHATS_KEY)) {
      localStorage.setItem(CrossSessionMessaging.CHATS_KEY, JSON.stringify({}));
      console.log('📦 Initialized chats storage');
    }
  }

  private startPolling() {
    // Poll for new messages every 2 seconds
    this.pollInterval = setInterval(() => {
      this.checkForNewMessages();
    }, 2000);
    console.log('⏰ Started polling for new messages every 2 seconds');
  }

  private checkForNewMessages() {
    try {
      const allMessages = this.getAllMessages();
      let totalMessages = 0;
      
      Object.values(allMessages).forEach((msgs: unknown) => {
        if (Array.isArray(msgs)) {
          totalMessages += msgs.length;
        }
      });
      
      if (totalMessages !== this.lastMessageCount) {
        this.lastMessageCount = totalMessages;
        this.notifyListeners(allMessages);
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }

  private notifyListeners(messages: any) {
    this.listeners.forEach(listener => listener(messages));
  }

  public sendMessage(senderId: string, recipientId: string, message: any): boolean {
    try {
      console.log(`📤 CrossSession: Sending message from ${senderId} to ${recipientId}`);
      console.log(`📝 Message content:`, message);
      
      const allMessages = this.getAllMessages();
      const chatKey = this.getChatKey(senderId, recipientId);
      
      console.log(`📝 CrossSession: Using chat key: ${chatKey}`);
      
      if (!allMessages[chatKey]) {
        allMessages[chatKey] = [];
        console.log(`📁 Created new chat thread: ${chatKey}`);
      }
      
      const messageWithId = {
        ...message,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        senderId,
        recipientId,
        senderName: this.getUserName(senderId)
      };
      
      allMessages[chatKey].push(messageWithId);
      localStorage.setItem(CrossSessionMessaging.MESSAGES_KEY, JSON.stringify(allMessages));
      
      console.log(`✅ CrossSession: Message stored successfully. Total messages in chat: ${allMessages[chatKey].length}`);
      console.log(`📊 All messages stored:`, allMessages);
      
      // Update chat list for both users
      this.updateChatList(senderId, recipientId, messageWithId);
      
      // Trigger listeners immediately
      this.notifyListeners(allMessages);
      
      return true;
    } catch (error) {
      console.error('❌ CrossSession: Error sending message:', error);
      return false;
    }
  }

  public getMessages(userId: string, otherUserId: string): any[] {
    const allMessages = this.getAllMessages();
    const chatKey = this.getChatKey(userId, otherUserId);
    return allMessages[chatKey] || [];
  }

  public getRecentChats(userId: string): any[] {
    try {
      const allChats = JSON.parse(localStorage.getItem(CrossSessionMessaging.CHATS_KEY) || '{}');
      const userChats = allChats[userId] || {};
      
      return Object.values(userChats).sort((a: any, b: any) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
    } catch (error) {
      console.error('Error getting recent chats:', error);
      return [];
    }
  }

  private getAllMessages(): any {
    try {
      return JSON.parse(localStorage.getItem(CrossSessionMessaging.MESSAGES_KEY) || '{}');
    } catch (error) {
      console.error('Error parsing messages from localStorage:', error);
      return {};
    }
  }

  private getChatKey(userId1: string, userId2: string): string {
    // Always use the same key regardless of who sends first
    return [userId1, userId2].sort().join('_');
  }

  private updateChatList(senderId: string, recipientId: string, message: any) {
    try {
      const allChats = JSON.parse(localStorage.getItem(CrossSessionMessaging.CHATS_KEY) || '{}');
      
      // Get email from centralized student data
      const getStudentEmail = (userId: string): string => {
        const student = getStudentById(userId);
        return student?.email || '';
      };
      
      // Update sender's chat list
      if (!allChats[senderId]) allChats[senderId] = {};
      allChats[senderId][recipientId] = {
        id: recipientId,
        participantId: recipientId,
        participantName: this.getUserName(recipientId),
        participantEmail: getStudentEmail(recipientId),
        participantAvatar: '',
        lastMessage: message,
        lastMessageTime: message.timestamp,
        unreadCount: 0
      };
      
      // Update recipient's chat list
      if (!allChats[recipientId]) allChats[recipientId] = {};
      allChats[recipientId][senderId] = {
        id: senderId,
        participantId: senderId,
        participantName: message.senderName || this.getUserName(senderId),
        participantEmail: getStudentEmail(senderId),
        participantAvatar: message.senderAvatar || '',
        lastMessage: message,
        lastMessageTime: message.timestamp,
        unreadCount: (allChats[recipientId][senderId]?.unreadCount || 0) + 1
      };
      
      localStorage.setItem(CrossSessionMessaging.CHATS_KEY, JSON.stringify(allChats));
    } catch (error) {
      console.error('Error updating chat list:', error);
    }
  }

  private getUserName(userId: string): string {
    // Get name from centralized student data
    const student = getStudentById(userId);
    return student ? student.name : 'Unknown User';
  }

  public onMessage(callback: (messages: any[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.listeners = [];
  }
}

// Create a singleton instance
export const crossSessionMessaging = new CrossSessionMessaging();