export interface Student {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  course: string;
  semester: number;
  avatar: string;
  isOnline?: boolean;
}

export const students: Student[] = [
  {
    id: "student-1",
    name: "Priya Sharma",
    username: "priya.sharma",
    email: "priya.sharma@pilani.bits-pilani.ac.in",
    password: "password123",
    phone: "+91 98765 43210",
    course: "M.Tech Computer Science",
    semester: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    isOnline: true
  },
  {
    id: "student-2",
    name: "Rahul Kumar",
    username: "rahul.kumar",
    email: "rahul.kumar@pilani.bits-pilani.ac.in",
    password: "password123",
    phone: "+91 98765 43211",
    course: "M.Tech Computer Science",
    semester: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    isOnline: false
  },
  {
    id: "student-3",
    name: "Sneha Reddy",
    username: "sneha.reddy",
    email: "sneha.reddy@pilani.bits-pilani.ac.in",
    password: "password123",
    phone: "+91 98765 43212",
    course: "M.Tech Computer Science",
    semester: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    isOnline: true
  },
  {
    id: "student-4",
    name: "Arjun Patel",
    username: "arjun.patel",
    email: "arjun.patel@pilani.bits-pilani.ac.in",
    password: "password123",
    phone: "+91 98765 43213",
    course: "M.Tech Computer Science",
    semester: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    isOnline: false
  },
  {
    id: "student-5",
    name: "Anjali Singh",
    username: "anjali.singh",
    email: "anjali.singh@pilani.bits-pilani.ac.in",
    password: "password123",
    phone: "+91 98765 43214",
    course: "M.Tech Computer Science",
    semester: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
    isOnline: true
  }
];
