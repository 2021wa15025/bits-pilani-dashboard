import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { MessageCircle, Send, ArrowLeft, X, Bell } from 'lucide-react';
import { students } from '../data/studentsData';
import { useAuth } from '../contexts/AuthContext';

interface SimpleMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  content: string;
  timestamp: number;
  read?: boolean; // Add read status
}

interface SimpleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleChatModal({ isOpen, onClose }: SimpleChatModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { userEmail } = useAuth();
  
  // Find current user
  const currentUser = students.find(s => s.email === userEmail);
  const currentUserId = currentUser?.id || '';
  
  // Get all other students and filter by search query
  const otherStudents = students
    .filter(s => s.id !== currentUserId)
    .filter(s => 
      searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Load messages when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, currentUserId]);
  
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem('simpleMessages') || '[]';
      const allMessages = JSON.parse(stored);
      setMessages(allMessages);
      console.log('📱 Loaded messages:', allMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };
  
  const saveMessages = (newMessages: SimpleMessage[]) => {
    try {
      localStorage.setItem('simpleMessages', JSON.stringify(newMessages));
      setMessages(newMessages);
      console.log('💾 Saved messages:', newMessages);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUserId || !currentUserId) return;
    
    const selectedUser = students.find(s => s.id === selectedUserId);
    if (!selectedUser || !currentUser) return;
    
    const message: SimpleMessage = {
      id: Date.now().toString(),
      from: currentUserId,
      fromName: currentUser.name,
      to: selectedUserId,
      toName: selectedUser.name,
      content: newMessage.trim(),
      timestamp: Date.now(),
      read: false // Mark as unread for recipient
    };
    
    const allMessages = [...messages, message];
    saveMessages(allMessages);
    setNewMessage('');
    
    // Dispatch custom event to notify header of new message
    window.dispatchEvent(new Event('localStorageUpdate'));
  };
  
  // Mark messages as read when opening a conversation
  const openConversation = (userId: string) => {
    setSelectedUserId(userId);
    
    // Mark all messages from this user as read
    const updatedMessages = messages.map(msg => 
      msg.from === userId && msg.to === currentUserId
        ? { ...msg, read: true }
        : msg
    );
    
    if (updatedMessages !== messages) {
      saveMessages(updatedMessages);
      // Dispatch custom event to notify header of read status change
      window.dispatchEvent(new Event('localStorageUpdate'));
    }
  };
  
  // Get total unread count for header badge
  const getTotalUnreadCount = () => {
    return messages.filter(msg => 
      msg.to === currentUserId && !msg.read
    ).length;
  };
  const getChatMessages = () => {
    if (!selectedUserId || !currentUserId) return [];
    
    return messages
      .filter(msg => 
        (msg.from === currentUserId && msg.to === selectedUserId) ||
        (msg.from === selectedUserId && msg.to === currentUserId)
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  };
  
  // Get conversations with unread counts
  const getConversations = () => {
    if (!currentUserId) return [];
    
    const conversations = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.from === currentUserId ? msg.to : msg.from;
      const otherUserName = msg.from === currentUserId ? msg.toName : msg.fromName;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          unreadCount: 0
        });
      } else {
        const existing = conversations.get(otherUserId);
        if (msg.timestamp > existing.timestamp) {
          existing.lastMessage = msg.content;
          existing.timestamp = msg.timestamp;
        }
      }
    });
    
    // Count unread messages for each conversation
    conversations.forEach((conv, userId) => {
      const unreadCount = messages.filter(msg => 
        msg.from === userId && 
        msg.to === currentUserId && 
        !msg.read
      ).length;
      conv.unreadCount = unreadCount;
    });
    
    return Array.from(conversations.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  };
  
  const selectedUser = selectedUserId ? students.find(s => s.id === selectedUserId) : null;
  const chatMessages = getChatMessages();
  const conversations = getConversations();
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Simple Chat</DialogTitle>
        
        {!selectedUserId ? (
          // Contact list view
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Messages</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Recent conversations */}
              {conversations.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Chats</h3>
                  {conversations.map(conv => (
                    <div
                      key={conv.userId}
                      onClick={() => openConversation(conv.userId)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium relative">
                        {conv.userName.charAt(0)}
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">{conv.unreadCount > 9 ? '9+' : conv.unreadCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {conv.userName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Search students */}
              <div className="p-4">
                {/* Search bar */}
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search students by name, email, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {searchQuery && (
                  <>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Search Results ({otherStudents.length})
                    </h3>
                    
                    {otherStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No students found matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      otherStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedUserId(student.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2"
                    >
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.course}</p>
                      </div>
                    </div>
                  ))
                    )}
                  </>
                )}
                
                {!searchQuery && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Search for students to start a conversation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Chat view
          <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedUserId(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {selectedUser && (
                <>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.course}</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-gray-400 text-sm">Send the first message!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-lg ${
                          message.from === currentUserId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm mb-1">{message.content}</p>
                        <p className={`text-xs ${
                          message.from === currentUserId ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}