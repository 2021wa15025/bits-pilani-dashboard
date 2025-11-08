// Centralized student data - synced with admin system
// This ensures consistency across all components

export interface Student {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  course: string;
  semester?: string;
  avatar?: string;
  isOnline?: boolean;
}

// Master student list - matches admin dashboard exactly
export const students: Student[] = [
  {
    id: "2021wa15025",
    name: "HARI HARA SUDHAN",
    username: "2021wa15025@wilp.bits-pilani.ac.in",
    email: "2021wa15025@wilp.bits-pilani.ac.in",
    password: "student123",
    phone: "+91 9876543225",
    course: "M.Tech Software Systems",
    semester: "4",
    isOnline: true
  },
  {
    id: "2021wa15026",
    name: "Priya Patel",
    username: "2021wa15026@wilp.bits-pilani.ac.in",
    email: "2021wa15026@wilp.bits-pilani.ac.in",
    password: "student123",
    phone: "+91 9876543226",
    course: "M.Tech Software Systems",
    semester: "4",
    isOnline: false
  },
  {
    id: "2021wa15027",
    name: "Arjun Gupta",
    username: "2021wa15027@wilp.bits-pilani.ac.in",
    email: "2021wa15027@wilp.bits-pilani.ac.in",
    password: "student123",
    phone: "+91 9876543227",
    course: "M.Tech Software Systems",
    semester: "4",
    isOnline: true
  },
  {
    id: "2021wa15028",
    name: "Sneha Singh",
    username: "2021wa15028@wilp.bits-pilani.ac.in",
    email: "2021wa15028@wilp.bits-pilani.ac.in",
    password: "student123",
    phone: "+91 9876543228",
    course: "M.Tech Software Systems",
    semester: "4",
    isOnline: true
  },
  {
    id: "2021wa15029",
    name: "Vikram Reddy",
    username: "2021wa15029@wilp.bits-pilani.ac.in",
    email: "2021wa15029@wilp.bits-pilani.ac.in",
    password: "student123",
    phone: "+91 9876543229",
    course: "M.Tech Software Systems",
    semester: "4",
    isOnline: false
  }
];

// Helper functions
export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

export const getStudentByEmail = (email: string): Student | undefined => {
  return students.find(student => student.email === email);
};

export const validateStudentCredentials = (email: string, password: string): Student | null => {
  const student = students.find(s => s.email === email && s.password === password);
  return student || null;
};

// For messaging system
export const getAvailableStudents = () => {
  return students.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    avatar: student.avatar || '',
    isOnline: student.isOnline || false
  }));
};