import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  // Current navigation state
  activeTab: string;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  
  // Modal/page states
  showNoteDetail: boolean;
  showNoteEdit: boolean;
  showCourseDetails: boolean;
  showCompletedCourses: boolean;
  showRecentActivity: boolean;
  showUniversityInfo: boolean;
  showProfileEdit: boolean;
  showAnnouncements: boolean;
  showSchedulePopup: boolean;
  
  // Selected items
  selectedNote: any;
  editingNote: any;
  selectedCourse: any;
  selectedEvent: any;
  
  // Navigation actions
  setActiveTab: (tab: string) => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Modal/page actions
  setShowNoteDetail: (show: boolean) => void;
  setShowNoteEdit: (show: boolean) => void;
  setShowCourseDetails: (show: boolean) => void;
  setShowCompletedCourses: (show: boolean) => void;
  setShowRecentActivity: (show: boolean) => void;
  setShowUniversityInfo: (show: boolean) => void;
  setShowProfileEdit: (show: boolean) => void;
  setShowAnnouncements: (show: boolean) => void;
  setShowSchedulePopup: (show: boolean) => void;
  
  // Selection actions
  setSelectedNote: (note: any) => void;
  setEditingNote: (note: any) => void;
  setSelectedCourse: (course: any) => void;
  setSelectedEvent: (event: any) => void;
  
  // Navigation helpers
  navigateToNoteDetail: (note: any) => void;
  navigateToNoteEdit: (note: any) => void;
  navigateToCourseDetails: (course: any) => void;
  navigateBack: () => void;
  closeAllModals: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal/page states
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const [showNoteEdit, setShowNoteEdit] = useState(false);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [showUniversityInfo, setShowUniversityInfo] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  
  // Selected items
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Navigation helpers
  const navigateToNoteDetail = (note: any) => {
    setSelectedNote(note);
    setShowNoteDetail(true);
    closeOtherModals(['noteDetail']);
  };

  const navigateToNoteEdit = (note: any) => {
    setEditingNote(note);
    setShowNoteEdit(true);
    closeOtherModals(['noteEdit']);
  };

  const navigateToCourseDetails = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
    closeOtherModals(['courseDetails']);
  };

  const navigateBack = () => {
    // Close all modals and return to dashboard or last tab
    closeAllModals();
    setActiveTab("dashboard");
  };

  const closeOtherModals = (except: string[] = []) => {
    if (!except.includes('noteDetail')) setShowNoteDetail(false);
    if (!except.includes('noteEdit')) setShowNoteEdit(false);
    if (!except.includes('courseDetails')) setShowCourseDetails(false);
    if (!except.includes('completedCourses')) setShowCompletedCourses(false);
    if (!except.includes('recentActivity')) setShowRecentActivity(false);
    if (!except.includes('universityInfo')) setShowUniversityInfo(false);
    if (!except.includes('profileEdit')) setShowProfileEdit(false);
    if (!except.includes('announcements')) setShowAnnouncements(false);
    if (!except.includes('schedulePopup')) setShowSchedulePopup(false);
  };

  const closeAllModals = () => {
    setShowNoteDetail(false);
    setShowNoteEdit(false);
    setShowCourseDetails(false);
    setShowCompletedCourses(false);
    setShowRecentActivity(false);
    setShowUniversityInfo(false);
    setShowProfileEdit(false);
    setShowAnnouncements(false);
    setShowSchedulePopup(false);
    setSelectedNote(null);
    setEditingNote(null);
    setSelectedCourse(null);
    setSelectedEvent(null);
  };

  const value: NavigationContextType = {
    // Current navigation state
    activeTab,
    isSidebarCollapsed,
    isMobileMenuOpen,
    
    // Modal/page states
    showNoteDetail,
    showNoteEdit,
    showCourseDetails,
    showCompletedCourses,
    showRecentActivity,
    showUniversityInfo,
    showProfileEdit,
    showAnnouncements,
    showSchedulePopup,
    
    // Selected items
    selectedNote,
    editingNote,
    selectedCourse,
    selectedEvent,
    
    // Navigation actions
    setActiveTab,
    setIsSidebarCollapsed,
    setIsMobileMenuOpen,
    
    // Modal/page actions
    setShowNoteDetail,
    setShowNoteEdit,
    setShowCourseDetails,
    setShowCompletedCourses,
    setShowRecentActivity,
    setShowUniversityInfo,
    setShowProfileEdit,
    setShowAnnouncements,
    setShowSchedulePopup,
    
    // Selection actions
    setSelectedNote,
    setEditingNote,
    setSelectedCourse,
    setSelectedEvent,
    
    // Navigation helpers
    navigateToNoteDetail,
    navigateToNoteEdit,
    navigateToCourseDetails,
    navigateBack,
    closeAllModals,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}