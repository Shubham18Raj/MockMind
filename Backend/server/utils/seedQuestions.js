const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config({ path: '../.env' });

const questions = [
  // ─── FRONTEND ───────────────────────────────────────
  {
    text: "What is the difference between let, const, and var in JavaScript?",
    role: "frontend", difficulty: "easy", category: "Technical",
    tags: ["javascript", "variables"]
  },
  {
    text: "Explain the concept of closures in JavaScript with an example.",
    role: "frontend", difficulty: "medium", category: "Technical",
    tags: ["javascript", "closures"]
  },
  {
    text: "What is the Virtual DOM in React and how does it work?",
    role: "frontend", difficulty: "easy", category: "Technical",
    tags: ["react", "dom"]
  },
  {
    text: "Explain the difference between useEffect and useLayoutEffect in React.",
    role: "frontend", difficulty: "hard", category: "Technical",
    tags: ["react", "hooks"]
  },
  {
    text: "What is CSS Flexbox? Explain its main properties.",
    role: "frontend", difficulty: "easy", category: "Technical",
    tags: ["css", "flexbox"]
  },
  {
    text: "What is the difference between == and === in JavaScript?",
    role: "frontend", difficulty: "easy", category: "Technical",
    tags: ["javascript"]
  },
  {
    text: "Explain event bubbling and event delegation in JavaScript.",
    role: "frontend", difficulty: "medium", category: "Technical",
    tags: ["javascript", "events"]
  },
  {
    text: "What are React hooks? Name and explain 5 commonly used hooks.",
    role: "frontend", difficulty: "medium", category: "Technical",
    tags: ["react", "hooks"]
  },
  {
    text: "What is the difference between localStorage, sessionStorage, and cookies?",
    role: "frontend", difficulty: "medium", category: "Technical",
    tags: ["browser", "storage"]
  },
  {
    text: "How does the browser render a webpage? Explain the critical rendering path.",
    role: "frontend", difficulty: "hard", category: "Technical",
    tags: ["browser", "performance"]
  },

  // ─── BACKEND ────────────────────────────────────────
  {
    text: "What is REST API? Explain its core principles.",
    role: "backend", difficulty: "easy", category: "Technical",
    tags: ["api", "rest"]
  },
  {
    text: "What is the difference between SQL and NoSQL databases?",
    role: "backend", difficulty: "easy", category: "Technical",
    tags: ["database"]
  },
  {
    text: "Explain JWT authentication. How does it work?",
    role: "backend", difficulty: "medium", category: "Technical",
    tags: ["auth", "jwt"]
  },
  {
    text: "What is middleware in Express.js? Give an example.",
    role: "backend", difficulty: "easy", category: "Technical",
    tags: ["nodejs", "express"]
  },
  {
    text: "What is the event loop in Node.js? How does it handle async operations?",
    role: "backend", difficulty: "hard", category: "Technical",
    tags: ["nodejs", "async"]
  },
  {
    text: "What is indexing in MongoDB? Why is it important?",
    role: "backend", difficulty: "medium", category: "Technical",
    tags: ["mongodb", "database"]
  },
  {
    text: "Explain the difference between authentication and authorization.",
    role: "backend", difficulty: "easy", category: "Technical",
    tags: ["auth", "security"]
  },
  {
    text: "What are environment variables and why should we use them?",
    role: "backend", difficulty: "easy", category: "Technical",
    tags: ["nodejs", "security"]
  },
  {
    text: "What is CORS? Why does it occur and how do you fix it?",
    role: "backend", difficulty: "medium", category: "Technical",
    tags: ["api", "security"]
  },
  {
    text: "Explain the MVC architecture pattern with an example.",
    role: "backend", difficulty: "medium", category: "Technical",
    tags: ["architecture"]
  },

  // ─── FULLSTACK ──────────────────────────────────────
  {
    text: "Explain how data flows in a MERN stack application.",
    role: "fullstack", difficulty: "medium", category: "Technical",
    tags: ["mern", "architecture"]
  },
  {
    text: "What is the difference between server-side rendering and client-side rendering?",
    role: "fullstack", difficulty: "medium", category: "Technical",
    tags: ["rendering", "performance"]
  },
  {
    text: "How would you handle file uploads in a MERN stack app?",
    role: "fullstack", difficulty: "hard", category: "Technical",
    tags: ["mern", "files"]
  },
  {
    text: "What is WebSocket? How is it different from HTTP?",
    role: "fullstack", difficulty: "hard", category: "Technical",
    tags: ["websocket", "networking"]
  },
  {
    text: "How do you manage state in a large React application?",
    role: "fullstack", difficulty: "hard", category: "Technical",
    tags: ["react", "state"]
  },

  // ─── DSA ────────────────────────────────────────────
  {
    text: "What is the time complexity of binary search? Explain with an example.",
    role: "fullstack", difficulty: "easy", category: "DSA",
    tags: ["algorithms", "searching"]
  },
  {
    text: "Explain the difference between a stack and a queue with real world examples.",
    role: "fullstack", difficulty: "easy", category: "DSA",
    tags: ["data-structures"]
  },
  {
    text: "What is a linked list? What are its advantages over arrays?",
    role: "fullstack", difficulty: "easy", category: "DSA",
    tags: ["data-structures"]
  },
  {
    text: "Explain recursion with an example. What is a base case?",
    role: "fullstack", difficulty: "medium", category: "DSA",
    tags: ["algorithms", "recursion"]
  },
  {
    text: "What is Big O notation? Explain O(1), O(n), O(n²) with examples.",
    role: "fullstack", difficulty: "medium", category: "DSA",
    tags: ["algorithms", "complexity"]
  },

  // ─── SYSTEM DESIGN ──────────────────────────────────
  {
    text: "How would you design a URL shortener like bit.ly?",
    role: "fullstack", difficulty: "hard", category: "SystemDesign",
    tags: ["system-design"]
  },
  {
    text: "What is load balancing? Why is it important in large systems?",
    role: "backend", difficulty: "hard", category: "SystemDesign",
    tags: ["system-design", "scalability"]
  },
  {
    text: "Explain caching. When would you use Redis in your application?",
    role: "backend", difficulty: "hard", category: "SystemDesign",
    tags: ["system-design", "caching"]
  },
  {
    text: "How would you design the backend for a chat application?",
    role: "backend", difficulty: "hard", category: "SystemDesign",
    tags: ["system-design", "websocket"]
  },
  {
    text: "What is a microservices architecture? How is it different from monolithic?",
    role: "backend", difficulty: "hard", category: "SystemDesign",
    tags: ["system-design", "architecture"]
  },

  // ─── HR / BEHAVIORAL ────────────────────────────────
  {
    text: "Tell me about yourself.",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "introduction"]
  },
  {
    text: "Where do you see yourself in 5 years?",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "career"]
  },
  {
    text: "What are your strengths and weaknesses?",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "self-awareness"]
  },
  {
    text: "Describe a time when you worked in a team and faced a conflict. How did you handle it?",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "teamwork"]
  },
  {
    text: "Tell me about a project you are most proud of and why.",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "projects"]
  },
  {
    text: "How do you handle pressure and tight deadlines?",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "pressure"]
  },
  {
    text: "Why do you want to join this company?",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "motivation"]
  },
  {
    text: "Describe a situation where you had to learn something new very quickly.",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "learning"]
  },
  {
    text: "Have you ever failed at something? What did you learn from it?",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "failure"]
  },
  {
    text: "What motivates you to write good code?",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "motivation"]
  },
  {
    text: "How do you stay updated with new technologies?",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "learning"]
  },
  {
    text: "Describe your ideal work environment.",
    role: "hr", difficulty: "easy", category: "HR",
    tags: ["hr", "culture"]
  },
  {
    text: "Tell me about a time you disagreed with your team lead. What did you do?",
    role: "hr", difficulty: "hard", category: "Behavioral",
    tags: ["behavioral", "leadership"]
  },
  {
    text: "How do you prioritize tasks when you have multiple deadlines?",
    role: "hr", difficulty: "medium", category: "Behavioral",
    tags: ["behavioral", "time-management"]
  },
  {
    text: "Why should we hire you over other candidates?",
    role: "hr", difficulty: "medium", category: "HR",
    tags: ["hr", "selling-yourself"]
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Old questions cleared');

    // Insert all questions
    await Question.insertMany(questions);
    console.log(` ${questions.length} questions seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();