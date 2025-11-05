// Core entity interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  studentId?: string;
  department?: string;
  semester?: number;
  profilePicture?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  courses: boolean;
  assignments: boolean;
  events: boolean;
}

// Course related interfaces (matching existing data structure)
export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  semester: number; // matching existing data
  status: 'completed' | 'ongoing' | 'upcoming'; // matching existing data
  grades?: {
    assignmentQuiz: number;
    midSemester: number;
    comprehensive: number;
    total: number;
    finalGrade: string;
  };
  progress?: number;
  // Optional fields for future expansion
  credits?: number;
  year?: number;
  description?: string;
  schedule?: CourseSchedule[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
  materials?: CourseMaterial[];
}

export interface CourseSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  maxPoints: number;
  earnedPoints?: number;
  submissionDate?: string;
  feedback?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  duration: number; // in minutes
  totalQuestions: number;
  maxPoints: number;
  attempts: number;
  status: 'upcoming' | 'active' | 'completed' | 'missed';
  score?: number;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'slides' | 'document' | 'link';
  url: string;
  uploadDate: string;
  size?: number;
  description?: string;
}

export interface CourseProgress {
  completedLectures: number;
  totalLectures: number;
  completedAssignments: number;
  totalAssignments: number;
  currentGrade: number;
  attendance: number; // percentage
}

// Notes interfaces (matching existing data structure)
export interface Note {
  id: string;
  title: string;
  content: string;
  course: string;
  category: string;
  date: string;
  tags: string; // existing data uses string instead of array
  createdAt: string;
  lastModified: string; // existing field name
  favorite: boolean; // existing field name
  attachments: NoteAttachment[];
  // Optional fields for future expansion
  courseId?: string;
  updatedAt?: string;
  isPrivate?: boolean;
}

export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Calendar and Events interfaces (matching existing data structure)
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string; // existing field name
  type: 'assignment' | 'quiz' | 'exam' | 'lecture' | 'personal' | 'holiday' | 'class' | 'deadline';
  description?: string;
  course?: string;
  location?: string;
  // Optional fields for future expansion
  startTime?: string;
  endTime?: string;
  courseId?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  reminders?: EventReminder[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
  daysOfWeek?: string[];
}

export interface EventReminder {
  id: string;
  timeBeforeEvent: number; // in minutes
  method: 'notification' | 'email';
}

// Activity tracking interfaces (matching existing data structure)
export interface RecentActivity {
  id: string;
  title: string;
  type: 'course' | 'note' | 'library' | 'announcement' | 'calendar';
  course?: string;
  icon?: string;
  lastAccessed: string; // existing field name
  timestamp: number; // existing field name is number, not string
  description?: string;
}

// Alias for backward compatibility
export type RecentActivityItem = RecentActivity;

// Notification interfaces (matching existing data structure)
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string; // existing field name
  read: boolean; // existing field name
  type?: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  actionLabel?: string;
}

// Announcement interfaces
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'urgent';
  publishedDate: string;
  expiryDate?: string;
  author: string;
  isActive: boolean;
  attachments?: AnnouncementAttachment[];
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

// Component prop interfaces
// HeaderProps is defined in Header.tsx component - we'll use that instead

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

// Page component prop interfaces
export interface CoursesPageProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export interface NotesPageProps {
  courses: Course[];
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onNotesChange: (notes: Note[]) => void;
}

export interface CalendarPageProps {
  events: CalendarEvent[];
  onEventsChange: (events: CalendarEvent[]) => void;
  courses: Course[];
  onEventClick: (event: CalendarEvent) => void;
  onNotificationAdd: (notification: Notification) => void;
  onAnnouncementRemove: (announcementId: string) => void;
}

export interface CourseDetailsPageProps {
  course: Course;
  onBack: () => void;
}

export interface NoteDetailPageProps {
  note: Note;
  onBack: () => void;
  onEdit: (note: Note) => void;
  onToggleFavorite: (noteId: string) => void;
}

export interface NoteEditPageProps {
  note: Note | null;
  courses: Course[];
  onBack: () => void;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form interfaces
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  studentId: string;
  department: string;
  semester: number;
}

export interface NoteFormData {
  title: string;
  content: string;
  course: string;
  tags: string[];
  category: string;
  isPrivate: boolean;
}

// State management interfaces
export interface AppState {
  user: User | null;
  courses: Course[];
  notes: Note[];
  events: CalendarEvent[];
  notifications: Notification[];
  recentActivity: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}

// Theme and UI interfaces
export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export interface LanguageContextValue {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Utility types
export type TabType = 'dashboard' | 'courses' | 'notes' | 'calendar' | 'library';
export type ViewMode = 'grid' | 'list';
export type SortOrder = 'asc' | 'desc';
export type FilterOption = 'all' | 'active' | 'completed' | 'favorite';

// Hook return types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}