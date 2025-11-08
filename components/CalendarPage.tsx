import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Edit3, AlertCircle, BookOpen, Users, Presentation, Briefcase, GraduationCap, Heart, Microscope, UserCheck, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "deadline" | "assignment" | "presentation" | "meeting" | "class" | "exam" | "holiday" | "viva" | "lab_assessment";
  description: string;
  course?: string;
  location?: string;
}

interface CalendarPageProps {
  events: Event[];
  onEventsChange: (events: Event[]) => void;
  courses: Array<{ id: string; title: string; code: string }>;
  onEventClick?: (event: Event) => void;
  onNotificationAdd?: (notification: any) => void;
  onAnnouncementRemove?: (announcementId: string) => void;
}

function CalendarPage({ events, onEventsChange, courses, onEventClick, onNotificationAdd, onAnnouncementRemove }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isDateEventsOpen, setIsDateEventsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Auto-suggestion state for type
  const [typeInput, setTypeInput] = useState("");
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const typeInputRef = useRef<HTMLInputElement>(null);
  const typeSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Auto-suggestion state for course
  const [courseInput, setCourseInput] = useState("");
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Array<{ id: string; title: string; code: string }>>([]);
  const courseInputRef = useRef<HTMLInputElement>(null);
  const courseSuggestionsRef = useRef<HTMLDivElement>(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "assignment" as Event["type"],
    description: "",
    course: ""
  });

  // Event type options
  const eventTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "deadline", label: "Deadline" },
    { value: "exam", label: "Exam" },
    { value: "class", label: "Class" },
    { value: "presentation", label: "Presentation" },
    { value: "meeting", label: "Meeting" },
    { value: "viva", label: "Viva" },
    { value: "lab_assessment", label: "Lab Assessment" },
    { value: "holiday", label: "Holiday" }
  ];

  // Auto-suggestion functions for type
  const handleTypeInputChange = (value: string) => {
    setTypeInput(value);
    setNewEvent({...newEvent, type: value as Event["type"]});
    
    // Filter types based on input
    if (value.trim()) {
      const filtered = eventTypes
        .filter(type => type.label.toLowerCase().includes(value.toLowerCase()))
        .map(type => type.label);
      setFilteredTypes(filtered);
      setShowTypeSuggestions(filtered.length > 0);
    } else {
      setFilteredTypes([]);
      setShowTypeSuggestions(false);
    }
  };

  const selectType = (typeLabel: string) => {
    const typeOption = eventTypes.find(type => type.label === typeLabel);
    if (typeOption) {
      setTypeInput(typeLabel);
      setNewEvent({...newEvent, type: typeOption.value as Event["type"]});
      setShowTypeSuggestions(false);
    }
  };

  // Auto-suggestion functions for course
  const handleCourseInputChange = (value: string) => {
    setCourseInput(value);
    setNewEvent({...newEvent, course: value});
    
    // Filter courses based on input
    if (value.trim()) {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
      setShowCourseSuggestions(filtered.length > 0);
    } else {
      setFilteredCourses([]);
      setShowCourseSuggestions(false);
    }
  };

  const selectCourse = (course: { id: string; title: string; code: string }) => {
    const courseText = `${course.code} - ${course.title}`;
    setCourseInput(courseText);
    setNewEvent({...newEvent, course: course.code});
    setShowCourseSuggestions(false);
  };

  // Focus and blur handlers
  const handleTypeInputFocus = () => {
    if (typeInput.trim() && filteredTypes.length > 0) {
      setShowTypeSuggestions(true);
    }
  };

  const handleCourseInputFocus = () => {
    if (courseInput.trim() && filteredCourses.length > 0) {
      setShowCourseSuggestions(true);
    }
  };

  const handleTypeInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!typeSuggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowTypeSuggestions(false);
      }
    }, 150);
  };

  const handleCourseInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!courseSuggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowCourseSuggestions(false);
      }
    }, 150);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type suggestions
      if (
        typeInputRef.current &&
        !typeInputRef.current.contains(event.target as Node) &&
        typeSuggestionsRef.current &&
        !typeSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowTypeSuggestions(false);
      }
      
      // Course suggestions
      if (
        courseInputRef.current &&
        !courseInputRef.current.contains(event.target as Node) &&
        courseSuggestionsRef.current &&
        !courseSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowCourseSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Default holidays and academic events
  const defaultEvents: Event[] = [
    {
      id: "holiday-1",
      title: "Independence Day",
      date: "2024-08-15",
      time: "00:00",
      type: "holiday",
      description: "National Holiday - Independence Day"
    },
    {
      id: "holiday-2", 
      title: "Gandhi Jayanti",
      date: "2024-10-02",
      time: "00:00",
      type: "holiday",
      description: "National Holiday - Gandhi Jayanti"
    },
    {
      id: "holiday-3",
      title: "Diwali",
      date: "2024-11-01",
      time: "00:00", 
      type: "holiday",
      description: "Festival Holiday - Diwali"
    },
    // November 2025 test events
    {
      id: "test-nov-9",
      title: "Software Engineering Project Demo",
      date: "2025-11-09",
      time: "10:30",
      type: "presentation",
      description: "Final project demonstration for Software Engineering course",
      course: "SSWT ZC528",
      location: "Computer Lab 1"
    },
    {
      id: "test-nov-9-2",
      title: "Database Lab Submission",
      date: "2025-11-09",
      time: "23:59",
      type: "deadline",
      description: "Submit database normalization assignment",
      course: "SSWT ZC337"
    },
    {
      id: "test-nov-8",
      title: "Network Security Viva",
      date: "2025-11-08",
      time: "14:00",
      type: "viva",
      description: "Oral examination on network security protocols",
      course: "SSWT ZC467",
      location: "Faculty Room 205"
    },
    {
      id: "exam-1",
      title: "Mid-Semester Viva",
      date: "2024-10-15",
      time: "10:00",
      type: "viva",
      description: "Oral examination for mid-semester evaluation",
      course: "SSWT ZC467"
    },
    {
      id: "lab-1",
      title: "Database Lab Assessment",
      date: "2024-10-20",
      time: "14:00",
      type: "lab_assessment", 
      description: "Practical assessment for database implementation",
      course: "SSWT ZC337",
      location: "Computer Lab 3"
    },
    {
      id: "exam-2",
      title: "Software Testing Viva",
      date: "2024-11-05",
      time: "11:00",
      type: "viva",
      description: "Oral examination for testing methodologies",
      course: "SSWT ZC528"
    },
    {
      id: "lab-2",
      title: "Network Configuration Lab",
      date: "2024-11-12",
      time: "16:00",
      type: "lab_assessment",
      description: "Hands-on network setup and configuration assessment",
      course: "SSWT ZC467",
      location: "Network Lab"
    }
  ];

  // Get current month details
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  // Adjust to start from Monday (0 = Sunday, 1 = Monday, etc.)
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days (to fill the week)
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    calendarDays.push({
      date: new Date(currentYear, currentMonth, day),
      isCurrentMonth: true
    });
  }

  // Next month days to fill the grid
  const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      date: new Date(currentYear, currentMonth + 1, day),
      isCurrentMonth: false
    });
  }

  // Combine user events with default events
  const allEvents = [...events, ...defaultEvents];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1));
  };

  const getEventsForDate = (date: Date) => {
    // Format date consistently to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const matchingEvents = allEvents.filter(event => event.date === dateString);
    
    // Debug logging
    console.log(`📅 Checking date: ${date.toDateString()} -> ${dateString}`);
    console.log(`📅 Found ${matchingEvents.length} events:`, matchingEvents.map(e => ({ title: e.title, date: e.date })));
    
    return matchingEvents;
  };

  // Updated with dark colors and icons
  const getEventTypeColor = (type: Event["type"]) => {
    const colors = {
      deadline: "bg-red-600 text-white border-red-700",
      assignment: "bg-blue-600 text-white border-blue-700",
      presentation: "bg-purple-600 text-white border-purple-700",
      meeting: "bg-green-600 text-white border-green-700",
      class: "bg-yellow-600 text-white border-yellow-700",
      exam: "bg-orange-600 text-white border-orange-700",
      holiday: "bg-pink-600 text-white border-pink-700",
      viva: "bg-indigo-600 text-white border-indigo-700",
      lab_assessment: "bg-teal-600 text-white border-teal-700"
    };
    return colors[type] || "bg-gray-600 text-white border-gray-700";
  };

  // Get icon for event type
  const getEventTypeIcon = (type: Event["type"]) => {
    const icons = {
      deadline: AlertCircle,
      assignment: BookOpen,
      presentation: Presentation,
      meeting: Users,
      class: GraduationCap,
      exam: Briefcase,
      holiday: Heart,
      viva: UserCheck,
      lab_assessment: Microscope
    };
    return icons[type] || BookOpen;
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type,
        description: newEvent.description,
        course: newEvent.course
      };
      
      console.log(`✅ Event created (IST): "${event.title}" on ${event.date} at ${event.time}`);
      
      onEventsChange([...events, event]);

      // Add notification when event is created
      if (onNotificationAdd) {
        onNotificationAdd({
          id: `event-${event.id}`,
          type: 'event',
          title: "Event Scheduled Successfully",
          message: `${event.title} has been scheduled for ${new Date(event.date).toLocaleDateString()} at ${event.time}`,
          time: "just now",
          read: false,
          eventData: event
        });
      }

      setNewEvent({
        title: "",
        date: "",
        time: "",
        type: "assignment",
        description: "",
        course: ""
      });
      setIsCreateEventOpen(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      course: event.course || ""
    });
    setIsEditEventOpen(true);
  };

  const handleUpdateEvent = () => {
    if (editingEvent && newEvent.title && newEvent.date && newEvent.time) {
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: newEvent.title,
              date: newEvent.date,
              time: newEvent.time,
              type: newEvent.type,
              description: newEvent.description,
              course: newEvent.course
            }
          : event
      );
      
      onEventsChange(updatedEvents);

      // Add notification when event is updated
      if (onNotificationAdd) {
        onNotificationAdd({
          id: `event-update-${editingEvent.id}`,
          type: 'event',
          title: "Event Updated Successfully",
          message: `${newEvent.title} has been updated for ${new Date(newEvent.date).toLocaleDateString()} at ${newEvent.time}`,
          time: "just now",
          read: false,
          eventData: {
            id: editingEvent.id,
            title: newEvent.title,
            date: newEvent.date,
            time: newEvent.time,
            type: newEvent.type,
            description: newEvent.description,
            course: newEvent.course
          }
        });
      }

      setNewEvent({
        title: "",
        date: "",
        time: "",
        type: "assignment",
        description: "",
        course: ""
      });
      setEditingEvent(null);
      setIsEditEventOpen(false);
    }
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.filter(event => event.id !== editingEvent.id);
      onEventsChange(updatedEvents);

      // Remove the announcement associated with this event
      if (onAnnouncementRemove) {
        const announcementId = `event-announcement-${editingEvent.id}`;
        onAnnouncementRemove(announcementId);
      }

      // Add notification when event is deleted
      if (onNotificationAdd) {
        onNotificationAdd({
          id: `event-delete-${editingEvent.id}`,
          type: 'event-delete',
          title: "Event Deleted Successfully",
          message: `${editingEvent.title} has been removed from your calendar`,
          time: "just now",
          read: false
        });
      }

      setNewEvent({
        title: "",
        date: "",
        time: "",
        type: "assignment",
        description: "",
        course: ""
      });
      setEditingEvent(null);
      setIsEditEventOpen(false);
    }
  };

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    setSelectedDate(date);
    
    console.log(`🎯 Date clicked: ${date.toDateString()}`);
    console.log(`🎯 Events found: ${dayEvents.length}`);
    
    if (dayEvents.length > 0) {
      // If there are events on this date, show them
      setIsDateEventsOpen(true);
    } else {
      // If no events, open create event dialog with pre-filled date
      // Use same date formatting as getEventsForDate to ensure consistency
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setNewEvent(prev => ({
        ...prev,
        date: dateString
      }));
      setIsCreateEventOpen(true);
    }
  };

  const upcomingEvents = allEvents
    .filter(event => {
      // Compare dates in IST (no time component)
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1 text-xs">Manage your academic schedule and events</p>
        </div>
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event to your calendar with course assignment and details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <Label htmlFor="event-title" className="text-sm font-medium">Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Event title..."
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date" className="text-sm font-medium">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time" className="text-sm font-medium">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-type" className="text-sm font-medium">Type</Label>
                <div className="relative">
                  <Input
                    ref={typeInputRef}
                    value={typeInput}
                    onChange={(e) => handleTypeInputChange(e.target.value)}
                    onFocus={handleTypeInputFocus}
                    onBlur={handleTypeInputBlur}
                    placeholder="Type to search event types..."
                    className="h-10 pr-8"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  
                  {/* Auto-suggestion dropdown */}
                  {showTypeSuggestions && filteredTypes.length > 0 && (
                    <div
                      ref={typeSuggestionsRef}
                      className="absolute z-50 w-full bg-white border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      {filteredTypes.map((typeLabel) => (
                        <div
                          key={typeLabel}
                          className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectType(typeLabel)}
                        >
                          <p className="font-medium text-card-foreground">{typeLabel}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-course" className="text-sm font-medium">Course</Label>
                <div className="relative">
                  <Input
                    ref={courseInputRef}
                    value={courseInput}
                    onChange={(e) => handleCourseInputChange(e.target.value)}
                    onFocus={handleCourseInputFocus}
                    onBlur={handleCourseInputBlur}
                    placeholder="Type to search courses..."
                    className="h-10 pr-8"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  
                  {/* Auto-suggestion dropdown */}
                  {showCourseSuggestions && filteredCourses.length > 0 && (
                    <div
                      ref={courseSuggestionsRef}
                      className="absolute z-50 w-full bg-white border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      {filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectCourse(course)}
                        >
                          <p className="font-medium text-card-foreground">{course.code} - {course.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Event description..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary/90">
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Event Dialog - NO DELETE OPTION */}
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-event-title" className="text-sm font-medium">Title</Label>
                <Input
                  id="edit-event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Event title..."
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date" className="text-sm font-medium">Date</Label>
                  <Input
                    id="edit-event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-time" className="text-sm font-medium">Time</Label>
                  <Input
                    id="edit-event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-type" className="text-sm font-medium">Type</Label>
                <div className="relative">
                  <Input
                    ref={typeInputRef}
                    value={typeInput}
                    onChange={(e) => handleTypeInputChange(e.target.value)}
                    onFocus={handleTypeInputFocus}
                    onBlur={handleTypeInputBlur}
                    placeholder="Type to search event types..."
                    className="h-10 pr-8"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  
                  {/* Auto-suggestion dropdown */}
                  {showTypeSuggestions && filteredTypes.length > 0 && (
                    <div
                      ref={typeSuggestionsRef}
                      className="absolute z-50 w-full bg-white border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      {filteredTypes.map((typeLabel) => (
                        <div
                          key={typeLabel}
                          className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectType(typeLabel)}
                        >
                          <p className="font-medium text-card-foreground">{typeLabel}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-course" className="text-sm font-medium">Course</Label>
                <div className="relative">
                  <Input
                    ref={courseInputRef}
                    value={courseInput}
                    onChange={(e) => handleCourseInputChange(e.target.value)}
                    onFocus={handleCourseInputFocus}
                    onBlur={handleCourseInputBlur}
                    placeholder="Type to search courses..."
                    className="h-10 pr-8"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  
                  {/* Auto-suggestion dropdown */}
                  {showCourseSuggestions && filteredCourses.length > 0 && (
                    <div
                      ref={courseSuggestionsRef}
                      className="absolute z-50 w-full bg-white border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                    >
                      {filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => selectCourse(course)}
                        >
                          <p className="font-medium text-card-foreground">{course.code} - {course.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="edit-event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Event description..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              {/* Action buttons with Delete option */}
              <div className="flex justify-between">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteEvent}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Event
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateEvent} className="bg-primary hover:bg-primary/90">
                    Update Event
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Date Events Dialog - Show events for selected date */}
        <Dialog open={isDateEventsOpen} onOpenChange={setIsDateEventsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Events for {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </DialogTitle>
              <DialogDescription>
                View and manage events for this date
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => {
                    const IconComponent = getEventTypeIcon(event.type);
                    const isUserEvent = !defaultEvents.find(de => de.id === event.id);
                    
                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                              <div className="flex items-center gap-4 text-xs opacity-90 mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{event.time}</span>
                                </div>
                                {event.course && (
                                  <Badge variant="secondary" className="text-xs">
                                    {event.course}
                                  </Badge>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-xs opacity-80 leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                          {isUserEvent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleEditEvent(event);
                                setIsDateEventsOpen(false);
                              }}
                              className="ml-2 opacity-70 hover:opacity-100"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No events scheduled for this date</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedDate) {
                      setNewEvent(prev => ({
                        ...prev,
                        date: selectedDate.toISOString().split('T')[0]
                      }));
                      setIsDateEventsOpen(false);
                      setIsCreateEventOpen(true);
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
                <Button variant="outline" onClick={() => setIsDateEventsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="professional-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="calendar-grid grid gap-1" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                {/* Day headers */}
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm bg-[rgba(25,31,95,0)]">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                  const dayOfWeek = day.date.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const hasEvents = dayEvents.length > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border border-border rounded cursor-pointer transition-all duration-200 ${
                        !day.isCurrentMonth ? 'bg-muted text-muted-foreground opacity-50' : 'bg-card text-card-foreground'
                      } ${isToday ? 'bg-primary/10 border-primary ring-1 ring-primary/20' : ''} ${
                        isSelected ? 'bg-accent border-accent-foreground ring-1 ring-accent-foreground/20' : ''
                      } ${hasEvents ? 'hover:bg-primary/5' : 'hover:bg-accent'}`}
                      onClick={() => handleDateClick(day.date)}
                      title={hasEvents ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''} on this date` : 'Click to add event'}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-sm font-medium ${
                          isToday ? 'text-primary font-bold' : 
                          isSelected ? 'text-accent-foreground font-semibold' : 
                          'text-muted-foreground'
                        }`}>
                          {day.date.getDate()}
                        </div>
                        {hasEvents && (
                          <div className="w-2 h-2 bg-primary rounded-full opacity-70"></div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => {
                          const IconComponent = getEventTypeIcon(event.type);
                          const isUserEvent = !defaultEvents.find(de => de.id === event.id);
                          return (
                            <div
                              key={event.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate ${getEventTypeColor(event.type)} cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1 group`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Show event details for any event, but only allow editing of user events
                                if (isUserEvent) {
                                  handleEditEvent(event);
                                } else {
                                  // For default events, show in the date events dialog
                                  setSelectedDate(day.date);
                                  setIsDateEventsOpen(true);
                                }
                                // Track event click if callback provided
                                if (onEventClick) {
                                  onEventClick(event);
                                }
                              }}
                              title={`${event.title} at ${event.time}`}
                            >
                              <IconComponent className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate flex-1">{event.title}</span>
                              {isUserEvent && (
                                <Edit3 className="w-2.5 h-2.5 ml-auto opacity-0 group-hover:opacity-70 transition-opacity" />
                              )}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div 
                            className="text-xs text-primary font-medium pl-1 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(day.date);
                              setIsDateEventsOpen(true);
                            }}
                          >
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card className="professional-card bg-university-primary dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white dark:text-white font-semibold">Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(new Date()).length > 0 ? (
                <div className="space-y-4">
                  {getEventsForDate(new Date()).map((event) => {
                    // Get background color for event type
                    const getEventBgColor = (type: Event["type"]) => {
                      const bgColors = {
                        deadline: "bg-red-50 dark:bg-red-900/40 border-red-100 dark:border-red-800/50",
                        assignment: "bg-blue-50 dark:bg-blue-900/40 border-blue-100 dark:border-blue-800/50",
                        presentation: "bg-purple-50 dark:bg-purple-900/40 border-purple-100 dark:border-purple-800/50",
                        meeting: "bg-green-50 dark:bg-green-900/40 border-green-100 dark:border-green-800/50",
                        class: "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-100 dark:border-yellow-800/50",
                        exam: "bg-orange-50 dark:bg-orange-900/40 border-orange-100 dark:border-orange-800/50",
                        holiday: "bg-pink-50 dark:bg-pink-900/40 border-pink-100 dark:border-pink-800/50",
                        viva: "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100 dark:border-indigo-800/50",
                        lab_assessment: "bg-teal-50 dark:bg-teal-900/40 border-teal-100 dark:border-teal-800/50"
                      };
                      return bgColors[type] || "bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800/50";
                    };

                    const getEventCircleColor = (type: Event["type"]) => {
                      const circleColors = {
                        deadline: "bg-red-500 dark:bg-red-400",
                        assignment: "bg-blue-500 dark:bg-blue-400",
                        presentation: "bg-purple-500 dark:bg-purple-400",
                        meeting: "bg-green-500 dark:bg-green-400",
                        class: "bg-yellow-500 dark:bg-yellow-400",
                        exam: "bg-orange-500 dark:bg-orange-400",
                        holiday: "bg-pink-500 dark:bg-pink-400",
                        viva: "bg-indigo-500 dark:bg-indigo-400",
                        lab_assessment: "bg-teal-500 dark:bg-teal-400"
                      };
                      return circleColors[type] || "bg-gray-500 dark:bg-gray-400";
                    };
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`p-4 rounded-xl ${getEventBgColor(event.type)} hover:shadow-sm transition-all duration-200`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Colored Circle */}
                          <div className={`w-5 h-5 rounded-full ${getEventCircleColor(event.type)} flex-shrink-0`} />
                          
                          <div className="flex-1 min-w-0 flex items-center">
                            {/* Event Title */}
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight text-left w-full">
                              {event.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white dark:text-white text-sm text-center py-8">No events today</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="professional-card bg-university-primary dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white dark:text-white font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const diffTime = eventDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Get background color for event type  
                    const getEventBgColor = (type: Event["type"]) => {
                      const bgColors = {
                        deadline: "bg-red-50 dark:bg-red-900/40 border-red-100 dark:border-red-800/50",
                        assignment: "bg-blue-50 dark:bg-blue-900/40 border-blue-100 dark:border-blue-800/50",
                        presentation: "bg-purple-50 dark:bg-purple-900/40 border-purple-100 dark:border-purple-800/50",
                        meeting: "bg-green-50 dark:bg-green-900/40 border-green-100 dark:border-green-800/50",
                        class: "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-100 dark:border-yellow-800/50",
                        exam: "bg-orange-50 dark:bg-orange-900/40 border-orange-100 dark:border-orange-800/50",
                        holiday: "bg-pink-50 dark:bg-pink-900/40 border-pink-100 dark:border-pink-800/50",
                        viva: "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-100 dark:border-indigo-800/50",
                        lab_assessment: "bg-teal-50 dark:bg-teal-900/40 border-teal-100 dark:border-teal-800/50"
                      };
                      return bgColors[type] || "bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800/50";
                    };

                    const getEventCircleColor = (type: Event["type"]) => {
                      const circleColors = {
                        deadline: "bg-red-500 dark:bg-red-400",
                        assignment: "bg-blue-500 dark:bg-blue-400",
                        presentation: "bg-purple-500 dark:bg-purple-400",
                        meeting: "bg-green-500 dark:bg-green-400",
                        class: "bg-yellow-500 dark:bg-yellow-400",
                        exam: "bg-orange-500 dark:bg-orange-400",
                        holiday: "bg-pink-500 dark:bg-pink-400",
                        viva: "bg-indigo-500 dark:bg-indigo-400",
                        lab_assessment: "bg-teal-500 dark:bg-teal-400"
                      };
                      return circleColors[type] || "bg-gray-500 dark:bg-gray-400";
                    };
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`p-4 rounded-xl ${getEventBgColor(event.type)} hover:shadow-sm transition-all duration-200`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Colored Circle */}
                          <div className={`w-5 h-5 rounded-full ${getEventCircleColor(event.type)} flex-shrink-0`} />
                          
                          <div className="flex-1 min-w-0 flex items-center">
                            {/* Event Title */}
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight text-left w-full">
                              {event.title}
                            </h4>  
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white dark:text-white text-sm text-center py-8">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;