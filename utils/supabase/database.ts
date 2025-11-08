import { projectId, publicAnonKey } from './info';

export interface UserProfile {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  semester: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  student_id: string;
  title: string;
  content: string;
  course: string;
  tags: string;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  student_id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  course?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  recipient_id?: string; // For private messages
  group_id?: string; // For group messages
  content: string;
  message_type: 'text' | 'file' | 'system';
  file_attachment?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  created_at: string;
  updated_at?: string;
}

class SupabaseDatabase {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/rest/v1`;
    this.headers = {
      'apikey': publicAnonKey,
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
  }

  // User Profile Methods
  async getUserProfile(studentId: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching user profile for student ID:', studentId);
      
      const response = await fetch(
        `${this.baseUrl}/user_profiles?student_id=eq.${studentId}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const profiles = await response.json();
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
    try {
      console.log('Creating user profile:', profile);
      
      const response = await fetch(`${this.baseUrl}/user_profiles`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create user profile: ${response.statusText}`);
      }

      const createdProfiles = await response.json();
      return createdProfiles[0];
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async updateUserProfile(studentId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      console.log('💾 Updating user profile for student ID:', studentId);
      console.log('📝 Updates:', updates);
      console.log('🌐 Base URL:', this.baseUrl);
      
      const response = await fetch(
        `${this.baseUrl}/user_profiles?student_id=eq.${studentId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            ...updates,
            updated_at: new Date().toISOString()
          })
        }
      );

      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', errorText);
      } else {
        console.log('✅ Profile update successful');
      }

      return response.ok;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      return false;
    }
  }

  // Notes Methods
  async getUserNotes(studentId: string): Promise<Note[]> {
    try {
      console.log('Fetching notes for student ID:', studentId);
      
      const response = await fetch(
        `${this.baseUrl}/notes?student_id=eq.${studentId}&order=updated_at.desc`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  async createNote(note: Omit<Note, 'created_at' | 'updated_at'>): Promise<Note | null> {
    try {
      console.log('Creating note:', note);
      
      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...note,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.statusText}`);
      }

      const createdNotes = await response.json();
      return createdNotes[0];
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<boolean> {
    try {
      console.log('Updating note:', noteId, updates);
      
      const response = await fetch(
        `${this.baseUrl}/notes?id=eq.${noteId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            ...updates,
            updated_at: new Date().toISOString()
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  }

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      console.log('Deleting note:', noteId);
      
      const response = await fetch(
        `${this.baseUrl}/notes?id=eq.${noteId}`,
        {
          method: 'DELETE',
          headers: this.headers
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  // Events Methods
  async getUserEvents(studentId: string): Promise<Event[]> {
    try {
      console.log('Fetching events for student ID:', studentId);
      
      const response = await fetch(
        `${this.baseUrl}/events?student_id=eq.${studentId}&order=date.asc`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async createEvent(event: Omit<Event, 'created_at' | 'updated_at'>): Promise<Event | null> {
    try {
      console.log('Creating event:', event);
      
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...event,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const createdEvents = await response.json();
      return createdEvents[0];
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<boolean> {
    try {
      console.log('Updating event:', eventId, updates);
      
      const response = await fetch(
        `${this.baseUrl}/events?id=eq.${eventId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            ...updates,
            updated_at: new Date().toISOString()
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      console.log('Deleting event:', eventId);
      
      const response = await fetch(
        `${this.baseUrl}/events?id=eq.${eventId}`,
        {
          method: 'DELETE',
          headers: this.headers
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Messaging functions
  async sendMessage(message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      console.log('📤 Sending message to Supabase:', message);
      
      const messageData = {
        sender_id: message.sender_id,
        sender_name: message.sender_name,
        sender_avatar: message.sender_avatar,
        recipient_id: message.recipient_id,
        group_id: message.group_id,
        content: message.content,
        message_type: message.message_type,
        file_attachment: message.file_attachment ? JSON.stringify(message.file_attachment) : null,
        created_at: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/chat_messages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        console.log('✅ Message sent successfully to Supabase');
        return true;
      } else {
        console.error('❌ Failed to send message:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async getPrivateMessages(userId: string, otherUserId: string): Promise<ChatMessage[]> {
    try {
      console.log(`📨 Fetching private messages between ${userId} and ${otherUserId}`);
      
      const response = await fetch(
        `${this.baseUrl}/chat_messages?or=(and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId}))&order=created_at.asc`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (response.ok) {
        const messages = await response.json();
        console.log(`✅ Fetched ${messages.length} private messages`);
        
        return messages.map((msg: any) => ({
          ...msg,
          file_attachment: msg.file_attachment ? JSON.parse(msg.file_attachment) : undefined
        }));
      } else {
        console.error('❌ Failed to fetch private messages:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching private messages:', error);
      return [];
    }
  }

  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    try {
      console.log(`📨 Fetching group messages for group ${groupId}`);
      
      const response = await fetch(
        `${this.baseUrl}/chat_messages?group_id=eq.${groupId}&order=created_at.asc`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (response.ok) {
        const messages = await response.json();
        console.log(`✅ Fetched ${messages.length} group messages`);
        
        return messages.map((msg: any) => ({
          ...msg,
          file_attachment: msg.file_attachment ? JSON.parse(msg.file_attachment) : undefined
        }));
      } else {
        console.error('❌ Failed to fetch group messages:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching group messages:', error);
      return [];
    }
  }

  async getRecentChats(userId: string): Promise<any[]> {
    try {
      console.log(`📨 Fetching recent chats for user ${userId}`);
      
      // Get latest message for each conversation
      const response = await fetch(
        `${this.baseUrl}/chat_messages?or=(sender_id.eq.${userId},recipient_id.eq.${userId})&order=created_at.desc`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (response.ok) {
        const messages = await response.json();
        console.log(`✅ Fetched ${messages.length} recent messages`);
        
        // Group by conversation partner
        const chats = new Map();
        
        messages.forEach((msg: any) => {
          const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
          const partnerName = msg.sender_id === userId ? 'Unknown' : msg.sender_name;
          
          if (partnerId && !chats.has(partnerId)) {
            chats.set(partnerId, {
              id: partnerId,
              participantId: partnerId,
              participantName: partnerName,
              participantEmail: '',
              participantAvatar: msg.sender_avatar || '',
              unreadCount: 0,
              lastMessage: {
                id: msg.id,
                senderId: msg.sender_id,
                senderName: msg.sender_name,
                content: msg.content,
                timestamp: msg.created_at,
                type: msg.message_type
              }
            });
          }
        });
        
        return Array.from(chats.values());
      } else {
        console.error('❌ Failed to fetch recent chats:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      return [];
    }
  }

  // Connection test
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user_profiles?limit=1`, {
        method: 'GET',
        headers: this.headers
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const supabaseDatabase = new SupabaseDatabase();