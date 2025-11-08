import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { students } from '../data/studentsData';
import { CrossSessionMessaging, crossSessionMessaging } from '../utils/crossSessionMessaging';
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Send, 
  X,
  UserPlus,
  Paperclip,
  Download,
  Trash2
} from 'lucide-react';

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

interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  members: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'member';
  }[];
  unreadCount: number;
  createdAt: string;
  createdBy: string;
}

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function MessagingModal({ isOpen, onClose, currentUser }: MessagingModalProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  
  // State for messaging - using cross-session messaging
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState('');
  
  // State for creating new group
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  
  // File upload state
  const [fileUpload, setFileUpload] = useState<{ file: File | null; preview?: string }>({ file: null });
  
  // Initialize the cross-session messaging instance
  const [crossSessionMessaging] = useState(() => new CrossSessionMessaging());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for available students (excluding current user)
  const [availableStudents, setAvailableStudents] = useState<typeof students>([]);

  // Update available students when currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      const filteredStudents = students.filter(student => student.id !== currentUser.id).map(student => ({
        id: student.id,
        name: student.name,
        username: student.username,
        email: student.email,
        password: student.password,
        phone: student.phone,
        course: student.course,
        semester: student.semester,
        avatar: student.avatar || '',
        isOnline: student.isOnline || false
      }));
      setAvailableStudents(filteredStudents);
    }
  }, [currentUser?.id]);

  // Load data from cross-session messaging
  useEffect(() => {
    if (!currentUser?.id) return;
    
    // Load recent chats from localStorage
    const loadChats = () => {
      console.log('🔄 Loading chats for user:', currentUser.id);
      const recentChats = crossSessionMessaging.getRecentChats(currentUser.id);
      console.log('📋 Loaded recent chats:', recentChats);
      
      // Convert to expected format
      const formattedChats = recentChats.map(chat => ({
        ...chat,
        lastMessage: chat.lastMessage ? {
          ...chat.lastMessage,
          type: chat.lastMessage.type as 'text' | 'file' | 'system'
        } : undefined
      }));
      
      setPrivateChats(formattedChats);
    };
    
    // Load groups from Supabase
    const loadGroups = async () => {
      console.log('🔄 Loading groups for user:', currentUser.id);
      const allGroups = await crossSessionMessaging.getGroups();
      console.log('👥 Loaded all groups:', allGroups);
      setGroups(allGroups);
    };
    
    loadChats();
    loadGroups();
    
    // Listen for new messages
    const unsubscribe = crossSessionMessaging.onMessage(async (allMessages) => {
      console.log('📡 Received real-time message update');
      await loadChats(); // Reload chats when messages change
      await loadGroups(); // Reload groups when messages change
      
      // If we have a selected chat, reload its messages
      if (selectedChat) {
        const chatMessages = await crossSessionMessaging.getMessages(currentUser.id, selectedChat);
        setMessages(prev => ({
          ...prev,
          [selectedChat]: chatMessages
        }));
      }
      
      // If we have a selected group, reload its messages
      if (selectedGroup) {
        const groupMessages = await crossSessionMessaging.getGroupMessages(selectedGroup);
        setMessages(prev => ({
          ...prev,
          [`group_${selectedGroup}`]: groupMessages
        }));
      }
    });
    
    return unsubscribe;
  }, [currentUser?.id, selectedChat]);

  // Load messages for selected chat or group
  useEffect(() => {
    if (selectedChat && currentUser?.id) {
      const chatMessages = crossSessionMessaging.getMessages(currentUser.id, selectedChat);
        setMessages(prev => ({
          ...prev,
          [selectedChat]: chatMessages
        }));
    }
    
    if (selectedGroup) {
      const groupMessages = crossSessionMessaging.getGroupMessages(selectedGroup);
      setMessages(prev => ({
        ...prev,
        [`group_${selectedGroup}`]: groupMessages
      });
  }, [selectedChat, selectedGroup, currentUser?.id]);

  // Get current messages for display
  const currentMessages = selectedChat 
    ? messages[selectedChat] || []
    : selectedGroup 
    ? messages[`group_${selectedGroup}`] || []
    : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // File upload function
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileUpload({
          file,
          preview: e.target?.result as string
        });
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        setFileUpload({ file });
      }
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setPrivateChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[`chat_${chatId}`];
      return newMessages;
    });
    if (selectedChat === chatId) {
      setSelectedChat(null);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[`group_${groupId}`];
      return newMessages;
    });
    if (selectedGroup === groupId) {
      setSelectedGroup(null);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    const groupData = {
      name: newGroupName,
      description: newGroupDescription,
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: 'admin' as const
        },
        ...selectedMembers.map(memberId => {
          const student = availableStudents.find(s => s.id === memberId)!;
          return {
            id: student.id,
            name: student.name,
            role: 'member' as const
          };
        })
      ],
      createdBy: currentUser.id
    };

    // Use Supabase cross-session messaging for group creation
    const success = await crossSessionMessaging.createGroup(groupData);
    
    if (success) {
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      setSelectedMembers([]);
      setShowNewGroup(false);
      
      // Reload groups to show the new one
      const allGroups = await crossSessionMessaging.getGroups();
      setGroups(allGroups);
    }
  };

  const handleStartPrivateChat = (studentId: string) => {
    const student = availableStudents.find(s => s.id === studentId);
    if (!student) return;

    // Check if chat already exists
    const existingChat = privateChats.find(chat => chat.participantId === studentId);
    if (existingChat) {
      setSelectedChat(studentId); // Use student ID directly
      setShowNewChat(false);
      return;
    }

    // Create new chat entry for UI
    const newChat: PrivateChat = {
      id: studentId, // Use student ID as chat ID for simplicity
      participantId: studentId,
      participantName: student.name,
      participantEmail: student.email,
      participantAvatar: student.avatar,
      unreadCount: 0
    };

    setPrivateChats(prev => [...prev, newChat]);
    setSelectedChat(studentId); // Use student ID directly
    setShowNewChat(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !fileUpload.file) return;
    if (!selectedChat && !selectedGroup) return;

    if (selectedChat) {
      // Send private message using Supabase cross-session messaging
      const messageData = {
        content: newMessage,
        type: (fileUpload.file ? 'file' : 'text') as 'text' | 'file',
        ...(fileUpload.file && {
          fileAttachment: {
            name: fileUpload.file.name,
            size: fileUpload.file.size,
            type: fileUpload.file.type,
            url: fileUpload.preview || '#'
          }
        })
      };

      const success = await crossSessionMessaging.sendMessage(currentUser.id, selectedChat, messageData);
      
      if (success) {
        setNewMessage('');
        setFileUpload({ file: null });
        
        // Immediately reload messages for this chat
        const updatedMessages = await crossSessionMessaging.getMessages(currentUser.id, selectedChat);
        setMessages(prev => ({
          ...prev,
          [selectedChat]: updatedMessages
        }));
      } else {
        console.error('❌ Failed to send message');
        // Show user feedback - you can replace this with a toast notification
        alert('Failed to send message. Please check the console for details.');
      }
    } else if (selectedGroup) {
      // Send group message using Supabase cross-session messaging
      const messageData = {
        content: newMessage,
        type: (fileUpload.file ? 'file' : 'text') as 'text' | 'file',
        ...(fileUpload.file && {
          fileAttachment: {
            name: fileUpload.file.name,
            size: fileUpload.file.size,
            type: fileUpload.file.type,
            url: fileUpload.preview || '#'
          }
        })
      };

      const success = await crossSessionMessaging.sendGroupMessage(currentUser.id, selectedGroup, messageData);
      
      if (success) {
        setNewMessage('');
        setFileUpload({ file: null });
        
        // Immediately reload messages for this group
        const updatedMessages = await crossSessionMessaging.getGroupMessages(selectedGroup);
        setMessages(prev => ({
          ...prev,
          [`group_${selectedGroup}`]: updatedMessages
        }));
      } else {
        console.error('❌ Failed to send group message');
        // Show user feedback - you can replace this with a toast notification
        alert('Failed to send group message. Please check the console for details.');
      }
    }
  };

  const currentChatName = selectedChat
    ? privateChats.find(chat => chat.id === selectedChat)?.participantName
    : selectedGroup
    ? groups.find(group => group.id === selectedGroup)?.name
    : '';

  if (showNewGroup) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Create New Group
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Add Members</label>
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search students..."
                className="mb-2"
              />
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers(prev => [...prev, student.id]);
                        } else {
                          setSelectedMembers(prev => prev.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()} className="flex-1">
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowNewGroup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showNewChat) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Start New Chat
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search students..."
            />
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleStartPrivateChat(student.id)}
                >
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" onClick={() => setShowNewChat(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (selectedChat || selectedGroup) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {currentChatName}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedChat(null);
                  setSelectedGroup(null);
                }}
              >
                ← Back
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages area with proper scroll */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 rounded-lg min-h-0">
              {currentMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                currentMessages.map(message => (
                  <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'system' 
                        ? 'bg-gray-200 text-gray-700 text-sm italic mx-auto'
                        : message.senderId === currentUser.id
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 shadow-sm rounded-bl-sm'
                    }`}>
                      
                      {message.type !== 'system' && message.senderId !== currentUser.id && (
                        <p className="text-xs font-medium mb-1 text-blue-600">{message.senderName}</p>
                      )}
                      
                      {/* File attachment */}
                      {message.fileAttachment && (
                        <div className="mb-2 p-2 bg-black/10 rounded flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{message.fileAttachment.name}</p>
                            <p className="text-xs opacity-70">{(message.fileAttachment.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button size="sm" variant="ghost" className="p-1 h-auto">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === currentUser.id 
                          ? 'text-blue-100' 
                          : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* File upload preview */}
            {fileUpload.file && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-t flex-shrink-0">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{fileUpload.file.name}</p>
                  <p className="text-xs text-gray-600">{(fileUpload.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setFileUpload({ file: null })}
                  className="p-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            
            {/* Message input area - fixed at bottom */}
            <div className="flex gap-2 mt-2 items-end flex-shrink-0 border-t pt-3">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() && !fileUpload.file}
              >
                <Send className="w-4 h-4" />
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chats' | 'groups')} className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <TabsList>
                <TabsTrigger value="chats" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Private Chats
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Groups
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                {activeTab === 'chats' && (
                  <Button size="sm" onClick={() => setShowNewChat(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    New Chat
                  </Button>
                )}
                {activeTab === 'groups' && (
                  <Button size="sm" onClick={() => setShowNewGroup(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create Group
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              <TabsContent value="chats" className="h-full space-y-2 mt-0 overflow-y-auto">
            {privateChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No private chats yet</h3>
                <p className="text-gray-500 mb-4">Start a conversation with your colleagues</p>
                <Button onClick={() => setShowNewChat(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              privateChats.map(chat => {
                const participant = availableStudents.find(s => s.id === chat.participantId);
                const lastMessage = messages[`chat_${chat.id}`]?.slice(-1)[0];
                return (
                  <Card key={chat.id} className="group hover:bg-gray-50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={chat.participantAvatar} />
                            <AvatarFallback>{chat.participantName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {participant?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div 
                          className="flex-1 min-w-0 cursor-pointer" 
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{chat.participantName}</h4>
                            <div className="flex items-center gap-2">
                              {chat.unreadCount > 0 && (
                                <Badge className="bg-blue-500">{chat.unreadCount}</Badge>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat.id);
                                }}
                                className="p-1 h-auto opacity-0 group-hover:opacity-100 hover:bg-red-100"
                                title="Delete chat"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">{chat.participantEmail}</p>
                          {lastMessage ? (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic mt-1">No messages yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="h-full space-y-2 mt-0 overflow-y-auto">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No groups yet</h3>
                <p className="text-gray-500 mb-4">Create a group to collaborate with multiple students</p>
                <Button onClick={() => setShowNewGroup(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>
            ) : (
              groups.map(group => {
                const lastMessage = messages[`group_${group.id}`]?.slice(-1)[0];
                
                return (
                  <Card key={group.id} className="group hover:bg-gray-50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div 
                          className="flex-1 min-w-0 cursor-pointer" 
                          onClick={() => setSelectedGroup(group.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{group.name}</h4>
                            <div className="flex items-center gap-2">
                              {group.unreadCount > 0 && (
                                <Badge className="bg-blue-500">{group.unreadCount}</Badge>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGroup(group.id);
                                }}
                                className="p-1 h-auto opacity-0 group-hover:opacity-100 hover:bg-red-100"
                                title="Delete group"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{group.members.length} members</p>
                          {lastMessage ? (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic mt-1">No messages yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}