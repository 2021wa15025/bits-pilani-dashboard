import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { students, validateStudentCredentials } from '../data/studentsData';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  userEmail: string;
  setIsLoggedIn: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUserName: (value: string) => void;
  setUserEmail: (value: string) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; studentData?: any }>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
  isAdmin?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john.doe@pilani.bits-pilani.ac.in");

  const initializeAuth = async () => {
    try {
      // Load from localStorage
      const savedLogin = localStorage.getItem("isLoggedIn");
      const savedIsAdmin = localStorage.getItem("isAdmin");
      const savedUserName = localStorage.getItem("userName");
      const savedUserEmail = localStorage.getItem("userEmail");
      
      if (savedLogin === "true") {
        setIsLoggedIn(true);
        setIsAdmin(savedIsAdmin === "true");
        if (savedUserName) setUserName(savedUserName);
        if (savedUserEmail) setUserEmail(savedUserEmail);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      // If there's an error, ensure we're logged out
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; studentData?: any }> => {
    const { email, password, isAdmin: adminLogin = false } = credentials;
    
    try {
      // Admin credentials check
      if (adminLogin) {
        if (email === "Admin@wilp.bits-pilani.ac.in" && password === "admin123") {
          setIsLoggedIn(true);
          setIsAdmin(true);
          setUserName("Admin User");
          setUserEmail(email);
          
          // Save to localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("userName", "Admin User");
          localStorage.setItem("userEmail", email);
          
          return { success: true };
        }
      } else {
        // Student credentials check - use centralized student data
        const matchingStudent = validateStudentCredentials(email, password);

        if (matchingStudent) {
          setIsLoggedIn(true);
          setIsAdmin(false);
          setUserName(matchingStudent.name);
          setUserEmail(matchingStudent.email);
          
          // Save to localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isAdmin", "false");
          localStorage.setItem("userName", matchingStudent.name);
          localStorage.setItem("userEmail", matchingStudent.email);
          
          // Return success with student data for App.tsx
          const studentData = {
            id: matchingStudent.id,
            name: matchingStudent.name,
            email: matchingStudent.email,
            phone: matchingStudent.phone || "+91-9876543210",
            course: matchingStudent.course,
            semester: matchingStudent.semester || "4"
          };
          
          return { success: true, studentData };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName("John Doe");
    setUserEmail("john.doe@pilani.bits-pilani.ac.in");
    
    // Clear localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isLoggedIn,
    isAdmin,
    userName,
    userEmail,
    setIsLoggedIn,
    setIsAdmin,
    setUserName,
    setUserEmail,
    login,
    logout,
    initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}