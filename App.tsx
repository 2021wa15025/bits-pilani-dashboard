import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Grid, List, X } from "lucide-react";
import { LoginPage } from "./components/LoginPage";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { AdminDashboard } from "./components/AdminDashboard_Enhanced";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { GreetingCard } from "./components/GreetingCard";
import { DashboardStats } from "./components/DashboardStats";
import { CourseCard } from "./components/CourseCard";
import { RecentlyAccessed } from "./components/RecentlyAccessed";
import { AIAssistant } from "./components/AIAssistant";
import { AnnouncementsWidget } from "./components/widgets/AnnouncementsWidget";
import { ProfileEditDialog } from "./components/ProfileEditDialog";
import { AnnouncementsDialog } from "./components/AnnouncementsDialog";
import { SchedulePopup } from "./components/SchedulePopup";
import { SettingsPage } from "./components/SettingsPage";
import { Button } from "./components/ui/button";
import { cn } from "./components/ui/utils";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
// import MainContentAccessibilitySettings from "./components/MainContentAccessibilitySettings";

// Lazy load page components for better performance
const CoursesPage = lazy(() => import("./components/CoursesPage"));
const NotesPage = lazy(() => import("./components/NotesPage"));
const CalendarPage = lazy(() => import("./components/CalendarPage"));
const CourseDetailsPage = lazy(() => import("./components/CourseDetailsPage"));
const CompletedCoursesPage = lazy(() => import("./components/CompletedCoursesPage"));
const RecentActivityPage = lazy(() => import("./components/RecentActivityPage"));
const NoteDetailPage = lazy(() => import("./components/NoteDetailPage"));
const NoteEditPage = lazy(() => import("./components/NoteEditPage"));
const UniversityInfoPage = lazy(() => import("./components/UniversityInfoPage"));

// Import data from separate files
import { coursesData } from "./data/coursesData.ts";
import { eventsData } from "./data/eventsData.ts";
import { sampleNotes, getAnnouncementsData } from "./data/sampleData.ts";
import { projectId, publicAnonKey } from './utils/supabase/info';
import { supabaseDatabase, type UserProfile } from './utils/supabase/database';

import "./utils/errorHandler";

// Import default profile picture
import defaultProfilePicture from './utils/defaultProfile';

