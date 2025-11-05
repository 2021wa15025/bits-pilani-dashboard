import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
}

export default function MessagingModal({ isOpen, onClose }: MessagingModalProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  
  // Current user (you would get this from context/auth)
  const currentUser = {
    id: 'current-user',
    name: 'You',
    email: 'you@wilp.bits-pilani.ac.in',
    avatar: ''
  };
  
  // State for messaging
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Five students list for the website
  const [availableStudents] = useState([
    { 
      id: '1', 
      name: 'Hari Hara Sudhan', 
      email: '2021wa15025@wilp.bits-pilani.ac.in', 
      avatar: '', 
      isOnline: true
    },
    { 
      id: '2', 
      name: 'Rahul Kumar', 
      email: '2021wa15026@wilp.bits-pilani.ac.in', 
      avatar: '', 
      isOnline: false
    },
    { 
      id: '3', 
      name: 'Arjun Patel', 
      email: '2021wa15028@wilp.bits-pilani.ac.in', 
      avatar: '', 
      isOnline: true
    },
    { 
      id: '4', 
      name: 'Vikram Singh', 
      email: '2021wa15030@wilp.bits-pilani.ac.in', 
      avatar: '', 
      isOnline: true
    },
    { 
      id: '5', 
      name: 'Kavya Nair', 
      email: '2021wa15031@wilp.bits-pilani.ac.in', 
      avatar: '', 
      isOnline: false
    }
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('privateChats');
    const savedGroups = localStorage.getItem('chatGroups');
    const savedMessages = localStorage.getItem('chatMessages');
    
    if (savedChats) setPrivateChats(JSON.parse(savedChats));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('privateChats', JSON.stringify(privateChats));
  }, [privateChats]);

  useEffect(() => {
    localStorage.setItem('chatGroups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

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

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: ChatGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      description: newGroupDescription,
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          role: 'admin'
        },
        ...selectedMembers.map(memberId => {
          const student = availableStudents.find(s => s.id === memberId)!;
          return {
            id: student.id,
            name: student.name,
            email: student.email,
            avatar: student.avatar,
            role: 'member' as const
          };
        })
      ],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      senderId: 'system',
      senderName: 'System',
      content: `${currentUser.name} created the group "${newGroupName}"`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    
    setMessages(prev => ({
      ...prev,
      [`group_${newGroup.id}`]: [systemMessage]
    }));

    // Reset form
    setNewGroupName('');
    setNewGroupDescription('');
    setSelectedMembers([]);
    setShowNewGroup(false);
  };

  const handleStartPrivateChat = (studentId: string) => {
    const student = availableStudents.find(s => s.id === studentId);
    if (!student) return;

    // Check if chat already exists
    const existingChat = privateChats.find(chat => chat.participantId === studentId);
    if (existingChat) {
      setSelectedChat(existingChat.id);
      setShowNewChat(false);
      return;
    }

    const newChat: PrivateChat = {
      id: Date.now().toString(),
      participantId: studentId,
      participantName: student.name,
      participantEmail: student.email,
      participantAvatar: student.avatar,
      unreadCount: 0
    };

    setPrivateChats(prev => [...prev, newChat]);
    setSelectedChat(newChat.id);
    setShowNewChat(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !fileUpload.file) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: fileUpload.file ? 'file' : 'text',
      ...(fileUpload.file && {
        fileAttachment: {
          name: fileUpload.file.name,
          size: fileUpload.file.size,
          type: fileUpload.file.type,
          url: fileUpload.preview || '#'
        }
      })
    };

    const chatKey = selectedChat ? `chat_${selectedChat}` : selectedGroup ? `group_${selectedGroup}` : '';
    if (!chatKey) return;

    setMessages(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message]
    }));

    setNewMessage('');
    setFileUpload({ file: null });
  };

  const currentMessages = selectedChat 
    ? messages[`chat_${selectedChat}`] || []
    : selectedGroup 
    ? messages[`group_${selectedGroup}`] || []
    : [];

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
        <DialogContent className="max-w-2xl h-[500px] flex flex-col">
          <DialogHeader>
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
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 rounded-lg">
              {currentMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                currentMessages.map(message => (
                  <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.type === 'system' 
                        ? 'bg-blue-100 text-blue-800 text-sm italic'
                        : message.senderId === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border'
                    }`}>
                      
                      {message.type !== 'system' && message.senderId !== currentUser.id && (
                        <p className="text-xs font-medium mb-1">{message.senderName}</p>
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
                      
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'system' || message.senderId === currentUser.id ? 'opacity-70' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* File upload preview */}
            {fileUpload.file && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-t">
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
            
            <div className="flex gap-2 mt-2 items-end">
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
      <DialogContent className="max-w-3xl h-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chats' | 'groups')}>
          <div className="flex items-center justify-between mb-4">
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
          
          <TabsContent value="chats" className="space-y-2">
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
          
          <TabsContent value="groups" className="space-y-2">
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}