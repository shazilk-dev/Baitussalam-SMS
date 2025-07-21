const users = [
  {
    id: 1,
    email: "admin@sms.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
    status: "active",
    permissions: ["dashboard", "students", "courses", "reports", "settings"],
  },
  {
    id: 2,
    email: "shazil.akn@gmail.com",
    password: "sk123",
    role: "student",
    name: "Shazil Khan",
    status: "active",
    permissions: ["dashboard", "students", "courses", "reports"],
  },

  {
    id: 3,
    email: "teacher@sms.com",
    password: "teacher123",
    role: "teacher",
    name: "Mr. Khurram Shah",
    status: "active",
    permissions: ["dashboard", "students", "attendance"],
  },
  {
    id: 4,
    email: "sarah.ahmed@sms.com",
    password: "teacher123",
    role: "teacher",
    name: "Dr. Sarah Ahmed",
    status: "active",
    permissions: ["dashboard", "students", "attendance"],
  },

  // Staff Users
  {
    id: 5,
    email: "staff@sms.com",
    password: "staff123",
    role: "staff",
    name: "Staff Member",
    status: "active",
    permissions: ["dashboard", "students"],
  },

  // Student Users (selected students who can access portal)
  {
    id: 6,
    email: "ahmed.hassan@student.edu",
    password: "student123",
    role: "student",
    name: "Ahmed Hassan",
    studentId: 1,
    status: "active",
    permissions: ["profile", "attendance", "assignments"],
  },
  {
    id: 7,
    email: "fatima.khan@student.edu",
    password: "student123",
    role: "student",
    name: "Fatima Khan",
    studentId: 2,
    status: "active",
    permissions: ["profile", "attendance", "assignments"],
  },
];

export default users;
