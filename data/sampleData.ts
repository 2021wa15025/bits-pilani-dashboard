// Sample notes and library data separated for better performance

// Helper function to generate dynamic dates
const getRelativeDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getRelativeDateTime = (daysAgo: number, hours: number = 10, minutes: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const sampleNotes = [
  {
    id: "note-1",
    title: "Object-Oriented Programming Concepts", 
    course: "Object Oriented Programming in Design",
    content: "Comprehensive notes on OOP principles including inheritance, polymorphism, encapsulation, and abstraction. These fundamental concepts form the backbone of modern software development and are essential for understanding how to design robust, maintainable applications.\\n\\nInheritance allows classes to inherit properties and methods from parent classes, promoting code reuse and establishing hierarchical relationships between objects. Polymorphism enables objects of different types to be treated uniformly through common interfaces, while encapsulation bundles data and methods together, hiding internal implementation details from external access.\\n\\nAbstraction focuses on essential features while hiding unnecessary complexity, making systems easier to understand and maintain.",
    category: "Study Notes",
    date: getRelativeDate(7),
    tags: "Study Notes",
    createdAt: getRelativeDateTime(7, 10, 30),
    lastModified: getRelativeDateTime(2, 14, 20),
    favorite: true,
    attachments: [
      {
        id: "file-1",
        name: "OOP_Diagrams.png",
        type: "image/png",
        size: 245760,
        url: "https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=OOP+Class+Diagrams",
        uploadDate: getRelativeDateTime(7, 10, 35)
      },
      {
        id: "file-2",
        name: "Java_Examples.pdf",
        type: "application/pdf",
        size: 1048576,
        url: "#",
        uploadDate: getRelativeDateTime(7, 11, 0)
      }
    ]
  },
  {
    id: "note-2", 
    title: "Database Normalization Forms",
    course: "Database Systems & Application",
    content: "Detailed explanation of 1NF, 2NF, 3NF, and BCNF with examples and practical applications. Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.\\n\\nFirst Normal Form (1NF) ensures that each column contains atomic values and each record is unique. Second Normal Form (2NF) eliminates partial dependencies by ensuring all non-key attributes are fully functionally dependent on the primary key.\\n\\nThird Normal Form (3NF) removes transitive dependencies, while Boyce-Codd Normal Form (BCNF) is a stronger version of 3NF that handles certain anomalies that 3NF doesn't address.",
    category: "Lecture Notes",
    date: getRelativeDate(10),
    tags: "Lecture Notes",
    createdAt: getRelativeDateTime(10, 9, 15),
    lastModified: getRelativeDateTime(10, 16, 45),
    favorite: false,
    attachments: [
      {
        id: "file-3",
        name: "Normalization_Examples.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 524288,
        url: "#",
        uploadDate: getRelativeDateTime(10, 9, 20)
      }
    ]
  },
  {
    id: "note-3",
    title: "Operating System Process Management",
    course: "Operating Systems",
    content: "Process scheduling algorithms, deadlock detection, and memory management techniques. The operating system is responsible for managing system resources and ensuring efficient execution of processes.\\n\\nProcess scheduling determines which process should be executed next and for how long. Common algorithms include First-Come-First-Served (FCFS), Shortest Job Next (SJN), and Round Robin scheduling.\\n\\nDeadlock occurs when processes are blocked indefinitely, waiting for resources held by other blocked processes. Prevention, avoidance, detection, and recovery are the four main approaches to handle deadlocks.",
    category: "Reference",
    date: getRelativeDate(15),
    tags: "Reference",
    createdAt: getRelativeDateTime(15, 14, 0),
    lastModified: getRelativeDateTime(5, 10, 30),
    favorite: true,
    attachments: []
  },
  {
    id: "note-4",
    title: "Software Testing Methodologies",
    course: "Software Testing",
    content: "Unit testing, integration testing, system testing, and automated testing frameworks. Software testing is a crucial phase in the software development lifecycle that ensures applications meet specified requirements and function correctly.\\n\\nUnit testing focuses on individual components or modules, verifying that each unit performs as designed. Integration testing examines the interfaces and interaction between integrated components.\\n\\nSystem testing evaluates the complete integrated system to verify that it meets specified requirements, while acceptance testing determines whether the system is ready for deployment.",
    category: "Study Notes",
    date: getRelativeDate(3),
    tags: "Study Notes",
    createdAt: getRelativeDateTime(3, 13, 45),
    lastModified: getRelativeDateTime(1, 11, 20),
    favorite: false,
    attachments: [
      {
        id: "file-4",
        name: "Testing_Framework_Screenshot.jpg",
        type: "image/jpeg",
        size: 367616,
        url: "https://via.placeholder.com/1024x768/28A745/FFFFFF?text=Testing+Framework+Interface",
        uploadDate: getRelativeDateTime(3, 14, 0)
      },
      {
        id: "file-5",
        name: "Test_Cases.txt",
        type: "text/plain",
        size: 8192,
        url: "#",
        uploadDate: getRelativeDateTime(3, 14, 15)
      }
    ]
  },
  {
    id: "note-5",
    title: "Computer Networks OSI Model",
    course: "Computer Networks",
    content: "Seven layers of OSI model, TCP/IP protocol suite, and network security fundamentals. The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a communication system into seven distinct layers.\\n\\nEach layer serves specific functions: Physical (bit transmission), Data Link (frame delivery), Network (packet routing), Transport (end-to-end delivery), Session (connection management), Presentation (data formatting), and Application (user interface).\\n\\nThe TCP/IP model, while similar, uses a four-layer approach that maps to the OSI model and forms the foundation of modern internet communications.",
    category: "Lecture Notes",
    date: getRelativeDate(5),
    tags: "Lecture Notes",
    createdAt: getRelativeDateTime(5, 8, 30),
    lastModified: getRelativeDateTime(5, 15, 45),
    favorite: true,
    attachments: [
      {
        id: "file-6",
        name: "OSI_Model_Diagram.png",
        type: "image/png",
        size: 456789,
        url: "https://via.placeholder.com/900x700/DC3545/FFFFFF?text=OSI+Model+Layers",
        uploadDate: getRelativeDateTime(5, 8, 35)
      },
      {
        id: "file-7",
        name: "Network_Protocols.pdf",
        type: "application/pdf",
        size: 2097152,
        url: "#",
        uploadDate: getRelativeDateTime(5, 9, 0)
      },
      {
        id: "file-8",
        name: "Wireshark_Capture.png",
        type: "image/png",
        size: 678912,
        url: "https://via.placeholder.com/1200x800/6C757D/FFFFFF?text=Network+Packet+Analysis",
        uploadDate: getRelativeDateTime(5, 10, 15)
      }
    ]
  }
];

export const sampleLibraryItems = [
  {
    id: "lib-1",
    title: "Advanced Java Programming Guide",
    type: "Textbook",
    course: "Object Oriented Programming in Design",
    fileType: "PDF",
    size: "15.2 MB",
    uploadDate: getRelativeDate(12)
  },
  {
    id: "lib-2",
    title: "Database Design Tutorial Videos",
    type: "Video Lecture",
    course: "Database Systems & Application", 
    fileType: "MP4",
    size: "450 MB",
    uploadDate: getRelativeDate(18)
  },
  {
    id: "lib-3",
    title: "Operating Systems Lab Manual",
    type: "Lab Material",
    course: "Operating Systems",
    fileType: "PDF",
    size: "8.7 MB",
    uploadDate: getRelativeDate(25)
  },
  {
    id: "lib-4",
    title: "Software Testing Case Studies",
    type: "Assignment",
    course: "Software Testing",
    fileType: "DOCX",
    size: "2.1 MB",
    uploadDate: getRelativeDate(4)
  }
];

export const getTimeAgoText = (timeKey: string) => {
  switch (timeKey) {
    case "2_hours": return "2 hours ago";
    case "5_hours": return "5 hours ago";
    case "2_days": return "2 days ago";
    default: return timeKey;
  }
};

export const getAnnouncementsData = () => [
  {
    id: "1",
    title: "Mid-Semester Examinations Schedule Released",
    content: "The mid-semester examination schedule for all courses has been published. Please check your registered courses and exam timings on the academic portal.",
    time: getTimeAgoText("2_hours"),
    priority: "high" as const,
    category: "Academic",
    read: false
  },
  {
    id: "2", 
    title: "Library Hours Extended During Exam Period",
    content: "The central library will remain open 24/7 starting from next week to support students during the examination period. Additional study spaces have been arranged.",
    time: getTimeAgoText("5_hours"),
    priority: "medium" as const,
    category: "Facilities",
    read: false
  },
  {
    id: "3",
    title: "Campus Network Maintenance",
    content: "Scheduled network maintenance will occur this Saturday from 2:00 AM to 6:00 AM. Internet services may be temporarily unavailable during this period.",
    time: getTimeAgoText("2_days"),
    priority: "low" as const,
    category: "IT Services",
    read: false
  }
];