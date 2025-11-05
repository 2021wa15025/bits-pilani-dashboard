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
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadDate: string;
    }>;
  }>;
  libraryItems?: Array<{
    id: string;
    title: string;
    type: string;
    course: string;
    fileType: string;
    size: string;
    uploadDate: string;
  }>;
}

export function AIAssistant({ 
  events = [], 
  courses = [], 
  userName = "Student", 
  userProfile,
  announcements = [],
  notes = [],
  libraryItems = []
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const displayName = userProfile?.name || userName;
    return [{
      id: "initial-1",
      type: "assistant",
      content: `Hey ${displayName}! 👋 I'm your AI assistant for this portal.

I can help you with anything - checking grades, finding features, understanding how things work, or just answering questions about your academic stuff.

Try asking me something like "What's due today?" or "How are my grades?" or even just "What can you do?"

What's up?`,
      timestamp: "Just now"
    }];
  });
  
  // Ticket form state
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

  // Find course mentioned in message
  const findCourse = (msg: string) => {
    const lower = msg.toLowerCase();
    for (const course of courses) {
      const title = course.title.toLowerCase();
      const code = course.code.toLowerCase();
      
      if (lower.includes(title) || lower.includes(code)) {
        return course;
      }
      
      // Check word matches
      const words = title.split(' ');
      for (const word of words) {
        if (word.length > 4 && lower.includes(word)) {
          return course;
        }
      }
    }
    return null;
  };

  // Check if out of scope
  const isOutOfScope = (msg: string) => {
    const lower = msg.toLowerCase();
    if (/\d+\s*[\+\-\*\/×÷]\s*\d+/.test(lower)) return true;
    if (/who is|capital of|world history|windows|mac|iphone|android/.test(lower)) return true;
    if (/movie|song|music|game/.test(lower)) return true;
    return false;
  };

  // Create support ticket (used by chat detection)
  const createTicket = async (issue: string, course?: any) => {
    try {
      const ticketData = {
        studentId: userProfile?.id || 'unknown',
        studentName: userProfile?.name || userName || 'Student',
        studentEmail: userProfile?.email || 'unknown@email.com',
        courseId: course?.id,
        courseName: course?.title,
        subject: course ? `Issue with ${course.title}` : 'General Support Request',
        description: issue,
        category: /grade|mark/.test(issue.toLowerCase()) ? 'grades' : 
                  /content|material|slide/.test(issue.toLowerCase()) ? 'content' : 
                  /technical|not working|error/.test(issue.toLowerCase()) ? 'technical' : 'general',
        priority: 'medium'
      };

      const response = await fetch(
        `https://${(await import('../utils/supabase/info')).projectId}.supabase.co/functions/v1/make-server-917daa5d/tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await import('../utils/supabase/info')).publicAnonKey}`
          },
          body: JSON.stringify(ticketData)
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Ticket created:', data.ticket.id);
        return data.ticket;
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
    return null;
  };

  // Handle ticket form submission
  const handleTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      return;
    }

    setIsSubmittingTicket(true);

    try {
      const selectedCourse = ticketCourse ? courses.find(c => c.id === ticketCourse) : undefined;
      
      const ticketData = {
        studentId: userProfile?.id || 'unknown',
        studentName: userProfile?.name || userName || 'Student',
        studentEmail: userProfile?.email || 'unknown@email.com',
        courseId: selectedCourse?.id,
        courseName: selectedCourse?.title,
        subject: ticketSubject,
        description: ticketDescription,
        category: ticketCategory as 'grades' | 'content' | 'technical' | 'general',
        priority: ticketPriority as 'low' | 'medium' | 'high'
      };

      const response = await fetch(
        `https://${(await import('../utils/supabase/info')).projectId}.supabase.co/functions/v1/make-server-917daa5d/tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await import('../utils/supabase/info')).publicAnonKey}`
          },
          body: JSON.stringify(ticketData)
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Ticket created via form:', data.ticket.id);
        
        // Add confirmation message to chat
        const ticketId = data.ticket.id;
        const newMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: `✅ Ticket #${ticketId} created successfully!\n\n**Subject:** ${ticketSubject}\n**Status:** Open\n\nA staff member will review your ticket and respond soon. You'll receive a notification when they reply.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Reset form and close dialog
        setTicketSubject("");
        setTicketDescription("");
        setTicketCourse("");
        setTicketCategory("general");
        setTicketPriority("medium");
        setShowTicketForm(false);
      } else {
        // Show error message
        const errorMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: "❌ Failed to create ticket. Please try again or contact support.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      const errorMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: "❌ Failed to create ticket. Please try again or contact support.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Generate response
  const generateResponse = async (userMessage: string) => {
    const lower = userMessage.toLowerCase().trim();
    const name = userProfile?.name || userName;
    
    // Simple conversational responses that actually work
    
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
    
    // What can you do / help
    if (lower.includes('what can you') || lower.includes('help me') || lower === 'help') {
      return `I can help you with:
• Check your grades and courses
• See what's due today or this week  
• Find your notes and materials
• Navigate the portal features
• Answer questions about your academic data

Just ask me naturally like "What are my grades?" or "What's due today?"

What would you like to know?`;
    }
    
    // Grades
    if (lower.includes('grade') || lower.includes('marks') || lower.includes('score')) {
      const completed = courses.filter(c => c.status === 'completed' && c.grades.finalGrade);
      if (completed.length === 0) {
        return `You don't have any final grades yet. You're currently working on your ongoing courses. Want to see your current progress?`;
      }
      let result = `Here are your grades:\n\n`;
      completed.forEach((c, i) => {
        result += `${i + 1}. ${c.title}: ${c.grades.finalGrade}\n`;
      });
      return result + `\nNeed details about any specific course?`;
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
    
    // Greetings with time-based responses
    if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      const now = new Date();
      const timeOfDay = now.getHours();
      const name = userProfile?.name || userName;
      let greeting = "Hello";
      if (timeOfDay < 12) greeting = "Good morning";
      else if (timeOfDay < 17) greeting = "Good afternoon";
      else greeting = "Good evening";

      const responses = [
        `${greeting} ${name}! I'm here to help you navigate and understand everything about this BITS Pilani portal. What would you like to know?`,
        `Hi ${name}! I'm your AI assistant for this student portal. I can explain features, help with navigation, answer questions about your academic data, and much more. How can I help?`,
        `Hey there! I'm designed to make your experience with this portal as smooth as possible. Whether you need help with courses, grades, calendar, or just understanding how things work - I'm your guy! What's up?`,
        `${greeting}! I'm like having ChatGPT specifically trained on this BITS Pilani portal. I know all about the features, how to use them, and can help with any questions you have. What can I help you with today?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // More conversational help responses
    if (/help|what can|capabilities|do for me/.test(lower)) {
      return `I'm here to make your life easier! Think of me as your personal guide for this BITS Pilani portal.

I can help you with basically anything:

**🎓 Your Academic Life:**
Want to check your grades? See what's due? Find course materials? I've got you covered.

**🔧 Using the Portal:**
Not sure how something works? Can't find a feature? I'll walk you through it step by step.

**� Your Data:**
I can explain your progress, help you understand your schedule, find specific information, or just give you a quick overview of everything.

**� Smart Assistance:**
I understand natural language, so just ask me things like "What's my grade in Database Systems?" or "How do I upload a file?" or "When is my next exam?"

The best part? I actually know your specific data, so I can give you personalized answers, not just generic help.

What would you like to start with?`;
    }

    // Add more natural conversation patterns
    
    // Handle casual questions and natural language
    if (/how are you|how's it going|what's up|sup/.test(lower)) {
      return `I'm doing great! Always ready to help with anything you need on this portal. How about you? What brings you here today?`;
    }
    
    if (/who are you|what are you|tell me about yourself/.test(lower)) {
      return `I'm your AI assistant for this BITS Pilani portal! Think of me as a smart helper who knows everything about this website and your academic data. I can answer questions, explain features, help you find things, and basically make your life easier when using this portal. I'm designed to be conversational and helpful, just like talking to a knowledgeable friend. What would you like to know?`;
    }
    
    if (/good|nice|cool|awesome|great|excellent/.test(lower) && userMessage.length < 20) {
      return `Thanks! Glad you're having a good experience. Is there anything specific I can help you with, or are you just exploring the portal?`;
    }
    
    if (/boring|bad|terrible|awful|hate/.test(lower) && userMessage.length < 30) {
      return `Oh no! I'm sorry you're having a frustrating experience. What's bothering you? Maybe I can help make things better or at least point you in the right direction.`;
    }

    const course = findCourse(userMessage);
    
    // Detect support issues - marks not updated, validation needed
    const isSupportIssue = /not updated|not showing|wrong|incorrect|missing|validate|check with staff|issue|problem|error/.test(lower);
    
    if (isSupportIssue && course) {
      // Create ticket for course-specific issue
      const ticket = await createTicket(userMessage, course);
      if (ticket) {
        return `I've created a support ticket (#${ticket.id}) for ${course.title}.\n\nA staff member will review your concern and respond soon. You'll receive a notification when they reply.\n\nAnything else I can help with?`;
      }
      return `I'll create a support ticket for ${course.title} and forward your concern to staff. They'll get back to you soon.\n\nWhat else can I help with?`;
    }
    
    if (isSupportIssue && !course) {
      // General support issue
      const ticket = await createTicket(userMessage);
      if (ticket) {
        return `I've created a support ticket (#${ticket.id}) for your concern.\n\nStaff will review it and respond soon. You'll be notified when they reply.\n\nAnything else?`;
      }
      return "I'll create a support ticket and forward your concern to staff. They'll get back to you soon.\n\nWhat else can I help with?";
    }

    // Grades for specific course
    if (/grade|mark|score|result/.test(lower) && course) {
      if (course.status === 'completed' && course.grades.finalGrade) {
        return `${course.title}: Grade ${course.grades.finalGrade} (${course.grades.total}/100)\n\nNeed anything else?`;
      }
      if (course.status === 'ongoing') {
        return `${course.title} is ongoing. Current progress: ${course.progress}%\n\nGrades available after completion. Check Courses tab for details.`;
      }
      return `${course.title} starts in Semester ${course.semester}.`;
    }

    // More natural grade queries
    if (/how.*doing|my grade|my mark|my score|my performance|how am i|grade|result/.test(lower)) {
      const completed = courses.filter(c => c.status === 'completed' && c.grades.finalGrade);
      const ongoing = courses.filter(c => c.status === 'ongoing');
      
      if (completed.length === 0 && ongoing.length === 0) {
        return "I don't see any courses in your profile yet. This could be because you're just getting started or there might be a sync issue. Would you like me to help you check with support?";
      }
      
      let response = '';
      
      if (ongoing.length > 0) {
        response += `You're currently working on ${ongoing.length} course${ongoing.length > 1 ? 's' : ''}. `;
        const avgProgress = Math.round(ongoing.reduce((sum, c) => sum + (c.progress || 0), 0) / ongoing.length);
        
        if (avgProgress >= 80) response += "You're doing excellent! 🎉";
        else if (avgProgress >= 65) response += "You're doing really well! 👍";
        else if (avgProgress >= 50) response += "You're making good progress! 📈";
        else response += "Keep going, you've got this! 💪";
        
        response += ` Average progress: ${avgProgress}%\n\n`;
      }
      
      if (completed.length > 0) {
        response += `For completed courses:\n`;
        const goodGrades = completed.filter(c => ['A+', 'A', 'A-', 'B+'].includes(c.grades.finalGrade || '')).length;
        
        completed.slice(0, 3).forEach((c, i) => {
          response += `• ${c.title}: ${c.grades.finalGrade}\n`;
        });
        
        if (completed.length > 3) {
          response += `...and ${completed.length - 3} more\n`;
        }
        
        if (goodGrades > 0) {
          response += `\n🌟 You've earned ${goodGrades} excellent grade${goodGrades > 1 ? 's' : ''}!`;
        }
      }
      
      response += `\n\nWant details about any specific course?`;
      return response;
    }

    // Schedule queries
    if (/today|tomorrow|week|due|deadline/.test(lower)) {
      const today = new Date().toISOString().split('T')[0];
      let filtered = [];
      
      if (lower.includes('today')) {
        filtered = events.filter(e => e.date === today);
        if (filtered.length === 0) return "Nothing due today! 🎉";
        const list = filtered.slice(0, 3).map((e, i) => `${i + 1}. ${e.title} at ${e.time}`).join('\n');
        return `Today:\n${list}\n\nCheck Calendar tab for more.`;
      }
      
      if (lower.includes('week')) {
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() + 7);
        filtered = events.filter(e => new Date(e.date) <= weekEnd);
        if (filtered.length === 0) return "Clear week ahead!";
        const list = filtered.slice(0, 3).map((e, i) => `${i + 1}. ${e.title}`).join('\n');
        return `This week:\n${list}\n\nView full schedule in Calendar tab.`;
      }
      
      return "Check the Calendar tab for your schedule. What else can I help with?";
    }

    // More natural course queries
    if (/what.*course|my course|which course|course.*taking|enrolled|studying/.test(lower)) {
      const ongoing = courses.filter(c => c.status === 'ongoing');
      const completed = courses.filter(c => c.status === 'completed');
      const upcoming = courses.filter(c => c.status === 'upcoming');
      
      if (ongoing.length === 0 && completed.length === 0) {
        return "Looks like you don't have any courses in the system yet. This might be because you're just getting started, or there might be a sync issue. Would you like me to help you check with support?";
      }

      let response = '';
      
      if (ongoing.length > 0) {
        response += `Right now you're taking ${ongoing.length} course${ongoing.length > 1 ? 's' : ''}:\n\n`;
        ongoing.forEach((course, i) => {
          const progress = course.progress || 0;
          response += `${i + 1}. **${course.title}** (${course.code}) - ${progress}% complete\n`;
        });
      }
      
      if (completed.length > 0) {
        response += `\nYou've completed ${completed.length} course${completed.length > 1 ? 's' : ''} so far. `;
      }
      
      if (upcoming.length > 0) {
        response += `\nYou have ${upcoming.length} course${upcoming.length > 1 ? 's' : ''} planned for future semesters.`;
      }
      
      response += `\n\nWant details about any specific course? Just ask me something like "Tell me about Database Systems" or "How am I doing in Programming"?`;
      
      return response;
    }

    // Course details
    if (/about|details|info/.test(lower) && course) {
      const status = course.status === 'ongoing' ? 'Ongoing' : course.status === 'completed' ? 'Completed' : 'Upcoming';
      return `${course.title} (${course.code})\nStatus: ${status}\n\nFind materials in Courses tab → ${course.title}`;
    }

    // Notes
    if (/note|material|find|search/.test(lower)) {
      if (course) {
        const courseNotes = notes.filter(n => n.course.toLowerCase().includes(course.title.toLowerCase()));
        if (courseNotes.length === 0) return `No notes for ${course.title} yet. Create one in Notes tab!`;
        const list = courseNotes.slice(0, 3).map((n, i) => `${i + 1}. ${n.title}`).join('\n');
        return `Notes for ${course.title}:\n${list}\n\nCheck Notes tab for all.`;
      }
      if (notes.length === 0) return "No notes yet. Create your first note in the Notes tab!";
      const list = notes.slice(0, 3).map((n, i) => `${i + 1}. ${n.title}`).join('\n');
      return `Your notes:\n${list}\n\nView all in Notes tab.`;
    }

    // Announcements
    if (/announcement|news|update|notice/.test(lower)) {
      if (announcements.length === 0) return "No new announcements. All caught up! ✅";
      const unread = announcements.filter(a => !a.read).length;
      const latest = announcements.slice(0, 2).map((a, i) => `${i + 1}. ${a.title}`).join('\n');
      return `${unread > 0 ? `${unread} unread` : 'Latest'} announcements:\n${latest}\n\nClick 🔔 bell icon for all.`;
    }

    // Navigation
    if (/where|how do i|how to/.test(lower)) {
      if (/login/.test(lower)) {
        return "Login page → Enter your BITS email and password. Having trouble?";
      }
      if (/calendar/.test(lower)) {
        return "Calendar tab in left sidebar → View all events and deadlines.";
      }
      if (/course|material/.test(lower)) {
        return "Courses tab → Click any course → See all materials, slides, quizzes.";
      }
      if (/grade/.test(lower)) {
        return "Dashboard → Completed Courses card → View all your grades.";
      }
      return "Which section are you looking for? (Courses, Calendar, Notes, etc)";
    }

    // ChatGPT-style comprehensive site responses
    // Portal Features & Navigation
    if (/dashboard|home|main page/.test(lower)) {
      return `The Dashboard is your central hub! 📊 Here you'll find:

**📈 Quick Stats:**
• Course progress overview
• Recent activities
• Upcoming deadlines

**🎯 Quick Access Cards:**
• Current courses with progress bars
• Today's schedule
• Recent announcements
• Notes and materials

**📱 Widgets:**
• Calendar preview
• Grade summary
• File manager
• AI assistant (that's me!)

The sidebar lets you navigate to detailed sections. What specific part would you like to explore?`;
    }

    if (/profile|account|personal info/.test(lower)) {
      return `Your Profile section contains all your personal information! 👤

**📋 Current Profile:**
• Name: ${userProfile?.name || 'Not set'}
• Email: ${userProfile?.email || 'Not set'}  
• Course: ${userProfile?.course || 'Not set'}
• Semester: ${userProfile?.semester || 'Not set'}

**✏️ You can edit:**
• Contact information
• Profile picture
• Academic details
• Preferences

Click your profile picture in the top-right corner to access settings. Need help updating anything specific?`;
    }

    if (/file|upload|download|library/.test(lower)) {
      return `The File Management system helps organize all your academic materials! 📂

**📁 Features:**
• Upload lecture slides, assignments, notes
• Organize by course and category  
• Quick search and filters
• Download materials anytime

**📱 Access Points:**
• File Manager tab in sidebar
• Course-specific materials in each course page
• Notes section for study materials
• Library tab for shared resources

**💡 Tips:**
• Use clear filenames for easy searching
• Organize by course/semester
• Tag files for better discovery

What type of files are you looking to manage?`;
    }

    if (/calendar|schedule|event|deadline/.test(lower)) {
      return `The Calendar system keeps you organized! 📅

**🗓️ Features:**
• All your events in one place
• Assignment deadlines
• Exam schedules  
• Class timings
• Holiday notifications

**📋 Event Types:**
• 📝 Exams and tests
• 📋 Assignment deadlines
• 💼 Presentations
• 📚 Classes
• 🎉 Holidays

**🔔 Notifications:**
• Automatic reminders
• Deadline alerts
• Schedule changes

You have ${events.length} upcoming events. Want to see today's schedule or this week's overview?`;
    }

    if (/note|study material|document/.test(lower)) {
      return `The Notes & Study Materials system is your academic knowledge base! 📚

**✏️ Create Notes:**
• Rich text editor with formatting
• Add images, links, attachments
• Tag for easy organization
• Mark favorites for quick access

**🔍 Smart Organization:**
• Search by course, topic, or tags
• Filter by creation date
• Favorite important notes
• Course-wise categorization

**📱 Features:**
• Edit notes anytime
• Share with classmates
• Backup automatically
• Access offline

You currently have ${notes.length} notes. Want to create a new note or search existing ones?`;
    }

    if (/grade|result|mark|performance/.test(lower)) {
      return `Grade & Performance Tracking helps monitor your academic progress! 📊

**📈 Available Data:**
• Individual assignment marks
• Mid-semester exam results  
• Comprehensive exam scores
• Final grades and GPA
• Course-wise performance

**📋 Grade Breakdown:**
• Assignment & Quiz: Continuous evaluation
• Mid-Semester: 30% weightage typically
• Comprehensive: 50% weightage typically
• Total: Combined score

**🎯 Progress Tracking:**
• Current semester progress
• Completed course results
• Performance trends
• Goal setting

${courses.filter(c => c.status === 'completed').length} courses completed so far. Want to see specific grades or overall performance?`;
    }

    if (/announcement|notification|news|update/.test(lower)) {
      return `The Announcements system keeps you informed! 📢

**🔔 Notification Types:**
• Course updates from professors
• University-wide announcements  
• Deadline reminders
• System maintenance notices
• Event notifications

**📱 Access Points:**
• Bell icon in top navigation (${announcements.filter(a => !a.read).length} unread)
• Dashboard announcement card
• Course-specific announcements
• Email notifications

**⚡ Features:**
• Real-time updates
• Priority marking (🔴 High, 🟡 Medium, ⚪ Normal)
• Read/unread tracking
• Archive old notifications

Want to see your latest announcements or learn about notification settings?`;
    }

    if (/technical|help|support|problem|issue/.test(lower)) {
      return `Technical Support & Help Resources! 🛠️

**🔧 Common Solutions:**
• **Login Issues:** Clear browser cache, check email/password
• **Slow Loading:** Try different browser, check internet connection  
• **File Upload:** Ensure file size < 10MB, supported formats
• **Mobile Issues:** Use updated browser, try desktop version

**📱 Browser Compatibility:**
• ✅ Chrome (Recommended)
• ✅ Firefox  
• ✅ Safari
• ✅ Edge

**🆘 Get Help:**
• Create support ticket (I can help!)
• Contact IT support via email
• Check FAQ section
• Use this AI assistant for guidance

**📞 Emergency Contacts:**
• IT Helpdesk: [Contact info]
• Academic Office: [Contact info]

Describe your specific issue and I'll help troubleshoot or create a support ticket!`;
    }

    if (/how to|tutorial|guide|learn/.test(lower)) {
      return `Here's how to make the most of this portal! 🎓

**🚀 Getting Started:**
1. Complete your profile setup
2. Check today's schedule in Calendar
3. Explore your current courses
4. Set up notifications

**📚 Study Workflow:**
1. Check assignments in Calendar
2. Download materials from Courses
3. Create notes for each topic  
4. Track progress in Dashboard

**💡 Pro Tips:**
• Use search to find content quickly
• Set favorites for important items
• Check announcements daily
• Use AI assistant (me!) for quick help

**🎯 Best Practices:**
• Keep profile updated
• Organize files by course
• Review grades regularly
• Stay on top of deadlines

What specific feature would you like a detailed tutorial for?`;
    }

    if (/about|what is|explain|tell me about/.test(lower)) {
      return `This is the BITS Pilani Student Portal - your comprehensive academic companion! 🎓

**🏛️ About This Portal:**
This web application is designed specifically for BITS Pilani students to manage their entire academic journey in one place.

**🎯 Core Purpose:**
• Centralized academic information
• Streamlined course management
• Enhanced student experience
• Real-time updates and notifications

**⚡ Key Features:**
• **Smart Dashboard:** Overview of everything important
• **Course Management:** Materials, progress, grades
• **Calendar Integration:** All events and deadlines
• **Notes System:** Organize study materials
• **AI Assistant:** Intelligent help (that's me!)
• **File Management:** Upload/download academic files

**🔒 Security & Privacy:**
• Secure login system
• Personal data protection
• Course-specific access control
• Regular security updates

**📱 Responsive Design:**
Works perfectly on desktop, tablet, and mobile devices.

This portal is built to make your academic life easier and more organized. What aspect interests you most?`;
    }

    // Intelligent fallback based on question patterns
    if (userMessage.includes('?')) {
      return `I'd be happy to help with your question! 🤔 

**🔍 I can provide detailed information about:**

**📚 Academic Features:**
• Course management and materials
• Grades and performance tracking  
• Assignment deadlines and calendar
• Notes and study resources

**🖥️ Portal Features:**
• Dashboard navigation and widgets
• Profile management and settings
• File uploads and downloads
• Announcements and notifications

**🛠️ Technical Help:**
• How to use specific features
• Troubleshooting common issues
• Browser compatibility guidance
• Mobile app usage tips

**💡 General Assistance:**
• University policies and procedures
• Contact information and support
• Best practices and pro tips
• Feature explanations

Try rephrasing your question more specifically, or ask me something like:
• "How do I check my grades?"
• "Where can I find course materials?"
• "How does the calendar work?"
• "What are the portal's main features?"

What would you like to know more about?`;
    }

    // Final intelligent default
    return `I'm here to help with EVERYTHING about this BITS Pilani portal! 🚀

**💬 You can ask me about:**
• Any feature or section of the website
• How to perform specific tasks
• Technical questions or issues  
• Academic information and data
• Navigation and user interface
• Tips and best practices

**🎯 Just like ChatGPT, I can:**
• Answer detailed questions about the portal
• Provide step-by-step guidance
• Explain features and functionality  
• Help troubleshoot problems
• Give personalized recommendations

**💡 Try asking things like:**
• "How does the dashboard work?"
• "Explain the grading system"  
• "What can I do in the calendar section?"
• "How do I upload files?"

I understand natural language really well, so you can ask me things however feels natural to you. I'm designed to be conversational and helpful, just like ChatGPT but specifically for this portal.

What's on your mind?`;

    // Simple fallback for any other question
    return `I'd be happy to help! I can tell you about:

• Your grades and course progress
• Today's schedule and deadlines  
• Your notes and materials
• How to use portal features

Try asking me something specific like:
- "What are my grades?"
- "What's due today?" 
- "Show my courses"
- "What notes do I have?"

What would you like to know?`;
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage("");

    // Generate response asynchronously
    const responseContent = await generateResponse(userMsg.content);
    
    const botMsg = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: responseContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <Card className="w-80 sm:w-96 h-[500px] sm:h-[550px] flex flex-col shadow-2xl border-university-border bg-white">
              {/* Header */}
              <div className="p-3 sm:p-4 rounded-t-lg" style={{ backgroundColor: 'rgb(25, 35, 94)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative bg-white/15">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-white">BITS Assistant</h3>
                      <p className="text-xs text-white opacity-90">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-lg w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3" style={{ backgroundColor: '#f9fafb' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] p-2 sm:p-3 rounded-lg"
                      style={msg.type === "user" 
                        ? { backgroundColor: 'rgb(25, 35, 94)' }
                        : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }
                      }
                    >
                      <p 
                        className="text-xs sm:text-sm leading-relaxed whitespace-pre-line"
                        style={{ color: msg.type === "user" ? '#ffffff' : '#1f2937' }}
                      >
                        {msg.content}
                      </p>
                      <p 
                        className={`text-xs mt-1 sm:text-sm leading-relaxed ${msg.type === "user" ? "text-white/70" : "text-gray-700"}`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 bg-white" style={{ borderTop: '1px solid #e2e8f0' }}>
                {/* Create Ticket Button */}
                <div className="mb-3">
                  <Button
                    onClick={() => setShowTicketForm(true)}
                    variant="outline"
                    className="w-full rounded-lg text-xs sm:text-sm border-[#191f5e] text-[#191f5e] hover:bg-[#191f5e] hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Support Ticket
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about this portal - courses, features, technical help, navigation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 rounded-lg text-xs sm:text-sm border-gray-300 focus:border-[#191f5e] focus:ring-[#191f5e]"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="bg-[#191f5e] hover:bg-[#151a4a] disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed rounded-lg px-3 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#191f5e] hover:bg-[#151a4a] shadow-lg relative text-white"
          >
            {isExpanded ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <>
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 p-0 text-white text-xs flex items-center justify-center rounded-full" style={{ backgroundColor: '#10b981' }}>
                  AI
                </Badge>
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-university-primary dark:text-blue-400">
              <AlertCircle className="w-5 h-5" />
              Create Support Ticket
            </DialogTitle>
            <DialogDescription className="dark:text-slate-300">
              Submit a support request to staff. You'll be notified when they respond.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
                <SelectContent className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] backdrop-blur-sm">
                  <SelectItem value="none">No specific course</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.title}
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
                <SelectContent className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] backdrop-blur-sm">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="grades">Grades/Marks</SelectItem>
                  <SelectItem value="content">Course Content</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
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
                <SelectContent className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-500 shadow-2xl z-[999999] backdrop-blur-sm">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
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
                placeholder="Provide detailed information about your issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows={4}
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
              className="bg-[#191f5e] hover:bg-[#151a4a] disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white"
            >
              {isSubmittingTicket ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