function AppContent() {
  // Core app state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<string>("");
  
  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Dialog states
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [showAnnouncementsDialog, setShowAnnouncementsDialog] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  
  // Page navigation states
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const [showNoteEdit, setShowNoteEdit] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [showUniversityInfo, setShowUniversityInfo] = useState(false);
  
  // Data states (TypeScript interfaces to be refined later)
  const [courses, setCourses] = useState(coursesData);
  const [events, setEvents] = useState(eventsData);
  const [announcements, setAnnouncements] = useState(getAnnouncementsData());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [notes, setNotes] = useState(sampleNotes);
  const [lastLoginTime, setLastLoginTime] = useState<string>("");

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load basic session data from localStorage
        const savedLogin = localStorage.getItem("isLoggedIn");
        const savedIsAdmin = localStorage.getItem("isAdmin");
        const savedUserName = localStorage.getItem("userName");
        const savedStudentId = localStorage.getItem("currentStudentId");
        const savedTheme = localStorage.getItem("theme");
        const savedLastLoginTime = localStorage.getItem("lastLoginTime");
        
        if (savedLogin === "true") setIsLoggedIn(true);
        if (savedIsAdmin === "true") setIsAdmin(true);
        if (savedUserName) setUserName(savedUserName);
        if (savedStudentId) setCurrentStudentId(savedStudentId);
        if (savedTheme) setTheme(savedTheme as "light" | "dark");
        if (savedLastLoginTime) setLastLoginTime(savedLastLoginTime);
        
        // If user is logged in, load their data from Supabase
        if (savedLogin === "true" && savedStudentId) {
          try {
            console.log('Loading user data from Supabase for student:', savedStudentId);
            
            // Load user profile from Supabase
            const profile = await supabaseDatabase.getUserProfile(savedStudentId);
            if (profile) {
              setUserProfile(profile);
              console.log('User profile loaded from Supabase');
            }
            
            // Load user notes from Supabase
            const userNotes = await supabaseDatabase.getUserNotes(savedStudentId);
            if (userNotes.length > 0) {
              // Convert Supabase notes to app format
              const formattedNotes = userNotes.map(note => ({
                id: note.id,
                title: note.title,
                content: note.content,
                course: note.course || '',
                category: 'Study Notes', // Default category
                date: note.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                tags: note.tags || '',
                createdAt: note.created_at || new Date().toISOString(),
                lastModified: note.updated_at || new Date().toISOString(),
                favorite: note.favorite || false,
                attachments: [] // Default empty attachments array
              }));
              setNotes(formattedNotes);
              console.log(`Loaded ${userNotes.length} notes from Supabase`);
            }
            
            // Load user events from Supabase
            const userEvents = await supabaseDatabase.getUserEvents(savedStudentId);
            if (userEvents.length > 0) {
              // Convert Supabase events to app format
              const formattedEvents = userEvents.map(event => ({
                id: event.id,
                title: event.title,
                date: event.date,
                time: event.time,
                type: (event.type as "deadline" | "assignment" | "presentation" | "meeting" | "class" | "exam" | "holiday" | "viva" | "lab_assessment") || "class",
                description: event.description || '',
                course: event.course || '',
                location: event.location || ''
              }));
              setEvents([...eventsData, ...formattedEvents] as typeof eventsData); // Merge with default events
              console.log(`Loaded ${userEvents.length} events from Supabase`);
            } else {
              setEvents(eventsData); // Use default events if no user events
            }
            
          } catch (error) {
            console.error('Error loading user data from Supabase:', error);
            // Fall back to localStorage if Supabase fails
            const savedProfile = localStorage.getItem("userProfile");
            const savedNotes = localStorage.getItem("notes");
            const savedEvents = localStorage.getItem("events");
            
            if (savedProfile) {
              try {
                setUserProfile(JSON.parse(savedProfile));
              } catch (e) {
                console.warn("Failed to parse saved profile");
              }
            }
            
            if (savedNotes) {
              try {
                setNotes(JSON.parse(savedNotes));
              } catch (e) {
                console.warn("Failed to parse saved notes");
              }
            }
            
            if (savedEvents) {
              try {
                setEvents(JSON.parse(savedEvents));
              } catch (e) {
                setEvents(eventsData);
              }
            } else {
              setEvents(eventsData);
            }
          }
        } else {
          // If not logged in, use default data
          setEvents(eventsData);
          setNotes(sampleNotes);
        }
        
        // Load recent activity from localStorage (kept local for performance)
        const savedActivity = localStorage.getItem("recentActivity");
        if (savedActivity) {
          try {
            setRecentActivity(JSON.parse(savedActivity));
          } catch (e) {
            console.warn("Failed to parse recent activity");
          }
        }
        
        // Load notifications from localStorage
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
          try {
            setNotifications(JSON.parse(savedNotifications));
          } catch (e) {
            console.warn("Failed to parse notifications");
          }
        }
        
        // Fetch events from backend
        try {
          const eventsResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-917daa5d/events`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`
              }
            }
          );
          
          const eventsData = await eventsResponse.json();
          if (eventsData.events) {
            // Merge admin events with local events
            const adminEvents = eventsData.events;
            setEvents(prev => {
              // Keep user-created events and merge with admin events
              const userEvents = prev.filter((e: any) => !e.createdBy || e.createdBy !== 'admin');
              const mergedEvents = [...userEvents, ...adminEvents];
              localStorage.setItem("events", JSON.stringify(mergedEvents));
              console.log(`✅ Synced events: ${mergedEvents.length} total (${adminEvents.length} from admin)`);
              return mergedEvents;
            });
          }
        } catch (error) {
          console.error("Failed to fetch events from backend:", error);
        }

        // Fetch announcements - try API first, then use localStorage for local development
        let announcementsLoaded = false;
        const savedAnnouncements = localStorage.getItem("announcements");
        
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-917daa5d/announcements`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`
              }
            }
          );
          
          const data = await response.json();
          
          if (data.announcements !== undefined) {
            // Create a set of existing event IDs for quick lookup
            const eventIds = new Set(events.map((event: any) => event.id));
            
            // Filter out orphaned event announcements
            const cleanedAnnouncements = data.announcements.filter((announcement: any) => {
              // If it's an event announcement, check if the event still exists
              if (announcement.id && announcement.id.startsWith('event-announcement-')) {
                const eventId = announcement.id.replace('event-announcement-', '');
                return eventIds.has(eventId);
              }
              // Keep all non-event announcements
              return true;
            });
            
            // Merge with localStorage announcements (for local development)
            let localAnnouncements: any[] = [];
            if (savedAnnouncements) {
              try {
                localAnnouncements = JSON.parse(savedAnnouncements);
              } catch (e) {
                console.warn("Failed to parse saved announcements");
              }
            }
            
            // Combine API announcements with localStorage announcements
            const apiIds = new Set(cleanedAnnouncements.map((ann: any) => ann.id));
            const uniqueLocalAnnouncements = localAnnouncements.filter((ann: any) => !apiIds.has(ann.id));
            const allAnnouncements = [...cleanedAnnouncements, ...uniqueLocalAnnouncements];
            
            // Sort by creation date (newest first)
            allAnnouncements.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            // Preserve read status
            const finalAnnouncements = allAnnouncements.map((ann: any) => ({
              ...ann,
              read: ann.read || false
            }));
            
            setAnnouncements(finalAnnouncements);
            localStorage.setItem("announcements", JSON.stringify(finalAnnouncements));
            
            console.log(`✅ Loaded announcements: ${finalAnnouncements.length} total (${cleanedAnnouncements.length} from API, ${uniqueLocalAnnouncements.length} from localStorage)`);
            announcementsLoaded = true;
          }
        } catch (error) {
          console.warn("API unavailable, using localStorage announcements:", error);
        }
        
        // Fallback to localStorage if API failed
        if (!announcementsLoaded && savedAnnouncements) {
          try {
            const loadedAnnouncements = JSON.parse(savedAnnouncements);
            setAnnouncements(loadedAnnouncements);
            console.log(`📂 Loaded ${loadedAnnouncements.length} announcements from localStorage`);
          } catch (e) {
            console.warn("Failed to parse saved announcements");
            setAnnouncements([]);
          }
        } else if (!announcementsLoaded) {
          setAnnouncements([]);
        }
        
        // Load user profile from localStorage on refresh
        const savedProfile = localStorage.getItem("userProfile");
        if (savedLogin === "true" && savedUserName) {
          if (savedProfile) {
            try {
              const parsedProfile = JSON.parse(savedProfile);
              setUserProfile(parsedProfile);
              setUserName(parsedProfile.name || savedUserName);
              console.log(`Restored session for: ${parsedProfile.name || savedUserName}`);
            } catch (e) {
              console.warn("Failed to parse user profile, creating basic profile");
              const basicProfile: UserProfile = {
                id: savedStudentId || 'temp-' + Date.now(),
                student_id: savedStudentId || 'temp-' + Date.now(),
                name: savedUserName,
                email: savedUserName + "@pilani.bits-pilani.ac.in",
                phone: '',
                course: '',
                semester: '',
                avatar: defaultProfilePicture
              };
              setUserProfile(basicProfile);
              setUserName(savedUserName);
              localStorage.setItem("userProfile", JSON.stringify(basicProfile));
            }
          } else {
            const basicProfile: UserProfile = {
              id: savedStudentId || 'temp-' + Date.now(),
              student_id: savedStudentId || 'temp-' + Date.now(),
              name: savedUserName,
              email: savedUserName + "@pilani.bits-pilani.ac.in",
              phone: '',
              course: '',
              semester: '',
              avatar: defaultProfilePicture
            };
            setUserProfile(basicProfile);
            localStorage.setItem("userProfile", JSON.stringify(basicProfile));
          }
        }
      } catch (error) {
        console.warn("Failed to initialize app:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Apply theme only for student portal (when logged in and not admin)
  useEffect(() => {
    // Remove any existing theme classes
    document.documentElement.classList.remove('dark', 'light');
    // Apply current theme only for student portal
    if (isLoggedIn && !isAdmin) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme, isLoggedIn, isAdmin]);

  // Initialize theme on app load - apply theme for student portal
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.classList.remove('dark', 'light');
      // Apply theme if logged in as student (not admin)
      if (isLoggedIn && !isAdmin) {
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.add('light');
        }
      }
    }
  }, [isLoggedIn, isAdmin]); // Re-run when login state changes

  // Sync userName with profile
  useEffect(() => {
    if (isLoggedIn && userProfile && userProfile.name && userName !== userProfile.name) {
      setUserName(userProfile.name);
    }
  }, [userProfile, isLoggedIn, userName]);

  // Periodic events refresh - sync with backend every 30 seconds
  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;

    const refreshEvents = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-917daa5d/events`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        
        const data = await response.json();
        
        if (data.events !== undefined) {
          // Merge admin events with user-created events
          setEvents(prev => {
            const userEvents = prev.filter((e: any) => !e.createdBy || e.createdBy !== 'admin');
            const adminEvents = data.events || [];
            const mergedEvents = [...userEvents, ...adminEvents];
            
            const hasChanged = JSON.stringify(prev) !== JSON.stringify(mergedEvents);
            if (hasChanged) {
              localStorage.setItem("events", JSON.stringify(mergedEvents));
              console.log(`🔄 Events refreshed: ${mergedEvents.length} total (${adminEvents.length} from admin)`);
              return mergedEvents;
            }
            return prev;
          });
        }
      } catch (error) {
        console.warn("Failed to refresh events:", error);
      }
    };

    // Refresh immediately
    refreshEvents();

    // Then refresh every 30 seconds
    const interval = setInterval(refreshEvents, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn, isAdmin]);

  // Periodic announcement refresh - sync with backend and localStorage every 30 seconds
  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;

    const refreshAnnouncements = async () => {
      try {
        let apiAnnouncements: any[] = [];
        let localAnnouncements: any[] = [];
        
        // Try to get announcements from API
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-917daa5d/announcements`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`
              }
            }
          );
          
          const data = await response.json();
          
          if (data.announcements !== undefined) {
            // Filter out orphaned event announcements
            const eventIds = new Set(events.map((event: any) => event.id));
            apiAnnouncements = data.announcements.filter((announcement: any) => {
              if (announcement.id && announcement.id.startsWith('event-announcement-')) {
                const eventId = announcement.id.replace('event-announcement-', '');
                return eventIds.has(eventId);
              }
              return true;
            });
          }
        } catch (apiError) {
          console.warn('API unavailable during refresh, checking localStorage');
        }
        
        // Always check localStorage for admin-created announcements
        try {
          const storedAnnouncements = localStorage.getItem('announcements');
          if (storedAnnouncements) {
            const parsed = JSON.parse(storedAnnouncements);
            localAnnouncements = Array.isArray(parsed) ? parsed : [];
          }
        } catch (e) {
          console.warn('Failed to parse localStorage announcements during refresh');
        }
        
        // Combine API and local announcements
        const apiIds = new Set(apiAnnouncements.map((ann: any) => ann.id));
        const uniqueLocalAnnouncements = localAnnouncements.filter((ann: any) => !apiIds.has(ann.id));
        const allAnnouncements = [...apiAnnouncements, ...uniqueLocalAnnouncements];
        
        // Sort by creation date (newest first)
        allAnnouncements.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Smart update: preserve read status and only update if there are changes
        setAnnouncements(prev => {
          // Create a map of existing announcements by ID to preserve read status
          const existingMap = new Map(prev.map(ann => [ann.id, ann]));
          
          // Merge new data with existing read status
          const mergedAnnouncements = allAnnouncements.map((newAnn: any) => {
            const existing = existingMap.get(newAnn.id) as any;
            return {
              ...newAnn,
              read: existing?.read || false // Preserve read status or default to false for new announcements
            };
          });
          
          // Check if there are actually changes
          const existingIds = new Set(prev.map(ann => ann.id));
          const newIds = new Set(allAnnouncements.map((ann: any) => ann.id));
          const hasNewAnnouncements = allAnnouncements.some((ann: any) => !existingIds.has(ann.id));
          const hasRemovedAnnouncements = prev.some(ann => !newIds.has(ann.id));
          
          // Only update if there are changes
          if (hasNewAnnouncements || hasRemovedAnnouncements || mergedAnnouncements.length !== prev.length) {
            localStorage.setItem("announcements", JSON.stringify(mergedAnnouncements));
            if (hasNewAnnouncements) {
              const newAnnouncementCount = allAnnouncements.filter((ann: any) => !existingIds.has(ann.id)).length;
              console.log(`🔔 ${newAnnouncementCount} new announcement(s) received`);
            }
            if (hasRemovedAnnouncements) {
              console.log(`🗑️ Some announcements were removed`);
            }
            return mergedAnnouncements;
          }
          
          // Check for content changes in existing announcements
          const hasContentChanges = prev.some(existingAnn => {
            const newAnn = allAnnouncements.find((ann: any) => ann.id === existingAnn.id);
            return newAnn && (
              newAnn.title !== existingAnn.title ||
              newAnn.content !== existingAnn.content ||
              newAnn.priority !== existingAnn.priority ||
              newAnn.category !== existingAnn.category
            );
          });
          
          if (hasContentChanges) {
            localStorage.setItem("announcements", JSON.stringify(mergedAnnouncements));
            console.log(`📝 Announcement content updated`);
            return mergedAnnouncements;
          }
          
          // No changes detected, return previous state
          return prev;
        });
        
      } catch (error) {
        console.warn("Failed to refresh announcements:", error);
      }
    };

    // Refresh immediately
    refreshAnnouncements();

    // Then refresh every 30 seconds
    const interval = setInterval(refreshAnnouncements, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn, isAdmin, events]);

  // Handlers
  const handleLogin = useCallback(async (name: string, password: string, studentData?: any) => {
    if (!studentData) {
      console.error("No student data provided for login");
      return;
    }
    
    console.log(`Logging in as: ${studentData.name} (${studentData.id})`);
    
    const studentId = studentData.id;
    setCurrentStudentId(studentId);
    setUserName(studentData.name);
    setIsLoggedIn(true);
    
    // Store minimal data in localStorage for session persistence
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentStudentId", studentId);
    localStorage.setItem("userName", studentData.name);
    
    try {
      // First, try to load profile from localStorage (more reliable)
      const profileKey = `userProfile_${studentId}`;
      const savedProfile = localStorage.getItem(profileKey);
      
      if (savedProfile) {
        try {
          const localProfile = JSON.parse(savedProfile);
          setUserProfile(localProfile);
          console.log('✅ Profile loaded from localStorage:', localProfile);
          
          // Try to sync with Supabase in the background
          setTimeout(async () => {
            try {
              const supabaseProfile = await supabaseDatabase.getUserProfile(studentId);
              if (supabaseProfile && supabaseProfile.avatar !== localProfile.avatar) {
                console.log('🔄 Syncing profile from Supabase');
                setUserProfile(supabaseProfile);
                localStorage.setItem(profileKey, JSON.stringify(supabaseProfile));
              }
            } catch (error) {
              console.warn('Background Supabase sync failed:', error);
            }
          }, 1000);
          
          return; // Exit early if localStorage profile found
        } catch (error) {
          console.warn('Failed to parse localStorage profile, trying Supabase');
        }
      }
      
      // Fallback: Check if user profile exists in Supabase
      console.log("🔍 Checking for existing profile in Supabase for student:", studentId);
      let profile = await supabaseDatabase.getUserProfile(studentId);
      
      if (!profile) {
        console.log("👤 No existing profile found, creating new one...");
        // Create new profile in Supabase
        const newProfile: Omit<UserProfile, 'created_at' | 'updated_at'> = {
          id: studentId,
          student_id: studentId,
          name: studentData.name,
          email: studentData.email || '',
          phone: studentData.phone || '',
          course: studentData.course || '',
          semester: studentData.semester || '',
          avatar: studentData.avatar || defaultProfilePicture
        };
        
        profile = await supabaseDatabase.createUserProfile(newProfile);
        console.log('✅ Created new user profile in Supabase:', profile);
        
        // Save to localStorage as well
        if (profile) {
          localStorage.setItem(profileKey, JSON.stringify(profile));
        }
      } else {
        console.log("👤 Found existing profile in Supabase:", profile);
        // Save to localStorage for faster future access
        localStorage.setItem(profileKey, JSON.stringify(profile));
        
        // Update existing profile with latest data
        const updates = {
          name: studentData.name,
          email: studentData.email || profile.email,
          phone: studentData.phone || profile.phone,
          course: studentData.course || profile.course,
          semester: studentData.semester || profile.semester
        };
        
        await supabaseDatabase.updateUserProfile(studentId, updates);
        console.log('🔄 Updated existing user profile in Supabase');
        
        // Fetch updated profile
        profile = await supabaseDatabase.getUserProfile(studentId);
        console.log('📄 Refreshed profile data:', profile);
        
        if (profile) {
          localStorage.setItem(profileKey, JSON.stringify(profile));
        }
      }
      
      if (profile) {
        setUserProfile(profile);
        console.log('✅ User profile loaded from Supabase:', profile);
      }
      
    } catch (error) {
      console.error('❌ Error managing user profile in Supabase:', error);
      
      // Fallback: Try localStorage again
      const profileKey = `userProfile_${studentId}`;
      const savedProfile = localStorage.getItem(profileKey);
      
      if (savedProfile) {
        try {
          const localProfile = JSON.parse(savedProfile);
          setUserProfile(localProfile);
          console.log('✅ Fallback: Profile loaded from localStorage:', localProfile);
          return;
        } catch (parseError) {
          console.warn('Failed to parse localStorage profile');
        }
      }
      
      // Final fallback: Create basic profile
      const fallbackProfile: UserProfile = {
        id: studentId,
        student_id: studentId,
        name: studentData.name,
        email: studentData.email || '',
        phone: studentData.phone || '',
        course: studentData.course || '',
        semester: studentData.semester || '',
        avatar: studentData.avatar || defaultProfilePicture
      };
      
      setUserProfile(fallbackProfile);
      localStorage.setItem(profileKey, JSON.stringify(fallbackProfile));
      console.log('🔧 Created fallback profile:', fallbackProfile);
    }

    // Immediately fetch courses after login
    try {
      const coursesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-917daa5d/courses`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (coursesResponse.ok) {
        const backendData = await coursesResponse.json();
        if (backendData.courses && backendData.courses.length > 0) {
          // Merge backend courses with hardcoded courses
          const backendCourseIds = new Set(backendData.courses.map((c: any) => c.id));
          const hardcodedCoursesFiltered = coursesData.filter((c: any) => !backendCourseIds.has(c.id));
          const allCourses = [...backendData.courses, ...hardcodedCoursesFiltered];
          
          setCourses(allCourses);
          console.log(`✅ Student logged in - Loaded ${allCourses.length} courses (${backendData.courses.length} from backend, ${hardcodedCoursesFiltered.length} hardcoded)`);
        } else {
          console.log('Backend empty, using hardcoded courses');
        }
      }
    } catch (error: any) {
      console.debug("Could not fetch courses from backend:", error.message);
    }
  }, []);

  const handleAdminLogin = useCallback((username: string) => {
    const loginTime = new Date().toISOString();
    setIsLoggedIn(true);
    setIsAdmin(true);
    setUserName(username);
    setLastLoginTime(loginTime);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("userName", username);
    localStorage.setItem("lastLoginTime", loginTime);
    
    // Remove dark theme for admin login
    document.documentElement.classList.remove('dark');
  }, []);

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName("");
    setUserProfile(null);
    setCurrentStudentId("");
    setActiveTab("dashboard");
    setShowAdminLogin(false);
    
    // Clear all auth-related localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    localStorage.removeItem("currentStudentId");
    localStorage.removeItem("userProfile");
    
    // Remove dark theme on logout
    document.documentElement.classList.remove('dark');
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme]);

  const trackActivity = useCallback((item: any) => {
    const activityItem = {
      ...item,
      lastAccessed: new Date().toISOString(),
      timestamp: Date.now()
    };

    setRecentActivity(prev => {
      const filtered = prev.filter((existing: any) => existing.id !== item.id);
      const updated = [activityItem, ...filtered].slice(0, 10);
      localStorage.setItem("recentActivity", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle library tab click with redirect
  const handleTabChange = useCallback((tab: string) => {
    console.log("Tab clicked:", tab);
    console.log("Current activeTab:", activeTab);
    if (tab === "library") {
      // Redirect to OpenAthens E-library
      window.open("https://my.openathens.net/?passiveLogin=false", "_blank");
      return;
    }
    setActiveTab(tab);
    console.log("Setting activeTab to:", tab);
  }, [activeTab]);

  const handleCourseClick = useCallback((course: any) => {
    trackActivity({
      id: `course-${course.id}`,
      title: course.title,
      type: 'course',
      course: course.code,
      icon: 'BookOpen'
    });
    setSelectedCourse(course);
    setShowCourseDetails(true);
  }, [trackActivity]);

  const handleNoteClick = useCallback((note: any) => {
    trackActivity({
      id: `note-${note.id}`,
      title: note.title,
      type: 'note',
      course: note.course,
      icon: 'FileText'
    });
    setSelectedNote(note);
    setShowNoteDetail(true);
  }, [trackActivity]);

  const handleSearchResultClick = useCallback((result: any) => {
    switch (result.type) {
      case 'course':
        handleCourseClick(result.data);
        break;
      case 'note':
        handleNoteClick(result.data);
        break;
      case 'event':
        trackActivity({
          id: `event-${result.data.id}`,
          title: result.data.title,
          type: 'calendar',
          icon: 'Calendar'
        });
        setActiveTab('calendar');
        break;
      case 'library':
        trackActivity({
          id: `library-${result.data.id}`,
          title: result.data.title,
          type: 'library',
          course: result.data.course,
          icon: 'Download'
        });
        // Redirect to OpenAthens E-library instead of setting active tab
        window.open("https://my.openathens.net/?passiveLogin=false", "_blank");
        break;
    }
  }, [handleCourseClick, handleNoteClick, trackActivity]);

  const handleNotificationClick = (id: string) => {
    // Check if it's an announcement
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      trackActivity({
        id: `announcement-${id}`,
        title: announcement.title,
        type: 'announcement',
        icon: 'Bell'
      });
      const updatedAnnouncements = announcements.map(ann => 
        ann.id === id ? { ...ann, read: true } : ann
      );
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
    }
    
    // Check if it's a notification
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      trackActivity({
        id: `notification-${id}`,
        title: notification.title || notification.message,
        type: 'notification',
        icon: 'Bell'
      });
      const updatedNotifications = notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      setNotifications(updatedNotifications);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    }
  };

  const handleNotesChange = useCallback((updatedNotes: any[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, []);

  const handleNoteSave = useCallback((updatedNote: any) => {
    console.log(`💾 Saving note: ${updatedNote.title}`, updatedNote);
    
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      localStorage.setItem("notes", JSON.stringify(updated));
      console.log(`✅ Note saved to localStorage with ${updatedNote.attachments?.length || 0} attachments`);
      return updated;
    });
    
    // Update selectedNote if it's the same note
    if (selectedNote && selectedNote.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  }, [selectedNote]);

  const handleNoteToggleFavorite = useCallback((noteId: string) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === noteId ? { ...note, favorite: !note.favorite } : note
      );
      localStorage.setItem("notes", JSON.stringify(updated));
      return updated;
    });
    
    // Update selectedNote if it's the same note
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(prev => prev ? { ...prev, favorite: !prev.favorite } : prev);
    }
  }, [selectedNote]);

  const handleEventsChange = useCallback((updatedEvents: any[]) => {
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  }, []);

  const handleNotificationAdd = useCallback((notification: any) => {
    const newNotification = {
      ...notification,
      id: notification.id || `notif-${Date.now()}`,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });

    // Also add to announcements if it's an event
    if (notification.type === 'event' && notification.eventData) {
      const eventDate = new Date(notification.eventData.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const eventAnnouncement = {
        id: `event-announcement-${notification.eventData.id}`,
        title: `New Event: ${notification.eventData.title}`,
        content: `${notification.eventData.title} scheduled for ${formattedDate}${notification.eventData.time ? ' at ' + notification.eventData.time : ''}${notification.eventData.location ? ' - ' + notification.eventData.location : ''}`,
        time: "just now",
        priority: 'medium' as const,
        category: notification.eventData.type === 'exam' ? 'Academic' : 
                  notification.eventData.type === 'assignment' || notification.eventData.type === 'deadline' ? 'Academic' :
                  notification.eventData.type === 'class' ? 'Academic' :
                  'Events',
        read: false
      };
      
      setAnnouncements(prev => {
        const updated = [eventAnnouncement, ...prev];
        localStorage.setItem("announcements", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const handleAnnouncementRemove = useCallback((announcementId: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(ann => ann.id !== announcementId);
      localStorage.setItem("announcements", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-university-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading BITS Pilani Dashboard...</p>
        </div>
      </div>
    );
  }

  // If logged in but no profile, wait for initialization or create basic profile
  if (isLoggedIn && !isAdmin && !userProfile) {
    // Give time for profile to load from localStorage during initialization
    if (!isInitialized) {
      return <LoadingSpinner />;
    }
    
    // Create a basic profile if none exists after initialization
    console.warn("No profile found after initialization, creating basic profile");
    const basicProfile: UserProfile = {
      id: currentStudentId || 'temp-' + Date.now(),
      student_id: currentStudentId || 'temp-' + Date.now(),
      name: userName || "Student",
      email: (userName || "student") + "@pilani.bits-pilani.ac.in", 
      phone: '',
      course: '',
      semester: '',
      avatar: defaultProfilePicture
    };
    setUserProfile(basicProfile);
    localStorage.setItem("userProfile", JSON.stringify(basicProfile));
    return <LoadingSpinner />;
  }

  // Show admin dashboard if logged in as admin
  if (isLoggedIn && isAdmin) {
    return <AdminDashboard onLogout={handleLogout} adminUsername={userName} />;
  }

  // Show admin login if selected
  if (!isLoggedIn && showAdminLogin) {
    return (
      <AdminLoginPage
        onLogin={handleAdminLogin}
        onSwitchToStudent={() => setShowAdminLogin(false)}
      />
    );
  }

  // Show student login if not logged in
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToAdmin={() => setShowAdminLogin(true)}
      />
    );
  }

  // Shared header props
  const headerProps = {
    onLogout: handleLogout,
    announcements,
    notifications,
    onNotificationClick: handleNotificationClick,
    onThemeToggle: handleThemeToggle,
    theme,
    onProfileEdit: () => setIsProfileDialogOpen(true),
    onProfileUpdate: async (updatedProfile: any) => {
      console.log("🔄 onProfileUpdate called with:", updatedProfile);
      console.log("🔍 Current student ID:", currentStudentId);
      
      // Always save to localStorage first (primary storage)
      const profileKey = `userProfile_${currentStudentId}`;
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      console.log("💾 Profile saved to localStorage:", profileKey);
      
      setUserProfile(updatedProfile);
      console.log("Profile updated in local state:", updatedProfile);
      
      // Try to save to Supabase database (secondary/backup storage)
      if (currentStudentId) {
        try {
          console.log("💾 Attempting to save to Supabase...");
          const success = await supabaseDatabase.updateUserProfile(currentStudentId, {
            name: updatedProfile.name,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            course: updatedProfile.course,
            semester: updatedProfile.semester,
            avatar: updatedProfile.avatar
          });
          
          if (success) {
            console.log("✅ Profile saved to Supabase successfully");
          } else {
            console.warn("⚠️ Failed to save profile to Supabase, using localStorage");
          }
        } catch (error) {
          console.error("Error saving profile to Supabase:", error);
          // Fallback to localStorage
          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        }
      } else {
        // Fallback to localStorage if no student ID
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      }
    },
    userProfile: userProfile || { name: "Guest", id: "", student_id: "", email: "", phone: "", course: "", semester: "", avatar: defaultProfilePicture },
    courses,
    notes: notes,
    events,
    libraryItems: [],
    onSearchResultClick: handleSearchResultClick,
    onMobileMenuToggle: () => setIsMobileSidebarOpen(!isMobileSidebarOpen),
    isMobileMenuOpen: isMobileSidebarOpen,
    onLogoClick: () => {
      setActiveTab("dashboard");
      // Close any open dialogs/pages
      setShowCourseDetails(false);
      setShowNoteDetail(false);
      setShowNoteEdit(false);
      setShowCompletedCourses(false);
      setShowRecentActivity(false);
      setShowUniversityInfo(false);
      setSelectedCourse(null);
      setSelectedNote(null);
      setEditingNote(null);
    },
    lastLoginTime
  };

  // Show special pages
  if (showUniversityInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<LoadingSpinner message="Loading university info..." />}>
          <UniversityInfoPage 
            onBack={() => setShowUniversityInfo(false)}
          />
        </Suspense>
      </div>
    );
  }

  if (showNoteEdit && editingNote) {
    return (
      <div className="min-h-screen bg-background">
        <Header {...headerProps} />
        <Suspense fallback={<LoadingSpinner message="Loading note editor..." />}>
          <NoteEditPage 
            note={editingNote}
            courses={courses}
            onBack={() => {
              setShowNoteEdit(false);
              setEditingNote(null);
              if (selectedNote) setShowNoteDetail(true);
            }}
            onSave={(updatedNote) => {
              handleNoteSave(updatedNote);
              setShowNoteEdit(false);
              setEditingNote(null);
              setShowNoteDetail(true);
              trackActivity({
                id: `note-edit-${updatedNote.id}`,
                title: `Edited: ${updatedNote.title}`,
                type: 'note',
                course: updatedNote.course,
                icon: 'Edit'
              });
            }}
            onCancel={() => {
              setShowNoteEdit(false);
              setEditingNote(null);
              if (selectedNote) setShowNoteDetail(true);
            }}
          />
        </Suspense>
      </div>
    );
  }

  if (showNoteDetail && selectedNote) {
    return (
      <div className="min-h-screen bg-background">
        <Header {...headerProps} />
          <Suspense fallback={<LoadingSpinner message="Loading note details..." />}>
            <NoteDetailPage 
              note={selectedNote} 
              onBack={() => {
                setShowNoteDetail(false);
                setSelectedNote(null);
              }}
              onEdit={(note) => {
                setEditingNote(note);
                setShowNoteDetail(false);
                setShowNoteEdit(true);
              }}
              onToggleFavorite={handleNoteToggleFavorite}
            />
          </Suspense>
        
      </div>
    );
  }

  if (showCourseDetails && selectedCourse) {
    return (
      <div className="min-h-screen bg-background">
        <Header {...headerProps} />
          <Suspense fallback={<LoadingSpinner message="Loading course details..." />}>
            <CourseDetailsPage 
              course={selectedCourse} 
              onBack={() => {
                setShowCourseDetails(false);
                setSelectedCourse(null);
              }}
            />
          </Suspense>
        
      </div>
    );
  }

  if (showCompletedCourses) {
    return (
      <div className="min-h-screen bg-background">
        <Header {...headerProps} />
        <div className="hidden lg:block">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        </div>
        <main className={cn(
          "university-content w-full min-w-0 bg-background p-3 sm:p-6",
          isSidebarCollapsed && "sidebar-collapsed"
        )}>
            <Suspense fallback={<LoadingSpinner message="Loading completed courses..." />}>
              <CompletedCoursesPage
                courses={courses}
                onBack={() => setShowCompletedCourses(false)}
              />
            </Suspense>
        </main>
      </div>
    );
  }

  if (showRecentActivity) {
    return (
      <div className="min-h-screen bg-background">
        <Header {...headerProps} />
        <div className="hidden lg:block">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        </div>
        <main className={cn(
          "university-content w-full min-w-0 bg-background p-3 sm:p-6",
          isSidebarCollapsed && "sidebar-collapsed"
        )}>
            <Suspense fallback={<LoadingSpinner message="Loading recent activity..." />}>
              <RecentActivityPage 
                recentActivity={recentActivity}
                onBack={() => setShowRecentActivity(false)}
              />
            </Suspense>
        </main>
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" 
               onClick={() => setIsMobileSidebarOpen(false)} />
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              handleTabChange(tab);
              setIsMobileSidebarOpen(false);
            }}
            isCollapsed={false}
            setIsCollapsed={() => {}}
            isMobile={true}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        </>
      )}
      
      <main className={cn(
        "university-content w-full min-w-0 bg-background p-3 sm:p-6",
        isSidebarCollapsed && "sidebar-collapsed"
      )}>
        <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <>
                <div className="mb-8">
                  <GreetingCard 
                    userName={userName || "Guest"} 
                    onViewSchedule={() => setShowSchedulePopup(true)}
                  />
                </div>

                <div className="mb-8">
                  <AnnouncementsWidget 
                    onViewAll={() => setShowAnnouncementsDialog(true)} 
                    announcements={announcements}
                  />
                </div>

                <DashboardStats 
                  courses={courses} 
                  onCompletedCoursesClick={() => setShowCompletedCourses(true)}
                  onCoursesTabClick={() => setActiveTab("courses")}
                  onCurrentSemesterClick={() => setActiveTab("courses")}
                />

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-[#0F172A] dark:text-white">Course Overview</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={viewMode === "grid" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-lg"
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-lg"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className={cn(
                      "gap-4 sm:gap-6",
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
                        : "space-y-4"
                    )}>
                      {courses.filter(c => c.status === "ongoing").slice(0, 4).map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          viewMode={viewMode}
                          onCourseClick={handleCourseClick}
                        />
                      ))}
                    </div>
                  </div>

                  <RecentlyAccessed 
                    recentActivity={recentActivity} 
                    onViewAllClick={() => setShowRecentActivity(true)}
                  />
                </div>
              </>
            )}

            {activeTab === "courses" && (
              <Suspense fallback={<LoadingSpinner message="Loading courses..." />}>
                <CoursesPage courses={courses} onCourseClick={handleCourseClick} />
              </Suspense>
            )}

            {activeTab === "notes" && (
              <Suspense fallback={<LoadingSpinner message="Loading notes..." />}>
                <NotesPage 
                  courses={courses} 
                  notes={notes}
                  onNoteClick={handleNoteClick}
                  onNotesChange={handleNotesChange}
                />
              </Suspense>
            )}

            {activeTab === "calendar" && (
              <Suspense fallback={<LoadingSpinner message="Loading calendar..." />}>
                <CalendarPage 
                  events={events} 
                  onEventsChange={handleEventsChange} 
                  courses={courses}
                  onEventClick={(event) => trackActivity({
                    id: `event-${event.id}`,
                    title: event.title,
                    type: 'calendar',
                    icon: 'Calendar'
                  })}
                  onNotificationAdd={handleNotificationAdd}
                  onAnnouncementRemove={handleAnnouncementRemove}
                />
              </Suspense>
            )}

            {activeTab === "settings" && (
              <SettingsPage 
                userProfile={userProfile}
                theme={theme}
                onThemeToggle={handleThemeToggle}
                onProfileUpdate={(updatedProfile) => {
                  setUserProfile(updatedProfile);
                  localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                }}
              />
            )}

            {!["dashboard", "courses", "notes", "calendar", "library", "settings"].includes(activeTab) && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">
                    {activeTab === "elearn" ? "E-learn Portal" : "Dashboard"}
                  </h2>
                  <p className="text-[#475569] dark:text-gray-300">This section is coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </main>

      {/* AI Assistant */}
      <AIAssistant 
        events={events} 
        courses={courses}
        userName={userName || "Guest"}
        userProfile={userProfile || { name: userName || "Guest", id: "", student_id: userName || "", email: "", phone: "", course: "", semester: "", avatar: defaultProfilePicture }}
        announcements={announcements}
        notes={notes}
      />
      
      {/* Dialogs */}
      {userProfile && (
        <ProfileEditDialog
          isOpen={isProfileDialogOpen}
          onClose={() => setIsProfileDialogOpen(false)}
          userProfile={userProfile}
          onSave={async (updatedProfile) => {
            console.log("🔄 ProfileEditDialog onSave called with:", updatedProfile);
            setUserName(updatedProfile.name);
            setIsProfileDialogOpen(false);
            
            // Use the existing onProfileUpdate function that saves to Supabase
            console.log("🔄 Calling headerProps.onProfileUpdate...");
            await headerProps.onProfileUpdate(updatedProfile);
            console.log("✅ Profile update completed");
          }}
        />
      )}
      
      <AnnouncementsDialog
        isOpen={showAnnouncementsDialog}
        onClose={() => setShowAnnouncementsDialog(false)}
        announcements={announcements}
      />

      <SchedulePopup
        isOpen={showSchedulePopup}
        onClose={() => setShowSchedulePopup(false)}
        events={events}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}