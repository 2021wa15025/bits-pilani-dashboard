import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { coursesData } from '../data/coursesData';
import { eventsData } from '../data/eventsData';
import { sampleNotes } from '../data/sampleData';

interface DataContextType {
  // Data states
  courses: any[];
  events: any[];
  notes: any[];
  notifications: any[];
  recentActivity: any[];
  announcements: any[];
  
  // Setters
  setCourses: (courses: any[]) => void;
  setEvents: (events: any[]) => void;
  setNotes: (notes: any[]) => void;
  setNotifications: (notifications: any[]) => void;
  setRecentActivity: (activity: any[]) => void;
  setAnnouncements: (announcements: any[]) => void;
  
  // Data operations
  addNote: (note: any) => void;
  updateNote: (note: any) => void;
  deleteNote: (noteId: string) => void;
  toggleNoteFavorite: (noteId: string) => void;
  
  addEvent: (event: any) => void;
  updateEvent: (event: any) => void;
  deleteEvent: (eventId: string) => void;
  
  addNotification: (notification: any) => void;
  removeNotification: (notificationId: string) => void;
  
  trackActivity: (activity: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Data states
  const [courses, setCourses] = useState(coursesData);
  const [events, setEvents] = useState(eventsData);
  const [notes, setNotes] = useState(sampleNotes);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load saved notes
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }

        // Load saved events
        const savedEvents = localStorage.getItem("events");
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        } else {
          setEvents(eventsData);
        }

        // Load recent activity
        const savedActivity = localStorage.getItem("recentActivity");
        if (savedActivity) {
          setRecentActivity(JSON.parse(savedActivity));
        }

        // Load notifications
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    initializeData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("recentActivity", JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Note operations
  const addNote = (note: any) => {
    const newNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    
    // Track activity
    trackActivity({
      id: `note-create-${newNote.id}`,
      title: `Created: ${newNote.title}`,
      type: 'note',
      course: newNote.course,
      icon: 'FileText',
      lastAccessed: new Date().toISOString(),
      timestamp: Date.now(),
    });
  };

  const updateNote = (updatedNote: any) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, lastModified: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const toggleNoteFavorite = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, favorite: !note.favorite } : note
    ));
  };

  // Event operations
  const addEvent = (event: any) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: any) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Notification operations
  const addNotification = (notification: any) => {
    const newNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Activity tracking
  const trackActivity = (activity: any) => {
    const newActivity = {
      ...activity,
      lastAccessed: new Date().toISOString(),
      timestamp: Date.now(),
    };
    
    setRecentActivity(prev => {
      const filtered = prev.filter(item => item.id !== activity.id);
      return [newActivity, ...filtered].slice(0, 10); // Keep only last 10
    });
  };

  const value: DataContextType = {
    // Data states
    courses,
    events,
    notes,
    notifications,
    recentActivity,
    announcements,
    
    // Setters
    setCourses,
    setEvents,
    setNotes,
    setNotifications,
    setRecentActivity,
    setAnnouncements,
    
    // Operations
    addNote,
    updateNote,
    deleteNote,
    toggleNoteFavorite,
    addEvent,
    updateEvent,
    deleteEvent,
    addNotification,
    removeNotification,
    trackActivity,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}