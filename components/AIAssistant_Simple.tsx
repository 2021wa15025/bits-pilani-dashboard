import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AIAssistantProps {
  events?: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    type: string;
    description?: string;
    course?: string;
    location?: string;
  }>;
  courses?: Array<{
    id: string;
    title: string;
    code: string;
    semester: number;
    status: "ongoing" | "completed" | "upcoming";
    progress?: number;
    grades: {
      assignmentQuiz: number | null;
      midSemester: number | null;
      comprehensive: number | null;
      total: number | null;
      finalGrade: string | null;
    };
  }>;
  userName?: string;
  userProfile?: {
    name: string;
    id: string;
    email: string;
    phone: string;
    course: string;
    semester: string;
    avatar?: string;
  };
  announcements?: Array<{
    id: string;
    title: string;
    content: string;
    time: string;
    priority: string;
    category: string;
    read: boolean;
  }>;
  notes?: Array<{
    id: string;
    title: string;
    content: string;
    course: string;
    tags: string;
    createdAt: string;
    lastModified: string;
    favorite: boolean;
  }>;
}

export function AIAssistant({ 
  events = [], 
  courses = [], 
  userName = "Student", 
  userProfile,
  announcements = [],
  notes = []
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content: `Hey there! I'm your AI assistant for this portal. I can help you with anything - checking grades, finding features, or just answering questions. What's up?`,
      timestamp: "Just now"
    }
  ]);
  
  // Ticket creation state
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCourse, setTicketCourse] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ticket creation functions
  const createTicket = async (description: string, course?: any) => {
    try {
      const ticket = {
        id: `T${Date.now()}`,
        subject: ticketSubject || 'Support Request',
        description: description,
        course: course?.title || ticketCourse || 'General',
        category: ticketCategory,
        priority: ticketPriority,
        status: 'open',
        createdAt: new Date().toISOString(),
        studentName: userProfile?.name || userName
      };

      // Here you would typically send to your backend
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  };

  const handleTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    setIsSubmittingTicket(true);
    
    const ticket = await createTicket(ticketDescription);
    
    if (ticket) {
      const successMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `✅ **Support Ticket Created Successfully!**

**Ticket ID:** #${ticket.id}
**Subject:** ${ticket.subject}
**Category:** ${ticket.category}
**Priority:** ${ticket.priority}

Your ticket has been submitted to our support team. You'll receive updates via email and notifications in the portal.

**What happens next:**
• Staff will review your ticket within 24 hours
• You'll get email updates on progress
• Check the notifications bell 🔔 for updates

Is there anything else I can help you with?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, successMessage]);
      
      // Reset form
      setTicketSubject("");
      setTicketDescription("");
      setTicketCourse("");
      setTicketCategory("general");
      setTicketPriority("medium");
      setShowTicketForm(false);
    } else {
      const errorMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `❌ Sorry, there was an error creating your ticket. Please try again or contact support directly.

**Alternative ways to get help:**
• Email: support@bits-pilani.ac.in
• Phone: +91-1596-515-151
• Visit: Academic office during office hours

What else can I help you with?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsSubmittingTicket(false);
  };

  const generateResponse = (userMessage: string) => {
    const lower = userMessage.toLowerCase().trim();
    const name = userProfile?.name || userName;
    
    // More specific and relevant responses
    
    // Support issues detection - suggest ticket creation
    const isSupportIssue = /not updated|not showing|wrong|incorrect|missing|bug|error|problem|issue|broken|can't access|won't load|not working/.test(lower);
    
    if (isSupportIssue) {
      return `I understand you're experiencing an issue. Let me help you get this resolved quickly.

**For technical problems like:**
• Grades not showing correctly
• Features not working
• Login issues
• Missing data
• System errors

I can create a **support ticket** that goes directly to our technical team.

**Would you like me to:**
1. **Create a support ticket** - Gets you direct help from staff
2. **Try troubleshooting** - I can guide you through common solutions first

Type "create ticket" if you want to submit this to support, or tell me more details about the issue for troubleshooting help.`;
    }

    // Ticket creation trigger
    if (lower.includes('create ticket') || lower.includes('support ticket') || lower.includes('submit ticket')) {
      setTimeout(() => setShowTicketForm(true), 500);
      return `I'll open the support ticket form for you right now! 

Please fill out the details about your issue and our support team will get back to you quickly.

**What to include:**
• Clear description of the problem
• What you were trying to do
• Any error messages you saw
• Which course it's related to (if applicable)`;
    }
    
    // Greetings
    if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return `Hello ${name}! I'm here to help you with anything about this portal. What would you like to know?`;
    }
    
    // Thank you
    if (lower.includes('thank') || lower.includes('thanks')) {
      return `You're welcome! Happy to help anytime. 😊`;
    }
    
    // How are you
    if (lower.includes('how are you') || lower.includes('how\'s it going')) {
      return `I'm doing great! Ready to help you with anything you need. What's on your mind?`;
    }
    
    // File upload - specific answer
    if (lower.includes('upload') && lower.includes('file')) {
      return `To upload files in this portal:

1. **Go to File Manager** - Click "File Manager" in the left sidebar
2. **Click Upload Button** - Look for the "+" or "Upload" button  
3. **Select Your Files** - Choose files from your computer
4. **Choose Category** - Select course or type (Assignment, Notes, etc.)
5. **Click Upload** - Wait for confirmation

You can also upload files directly in:
• Course pages (for course-specific materials)
• Notes section (when creating/editing notes)
• Assignment submissions

What type of file are you trying to upload?`;
    }
    
    // What can you do / help
    if (lower.includes('what can you') || lower.includes('help me') || lower === 'help') {
      return `I can help you with specific things on this portal:

• **Grades**: "What are my grades?" "How am I doing?"
• **Schedule**: "What's due today?" "Show my calendar"  
• **Courses**: "My courses" "Course progress"
• **Files**: "How to upload files?" "Find my documents"
• **Navigation**: "Where is [feature]?" "How to use [something]?"

Ask me anything specific and I'll give you a direct answer!`;
    }
    
    // Grades - more specific
    if (lower.includes('grade') || lower.includes('marks') || lower.includes('score') || lower.includes('result')) {
      const completed = courses.filter(c => c.status === 'completed' && c.grades.finalGrade);
      const ongoing = courses.filter(c => c.status === 'ongoing');
      
      if (completed.length === 0 && ongoing.length === 0) {
        return `I don't see any courses in your profile yet. This could mean:
• You're just getting started
• Courses haven't been assigned yet
• There might be a sync issue

Try refreshing the page or contact support if this seems wrong.`;
      }
      
      let result = '';
      
      if (completed.length > 0) {
        result += `**Your Final Grades:**\n`;
        completed.forEach((c, i) => {
          result += `${i + 1}. ${c.title}: ${c.grades.finalGrade}`;
          if (c.grades.total) result += ` (${c.grades.total}%)`;
          result += '\n';
        });
        result += '\n';
      }
      
      if (ongoing.length > 0) {
        result += `**Current Courses Progress:**\n`;
        ongoing.forEach((c, i) => {
          result += `${i + 1}. ${c.title}: ${c.progress || 0}% complete\n`;
        });
      }
      
      return result || 'No grade information available right now.';
    }
    
    // Courses
    if (lower.includes('course') || lower.includes('subject')) {
      const ongoing = courses.filter(c => c.status === 'ongoing');
      if (ongoing.length === 0) {
        return `You don't have any ongoing courses right now. Want to see your completed courses instead?`;
      }
      let result = `You're currently taking:\n\n`;
      ongoing.forEach((c, i) => {
        result += `${i + 1}. ${c.title} (${c.progress || 0}% complete)\n`;
      });
      return result + `\nWant details about any of these?`;
    }
    
    // Schedule/Calendar
    if (lower.includes('today') || lower.includes('schedule') || lower.includes('due') || lower.includes('deadline')) {
      const today = new Date().toISOString().split('T')[0];
      const todayEvents = events.filter(e => e.date === today);
      
      if (todayEvents.length === 0) {
        return `Nothing due today! 🎉 You have a free day. Want to see what's coming up this week?`;
      }
      
      let result = `Here's what you have today:\n\n`;
      todayEvents.forEach((e, i) => {
        result += `${i + 1}. ${e.title} at ${e.time}\n`;
      });
      return result;
    }
    
    // Notes
    if (lower.includes('note') || lower.includes('material')) {
      if (notes.length === 0) {
        return `You don't have any notes yet. You can create notes in the Notes section of the portal.`;
      }
      let result = `You have ${notes.length} notes:\n\n`;
      notes.slice(0, 5).forEach((n, i) => {
        result += `${i + 1}. ${n.title}\n`;
      });
      return result + (notes.length > 5 ? `\n...and ${notes.length - 5} more notes.` : '');
    }
    
    // Specific navigation questions
    if (lower.includes('where') && (lower.includes('grade') || lower.includes('marks'))) {
      return `To find your grades:

1. **Dashboard** - See grade summary cards on the main page
2. **Courses Tab** - Click any course to see detailed grades
3. **Completed Courses** - For final grades of finished courses

Your completed courses show final grades, ongoing courses show progress.`;
    }
    
    if (lower.includes('where') && lower.includes('course')) {
      return `To find your courses:

1. **Courses Tab** - Left sidebar, shows all your courses
2. **Dashboard** - Quick overview cards of current courses
3. **Calendar** - See course-related events and deadlines

Click any course to see materials, assignments, and progress.`;
    }
    
    if (lower.includes('where') && (lower.includes('note') || lower.includes('material'))) {
      return `To find your notes and materials:

1. **Notes Tab** - Left sidebar, all your personal notes
2. **File Manager** - All uploaded files organized by course
3. **Course Pages** - Course-specific materials and resources
4. **Library Tab** - Shared resources and materials

What type of material are you looking for?`;
    }
    
    // Dashboard questions
    if (lower.includes('dashboard') || lower.includes('home')) {
      return `The Dashboard is your main hub showing:

• **Current Courses** - Progress bars and quick access
• **Today's Schedule** - Events, deadlines, classes
• **Recent Activity** - Latest updates and changes
• **Grade Overview** - Performance summary
• **Quick Stats** - Announcements, notifications

Click any card to go to that section. What would you like to explore?`;
    }
    
    // Calendar questions  
    if (lower.includes('calendar') || lower.includes('schedule')) {
      return `The Calendar shows:

• **All Events** - Exams, assignments, classes
• **Deadlines** - Important due dates
• **Schedule** - Daily and weekly view
• **Event Details** - Time, location, description

You have ${events.length} upcoming events. Want to see what's coming up?`;
    }
    
    // Profile questions
    if (lower.includes('profile') || lower.includes('account') || lower.includes('setting')) {
      return `To access your profile:

1. **Click your profile picture** - Top right corner
2. **Edit Profile** - Update your information
3. **Account Settings** - Change preferences
4. **Security** - Password and privacy settings

Your current profile shows:
• Name: ${userProfile?.name || 'Not set'}
• Course: ${userProfile?.course || 'Not set'}
• Semester: ${userProfile?.semester || 'Not set'}

Need help updating anything?`;
    }
    
    // Smart fallback - try to understand what they're asking
    if (lower.includes('?')) {
      return `I want to give you the most helpful answer! Could you be more specific about what you're looking for?

**Common questions I can answer:**
• "Where can I find my grades?"
• "How do I upload files?"  
• "What courses am I taking?"
• "What's due today?"
• "Where is the calendar?"
• "How do I edit my profile?"

**Or ask about:**
• Any feature location ("Where is...")
• How to do something ("How do I...")
• Your academic data ("What are my...")

What specifically would you like help with?`;
    }

    // Final fallback
    return `I'm here to help with this portal! I can answer questions about:

✅ **Your Data**: Grades, courses, schedule, notes
✅ **Navigation**: Where to find features, how to use them  
✅ **Actions**: How to upload, download, edit, etc.

Try asking something like:
• "Where can I see my grades?"
• "How do I upload a file?"
• "What assignments are due?"

What do you need help with?`;
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: generateResponse(message),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setMessage("");
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[9998]"
          >
            <Card className="w-80 sm:w-96 h-[500px] sm:h-[550px] flex flex-col shadow-2xl border-university-border bg-white dark:bg-gray-900">
              {/* Header */}
              <div className="bg-university-primary text-white p-3 sm:p-4 rounded-t-lg relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center relative">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-white">
                        BITS-Bot
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80">AI Assistant</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-lg w-8 h-8 sm:w-auto sm:h-auto"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-50/30 dark:bg-gray-800/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-2 sm:p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-university-primary text-white"
                          : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                      }`}
                    >
                      <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        msg.type === "user" ? "text-white" : "text-gray-900 dark:text-gray-100"
                      }`}>{msg.content}</p>
                      <p className={`text-xs mt-1 sm:mt-2 ${
                        msg.type === "user" ? "text-white/80" : "text-gray-500 dark:text-gray-300"
                      }`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {/* Create Ticket Button */}
                <div className="mb-3">
                  <Button
                    onClick={() => setShowTicketForm(true)}
                    variant="outline"
                    className="w-full h-10 flex items-center justify-center gap-2 text-sm border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Create Support Ticket
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about the portal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 rounded-lg text-xs sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-university-primary focus:ring-2 focus:ring-university-primary/20 h-10"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed rounded-lg px-3 text-white h-10 min-w-[2.5rem] flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-university-primary hover:bg-university-secondary shadow-lg transition-all duration-300 relative"
          >
            {isExpanded ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <>
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                <Badge className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 bg-green-500 text-white text-xs flex items-center justify-center rounded-full">
                  AI
                </Badge>
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Support Ticket Dialog */}
      <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden dark:bg-slate-800 dark:text-white z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl dark:text-white">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Create Support Ticket
            </DialogTitle>
            <DialogDescription className="dark:text-slate-300">
              Describe your issue and our support team will help you resolve it quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="ticket-subject" className="dark:text-white">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ticket-subject"
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              />
            </div>

            {/* Course (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="ticket-course" className="dark:text-white">
                Related Course (Optional)
              </Label>
              <Select value={ticketCourse} onValueChange={setTicketCourse}>
                <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] max-h-[200px] overflow-y-auto backdrop-blur-sm"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={8}
                >
                  <SelectItem value="none" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    No specific course
                  </SelectItem>
                  {courses.map(course => (
                    <SelectItem 
                      key={course.id} 
                      value={course.id}
                      className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3 text-sm"
                    >
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="ticket-category" className="dark:text-white">
                Category
              </Label>
              <Select value={ticketCategory} onValueChange={setTicketCategory}>
                <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] backdrop-blur-sm"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={8}
                >
                  <SelectItem value="general" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    General
                  </SelectItem>
                  <SelectItem value="grades" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    Grades/Marks
                  </SelectItem>
                  <SelectItem value="content" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    Course Content
                  </SelectItem>
                  <SelectItem value="technical" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    Technical Issue
                  </SelectItem>
                  <SelectItem value="account" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    Account/Profile
                  </SelectItem>
                  <SelectItem value="access" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    Access Issues
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="ticket-priority" className="dark:text-white">
                Priority
              </Label>
              <Select value={ticketPriority} onValueChange={setTicketPriority}>
                <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] backdrop-blur-sm"
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={8}
                >
                  <SelectItem value="low" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    🔵 Low
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    🟡 Medium
                  </SelectItem>
                  <SelectItem value="high" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    🟠 High
                  </SelectItem>
                  <SelectItem value="urgent" className="hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer py-2 px-3">
                    🔴 Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ticket-description" className="dark:text-white">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="ticket-description"
                placeholder="Provide detailed information about your issue...

• What were you trying to do?
• What happened instead?
• Any error messages?
• Steps to reproduce the issue?"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows={6}
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowTicketForm(false);
                setTicketSubject("");
                setTicketDescription("");
                setTicketCourse("");
                setTicketCategory("general");
                setTicketPriority("medium");
              }}
              disabled={isSubmittingTicket}
              className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTicketSubmit}
              disabled={!ticketSubject.trim() || !ticketDescription.trim() || isSubmittingTicket}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmittingTicket ? "Creating Ticket..." : "Create Ticket"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}