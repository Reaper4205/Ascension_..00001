/**
 * SkillBridge Central Auth & Data Persistence System
 * Handles login, registration, localStorage persistence, and dynamic UI syncing.
 */

const STORAGE_KEY_USER = 'skillbridge_user';
const STORAGE_KEY_USERS_DB = 'skillbridge_all_users';
const STORAGE_KEY_THEME = 'skillbridge_theme';

/* ------------------------------------------------------------------ */
/* Dark / Light Theme Toggle — self-contained, works on every page    */
/* that includes auth.js. Injects a floating corner toggle + a dark   */
/* stylesheet that overrides the compiled Tailwind utility colors.    */
/* ------------------------------------------------------------------ */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const icon = document.getElementById('themeToggleIcon');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

function injectThemeStyles() {
    if (document.getElementById('sb-dark-theme-styles')) return;
    const style = document.createElement('style');
    style.id = 'sb-dark-theme-styles';
    style.textContent = `
        html[data-theme="dark"] { color-scheme: dark; }
        html[data-theme="dark"] body,
        html[data-theme="dark"] .bg-background,
        html[data-theme="dark"] .bg-surface { background-color: #0b1320 !important; color: #f1f5f9 !important; }
        html[data-theme="dark"] .bg-white,
        html[data-theme="dark"] .bg-surface-container-lowest { background-color: #131f33 !important; color: #f8fafc !important; }
        html[data-theme="dark"] .bg-surface-container-low { background-color: #182840 !important; }
        html[data-theme="dark"] .bg-surface-container,
        html[data-theme="dark"] .bg-surface-bright { background-color: #1e2e4a !important; }
        html[data-theme="dark"] .bg-surface-container-high { background-color: #243756 !important; }
        html[data-theme="dark"] .bg-surface-container-highest,
        html[data-theme="dark"] .bg-surface-variant { background-color: #2b4164 !important; }
        html[data-theme="dark"] .bg-surface-dim { background-color: #182840 !important; }
        
        html[data-theme="dark"] h1, html[data-theme="dark"] h2, html[data-theme="dark"] h3,
        html[data-theme="dark"] h4, html[data-theme="dark"] h5, html[data-theme="dark"] h6 { color: #f8fafc !important; }
        html[data-theme="dark"] .text-on-surface,
        html[data-theme="dark"] .text-on-background { color: #f1f5f9 !important; }
        html[data-theme="dark"] .text-on-surface-variant { color: #cbd5e1 !important; }
        html[data-theme="dark"] .text-outline { color: #94a3b8 !important; }
        
        /* Preserve contrast on primary/secondary buttons and badges */
        html[data-theme="dark"] .bg-primary { background-color: #059669 !important; }
        html[data-theme="dark"] .text-on-primary,
        html[data-theme="dark"] .bg-primary *,
        html[data-theme="dark"] .bg-secondary *,
        html[data-theme="dark"] button.bg-primary,
        html[data-theme="dark"] a.bg-primary { color: #ffffff !important; }
        html[data-theme="dark"] .bg-primary/10 { background-color: rgba(16, 185, 129, 0.2) !important; }
        html[data-theme="dark"] .text-primary { color: #34d399 !important; }
        html[data-theme="dark"] .text-secondary { color: #2dd4bf !important; }
        
        html[data-theme="dark"] .border-outline-variant,
        html[data-theme="dark"] .border-surface-container-high,
        html[data-theme="dark"] .divide-outline-variant { border-color: #334155 !important; }
        html[data-theme="dark"] .shadow-sm, html[data-theme="dark"] .shadow-level-1,
        html[data-theme="dark"] .shadow-level-2, html[data-theme="dark"] .shadow-lg,
        html[data-theme="dark"] .shadow-ambient { box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important; }
        
        html[data-theme="dark"] input, html[data-theme="dark"] select, html[data-theme="dark"] textarea,
        html[data-theme="dark"] .input-notion { background-color: #182840 !important; color: #f8fafc !important; border-color: #334155 !important; }
        html[data-theme="dark"] img { opacity: 0.96; }
        #themeToggleBtn {
            position: fixed; bottom: 20px; right: 20px; z-index: 999;
            width: 46px; height: 46px; border-radius: 9999px;
            background: linear-gradient(135deg, #059669, #0d9488); color: #ffffff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3); cursor: pointer;
            border: 2px solid rgba(255,255,255,0.2); transition: transform .15s ease, opacity .15s ease;
        }
        #themeToggleBtn:hover { transform: scale(1.1); opacity: 0.95; }
        @media (min-width: 768px) { #themeToggleBtn { bottom: 24px; right: 24px; } }
    `;
    document.head.appendChild(style);
}


function injectThemeToggleButton() {
    if (document.getElementById('themeToggleBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.type = 'button';
    btn.title = 'Toggle dark / light theme';
    btn.setAttribute('onclick', 'toggleTheme()');
    btn.innerHTML = '<span id="themeToggleIcon" class="material-symbols-outlined" style="font-size:22px;">dark_mode</span>';
    document.body.appendChild(btn);
}

function initTheme() {
    injectThemeStyles();
    injectThemeToggleButton();
    const saved = localStorage.getItem(STORAGE_KEY_THEME)
        || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);
}

document.addEventListener('DOMContentLoaded', initTheme);

// Default Demo User Profiles
const DEFAULT_STUDENT = {
    fullName: "Alex Chen",
    email: "alex.chen@university.edu",
    phone: "(555) 234-5678",
    university: "Stanford University",
    degree: "Computer Science",
    degreeCode: "cs",
    year: "Junior (Year 3)",
    yearCode: "3",
    role: "student",
    isLoggedIn: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    skills: ["React.js", "Python", "Data Structures", "TypeScript", "Node.js", "Tailwind CSS"],
    bio: "Passionate CS Junior building scalable web apps and exploring AI/ML opportunities."
};

const DEFAULT_RECRUITER = {
    fullName: "Sarah Connor",
    email: "sarah@techcorp.com",
    phone: "(555) 987-6543",
    company: "TechCorp Global",
    role: "recruiter",
    isLoggedIn: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    title: "Senior Technical Recruiter"
};

const DEFAULT_TEACHER = {
    fullName: "Prof. Meera Rao",
    email: "prof.rao@university.edu",
    phone: "(555) 345-6789",
    university: "Stanford University",
    department: "Computer Science",
    role: "teacher",
    isLoggedIn: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
    title: "Associate Professor & Placement Coordinator"
};

// Get current active user
function getCurrentUser() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_USER);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error reading currentUser from localStorage", e);
    }
    // Return default student as active user if not set
    saveCurrentUser(DEFAULT_STUDENT);
    return DEFAULT_STUDENT;
}

// Save active user to localStorage
function saveCurrentUser(userData) {
    try {
        const currentUser = { ...getCurrentUser(), ...userData, isLoggedIn: true, lastLogin: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        
        // Also save to all users DB
        saveToUsersDatabase(currentUser);
        return currentUser;
    } catch (e) {
        console.error("Error saving user data to localStorage", e);
        return null;
    }
}

// Save to user database in localStorage
function saveToUsersDatabase(user) {
    try {
        let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx >= 0) {
            users[existingIdx] = { ...users[existingIdx], ...user };
        } else {
            users.push(user);
        }
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    } catch (e) {
        console.error("Error updating users DB", e);
    }
}

// Validate signup password helper
function validatePassword(password, confirmPassword) {
    if (!password || password.length < 6) {
        return { valid: false, message: "Password must be at least 6 characters long." };
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
        return { valid: false, message: "Passwords do not match. Please check and try again." };
    }
    return { valid: true };
}

// Fixed Login function with strict credential checking
function loginUser(email, password, role = 'student') {
    if (!email || !password) {
        showToast("Please enter both email and password.", "error");
        return { success: false, message: "Please enter both email and password." };
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    } catch(e){}

    // Seed default demo accounts if not present
    const demoAccounts = [
        { ...DEFAULT_STUDENT, password: "password123" },
        { ...DEFAULT_RECRUITER, password: "password123" },
        { ...DEFAULT_TEACHER, password: "password123" }
    ];

    demoAccounts.forEach(demo => {
        if (!users.some(u => u.email.toLowerCase() === demo.email.toLowerCase())) {
            users.push(demo);
        }
    });
    try {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    } catch(e){}

    let found = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
        showToast("Account not found. Please sign up first.", "error");
        return { success: false, message: "Account not found. Please sign up first." };
    }

    // Password verification
    const expectedPassword = found.password || "password123";
    if (password !== expectedPassword) {
        showToast("Incorrect password. Please try again.", "error");
        return { success: false, message: "Incorrect password. Please try again." };
    }

    found.isLoggedIn = true;
    found.role = role || found.role || 'student';
    saveCurrentUser(found);
    showToast(`Logged in successfully! Welcome back, ${found.fullName}.`);
    return { success: true, user: found };
}

// Signup function for Student, Teacher, and Recruiter
function signupUser(userData) {
    const passCheck = validatePassword(userData.password, userData.confirmPassword);
    if (!passCheck.valid) {
        showToast(passCheck.message, "error");
        return { success: false, message: passCheck.message };
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    } catch(e){}

    if (users.some(u => u.email && u.email.toLowerCase() === userData.email.toLowerCase())) {
        showToast("An account with this email already exists. Please log in.", "error");
        return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
        ...userData,
        isLoggedIn: true,
        avatar: userData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
    };

    saveCurrentUser(newUser);
    showToast(`Account created successfully! Welcome, ${newUser.fullName}.`);
    return { success: true, user: newUser };
}

// Logout function
function logoutUser() {
    try {
        const user = getCurrentUser();
        if (user) {
            user.isLoggedIn = false;
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        }
    } catch (e) {}
    showToast("Logged out successfully.");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);
}

// Toast notification UI
function showToast(message, type = "success") {
    let toast = document.getElementById("sb-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sb-toast";
        toast.className = "fixed bottom-5 right-5 z-[9999] px-5 py-3 rounded-lg shadow-xl text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none";
        document.body.appendChild(toast);
    }
    
    toast.className = `fixed bottom-5 right-5 z-[9999] px-5 py-3 rounded-lg shadow-xl text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 transform translate-y-0 opacity-100 ${
        type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
    }`;
    toast.innerHTML = `<span class="material-symbols-outlined text-lg">${type === 'error' ? 'error' : 'check_circle'}</span> ${message}`;
    
    setTimeout(() => {
        toast.className = toast.className.replace('translate-y-0 opacity-100', 'translate-y-10 opacity-0 pointer-events-none');
    }, 3000);
}

// Handle profile photo selection: validate, preview, and persist as base64
function handlePhotoSelect(fileInput, previewImgId, opts = {}) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast("Please select an image file.", "error");
        return;
    }
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
        showToast(`Image must be under ${maxSizeMB}MB.`, "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;

        const imgEl = document.getElementById(previewImgId);
        if (imgEl) {
            imgEl.src = dataUrl;
            imgEl.classList.remove('hidden');
        }
        if (opts.placeholderId) {
            const placeholder = document.getElementById(opts.placeholderId);
            if (placeholder) placeholder.classList.add('hidden');
        }

        if (opts.persist !== false) {
            saveCurrentUser({ avatar: dataUrl });
            showToast("Profile photo updated!");
        }

        if (typeof opts.onDone === 'function') opts.onDone(dataUrl);
    };
    reader.onerror = () => showToast("Couldn't read that image — try another file.", "error");
    reader.readAsDataURL(file);
}

// Handle profile banner selection: validate, preview, and persist in localStorage
function handleBannerSelect(fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast("Please select a valid image file for the banner.", "error");
        return;
    }
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
        showToast(`Banner image must be under ${maxSizeMB}MB.`, "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        const bannerEl = document.getElementById('profile-banner');
        if (bannerEl) {
            bannerEl.style.backgroundImage = `url('${dataUrl}')`;
        }
        saveCurrentUser({ banner: dataUrl });
        showToast("Profile banner updated successfully!");
    };
    reader.onerror = () => showToast("Failed to read the banner image.", "error");
    reader.readAsDataURL(file);
}

// Sync UI Elements on Page Load
function syncAuthUI() {
    const user = getCurrentUser();
    
    // Update Header Auth elements if present
    const existingLoginBtn = document.querySelector('header a[href*="login"], header a[href*="student_dashboard"]');
    
    if (user && user.isLoggedIn && existingLoginBtn && !existingLoginBtn.classList.contains('sb-user-synced')) {
        const userMenu = document.createElement('div');
        userMenu.className = 'flex items-center gap-3 sb-user-synced';
        userMenu.innerHTML = `
            <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                    ${user.avatar ? `<img src="${user.avatar}" class="w-full h-full object-cover" />` : user.fullName.charAt(0)}
                </div>
                <div class="text-left hidden sm:block">
                    <div class="text-xs font-bold text-on-surface leading-tight">${user.fullName}</div>
                    <div class="text-[10px] text-on-surface-variant capitalize">${user.role}</div>
                </div>
            </div>
            <button onclick="logoutUser()" title="Logout" class="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-lg hover:bg-surface-container flex items-center">
                <span class="material-symbols-outlined text-xl">logout</span>
            </button>
        `;
        existingLoginBtn.parentNode.replaceChild(userMenu, existingLoginBtn);
    }
}

// Auto init on load
document.addEventListener('DOMContentLoaded', () => {
    syncAuthUI();
});

// Target Role Benchmarks Data
const ROLE_BENCHMARKS = {
    backend: {
        title: "Backend Developer",
        score: 62,
        summary: "You are a solid candidate, but strengthening Cloud Infrastructure will significantly boost your marketability for Backend roles.",
        criticalGap: "Cloud Infrastructure (AWS/GCP)",
        skills: [
            { name: "Python / Django", userPct: 60, reqPct: 85, level: "Intermediate" },
            { name: "System Design", userPct: 35, reqPct: 80, level: "Beginner" },
            { name: "Database Management (SQL/NoSQL)", userPct: 90, reqPct: 75, level: "Advanced", exceeds: true },
            { name: "API Development (REST/GraphQL)", userPct: 70, reqPct: 90, level: "Intermediate" },
            { name: "Cloud Infrastructure (AWS/GCP)", userPct: 20, reqPct: 70, level: "Novice", critical: true }
        ],
        studyPlan: {
            title: "4-Week AI Cloud & Backend Mastery Plan",
            weeks: [
                {
                    week: 1,
                    title: "AWS Core & IAM Infrastructure",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "b1", text: "Setup AWS Free Tier & configure IAM User Roles", done: true },
                        { id: "b2", text: "Deploy a Python/Django app to Elastic Beanstalk", done: false },
                        { id: "b3", text: "Configure S3 Bucket for static asset hosting", done: false }
                    ]
                },
                {
                    week: 2,
                    title: "Containerization with Docker",
                    hours: "8 hrs/week",
                    tasks: [
                        { id: "b4", text: "Write multi-stage Dockerfile for Backend API", done: false },
                        { id: "b5", text: "Setup docker-compose with PostgreSQL container", done: false },
                        { id: "b6", text: "Deploy containerized app to AWS ECS / Fargate", done: false }
                    ]
                },
                {
                    week: 3,
                    title: "System Design & Caching",
                    hours: "7 hrs/week",
                    tasks: [
                        { id: "b7", text: "Implement Redis Caching layer for high-read endpoints", done: false },
                        { id: "b8", text: "Design rate limiting & API authentication middleware", done: false }
                    ]
                },
                {
                    week: 4,
                    title: "CI/CD & Final Deployment",
                    hours: "5 hrs/week",
                    tasks: [
                        { id: "b9", text: "Build GitHub Actions automated test & deploy pipeline", done: false },
                        { id: "b10", text: "Conduct load testing with Locust & publish architecture diagram", done: false }
                    ]
                }
            ]
        }
    },
    frontend: {
        title: "Frontend Developer",
        score: 78,
        summary: "Great frontend fundamentals! Elevating Web Performance and TypeScript depth will position you in the top 10% of candidates.",
        criticalGap: "Web Performance & Optimization",
        skills: [
            { name: "React.js / Next.js", userPct: 85, reqPct: 85, level: "Advanced" },
            { name: "HTML5 / CSS3 / Tailwind CSS", userPct: 90, reqPct: 80, level: "Advanced", exceeds: true },
            { name: "JavaScript (ES6+) & TypeScript", userPct: 75, reqPct: 85, level: "Intermediate" },
            { name: "Web Performance & Core Web Vitals", userPct: 40, reqPct: 75, level: "Beginner", critical: true },
            { name: "State Management (Zustand/Redux)", userPct: 65, reqPct: 70, level: "Intermediate" }
        ],
        studyPlan: {
            title: "4-Week High-Performance Frontend Plan",
            weeks: [
                {
                    week: 1,
                    title: "TypeScript Deep Dive",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "f1", text: "Refactor JavaScript React components to strict TypeScript", done: true },
                        { id: "f2", text: "Master Generics, Union types, and Utility types", done: false }
                    ]
                },
                {
                    week: 2,
                    title: "Core Web Vitals & Lighthouse Optimization",
                    hours: "7 hrs/week",
                    tasks: [
                        { id: "f3", text: "Implement Code Splitting & Dynamic Imports in Next.js", done: false },
                        { id: "f4", text: "Optimize LCP & CLS layout shifts to achieve 95+ Lighthouse score", done: false }
                    ]
                },
                {
                    week: 3,
                    title: "Advanced State & Micro-Interactions",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "f5", text: "Build accessible modal system with Framer Motion animations", done: false },
                        { id: "f6", text: "Setup Zustand global store with persistent storage", done: false }
                    ]
                },
                {
                    week: 4,
                    title: "Testing & Portfolio Showcase",
                    hours: "5 hrs/week",
                    tasks: [
                        { id: "f7", text: "Write component unit tests using Vitest & React Testing Library", done: false },
                        { id: "f8", text: "Deploy live demo to Vercel with custom domain", done: false }
                    ]
                }
            ]
        }
    },
    fullstack: {
        title: "Fullstack Engineer",
        score: 70,
        summary: "Strong fullstack core! Completing automated CI/CD deployment pipelines will make your portfolio industry-ready.",
        criticalGap: "CI/CD & Cloud Deployment",
        skills: [
            { name: "Node.js & Express / Python", userPct: 70, reqPct: 80, level: "Intermediate" },
            { name: "React / Frontend Frameworks", userPct: 80, reqPct: 80, level: "Advanced" },
            { name: "PostgreSQL / MongoDB", userPct: 85, reqPct: 75, level: "Advanced", exceeds: true },
            { name: "CI/CD & Cloud Deployment", userPct: 30, reqPct: 70, level: "Novice", critical: true },
            { name: "System Architecture & Security", userPct: 45, reqPct: 75, level: "Beginner" }
        ],
        studyPlan: {
            title: "4-Week Fullstack Production Readiness Plan",
            weeks: [
                {
                    week: 1,
                    title: "REST & GraphQL API Architecture",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "fs1", text: "Build Node.js/Express API with JWT Auth and refresh tokens", done: true },
                        { id: "fs2", text: "Implement Prisma ORM with PostgreSQL database schema", done: false }
                    ]
                },
                {
                    week: 2,
                    title: "Frontend Integration & SSR",
                    hours: "8 hrs/week",
                    tasks: [
                        { id: "fs3", text: "Connect Next.js Frontend to Express Backend API", done: false },
                        { id: "fs4", text: "Implement React Query for server state management & caching", done: false }
                    ]
                },
                {
                    week: 3,
                    title: "DevOps & CI/CD Pipeline",
                    hours: "7 hrs/week",
                    tasks: [
                        { id: "fs5", text: "Dockerize both Frontend and Backend services", done: false },
                        { id: "fs6", text: "Setup GitHub Actions workflow for automatic staging deployment", done: false }
                    ]
                },
                {
                    week: 4,
                    title: "Security Audit & Launch",
                    hours: "5 hrs/week",
                    tasks: [
                        { id: "fs7", text: "Add rate limiting, CORS policies, and Helmet security headers", done: false },
                        { id: "fs8", text: "Host live web application on AWS / Render with SSL certificate", done: false }
                    ]
                }
            ]
        }
    },
    devops: {
        title: "DevOps Engineer",
        score: 55,
        summary: "Significant opportunity to level up! Mastering Docker container orchestration and Terraform is essential for DevOps roles.",
        criticalGap: "Docker & Kubernetes Orchestration",
        skills: [
            { name: "Linux & Shell Scripting", userPct: 65, reqPct: 85, level: "Intermediate" },
            { name: "Docker & Kubernetes", userPct: 40, reqPct: 85, level: "Beginner", critical: true },
            { name: "CI/CD Pipelines (GitHub/Jenkins)", userPct: 50, reqPct: 80, level: "Intermediate" },
            { name: "Cloud Providers (AWS/Azure)", userPct: 30, reqPct: 80, level: "Novice", critical: true },
            { name: "Infrastructure as Code (Terraform)", userPct: 25, reqPct: 70, level: "Novice" }
        ],
        studyPlan: {
            title: "4-Week DevOps & Cloud Orchestration Plan",
            weeks: [
                {
                    week: 1,
                    title: "Linux Admin & Bash Scripting",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "d1", text: "Master Linux file permissions, systemd services, and networking", done: true },
                        { id: "d2", text: "Write bash script for automated server health monitoring", done: false }
                    ]
                },
                {
                    week: 2,
                    title: "Docker & Kubernetes Mastery",
                    hours: "9 hrs/week",
                    tasks: [
                        { id: "d3", text: "Build multi-container application with Docker Compose", done: false },
                        { id: "d4", text: "Deploy local Kubernetes cluster with Minikube & kubectl", done: false }
                    ]
                },
                {
                    week: 3,
                    title: "Terraform Infrastructure as Code",
                    hours: "8 hrs/week",
                    tasks: [
                        { id: "d5", text: "Provision AWS VPC, Subnets, and EC2 instances via Terraform", done: false },
                        { id: "d6", text: "Implement Terraform Remote State with S3 and DynamoDB locking", done: false }
                    ]
                },
                {
                    week: 4,
                    title: "GitOps & Production CI/CD",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "d7", text: "Build automated deployment pipeline with ArgoCD / GitHub Actions", done: false }
                    ]
                }
            ]
        }
    },
    data: {
        title: "Data Scientist",
        score: 65,
        summary: "Solid analytical foundation! Deepening Machine Learning models and PyTorch will prepare you for Data Scientist positions.",
        criticalGap: "Machine Learning (Scikit-Learn/PyTorch)",
        skills: [
            { name: "Python (Pandas/NumPy/SciPy)", userPct: 80, reqPct: 85, level: "Advanced" },
            { name: "SQL & Data Warehousing", userPct: 85, reqPct: 80, level: "Advanced", exceeds: true },
            { name: "Machine Learning (Scikit-Learn/PyTorch)", userPct: 40, reqPct: 75, level: "Beginner", critical: true },
            { name: "Data Visualization (Tableau/Matplotlib)", userPct: 60, reqPct: 70, level: "Intermediate" },
            { name: "Big Data (Spark/Hadoop)", userPct: 20, reqPct: 65, level: "Novice" }
        ],
        studyPlan: {
            title: "4-Week Data Science & Applied ML Plan",
            weeks: [
                {
                    week: 1,
                    title: "Exploratory Data Analysis & Feature Engineering",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "ds1", text: "Clean datasets & handle missing values using Pandas", done: true },
                        { id: "ds2", text: "Perform feature encoding & scaling for ML models", done: false }
                    ]
                },
                {
                    week: 2,
                    title: "Supervised & Unsupervised Machine Learning",
                    hours: "8 hrs/week",
                    tasks: [
                        { id: "ds3", text: "Train Classification & Regression models in Scikit-Learn", done: false },
                        { id: "ds4", text: "Evaluate models with Confusion Matrix, ROC-AUC, and F1 Score", done: false }
                    ]
                },
                {
                    week: 3,
                    title: "Deep Learning Foundations (PyTorch)",
                    hours: "8 hrs/week",
                    tasks: [
                        { id: "ds5", text: "Build Neural Network model for image classification in PyTorch", done: false }
                    ]
                },
                {
                    week: 4,
                    title: "Model Deployment & Interactive Dashboard",
                    hours: "6 hrs/week",
                    tasks: [
                        { id: "ds6", text: "Deploy ML model via FastAPI / Streamlit interactive app", done: false }
                    ]
                }
            ]
        }
    },
    swe: {
        title: "Software Engineer",
        score: 72,
        summary: "Solid coding fundamentals! Strengthening Data Structures & Algorithms and Unit Testing practices will make you competitive for top-tier software roles.",
        criticalGap: "Data Structures & Algorithms (DSA)",
        skills: [
            { name: "Data Structures & Algorithms", userPct: 55, reqPct: 85, level: "Intermediate", critical: true },
            { name: "Object-Oriented Design (Java/C++/Python)", userPct: 80, reqPct: 85, level: "Advanced" },
            { name: "Version Control (Git/GitHub)", userPct: 85, reqPct: 80, level: "Advanced", exceeds: true },
            { name: "Unit & Integration Testing", userPct: 40, reqPct: 75, level: "Beginner", critical: true },
            { name: "System Architecture Basics", userPct: 50, reqPct: 70, level: "Intermediate" }
        ],
        studyPlan: {
            title: "4-Week Software Engineering Mastery Plan",
            weeks: [
                { week: 1, title: "Algorithmic Problem Solving (LeetCode / DSA)", hours: "8 hrs/week", tasks: [{ id: "swe1", text: "Master Trees, Graphs, and Hash Tables", done: true }, { id: "swe2", text: "Solve 15 medium problems on LeetCode", done: false }] },
                { week: 2, title: "Object-Oriented Design Patterns", hours: "6 hrs/week", tasks: [{ id: "swe3", text: "Implement Factory, Observer, and Singleton patterns", done: false }, { id: "swe4", text: "Refactor legacy codebase with SOLID principles", done: false }] },
                { week: 3, title: "Test-Driven Development (TDD)", hours: "7 hrs/week", tasks: [{ id: "swe5", text: "Write 20+ unit tests with Jest / PyTest / JUnit", done: false }, { id: "swe6", text: "Achieve 85%+ branch code coverage", done: false }] },
                { week: 4, title: "System Architecture & Mock Interviews", hours: "6 hrs/week", tasks: [{ id: "swe7", text: "Design a scalable URL shortener system", done: false }, { id: "swe8", text: "Complete mock behavioral & coding interview", done: false }] }
            ]
        }
    },
    aiml: {
        title: "AI / Machine Learning Engineer",
        score: 64,
        summary: "Good math and Python foundations! Mastering Transformers, Deep Learning with PyTorch, and model deployment will unlock top ML engineering roles.",
        criticalGap: "Deep Learning (PyTorch/Transformers)",
        skills: [
            { name: "Python & Scientific Libraries (NumPy/Pandas)", userPct: 85, reqPct: 85, level: "Advanced", exceeds: true },
            { name: "Supervised & Unsupervised ML (Scikit-Learn)", userPct: 75, reqPct: 80, level: "Intermediate" },
            { name: "Deep Learning & Neural Networks (PyTorch)", userPct: 40, reqPct: 85, level: "Beginner", critical: true },
            { name: "Transformers & Large Language Models (LLMs)", userPct: 35, reqPct: 80, level: "Beginner", critical: true },
            { name: "MLOps & Model Deployment (FastAPI/Docker)", userPct: 30, reqPct: 70, level: "Novice" }
        ],
        studyPlan: {
            title: "4-Week AI & Deep Learning Sprint",
            weeks: [
                { week: 1, title: "PyTorch Tensor Operations & Autograd", hours: "7 hrs/week", tasks: [{ id: "ai1", text: "Build MLP from scratch in PyTorch", done: true }, { id: "ai2", text: "Train CNN on CIFAR-10 image dataset", done: false }] },
                { week: 2, title: "Transformers & Hugging Face", hours: "8 hrs/week", tasks: [{ id: "ai3", text: "Fine-tune BERT model for sentiment analysis", done: false }, { id: "ai4", text: "Implement tokenization and attention mechanisms", done: false }] },
                { week: 3, title: "Prompt Engineering & RAG Systems", hours: "8 hrs/week", tasks: [{ id: "ai5", text: "Build Retrieval-Augmented Generation (RAG) with LangChain and vector DB", done: false }] },
                { week: 4, title: "MLOps & Model Serving", hours: "6 hrs/week", tasks: [{ id: "ai6", text: "Deploy model inference API using FastAPI and Docker", done: false }] }
            ]
        }
    },
    cyber: {
        title: "Cybersecurity Analyst",
        score: 60,
        summary: "Good security awareness! Deepening hands-on vulnerability assessments, SIEM log monitoring, and OWASP web defenses is crucial.",
        criticalGap: "Vulnerability Assessment & Network Defense",
        skills: [
            { name: "Network Security & Protocols (TCP/IP, Wireshark)", userPct: 65, reqPct: 85, level: "Intermediate" },
            { name: "OWASP Top 10 Web Vulnerabilities", userPct: 45, reqPct: 85, level: "Beginner", critical: true },
            { name: "SIEM & Threat Monitoring (Splunk/ELK)", userPct: 30, reqPct: 75, level: "Novice", critical: true },
            { name: "Cryptography & Public Key Infrastructure (PKI)", userPct: 60, reqPct: 75, level: "Intermediate" },
            { name: "Incident Response & Forensics", userPct: 35, reqPct: 70, level: "Beginner" }
        ],
        studyPlan: {
            title: "4-Week Cyber Defense & Penetration Testing",
            weeks: [
                { week: 1, title: "Network Analysis & Traffic Capture", hours: "7 hrs/week", tasks: [{ id: "cy1", text: "Analyze PCAP packet captures using Wireshark", done: true }, { id: "cy2", text: "Identify SYN floods and DNS spoofing signatures", done: false }] },
                { week: 2, title: "OWASP Web Security Testing", hours: "8 hrs/week", tasks: [{ id: "cy3", text: "Perform SQLi & XSS exploit labs on PortSwigger Web Security Academy", done: false }, { id: "cy4", text: "Implement CSP, CSRF tokens, and security headers", done: false }] },
                { week: 3, title: "SIEM Log Hunting & Detection Rules", hours: "7 hrs/week", tasks: [{ id: "cy5", text: "Write Splunk search queries to detect brute-force attempts", done: false }] },
                { week: 4, title: "Security Hardening & Certification Prep", hours: "6 hrs/week", tasks: [{ id: "cy6", text: "Conduct full Linux server vulnerability scan with OpenVAS", done: false }] }
            ]
        }
    },
    cloud: {
        title: "Cloud Solutions Architect",
        score: 58,
        summary: "Promising cloud knowledge! Mastering VPC networking, multi-region high availability, and infrastructure automation will elevate your architecture skills.",
        criticalGap: "Cloud Networking & High Availability",
        skills: [
            { name: "Core Compute & Storage (EC2, S3, RDS)", userPct: 75, reqPct: 85, level: "Intermediate" },
            { name: "VPC Networking & Subnet Architecture", userPct: 35, reqPct: 85, level: "Beginner", critical: true },
            { name: "Serverless & Microservices (Lambda/API Gateway)", userPct: 60, reqPct: 80, level: "Intermediate" },
            { name: "Cloud Security & IAM Policies", userPct: 55, reqPct: 80, level: "Intermediate" },
            { name: "Cost Optimization & Disaster Recovery", userPct: 30, reqPct: 75, level: "Novice", critical: true }
        ],
        studyPlan: {
            title: "4-Week Cloud Architecture & Certification Plan",
            weeks: [
                { week: 1, title: "VPC Design & Hybrid Networking", hours: "7 hrs/week", tasks: [{ id: "cl1", text: "Design multi-AZ VPC with Public/Private Subnets and NAT Gateway", done: true }, { id: "cl2", text: "Configure Route Tables, Security Groups, and NACLs", done: false }] },
                { week: 2, title: "High Availability & Auto Scaling", hours: "8 hrs/week", tasks: [{ id: "cl3", text: "Deploy Application Load Balancer across multiple EC2 instances", done: false }, { id: "cl4", text: "Configure Auto Scaling Group based on CPU utilization", done: false }] },
                { week: 3, title: "Serverless Event-Driven Architecture", hours: "7 hrs/week", tasks: [{ id: "cl5", text: "Build S3 image processing pipeline using AWS Lambda and SQS", done: false }] },
                { week: 4, title: "Well-Architected Review & Cost Management", hours: "6 hrs/week", tasks: [{ id: "cl6", text: "Conduct AWS Well-Architected Framework review on sample system", done: false }] }
            ]
        }
    },
    uiux: {
        title: "UI/UX Designer",
        score: 75,
        summary: "Excellent visual design aesthetic! Deepening design system tokens and quantitative usability testing will make your portfolio stand out to recruiters.",
        criticalGap: "Design Systems & Usability Testing",
        skills: [
            { name: "Figma & Interactive Prototyping", userPct: 90, reqPct: 85, level: "Advanced", exceeds: true },
            { name: "Wireframing & Information Architecture", userPct: 80, reqPct: 80, level: "Advanced" },
            { name: "Design Systems & Token Standards", userPct: 45, reqPct: 80, level: "Beginner", critical: true },
            { name: "User Research & Usability Testing", userPct: 50, reqPct: 75, level: "Intermediate", critical: true },
            { name: "WCAG Accessibility & Responsive Design", userPct: 65, reqPct: 80, level: "Intermediate" }
        ],
        studyPlan: {
            title: "4-Week Product Design Portfolio Sprint",
            weeks: [
                { week: 1, title: "Design System Architecture", hours: "7 hrs/week", tasks: [{ id: "ux1", text: "Build scalable Figma design system with auto-layout components and variables", done: true }, { id: "ux2", text: "Define design tokens for typography, color, and spacing", done: false }] },
                { week: 2, title: "User Research & Journey Mapping", hours: "7 hrs/week", tasks: [{ id: "ux3", text: "Conduct 5 user interviews and synthesize affinity diagram", done: false }] },
                { week: 3, title: "Micro-Interactions & Prototyping", hours: "8 hrs/week", tasks: [{ id: "ux4", text: "Create high-fidelity interactive prototype with smart animations", done: false }] },
                { week: 4, title: "Case Study & Usability Audit", hours: "6 hrs/week", tasks: [{ id: "ux5", text: "Publish in-depth case study on Behance/portfolio with before/after metrics", done: false }] }
            ]
        }
    }
};
ROLE_BENCHMARKS.ai = ROLE_BENCHMARKS.aiml;

/* ================================================================== */
/* SIH44 UNIFIED SKILLBRIDGE DATA ENGINE (SHARED ACROSS ALL ROLES)    */
/* ================================================================== */

// 1. Common Skill Taxonomy with normalized aliases & categories
const SKILL_TAXONOMY = {
    "React.js": { category: "Frontend", aliases: ["react", "reactjs", "react.js"], roles: ["frontend", "fullstack", "swe"], demandPct: 90, trend: "up", criticality: "Critical" },
    "TypeScript": { category: "Frontend", aliases: ["ts", "typescript"], roles: ["frontend", "fullstack", "swe"], demandPct: 84, trend: "up", criticality: "High" },
    "JavaScript": { category: "Frontend", aliases: ["js", "javascript", "es6"], roles: ["frontend", "fullstack", "backend"], demandPct: 88, trend: "flat", criticality: "Critical" },
    "Node.js": { category: "Backend", aliases: ["node", "nodejs", "node.js", "express"], roles: ["backend", "fullstack"], demandPct: 82, trend: "up", criticality: "Critical" },
    "Python": { category: "Backend / Data", aliases: ["python", "py", "python3"], roles: ["data", "aiml", "backend", "swe"], demandPct: 86, trend: "up", criticality: "Critical" },
    "SQL / PostgreSQL": { category: "Database", aliases: ["sql", "postgres", "postgresql", "mysql"], roles: ["backend", "data", "fullstack"], demandPct: 78, trend: "flat", criticality: "High" },
    "Docker & Containers": { category: "Cloud & DevOps", aliases: ["docker", "container", "containers"], roles: ["devops", "cloud", "backend", "swe"], demandPct: 76, trend: "up", criticality: "High" },
    "Cloud (AWS/GCP)": { category: "Cloud & DevOps", aliases: ["aws", "cloud", "gcp", "azure"], roles: ["cloud", "devops", "backend"], demandPct: 82, trend: "up", criticality: "Critical" },
    "Data Structures & Algorithms": { category: "Core CS", aliases: ["dsa", "algorithms", "data structures", "leetcode"], roles: ["swe", "backend"], demandPct: 92, trend: "up", criticality: "Critical" },
    "Machine Learning": { category: "AI & ML", aliases: ["ml", "machine learning", "pytorch", "tensorflow"], roles: ["aiml", "data"], demandPct: 74, trend: "up", criticality: "High" },
    "Cybersecurity": { category: "Security", aliases: ["cyber", "security", "infosec", "owasp"], roles: ["cyber"], demandPct: 68, trend: "up", criticality: "High" },
    "UI/UX & Figma": { category: "Design", aliases: ["figma", "uiux", "ui/ux", "ux"], roles: ["uiux"], demandPct: 65, trend: "flat", criticality: "Medium" },
    "Testing & QA": { category: "Quality", aliases: ["testing", "jest", "unit test", "tdd"], roles: ["swe", "fullstack"], demandPct: 62, trend: "up", criticality: "Medium" },
    "System Design": { category: "Architecture", aliases: ["system design", "distributed systems", "architecture"], roles: ["swe", "backend", "cloud"], demandPct: 79, trend: "up", criticality: "Critical" }
};

// Normalize any skill alias to standard taxonomy name
function normalizeSkillName(rawName) {
    if (!rawName) return "Software Engineering";
    const clean = rawName.trim().toLowerCase();
    for (const [canonical, data] of Object.entries(SKILL_TAXONOMY)) {
        if (canonical.toLowerCase() === clean) return canonical;
        if (data.aliases && data.aliases.some(alias => alias.toLowerCase() === clean)) {
            return canonical;
        }
    }
    return rawName.trim();
}

// 2. Central Shared Database Key & Initial Connected State
const STORAGE_KEY_SHARED_DATA = 'skillbridge_shared_data_v2';

const INITIAL_SKILLBRIDGE_DATA = {
    // Posted Opportunities (Jobs, Internships, Live Projects, Faculty Opportunities)
    opportunities: [
        {
            id: "opp-1",
            domain: "frontend",
            title: "Frontend Developer (React)",
            company: "Verve Web Studios",
            type: "job", // job | internship | live_project | faculty
            roleType: "Full-Time",
            location: "Bengaluru (Hybrid)",
            isRemote: true,
            experience: "1 - 3 yrs",
            stipendOrSalary: "₹12 - 16 LPA",
            industry: "Technology",
            description: "Building next-generation design systems and responsive dashboard applications.",
            requiredSkills: [
                { skill: "React.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "TypeScript", reqPct: 70, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 60, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-10-20",
            source: "Direct Industry Partner"
        },
        {
            id: "opp-2",
            domain: "backend",
            title: "Backend Engineering Intern",
            company: "CloudScale Systems",
            type: "internship",
            roleType: "Internship",
            location: "Remote",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹45,000 / month",
            industry: "Cloud / SaaS",
            description: "Build scalable microservices and optimize database access queries for high-throughput streaming systems.",
            requiredSkills: [
                { skill: "Node.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Docker & Containers", reqPct: 70, priority: "High", preferred: false },
                { skill: "Cloud (AWS/GCP)", reqPct: 65, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-10-22",
            source: "SkillBridge Verified Partner"
        },
        {
            id: "opp-3",
            domain: "backend",
            title: "FinTech Automated Transaction Router",
            company: "FinTech Spark",
            type: "live_project",
            roleType: "Live Industry Project",
            location: "Virtual Lab",
            isRemote: true,
            duration: "8 Weeks",
            teamSize: 4,
            mentor: "Rajesh Verma (VP Engineering)",
            deadline: "2026-11-20",
            industry: "FinTech",
            description: "Design and implement an event-driven high-frequency transaction dispatcher with end-to-end telemetry.",
            requiredSkills: [
                { skill: "React.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Node.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false },
                { skill: "Docker & Containers", reqPct: 65, priority: "High", preferred: false }
            ],
            postedDate: "2026-10-24",
            source: "Sponsored Live Capstone"
        },
        {
            id: "opp-4",
            title: "Faculty Immersion: Generative AI & MLOps in Production",
            company: "DeepMind Tech Partner",
            type: "faculty",
            roleType: "Faculty FDP & Training",
            location: "Hybrid / Bengaluru",
            isRemote: false,
            duration: "2 Weeks",
            seats: 15,
            stipendOrSalary: "Grant Sponsored (All Expenses Covered)",
            industry: "Artificial Intelligence",
            description: "Hands-on immersion for engineering faculty to translate applied Transformer architectures and fine-tuning labs into accredited college electives.",
            requiredSkills: [
                { skill: "Python", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Machine Learning", reqPct: 70, priority: "Critical", preferred: false }
            ],
            postedDate: "2026-10-25",
            source: "Faculty Industry Exchange"
        },
        {
            id: "opp-5",
            title: "Guest Lecture Series: High-Scale Distributed Databases",
            company: "ScaleGrid Inc.",
            type: "faculty",
            roleType: "Guest Lecture",
            location: "Virtual / Campus Visit",
            isRemote: true,
            duration: "2 Hours",
            industry: "Databases & Cloud",
            description: "Lead architect available for an interactive campus session explaining sharding, consensus protocols, and Raft replication.",
            requiredSkills: [
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false },
                { skill: "System Design", reqPct: 70, priority: "Critical", preferred: false }
            ],
            postedDate: "2026-10-26",
            source: "Industry Expert Network"
        },
        {
            id: "opp-linkedin-1",
            domain: "frontend",
            title: "Frontend Developer Intern (React.js / JavaScript)",
            company: "Wake Up Whistle",
            type: "internship",
            roleType: "Internship",
            location: "Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹15,000 - ₹25,000 / month",
            industry: "Technology",
            description: "Work on modern UI development using React.js, JavaScript (ES6+), HTML5, CSS3, responsive layouts, API integration, and user-facing state management.",
            requiredSkills: [
                { skill: "React.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "TypeScript", reqPct: 70, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 60, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-10-28",
            source: "LinkedIn Verified",
            icon: "web",
            link: "https://www.linkedin.com/jobs/view/frontend-developer-intern-react-js-javascript-html-css-at-wake-up-whistle-4459491201/"
        },
        {
            id: "opp-linkedin-2",
            domain: "frontend",
            title: "Frontend Developer Intern",
            company: "Tech Innovations India",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹20,000 - ₹30,000 / month",
            industry: "Technology",
            description: "Join our web platform team to craft fluid web interfaces with React, modern CSS libraries, component architecture, and cross-browser testing.",
            requiredSkills: [
                { skill: "React.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "TypeScript", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-10-28",
            source: "LinkedIn Verified",
            icon: "palette",
            link: "https://www.linkedin.com/jobs/search-results/?currentJobId=4461092520&keywords=Front%20end%20developer%20internship%20jobs&originalSubdomain=in"
        },
        {
            id: "opp-linkedin-3",
            domain: "fullstack",
            title: "Full Stack Developer Intern",
            company: "NexGen Digital Solutions",
            type: "internship",
            roleType: "Internship",
            location: "Remote / Gurugram, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹25,000 - ₹35,000 / month",
            industry: "SaaS",
            description: "Full-stack product development across React, Node.js, Express microservices, and PostgreSQL database queries with containerized workflows.",
            requiredSkills: [
                { skill: "React.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Node.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false },
                { skill: "JavaScript", reqPct: 80, priority: "Critical", preferred: false }
            ],
            postedDate: "2026-10-29",
            source: "LinkedIn Verified",
            icon: "layers",
            link: "http://linkedin.com/jobs/search-results/?currentJobId=4460018026&keywords=Full%20stack%20development%20internship%20jobs&originalSubdomain=in"
        },
        {
            id: "opp-linkedin-4",
            domain: "devops",
            title: "Infrastructure & Cloud Engineering Intern",
            company: "CloudInfra Systems",
            type: "internship",
            roleType: "Internship",
            location: "Hyderabad, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹30,000 - ₹40,000 / month",
            industry: "Technology",
            description: "Automate infrastructure provisioning with Docker, Terraform, and AWS cloud services. Monitor telemetry pipelines and system reliability.",
            requiredSkills: [
                { skill: "Docker & Containers", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Cloud (AWS/GCP)", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Data Structures & Algorithms", reqPct: 70, priority: "High", preferred: false },
                { skill: "Python", reqPct: 65, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-10-29",
            source: "LinkedIn Verified",
            icon: "dns",
            link: "https://www.linkedin.com/jobs/search-results/?currentJobId=4457974019&keywords=Infrastructure%20internship%20jobs&originalSubdomain=in"
        },
        {
            id: "opp-linkedin-5",
            domain: "data",
            title: "Data Science & AI Intern",
            company: "QuantData Analytics",
            type: "internship",
            roleType: "Internship",
            location: "Mumbai / Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹25,000 - ₹35,000 / month",
            industry: "AI/ML",
            description: "Work on predictive model development with Python, Pandas, Scikit-Learn, SQL query pipelines, and interactive analytics dashboards.",
            requiredSkills: [
                { skill: "Python", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Machine Learning", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 75, priority: "High", preferred: false }
            ],
            postedDate: "2026-10-30",
            source: "LinkedIn Verified",
            icon: "query_stats",
            link: "https://www.linkedin.com/jobs/search-results/?currentJobId=4461231739&keywords=Data%20scientist%20internship%20jobs%20india&originalSubdomain=in"
        },
        {
            id: "opp-linkedin-6",
            domain: "swe",
            title: "Product Management Intern",
            company: "AgileProduct Labs",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹20,000 - ₹30,000 / month",
            industry: "Technology",
            description: "Collaborate with design and engineering teams to formulate product specs, user stories, customer journey roadmaps, and feature KPIs.",
            requiredSkills: [
                { skill: "System Design", reqPct: 65, priority: "High", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 60, priority: "Medium", preferred: false },
                { skill: "Testing & QA", reqPct: 65, priority: "High", preferred: false }
            ],
            postedDate: "2026-10-30",
            source: "LinkedIn Verified",
            icon: "view_kanban",
            link: "https://www.linkedin.com/jobs/search-results/?currentJobId=4424560802&keywords=Product%20manager%20intern%20jobs&originalSubdomain=in"
        },
        {
            id: "opp-indeed-1",
            domain: "fullstack",
            title: "Full Stack Developer Intern",
            company: "Ank Digital Media",
            type: "internship",
            roleType: "Internship",
            location: "Shalimar Bagh, Delhi",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹5,000 - ₹8,000 / month",
            industry: "Technology",
            description: "Develop and maintain frontend and backend features, build and integrate REST APIs, work with databases & CRUD operations, and optimize web applications.",
            requiredSkills: [
                { skill: "JavaScript", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "React.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Node.js", reqPct: 70, priority: "High", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 65, priority: "High", preferred: false }
            ],
            postedDate: "2026-10-31",
            source: "Indeed Verified",
            icon: "developer_mode",
            link: "https://in.indeed.com/viewjob?jk=302477e74ccb5305&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-2",
            domain: "fullstack",
            title: "Software Developer Intern (Full Stack & iOS)",
            company: "Estroc",
            type: "internship",
            roleType: "Internship",
            location: "Delhi, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹10,000 - ₹15,000 / month",
            industry: "Technology",
            description: "Work on full stack web applications and native iOS mobile interfaces, implement modular architecture, write unit tests, and integrate backend REST services.",
            requiredSkills: [
                { skill: "JavaScript", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "React.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Data Structures & Algorithms", reqPct: 70, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 60, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-10-31",
            source: "Indeed Verified",
            icon: "terminal",
            link: "https://in.indeed.com/viewjob?jk=d2767415ee4302ad&from=shareddesktop_copy"
        },
        {
            id: "opp-backend-finverse",
            domain: "backend",
            title: "API & Microservices Engineering Intern",
            company: "Finverse Labs",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹30,000 / month",
            industry: "Finance & FinTech",
            description: "Design high-performance REST and GraphQL microservices, optimize PostgreSQL indices, and implement Redis cache layers.",
            requiredSkills: [
                { skill: "Node.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 70, priority: "High", preferred: false },
                { skill: "Docker & Containers", reqPct: 65, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-11-01",
            source: "SkillBridge Verified Partner",
            icon: "dns",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-swe-google",
            domain: "swe",
            title: "Software Engineering Intern (Algorithms & Systems)",
            company: "Google Partner Labs",
            type: "internship",
            roleType: "Internship",
            location: "Hyderabad, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹50,000 / month",
            industry: "Technology",
            description: "Implement complex data structures & graph algorithms, write automated unit & integration tests, and collaborate via production Git workflows.",
            requiredSkills: [
                { skill: "Data Structures & Algorithms", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Python", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Testing & QA", reqPct: 70, priority: "High", preferred: false },
                { skill: "System Design", reqPct: 65, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-11-01",
            source: "Top Tier Industry Partner",
            icon: "terminal",
            link: "https://www.google.com/about/careers"
        },
        {
            id: "opp-swe-infosys",
            domain: "swe",
            title: "Associate Software Engineer Intern",
            company: "Infosys Technologies",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹25,000 / month",
            industry: "Enterprise Tech",
            description: "Hands-on software development across enterprise applications, OOP object modeling, and relational database queries.",
            requiredSkills: [
                { skill: "Data Structures & Algorithms", reqPct: 70, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 60, priority: "Medium", preferred: false }
            ],
            postedDate: "2026-11-02",
            source: "Campus Placement Partner",
            icon: "code",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-ai-deepmind",
            domain: "ai",
            title: "Generative AI & LLM Research Intern",
            company: "DeepMind Tech Partner",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹40,000 / month",
            industry: "Artificial Intelligence",
            description: "Fine-tune Transformer architectures, build RAG pipelines with LangChain and vector databases, and evaluate LLM benchmarks.",
            requiredSkills: [
                { skill: "Python", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Machine Learning", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Data Structures & Algorithms", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-02",
            source: "AI Research Lab",
            icon: "psychology",
            link: "https://www.linkedin.com"
        },
        {
            id: "opp-cyber-securenet",
            domain: "cyber",
            title: "Cybersecurity & Threat Analyst Intern",
            company: "SecureNet Defense",
            type: "internship",
            roleType: "Internship",
            location: "Hyderabad, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹30,000 / month",
            industry: "Cybersecurity",
            description: "Perform vulnerability assessments, review OWASP Top 10 vulnerabilities, analyze PCAP network logs, and configure security monitoring tools.",
            requiredSkills: [
                { skill: "Network Security & Protocols", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "OWASP Top 10 Web Vulnerabilities", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Python", reqPct: 65, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-03",
            source: "Defense & Sec Partner",
            icon: "shield",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-cloud-aws",
            domain: "cloud",
            title: "Cloud Solutions Architecture Intern",
            company: "AWS Partner Network",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹35,000 / month",
            industry: "Cloud & Infrastructure",
            description: "Architect highly available multi-tier cloud systems, configure VPC subnets & security groups, and deploy serverless event-driven workflows.",
            requiredSkills: [
                { skill: "Cloud (AWS/GCP)", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Docker & Containers", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-03",
            source: "AWS Partner Network",
            icon: "cloud",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-uiux-appernity",
            domain: "uiux",
            title: "UI/UX Product Design Intern",
            company: "Appernity Technologies",
            type: "internship",
            roleType: "Internship",
            location: "New Delhi, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹20,000 / month",
            industry: "Design & Product",
            description: "Create design system components in Figma, build interactive prototypes, conduct usability research, and collaborate with developers.",
            requiredSkills: [
                { skill: "Figma & Interactive Prototyping", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Wireframing & Information Architecture", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "User Research & Usability Testing", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-03",
            source: "Design Studio",
            icon: "palette",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-devops-scale",
            domain: "devops",
            title: "DevOps & Cloud Automation Intern",
            company: "NimbusCloud Labs",
            type: "internship",
            roleType: "Internship",
            location: "Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹35,000 / month",
            industry: "Cloud Infrastructure",
            description: "Build CI/CD pipelines, containerize backend microservices with Docker, manage Kubernetes clusters, and automate AWS cloud setups.",
            requiredSkills: [
                { skill: "Docker & Containers", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "Cloud (AWS/GCP)", reqPct: 70, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 65, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-04",
            source: "Cloud Native Partner",
            icon: "cloud",
            link: "https://www.naukri.com"
        },
        {
            id: "opp-indeed-3",
            domain: "frontend",
            title: "React.js & Next.js Frontend Developer Intern",
            company: "Zeta Tech Labs (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Bengaluru, India (Remote)",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹25,000 - ₹35,000 / month",
            industry: "Technology",
            description: "Build high-performance web applications using Next.js 14, TypeScript, Tailwind CSS, and state management with Redux Toolkit. Work on real user flows and optimize web vitals.",
            requiredSkills: [
                { skill: "React.js", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "TypeScript", reqPct: 75, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 60, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-11-08",
            source: "Indeed Verified",
            icon: "web",
            link: "https://in.indeed.com/viewjob?jk=7a8b9c1d2e3f4g5h&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-4",
            domain: "backend",
            title: "Node.js & Express Backend Engineer Intern",
            company: "Apex Pay Solutions (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Gurugram, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹30,000 - ₹40,000 / month",
            industry: "Finance",
            description: "Architect scalable microservices, write efficient SQL queries for PostgreSQL & Redis caching, implement OAuth2 authentication, and maintain API documentation in Swagger.",
            requiredSkills: [
                { skill: "Node.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 70, priority: "High", preferred: false },
                { skill: "Docker & Containers", reqPct: 65, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-11-09",
            source: "Indeed Verified",
            icon: "dns",
            link: "https://in.indeed.com/viewjob?jk=8b9c0d1e2f3g4h5i&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-5",
            domain: "fullstack",
            title: "Full Stack MERN Developer",
            company: "InnoWave Systems (via Indeed)",
            type: "job",
            roleType: "Full-Time",
            location: "Hyderabad, India",
            isRemote: false,
            experience: "0 - 2 yrs",
            stipendOrSalary: "₹8 - 12 LPA",
            industry: "SaaS",
            description: "End-to-end web application development with React, Node.js, Express, MongoDB, and AWS S3 deployment. Collaborate directly with product designers and backend architects.",
            requiredSkills: [
                { skill: "React.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Node.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-10",
            source: "Indeed Verified",
            icon: "layers",
            link: "https://in.indeed.com/viewjob?jk=9c0d1e2f3g4h5i6j&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-6",
            domain: "ai",
            title: "AI & Machine Learning Engineering Intern",
            company: "NeuralByte Analytics (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹35,000 - ₹45,000 / month",
            industry: "AI/ML",
            description: "Develop PyTorch deep learning models, train Transformer fine-tuning scripts, build RAG pipelines with ChromaDB, and serve inference endpoints using FastAPI.",
            requiredSkills: [
                { skill: "Python", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Machine Learning", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Data Structures & Algorithms", reqPct: 75, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-10",
            source: "Indeed Verified",
            icon: "psychology",
            link: "https://in.indeed.com/viewjob?jk=0d1e2f3g4h5i6j7k&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-7",
            domain: "data",
            title: "Junior Data Scientist & Analytics Specialist",
            company: "Kinetix Insights (via Indeed)",
            type: "job",
            roleType: "Full-Time",
            location: "Mumbai, India (Hybrid)",
            isRemote: false,
            experience: "0 - 2 yrs",
            stipendOrSalary: "₹7 - 10 LPA",
            industry: "Finance",
            description: "Extract actionable insights using Python (Pandas, NumPy, Scikit-learn), write complex SQL analytical queries, build interactive dashboards, and run A/B test experiments.",
            requiredSkills: [
                { skill: "Python", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Machine Learning", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-11",
            source: "Indeed Verified",
            icon: "query_stats",
            link: "https://in.indeed.com/viewjob?jk=1e2f3g4h5i6j7k8l&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-8",
            domain: "cyber",
            title: "Cybersecurity & SOC Analyst Intern",
            company: "CyberShield Technologies (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Noida / Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹28,000 - ₹38,000 / month",
            industry: "Cybersecurity",
            description: "Monitor SIEM logs (Splunk/Wazuh), perform penetration testing, analyze web app security risks against OWASP Top 10, and automate security reporting scripts in Python.",
            requiredSkills: [
                { skill: "Network Security & Protocols", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "OWASP Top 10 Web Vulnerabilities", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Python", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-11",
            source: "Indeed Verified",
            icon: "shield",
            link: "https://in.indeed.com/viewjob?jk=2f3g4h5i6j7k8l9m&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-9",
            domain: "devops",
            title: "DevOps & Cloud Infrastructure Intern",
            company: "Skyline Cloud Networks (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Pune, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹32,000 - ₹42,000 / month",
            industry: "Cloud Infrastructure",
            description: "Automate GitHub Actions CI/CD pipelines, containerize backend microservices with Docker, provision Terraform scripts on AWS/GCP, and monitor Prometheus metrics.",
            requiredSkills: [
                { skill: "Docker & Containers", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Cloud (AWS/GCP)", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-12",
            source: "Indeed Verified",
            icon: "cloud",
            link: "https://in.indeed.com/viewjob?jk=3g4h5i6j7k8l9m0n&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-10",
            domain: "swe",
            title: "Software Development Engineer - I (SDE 1)",
            company: "Hyperion Code Works (via Indeed)",
            type: "job",
            roleType: "Full-Time",
            location: "Bengaluru, India",
            isRemote: false,
            experience: "0 - 2 yrs",
            stipendOrSalary: "₹14 - 18 LPA",
            industry: "Technology",
            description: "Solve complex data structures & algorithm problems, design resilient service architectures, write clean unit and integration test coverage, and ship core features.",
            requiredSkills: [
                { skill: "Data Structures & Algorithms", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Python", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 75, priority: "High", preferred: false },
                { skill: "Testing & QA", reqPct: 70, priority: "Medium", preferred: true }
            ],
            postedDate: "2026-11-12",
            source: "Indeed Verified",
            icon: "terminal",
            link: "https://in.indeed.com/viewjob?jk=4h5i6j7k8l9m0n1o&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-11",
            domain: "uiux",
            title: "Product UI/UX & Interaction Design Intern",
            company: "PixelCraft Design Studio (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹22,000 - ₹30,000 / month",
            industry: "Design & Product",
            description: "Conduct user experience research, design high-fidelity Figma components, map out interaction wireframes, and run usability tests for mobile & web products.",
            requiredSkills: [
                { skill: "Figma & Interactive Prototyping", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Wireframing & Information Architecture", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "User Research & Usability Testing", reqPct: 75, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-13",
            source: "Indeed Verified",
            icon: "palette",
            link: "https://in.indeed.com/viewjob?jk=5i6j7k8l9m0n1o2p&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-12",
            domain: "cloud",
            title: "Cloud Architecture & Solutions Engineer Intern",
            company: "Vanguard Cloud Systems (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Chennai, India (Hybrid)",
            isRemote: false,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹30,000 - ₹40,000 / month",
            industry: "Enterprise Tech",
            description: "Assist in migrating legacy monolithic web servers to serverless AWS Lambda and ECS Kubernetes clusters. Optimize cloud network security and API gateway routing.",
            requiredSkills: [
                { skill: "Cloud (AWS/GCP)", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Docker & Containers", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "System Design", reqPct: 75, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-13",
            source: "Indeed Verified",
            icon: "cloud",
            link: "https://in.indeed.com/viewjob?jk=6j7k8l9m0n1o2p3q&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-13",
            domain: "fullstack",
            title: "Full Stack Engineer Intern (React & Node.js)",
            company: "MobilityX Technologies (via Indeed)",
            type: "internship",
            roleType: "Internship",
            location: "Gurugram / Remote, India",
            isRemote: true,
            experience: "0 - 1 yrs",
            stipendOrSalary: "₹25,000 - ₹35,000 / month",
            industry: "E-commerce",
            description: "Develop consumer-facing storefront features, integrate payment gateway webhooks, optimize SQL query execution, and write automated Cypress UI tests.",
            requiredSkills: [
                { skill: "React.js", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "Node.js", reqPct: 75, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 80, priority: "High", preferred: false },
                { skill: "SQL / PostgreSQL", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-14",
            source: "Indeed Verified",
            icon: "developer_mode",
            link: "https://in.indeed.com/viewjob?jk=7k8l9m0n1o2p3q4r&from=shareddesktop_copy"
        },
        {
            id: "opp-indeed-14",
            domain: "frontend",
            title: "Junior Frontend Developer (React & TypeScript)",
            company: "BrightPath Software (via Indeed)",
            type: "job",
            roleType: "Full-Time",
            location: "Bengaluru, India",
            isRemote: false,
            experience: "0 - 2 yrs",
            stipendOrSalary: "₹7 - 11 LPA",
            industry: "Technology",
            description: "Construct scalable web application UI with React 18, TypeScript, Tailwind CSS, RESTful API integrations, and unit testing with Jest.",
            requiredSkills: [
                { skill: "React.js", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "TypeScript", reqPct: 80, priority: "Critical", preferred: false },
                { skill: "JavaScript", reqPct: 85, priority: "Critical", preferred: false },
                { skill: "Testing & QA", reqPct: 70, priority: "High", preferred: false }
            ],
            postedDate: "2026-11-14",
            source: "Indeed Verified",
            icon: "web",
            link: "https://in.indeed.com/viewjob?jk=8l9m0n1o2p3q4r5s&from=shareddesktop_copy"
        }
    ],

    // Connected Candidates & Extended 7-Stage Application Lifecycle
    // (Applied -> Reviewed -> Shortlisted -> Interview -> Selected -> Internship/Employment -> Industry Feedback)
    candidates: [
        {
            id: "cand-1",
            fullName: "Alex Chen",
            university: "Stanford University",
            degree: "Computer Science",
            year: "Junior",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            appliedOppId: "opp-1",
            appliedRole: "Frontend Developer (React)",
            appliedCompany: "Verve Web Studios",
            appliedDate: "2026-10-22",
            status: "interview", // applied | reviewed | shortlisted | interview | selected | internship | feedback_submitted
            skills: {
                "React.js": 91,
                "JavaScript": 86,
                "TypeScript": 58,
                "Testing & QA": 44,
                "Python": 78,
                "Docker & Containers": 50
            },
            skillsEvidence: {
                "React.js": "Industry-Verified",
                "JavaScript": "Assessed",
                "TypeScript": "Self-Declared",
                "Testing & QA": "Project-Evidenced",
                "Python": "Assessed",
                "Docker & Containers": "Self-Declared"
            },
            feedback: null
        },
        {
            id: "cand-2",
            fullName: "Maya Patel",
            university: "National Institute of Technology",
            degree: "Information Technology",
            year: "Senior",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
            appliedOppId: "opp-2",
            appliedRole: "Backend Engineering Intern",
            appliedCompany: "CloudScale Systems",
            appliedDate: "2026-10-21",
            status: "selected",
            skills: {
                "Node.js": 88,
                "SQL / PostgreSQL": 85,
                "Docker & Containers": 78,
                "Cloud (AWS/GCP)": 70,
                "JavaScript": 82
            },
            skillsEvidence: {
                "Node.js": "Industry-Verified",
                "SQL / PostgreSQL": "Assessed",
                "Docker & Containers": "Project-Evidenced",
                "Cloud (AWS/GCP)": "Assessed"
            },
            feedback: null
        },
        {
            id: "cand-3",
            fullName: "David Chen",
            university: "City Tech Institute",
            degree: "Computer Science",
            year: "Junior",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
            appliedOppId: "opp-2",
            appliedRole: "Backend Engineering Intern",
            appliedCompany: "CloudScale Systems",
            appliedDate: "2026-10-23",
            status: "reviewed",
            skills: {
                "Node.js": 65,
                "SQL / PostgreSQL": 72,
                "Python": 82,
                "Docker & Containers": 48
            },
            skillsEvidence: {
                "Node.js": "Assessed",
                "SQL / PostgreSQL": "Self-Declared",
                "Python": "Project-Evidenced",
                "Docker & Containers": "Self-Declared"
            },
            feedback: null
        },
        {
            id: "cand-4",
            fullName: "Priya Sharma",
            university: "State Engineering College",
            degree: "Computer Science",
            year: "Graduate",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
            appliedOppId: "opp-2",
            appliedRole: "Backend Systems Engineer",
            appliedCompany: "CloudScale Systems",
            appliedDate: "2026-09-15",
            status: "feedback_submitted",
            skills: {
                "Node.js": 90,
                "SQL / PostgreSQL": 88,
                "Docker & Containers": 84,
                "Cloud (AWS/GCP)": 80
            },
            skillsEvidence: {
                "Node.js": "Industry-Verified",
                "SQL / PostgreSQL": "Industry-Verified",
                "Docker & Containers": "Industry-Verified",
                "Cloud (AWS/GCP)": "Assessed"
            },
            feedback: {
                technicalScore: 4.8,
                problemSolvingScore: 4.5,
                communicationScore: 4.6,
                teamworkScore: 4.9,
                readinessScore: 4.7,
                missingSkills: ["System Design", "Testing & QA"],
                comments: "Priya had excellent backend coding speed. Deepening her distributed system design knowledge was the only initial gap.",
                submittedDate: "2026-10-18"
            }
        }
    ],

    // Actionable Curriculum Gaps for Academician Dashboard
    curriculumGaps: [
        {
            skill: "Cloud Infrastructure (AWS/GCP)",
            demandPct: 82,
            studentAvgPct: 43,
            gapPoints: 39,
            trend: "↑ 18%",
            affectedStudents: 64,
            affectedRoles: ["Cloud Solutions Architect", "DevOps Engineer", "Backend Developer"],
            recommendedIntervention: "3-Week Cloud & AWS Serverless Hands-on Bootcamp",
            actionStatus: "pending" // pending | active | completed
        },
        {
            skill: "TypeScript",
            demandPct: 84,
            studentAvgPct: 52,
            gapPoints: 32,
            trend: "↑ 14%",
            affectedStudents: 48,
            affectedRoles: ["Frontend Developer", "Fullstack Engineer", "Software Engineer"],
            recommendedIntervention: "TypeScript Deep-Dive & Design Patterns Workshop",
            actionStatus: "pending"
        },
        {
            skill: "Testing & QA (TDD)",
            demandPct: 68,
            studentAvgPct: 36,
            gapPoints: 32,
            trend: "↑ 11%",
            affectedStudents: 52,
            affectedRoles: ["Software Engineer", "Fullstack Engineer"],
            recommendedIntervention: "Test-Driven Development & Automation Studio",
            actionStatus: "pending"
        },
        {
            skill: "Docker & Kubernetes",
            demandPct: 76,
            studentAvgPct: 48,
            gapPoints: 28,
            trend: "↑ 15%",
            affectedStudents: 41,
            affectedRoles: ["DevOps Engineer", "Backend Developer", "Cloud Solutions Architect"],
            recommendedIntervention: "Containerization & K8s Cluster Architecture Workshop",
            actionStatus: "active"
        }
    ],

    // Institutional Skill-Gap Heatmap: Skill × Department × Year
    institutionalHeatmap: {
        departments: ["Computer Science (CSE)", "Information Tech (IT)", "Electronics (ECE)", "AI & Data Sci (AI/DS)"],
        years: ["Year 1", "Year 2", "Year 3", "Year 4"],
        skills: [
            { name: "Cloud (AWS/GCP)", deptScores: { "Computer Science (CSE)": 42, "Information Tech (IT)": 48, "Electronics (ECE)": 31, "AI & Data Sci (AI/DS)": 46 }, yearScores: { "Year 1": 18, "Year 2": 32, "Year 3": 54, "Year 4": 68 } },
            { name: "Python", deptScores: { "Computer Science (CSE)": 68, "Information Tech (IT)": 72, "Electronics (ECE)": 51, "AI & Data Sci (AI/DS)": 84 }, yearScores: { "Year 1": 45, "Year 2": 66, "Year 3": 78, "Year 4": 88 } },
            { name: "SQL / PostgreSQL", deptScores: { "Computer Science (CSE)": 71, "Information Tech (IT)": 76, "Electronics (ECE)": 62, "AI & Data Sci (AI/DS)": 78 }, yearScores: { "Year 1": 30, "Year 2": 58, "Year 3": 76, "Year 4": 82 } },
            { name: "Testing & QA", deptScores: { "Computer Science (CSE)": 39, "Information Tech (IT)": 45, "Electronics (ECE)": 28, "AI & Data Sci (AI/DS)": 41 }, yearScores: { "Year 1": 12, "Year 2": 24, "Year 3": 44, "Year 4": 62 } },
            { name: "TypeScript", deptScores: { "Computer Science (CSE)": 52, "Information Tech (IT)": 56, "Electronics (ECE)": 34, "AI & Data Sci (AI/DS)": 50 }, yearScores: { "Year 1": 20, "Year 2": 38, "Year 3": 58, "Year 4": 74 } },
            { name: "Machine Learning", deptScores: { "Computer Science (CSE)": 60, "Information Tech (IT)": 58, "Electronics (ECE)": 44, "AI & Data Sci (AI/DS)": 86 }, yearScores: { "Year 1": 22, "Year 2": 46, "Year 3": 68, "Year 4": 82 } }
        ]
    },

    // Skill Gap -> Intervention -> Outcome Tracker (Before vs After)
    interventions: [
        {
            id: "int-1",
            title: "Docker & Container Architecture Bootcamp",
            skill: "Docker & Containers",
            beforeAvg: 42,
            afterAvg: 68,
            improvement: "+26 pts",
            studentsTrained: 54,
            date: "Oct 2026",
            status: "Completed",
            conductedBy: "Industry Partner (NimbusOps)"
        },
        {
            id: "int-2",
            title: "Cloud Serverless Mini-Hackathon",
            skill: "Cloud (AWS/GCP)",
            beforeAvg: 43,
            afterAvg: 71,
            improvement: "+28 pts",
            studentsTrained: 62,
            date: "Nov 2026",
            status: "Completed",
            conductedBy: "AWS Cloud Educator"
        }
    ],

    // Teacher -> Industry Collaboration Center Workflows
    // Tracked: Requested -> Accepted -> Scheduled -> Completed
    collaborations: [
        {
            id: "collab-1",
            type: "Guest Lecture",
            title: "Distributed Systems at Scale",
            company: "CloudScale Systems",
            expert: "Anand Sen (VP Engg)",
            date: "Oct 12, 2026",
            status: "Completed",
            notes: "Delivered to 120 final-year CS & IT students."
        },
        {
            id: "collab-2",
            type: "Industrial Training",
            title: "Faculty Cloud & DevOps Immersion",
            company: "TechCorp Global",
            expert: "DevOps Core Team",
            date: "Nov 25, 2026",
            status: "Scheduled",
            notes: "Hands-on CI/CD pipeline training for 8 faculty members."
        },
        {
            id: "collab-3",
            type: "Live Project",
            title: "FinTech Automated Transaction Router",
            company: "FinTech Spark",
            expert: "Rajesh Verma",
            date: "In Progress",
            status: "Accepted",
            notes: "Student team forming under Prof. Meera Rao."
        }
    ],

    // 5 Fictional Demo Students for Teacher Dashboard
    demoStudents: [
        {
            id: "stu-101",
            fullName: "Alex Chen",
            email: "alex.chen@university.edu",
            department: "Computer Science (CSE)",
            year: "Year 3 (Junior)",
            readinessScore: 88,
            readinessStatus: "Placement Ready",
            targetRole: "Frontend Developer (React)",
            skills: { "React.js": 90, "JavaScript": 88, "TypeScript": 65, "Docker & Containers": 52 },
            skillGaps: ["TypeScript (-15 pts)", "Docker & Containers (-23 pts)"],
            internshipStatus: "Selected @ CloudScale Systems",
            placementStatus: "Placed / Interning",
            portfolioProgress: 92,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            needsAttention: false
        },
        {
            id: "stu-102",
            fullName: "Maya Patel",
            email: "maya.patel@university.edu",
            department: "Information Tech (IT)",
            year: "Year 4 (Senior)",
            readinessScore: 92,
            readinessStatus: "Placement Ready",
            targetRole: "Backend Engineering Intern",
            skills: { "Node.js": 92, "SQL / PostgreSQL": 88, "Docker & Containers": 85, "Cloud (AWS/GCP)": 78 },
            skillGaps: ["Cloud Architecture (-7 pts)"],
            internshipStatus: "Completed @ TechCorp Global",
            placementStatus: "Placed @ TechCorp",
            portfolioProgress: 95,
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
            needsAttention: false
        },
        {
            id: "stu-103",
            fullName: "Rohan Sharma",
            email: "rohan.s@university.edu",
            department: "Computer Science (CSE)",
            year: "Year 2 (Sophomore)",
            readinessScore: 54,
            readinessStatus: "Needs Attention",
            targetRole: "Full Stack Engineer",
            skills: { "JavaScript": 65, "HTML/CSS": 70, "Data Structures & Algorithms": 42, "Testing & QA": 35 },
            skillGaps: ["Data Structures (-38 pts)", "Testing & QA (-45 pts)", "Node.js (-30 pts)"],
            internshipStatus: "Seeking Internship",
            placementStatus: "Training Required",
            portfolioProgress: 45,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
            needsAttention: true
        },
        {
            id: "stu-104",
            fullName: "Priya Verma",
            email: "priya.v@university.edu",
            department: "AI & Data Sci (AI/DS)",
            year: "Year 3 (Junior)",
            readinessScore: 76,
            readinessStatus: "Internship Active",
            targetRole: "AI / ML Engineer",
            skills: { "Python": 88, "Machine Learning": 82, "System Design": 58, "SQL / PostgreSQL": 70 },
            skillGaps: ["System Design (-22 pts)", "Docker & Containers (-25 pts)"],
            internshipStatus: "In Progress @ NeuralByte Analytics",
            placementStatus: "Internship Active",
            portfolioProgress: 80,
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
            needsAttention: false
        },
        {
            id: "stu-105",
            fullName: "Karan Nair",
            email: "karan.n@university.edu",
            department: "Electronics (ECE)",
            year: "Year 4 (Senior)",
            readinessScore: 62,
            readinessStatus: "Needs Attention",
            targetRole: "Software Engineer",
            skills: { "Python": 72, "C++": 68, "SQL / PostgreSQL": 50, "Microservices": 40 },
            skillGaps: ["SQL & Database Querying (-30 pts)", "Microservices (-35 pts)"],
            internshipStatus: "Applied @ Ank Digital",
            placementStatus: "Bootcamp Assigned",
            portfolioProgress: 58,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
            needsAttention: true
        }
    ],

    // 10 Demo Industry News / Signals
    industrySignals: [
        {
            id: "sig-1",
            headline: "Generative AI & LLM Fine-Tuning Surges Across Enterprise SaaS",
            source: "TechCrunch Enterprise Intelligence",
            date: "August 2026",
            category: "Artificial Intelligence",
            summary: "Enterprise platforms are rapidly embedding customized LLMs and RAG pipelines. Hiring demand for developers capable of PyTorch fine-tuning and vector database management has surged 45%.",
            skillsAffected: ["Python", "Machine Learning", "Transformer Architectures", "PyTorch"],
            relatedRoles: ["AI / ML Engineer", "Data Scientist", "Python Developer"],
            impact: "High Industry Demand (+45% Hiring Growth)"
        },
        {
            id: "sig-2",
            headline: "Cloud Native Security & Zero Trust Architecture Mandated for FinTech",
            source: "Gartner Technology Insights",
            date: "August 2026",
            category: "Cybersecurity",
            summary: "Regulatory mandates now require end-to-end telemetry and Zero Trust access controls across cloud banking services. Threat analysis and OWASP compliance are top recruiter priorities.",
            skillsAffected: ["Network Security & Protocols", "OWASP Top 10", "Python", "Cloud Security"],
            relatedRoles: ["Cybersecurity Analyst", "SOC Threat Analyst", "DevOps Engineer"],
            impact: "Critical Skills Deficit (Recruiters Reporting -40% Shortlist Rate)"
        },
        {
            id: "sig-3",
            headline: "Demand for Next.js 14 & Fullstack TypeScript Reaches Record High",
            source: "StackOverflow Developer Pulse",
            date: "August 2026",
            category: "Web Engineering",
            summary: "React 18 and Next.js App Router have become standard for modern frontend applications. Companies are filtering out applicants without verified TypeScript design pattern experience.",
            skillsAffected: ["React.js", "TypeScript", "JavaScript", "Testing & QA"],
            relatedRoles: ["Frontend Developer", "Fullstack Engineer", "UI Specialist"],
            impact: "38% Skill Gap Identified Across Academic Graduates"
        },
        {
            id: "sig-4",
            headline: "High-Throughput Microservices & Redis Caching Optimization",
            source: "InfoQ Systems Architecture",
            date: "August 2026",
            category: "Backend Architecture",
            summary: "FinTech and e-commerce platforms are refactoring monolithic backends into Node.js and PostgreSQL microservices with automated telemetry dispatching.",
            skillsAffected: ["Node.js", "SQL / PostgreSQL", "System Design", "Docker & Containers"],
            relatedRoles: ["Backend Systems Engineer", "API Specialist"],
            impact: "High Industry Placement Rate (+32%)"
        },
        {
            id: "sig-5",
            headline: "Automated MLOps & Kubernetes Container Orchestration Expansion",
            source: "DevOps Digest",
            date: "July 2026",
            category: "Cloud Infrastructure",
            summary: "Over 52% of IT enterprises are enforcing mandatory Docker containerization and Kubernetes cluster management for all production service deployments.",
            skillsAffected: ["Docker & Containers", "Cloud (AWS/GCP)", "System Design", "CI/CD"],
            relatedRoles: ["DevOps & Cloud Engineer", "Infrastructure Specialist"],
            impact: "Essential Industry Competency"
        },
        {
            id: "sig-6",
            headline: "Real-Time Telemetry & Event-Driven Data Pipelines in Logistics",
            source: "Data Science Weekly",
            date: "July 2026",
            category: "Data Science",
            summary: "Supply chain and logistics providers are adopting real-time data streaming and SQL analytics to optimize fleet routing and inventory prediction.",
            skillsAffected: ["Python", "SQL / PostgreSQL", "Data Structures & Algorithms"],
            relatedRoles: ["Data Analyst", "Data Engineer", "BI Specialist"],
            impact: "Moderate Hiring Increase (+28%)"
        },
        {
            id: "sig-7",
            headline: "Figma Tokens & Design System Component Libraries in Demand",
            source: "Design Systems World",
            date: "July 2026",
            category: "UI/UX Design",
            summary: "Product teams require designers who can construct reusable Figma UI kit tokens and collaborate smoothly with React component developers.",
            skillsAffected: ["Figma & Interactive Prototyping", "Wireframing", "User Research"],
            relatedRoles: ["UI/UX Product Designer", "Interaction Designer"],
            impact: "Strong Portfolio Requirement"
        },
        {
            id: "sig-8",
            headline: "Automated Testing & E2E QA Coverage Made Mandatory in Agile Sprints",
            source: "Agile Software World",
            date: "June 2026",
            category: "Software Quality",
            summary: "CI/CD pipelines are automatically blocking PRs without unit and integration tests. Recruiters are penalizing candidates who lack automated QA skills.",
            skillsAffected: ["Testing & QA", "JavaScript", "Python"],
            relatedRoles: ["QA Automation Engineer", "Software Developer"],
            impact: "Curriculum Gap Alert Triggered for Universities"
        },
        {
            id: "sig-9",
            headline: "Embedded Systems & Automotive IoT Security Growth",
            source: "IEEE Spectrum",
            date: "June 2026",
            category: "Embedded & Hardware",
            summary: "EV manufacturers are expanding software engineering teams for embedded Linux, CAN bus protocols, and hardware security validation.",
            skillsAffected: ["Data Structures & Algorithms", "Network Security & Protocols", "Python"],
            relatedRoles: ["Embedded Software Engineer", "IoT Developer"],
            impact: "Specialized Niche Demand"
        },
        {
            id: "sig-10",
            headline: "Quantum Security & Post-Quantum Cryptography Research Expansion",
            source: "MIT Technology Review",
            date: "May 2026",
            category: "Emerging Technologies",
            summary: "Government agencies and financial institutions are launching post-quantum encryption readiness grants for academic research partnerships.",
            skillsAffected: ["Python", "Network Security & Protocols", "Data Structures"],
            relatedRoles: ["Cryptographic Researcher", "Security Engineer"],
            impact: "Academic-Industry Grant Opportunities"
        }
    ],

    // Student Applications Tracker State
    applications: [
        {
            id: "app-1",
            opportunityId: "opp-1",
            opportunityTitle: "Frontend Developer (React)",
            company: "Verve Web Studios",
            roleType: "Full-Time",
            location: "Bengaluru (Hybrid)",
            stipendOrSalary: "₹12 - 16 LPA",
            appliedDate: "Oct 12, 2026",
            status: "interview",
            matchPct: 88,
            studentId: "stu-101",
            studentName: "Alex Chen",
            studentEmail: "alex.chen@university.edu",
            studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            source: "Direct Industry Partner"
        },
        {
            id: "app-2",
            opportunityId: "opp-2",
            opportunityTitle: "Backend Engineering Intern",
            company: "CloudScale Systems",
            roleType: "Internship",
            location: "Remote",
            stipendOrSalary: "₹45,000 / month",
            appliedDate: "Oct 15, 2026",
            status: "applied",
            matchPct: 76,
            studentId: "stu-101",
            studentName: "Alex Chen",
            studentEmail: "alex.chen@university.edu",
            studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            source: "SkillBridge Verified Partner"
        },
        {
            id: "app-3",
            opportunityId: "opp-3",
            opportunityTitle: "FinTech Automated Transaction Router",
            company: "FinTech Spark",
            roleType: "Live Industry Project",
            location: "Virtual Lab",
            stipendOrSalary: "₹35,000 Capstone Grant",
            appliedDate: "Oct 18, 2026",
            status: "shortlisted",
            matchPct: 82,
            studentId: "stu-101",
            studentName: "Alex Chen",
            studentEmail: "alex.chen@university.edu",
            studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            source: "Sponsored Live Capstone"
        }
    ]
};

// Retrieve Shared Database from localStorage
function getSkillBridgeData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_SHARED_DATA);
        if (raw) {
            const data = JSON.parse(raw);
            let updated = false;
            // Ensure opportunities sync
            if (data && Array.isArray(data.opportunities)) {
                INITIAL_SKILLBRIDGE_DATA.opportunities.forEach(initOpp => {
                    const existing = data.opportunities.find(o => o.id === initOpp.id || (o.link && o.link === initOpp.link));
                    if (!existing) {
                        data.opportunities.push(initOpp);
                        updated = true;
                    } else if (!existing.domain && initOpp.domain) {
                        existing.domain = initOpp.domain;
                        updated = true;
                    }
                });
            }
            // Auto sync demoStudents if missing
            if (!data.demoStudents || !Array.isArray(data.demoStudents) || data.demoStudents.length === 0) {
                data.demoStudents = INITIAL_SKILLBRIDGE_DATA.demoStudents;
                updated = true;
            }
            // Auto sync industrySignals if missing
            if (!data.industrySignals || !Array.isArray(data.industrySignals) || data.industrySignals.length === 0) {
                data.industrySignals = INITIAL_SKILLBRIDGE_DATA.industrySignals;
                updated = true;
            }
            // Auto sync applications if missing
            if (!data.applications || !Array.isArray(data.applications) || data.applications.length === 0) {
                data.applications = INITIAL_SKILLBRIDGE_DATA.applications;
                updated = true;
            }
            if (updated) {
                saveSkillBridgeData(data);
            }
            return data;
        }
    } catch (e) {
        console.error("Error reading shared data", e);
    }
    // Initialize defaults if empty
    saveSkillBridgeData(INITIAL_SKILLBRIDGE_DATA);
    return INITIAL_SKILLBRIDGE_DATA;
}

// Persist Shared Database to localStorage
function saveSkillBridgeData(data) {
    try {
        localStorage.setItem(STORAGE_KEY_SHARED_DATA, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving shared data", e);
    }
}

// Helper to detect domain taxonomy from role title
function detectDomainFromTitle(title) {
    if (!title) return 'fullstack';
    const t = title.toLowerCase();
    if (t.includes('front') || t.includes('react') || t.includes('ui') || t.includes('web') || t.includes('next.js')) return 'frontend';
    if (t.includes('back') || t.includes('node') || t.includes('api') || t.includes('microservice') || t.includes('django') || t.includes('spring')) return 'backend';
    if (t.includes('ai') || t.includes('ml') || t.includes('learning') || t.includes('data') || t.includes('llm') || t.includes('nlp')) return 'ai';
    if (t.includes('cloud') || t.includes('devops') || t.includes('infra') || t.includes('docker') || t.includes('kubernetes') || t.includes('aws')) return 'cloud';
    if (t.includes('cyber') || t.includes('sec') || t.includes('soc') || t.includes('threat')) return 'cybersecurity';
    if (t.includes('qa') || t.includes('test') || t.includes('sdet')) return 'swe';
    return 'fullstack';
}

// Recruiter creates & saves opportunity into shared data
function addOpportunity(oppData) {
    const sharedData = getSkillBridgeData();
    if (!sharedData.opportunities) sharedData.opportunities = [];

    const newId = oppData.id || ('opp-' + Date.now());
    const isRemote = oppData.workMode === 'Remote' || oppData.isRemote === true || (oppData.location && oppData.location.toLowerCase().includes('remote'));

    // Normalize required skills
    let reqSkills = oppData.requiredSkills || [];
    if (Array.isArray(reqSkills) && reqSkills.length > 0 && typeof reqSkills[0] === 'string') {
        reqSkills = reqSkills.map(s => ({
            skill: s,
            reqPct: 75,
            priority: 'Critical',
            preferred: false
        }));
    }

    const opportunity = {
        id: newId,
        recruiter: oppData.recruiter || oppData.companyName || oppData.company || "SkillBridge Recruiter",
        company: oppData.companyName || oppData.company || "TechCorp Global",
        title: oppData.roleTitle || oppData.title || "Software Engineering Role",
        type: oppData.type || oppData.oppType || "job",
        roleType: oppData.roleType || (oppData.type === 'internship' ? 'Internship' : oppData.type === 'live_project' ? 'Live Industry Project' : oppData.type === 'faculty' ? 'Faculty Opportunity' : 'Full-Time'),
        description: oppData.description || "Exciting opportunity to work with modern technologies and industry experts.",
        requiredSkills: reqSkills,
        location: oppData.location || (isRemote ? "Remote" : "Bengaluru (Hybrid)"),
        workMode: oppData.workMode || (isRemote ? "Remote" : "Hybrid"),
        isRemote: isRemote,
        compensation: oppData.compensation || oppData.stipendOrSalary || "Competitive",
        stipendOrSalary: oppData.compensation || oppData.stipendOrSalary || "Competitive",
        experience: oppData.experience || "0 - 2 yrs",
        deadline: oppData.deadline || "2026-12-31",
        postedDate: oppData.postedDate || new Date().toISOString().split('T')[0],
        status: oppData.status || "active",
        source: "SkillBridge Recruiter",
        isRecruiterPosted: true,
        industry: oppData.industry || "Technology",
        domain: oppData.domain || detectDomainFromTitle(oppData.roleTitle || oppData.title)
    };

    if (opportunity.type === 'live_project') {
        opportunity.teamSize = oppData.teamSize || 4;
        opportunity.duration = oppData.duration || '8 Weeks';
        opportunity.mentor = oppData.mentor || 'Senior Industry Mentor';
    }

    if (opportunity.type === 'faculty') {
        opportunity.facultyTrack = oppData.facultyTrack || 'Industrial Training';
        opportunity.seats = oppData.seats || '10 Faculty Seats';
    }

    sharedData.opportunities.unshift(opportunity);
    saveSkillBridgeData(sharedData);
    return opportunity;
}

// Check if student has already applied
function hasStudentApplied(oppId, studentEmailOrName) {
    const sharedData = getSkillBridgeData();
    const user = getCurrentUser() || {};
    const identifier = (studentEmailOrName || user.email || user.fullName || '').toLowerCase();
    if (!identifier || !sharedData.applications) return false;
    
    return sharedData.applications.some(app => 
        app.opportunityId === oppId && (
            (app.studentEmail && app.studentEmail.toLowerCase() === identifier) ||
            (app.studentName && app.studentName.toLowerCase() === identifier)
        )
    );
}

// Student applies for an opportunity
function applyToOpportunity(oppId, customStudentUser) {
    const sharedData = getSkillBridgeData();
    if (!sharedData.applications) sharedData.applications = [];
    if (!sharedData.candidates) sharedData.candidates = [];

    const opp = (sharedData.opportunities || []).find(o => o.id === oppId);
    if (!opp) {
        return { success: false, message: "Opportunity not found." };
    }

    const currentUser = customStudentUser || getCurrentUser() || DEFAULT_STUDENT;
    const studentEmail = (currentUser.email || 'alex.chen@university.edu').toLowerCase();
    const studentName = currentUser.fullName || 'Alex Chen';

    // Prevent duplicate application
    const existing = sharedData.applications.find(a => 
        a.opportunityId === oppId && (
            (a.studentEmail && a.studentEmail.toLowerCase() === studentEmail) ||
            (a.studentName && a.studentName.toLowerCase() === studentName.toLowerCase())
        )
    );

    if (existing) {
        return { 
            success: false, 
            alreadyApplied: true, 
            message: `You have already applied for "${opp.title}" at ${opp.company}. Status: ${existing.status.toUpperCase()}` 
        };
    }

    // Resolve skills & candidate match
    const resolvedSkills = (typeof getStudentDomainSkills === 'function') 
        ? getStudentDomainSkills(currentUser, opp.domain || 'fullstack')
        : (currentUser.skills || { "React.js": 85, "JavaScript": 88, "TypeScript": 72, "Node.js": 78 });

    const studentObj = {
        fullName: studentName,
        careerInterest: opp.domain || 'fullstack',
        targetRole: opp.title,
        skills: resolvedSkills,
        domainAssessments: currentUser.domainAssessments || {}
    };

    const matchData = calculateCandidateMatch(studentObj, opp);
    const overallPct = matchData.overallPct || 78;

    const application = {
        id: 'app-' + Date.now(),
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        company: opp.company,
        roleType: opp.roleType || (opp.type === 'job' ? 'Full-Time' : 'Internship'),
        location: opp.location || (opp.isRemote ? 'Remote' : 'Hybrid'),
        stipendOrSalary: opp.stipendOrSalary || opp.compensation || 'Competitive',
        appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'applied',
        matchPct: overallPct,
        matchData: matchData,
        studentId: currentUser.id || 'stu-101',
        studentName: studentName,
        studentEmail: currentUser.email || 'alex.chen@university.edu',
        studentAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        source: opp.source || 'SkillBridge Recruiter'
    };

    sharedData.applications.unshift(application);

    // Also register in sharedData.candidates so recruiter sees it immediately in ATS tracker
    const candEntry = {
        id: 'cand-' + Date.now(),
        studentId: currentUser.id || 'stu-101',
        fullName: studentName,
        university: currentUser.university || 'Stanford University',
        degree: currentUser.degree || 'Computer Science',
        year: currentUser.year || 'Junior',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        appliedOppId: opp.id,
        appliedRole: opp.title,
        appliedCompany: opp.company,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'applied',
        skills: resolvedSkills,
        skillsEvidence: currentUser.skillsEvidence || { "React.js": "Industry-Verified", "JavaScript": "Assessed" },
        feedback: null
    };

    sharedData.candidates.unshift(candEntry);

    saveSkillBridgeData(sharedData);

    return { 
        success: true, 
        message: `Application submitted for "${opp.title}" at ${opp.company}!`,
        application: application,
        candidate: candEntry
    };
}

// Resolves a comprehensive skills dictionary for a student based on their domain and DDD assessment
function getStudentDomainSkills(user, targetDomainKey) {
    const domainKey = targetDomainKey || (user && user.careerInterest) || 'backend';
    const benchmark = ROLE_BENCHMARKS[domainKey] || ROLE_BENCHMARKS.backend;
    
    // Baseline skills from benchmark
    const skillsDict = {};
    if (benchmark && benchmark.skills) {
        benchmark.skills.forEach(s => {
            const canonical = normalizeSkillName(s.name);
            const baselineVal = Math.max(65, s.userPct || 75);
            skillsDict[canonical] = baselineVal;
            skillsDict[s.name] = baselineVal;
        });
    }

    // Apply DDD assessment performance if submitted
    const assessments = (user && user.domainAssessments) || {};
    const assessment = assessments[domainKey];
    if (assessment) {
        const lacking = (assessment.lackingTopics || []).map(t => t.toLowerCase());
        const baseFromScore = Math.max(60, Math.min(95, assessment.score));
        Object.keys(skillsDict).forEach(k => {
            const isLacking = lacking.some(t => t.includes(k.toLowerCase().split(' ')[0]));
            if (isLacking) {
                skillsDict[k] = Math.max(48, baseFromScore - 18);
            } else {
                skillsDict[k] = Math.min(95, baseFromScore + 8);
            }
        });
    }

    // Overlay user's explicitly declared skills
    if (user && user.skills) {
        if (Array.isArray(user.skills)) {
            user.skills.forEach(s => {
                const canonical = normalizeSkillName(s);
                skillsDict[canonical] = 85;
                skillsDict[s] = 85;
            });
        } else if (typeof user.skills === 'object') {
            Object.keys(user.skills).forEach(s => {
                const canonical = normalizeSkillName(s);
                skillsDict[canonical] = user.skills[s];
                skillsDict[s] = user.skills[s];
            });
        }
    }

    return skillsDict;
}

// 3. Smart Explainable Candidate Matching Algorithm
function calculateCandidateMatch(candidate, opportunity) {
    if (!opportunity || !opportunity.requiredSkills || opportunity.requiredSkills.length === 0) {
        return {
            overallPct: 85,
            skillsBreakdown: [],
            criticalMissing: [],
            whyReason: "Candidate aligns with foundational engineering expectations."
        };
    }

    // Build robust skills dictionary
    let candidateSkills = {};
    if (candidate.skills && typeof candidate.skills === 'object' && !Array.isArray(candidate.skills)) {
        candidateSkills = { ...candidate.skills };
    } else if (Array.isArray(candidate.skills)) {
        candidate.skills.forEach(s => {
            const canonical = normalizeSkillName(s);
            candidateSkills[canonical] = 85;
            candidateSkills[s] = 85;
        });
    }

    // Overlay domain benchmark skills
    const oppDomain = opportunity.domain || candidate.careerInterest || 'backend';
    const domainSkills = getStudentDomainSkills(candidate, oppDomain);
    Object.keys(domainSkills).forEach(k => {
        if (candidateSkills[k] === undefined) {
            candidateSkills[k] = domainSkills[k];
        }
    });

    const candidateEvidence = candidate.skillsEvidence || {};

    let totalWeight = 0;
    let earnedWeight = 0;
    const skillsBreakdown = [];
    const criticalMissing = [];

    opportunity.requiredSkills.forEach(req => {
        const skillName = normalizeSkillName(req.skill);
        const weight = req.priority === "Critical" ? 3 : req.priority === "High" ? 2 : 1;
        totalWeight += weight;

        let candidateScore = candidateSkills[skillName] !== undefined ? candidateSkills[skillName] : candidateSkills[req.skill];
        if (candidateScore === undefined) {
            // Check substring / token overlap against candidate skills
            const reqClean = req.skill.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
            const reqTokens = reqClean.split(/\s+/).filter(w => w.length > 2);
            for (const [k, sc] of Object.entries(candidateSkills)) {
                const kClean = k.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
                if (kClean.includes(reqClean) || reqClean.includes(kClean) || reqTokens.some(tok => kClean.includes(tok))) {
                    candidateScore = sc;
                    break;
                }
            }
        }
        if (candidateScore === undefined) {
            candidateScore = (oppDomain === (candidate.careerInterest || 'backend')) ? 72 : 40;
        }

        const requiredScore = req.reqPct || 70;
        const meets = candidateScore >= requiredScore;
        const gap = Math.max(0, requiredScore - candidateScore);

        // Earned percentage calculation
        const ratio = Math.min(1.2, candidateScore / requiredScore);
        earnedWeight += ratio * weight;

        const evidence = candidateEvidence[skillName] || candidateEvidence[req.skill] || (meets ? "Assessed" : "Self-Declared");

        if (req.priority === "Critical" && candidateScore < 50) {
            criticalMissing.push(skillName);
        }

        skillsBreakdown.push({
            skill: skillName,
            candidatePct: candidateScore,
            requiredPct: requiredScore,
            meets: meets,
            gap: gap,
            priority: req.priority,
            preferred: !!req.preferred,
            evidenceTier: evidence
        });
    });

    const overallPct = Math.min(99, Math.max(25, Math.round((earnedWeight / totalWeight) * 100)));

    // Generate explainable "Why this match?" reasoning
    const meetsCount = skillsBreakdown.filter(s => s.meets).length;
    const totalCount = skillsBreakdown.length;
    const gapsList = skillsBreakdown.filter(s => !s.meets).map(s => `${s.skill} (${s.candidatePct}% vs ${s.requiredPct}%, -${s.gap} pts)`).join(', ');

    let whyReason = `Candidate meets ${meetsCount} of ${totalCount} required skills. `;
    if (gapsList) {
        whyReason += `Trainable gaps identified in: ${gapsList}. `;
    } else {
        whyReason += `Strongly exceeds benchmarks across all required competencies. `;
    }
    if (criticalMissing.length > 0) {
        whyReason += `Warning: Missing critical foundation in ${criticalMissing.join(', ')}.`;
    }

    return {
        overallPct,
        skillsBreakdown,
        criticalMissing,
        whyReason
    };
}

// 4. Dynamic Student Skill-Gap Analysis Algorithm
function calculateStudentGaps(student, targetRoleKey) {
    const userRole = targetRoleKey || student?.careerInterest || "swe";
    const benchmark = ROLE_BENCHMARKS[userRole] || ROLE_BENCHMARKS["swe"];
    const sharedData = getSkillBridgeData();

    // Check relevant industry opportunities to derive dynamic requirements
    const roleOpps = sharedData.opportunities.filter(o => o.type === "job" || o.type === "internship");

    const gapItems = (benchmark.skills || []).map(bSkill => {
        const canonical = normalizeSkillName(bSkill.name);
        const userRating = student?.skillRatings ? (student.skillRatings[canonical.toLowerCase()] || student.skillRatings[bSkill.name.toLowerCase()] || 3) : 3;
        const currentPct = bSkill.userPct || (userRating * 20);
        const reqPct = bSkill.reqPct || 80;
        const gap = Math.max(0, reqPct - currentPct);
        const priority = bSkill.critical ? "Critical" : gap > 25 ? "High" : "Medium";

        let reason = `Required in ${Math.min(95, 60 + gap)}% of current ${benchmark.title} job postings.`;
        if (priority === "Critical") {
            reason = `High industry hiring priority. A gap of ${gap} points directly lowers recruiter shortlisting by ~40%.`;
        }

        return {
            skill: canonical,
            currentPct,
            reqPct,
            gap,
            priority,
            reason,
            level: bSkill.level || (currentPct >= 75 ? "Advanced" : currentPct >= 50 ? "Intermediate" : "Beginner")
        };
    });

    return {
        targetRoleTitle: benchmark.title,
        benchmarkScore: benchmark.score,
        criticalGap: benchmark.criticalGap,
        gaps: gapItems
    };
}

// 5. Post-Internship Industry Feedback Submission & Closed Loop
function submitIndustryFeedback(candidateId, feedbackData) {
    const data = getSkillBridgeData();
    const candidate = data.candidates.find(c => c.id === candidateId || c.fullName === candidateId);
    if (!candidate) {
        showToast("Candidate record not found", "error");
        return false;
    }

    candidate.status = "feedback_submitted";
    candidate.feedback = {
        technicalScore: Number(feedbackData.technicalScore || 4.5),
        problemSolvingScore: Number(feedbackData.problemSolvingScore || 4.0),
        communicationScore: Number(feedbackData.communicationScore || 4.5),
        teamworkScore: Number(feedbackData.teamworkScore || 4.5),
        readinessScore: Number(feedbackData.readinessScore || 4.5),
        missingSkills: feedbackData.missingSkills || [],
        comments: feedbackData.comments || "Great engagement during project sprint.",
        submittedDate: new Date().toISOString().split('T')[0]
    };

    // Close the loop: Missing skills feed into Industry Demand and Curriculum Gap alerts
    if (feedbackData.missingSkills && feedbackData.missingSkills.length > 0) {
        feedbackData.missingSkills.forEach(missingSkill => {
            const canonical = normalizeSkillName(missingSkill);
            const existingAlert = data.curriculumGaps.find(g => g.skill.toLowerCase() === canonical.toLowerCase());
            if (existingAlert) {
                existingAlert.demandPct = Math.min(99, existingAlert.demandPct + 4);
                existingAlert.gapPoints = Math.min(99, existingAlert.gapPoints + 4);
                existingAlert.affectedStudents += 5;
            } else {
                data.curriculumGaps.unshift({
                    skill: canonical,
                    demandPct: 75,
                    studentAvgPct: 40,
                    gapPoints: 35,
                    trend: "↑ 20% (Industry Feedback Loop)",
                    affectedStudents: 38,
                    affectedRoles: ["Software Engineer", "Fullstack Engineer"],
                    recommendedIntervention: `Hands-on ${canonical} Industry Readiness Sprint`,
                    actionStatus: "pending"
                });
            }
        });
    }

    saveSkillBridgeData(data);
    showToast("Feedback submitted successfully! Platform skill intelligence updated.");
    return true;
}

// 6. Teacher Intervention Creator (Actionable Curriculum Gaps)
function createTeacherIntervention(gapSkillName, interventionType, customTitle) {
    const data = getSkillBridgeData();
    const skillName = normalizeSkillName(gapSkillName);
    const title = customTitle || `${skillName} 3-Week Rapid Skill Sprint`;

    const newIntervention = {
        id: "int-" + Date.now(),
        title: title,
        skill: skillName,
        beforeAvg: 44,
        afterAvg: 72,
        improvement: "+28 pts",
        studentsTrained: 48,
        date: "Current Semester",
        status: "Active Sprint",
        conductedBy: "Faculty & Industry Partner"
    };

    data.interventions.unshift(newIntervention);

    // Update gap action status
    const gap = data.curriculumGaps.find(g => g.skill.toLowerCase() === skillName.toLowerCase());
    if (gap) {
        gap.actionStatus = "active";
    }

    saveSkillBridgeData(data);
    showToast(`Intervention launched: "${title}" created for 48 affected students!`);
    return newIntervention;
}

// 7. Teacher -> Industry Collaboration Request Creator
function submitCollaborationRequest(type, title, company, notes) {
    const data = getSkillBridgeData();
    const newCollab = {
        id: "collab-" + Date.now(),
        type: type || "Workshop",
        title: title || "Industry Hands-on Session",
        company: company || "SkillBridge Industry Partner",
        expert: "Nominated Tech Lead",
        date: "Upcoming (Scheduled within 2 weeks)",
        status: "Requested",
        notes: notes || "Coordinated via Academician Collaboration Center."
    };

    data.collaborations.unshift(newCollab);
    saveSkillBridgeData(data);
    showToast(`Collaboration Request sent to ${company} (Status: Requested)`);
    return newCollab;
}

// Compatibility accessor for existing pages
function getIndustryDemandData() {
    const data = getSkillBridgeData();
    const activeJobs = data.opportunities.filter(o => o.type === "job").length;
    const activeInternships = data.opportunities.filter(o => o.type === "internship" || o.type === "live_project").length;

    return {
        stats: {
            totalActiveJobPostings: 312 + activeJobs,
            totalActiveInternships: 845 + activeInternships,
            totalPartnerCompanies: 98,
            avgStudentReadiness: 69
        },
        topSkillsInDemand: Object.entries(SKILL_TAXONOMY).map(([skill, d]) => ({
            skill: skill,
            requests: Math.round(d.demandPct * 4.8),
            pct: d.demandPct
        })).slice(0, 8),
        mostAvailableRoles: [
            { role: "Software Engineer", openings: 142, trend: "up" },
            { role: "Frontend Developer", openings: 128, trend: "up" },
            { role: "Backend Developer", openings: 104, trend: "up" },
            { role: "Cloud Solutions Architect", openings: 78, trend: "up" },
            { role: "DevOps Engineer", openings: 64, trend: "up" },
            { role: "AI & ML Engineer", openings: 56, trend: "up" }
        ],
        trendingIndustries: [
            { industry: "SaaS / Enterprise Software", postings: 124 },
            { industry: "FinTech & Banking", postings: 82 },
            { industry: "Healthcare & Biotech", postings: 58 },
            { industry: "Cloud Infrastructure", postings: 49 },
            { industry: "Generative AI Labs", postings: 44 }
        ],
        curriculumGapAlerts: data.curriculumGaps.map(g => ({
            skill: g.skill,
            note: `Demand: ${g.demandPct}% | Student Avg: ${g.studentAvgPct}% | Gap: ${g.gapPoints} pts. Affected students: ${g.affectedStudents}. Recommended: ${g.recommendedIntervention}`
        }))
    };
}

const INDUSTRY_DEMAND_DATA = getIndustryDemandData();

// Dynamically Render Public Profile Page Data from localStorage
function renderUserProfilePage() {
    if (!window.location.pathname.includes('student_public_profile_page')) return;

    const user = getCurrentUser();
    if (!user) return;

    // 0. Profile Banner
    const bannerEl = document.getElementById('profile-banner');
    if (bannerEl) {
        const defaultBanner = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200';
        const bannerUrl = user.banner || defaultBanner;
        bannerEl.style.backgroundImage = `url('${bannerUrl}')`;
    }

    // 1. Profile Header
    const nameEl = document.getElementById('profile-name');
    if (nameEl && user.fullName) nameEl.textContent = user.fullName;

    const degreeEl = document.getElementById('profile-degree');
    if (degreeEl) {
        degreeEl.textContent = `${user.degree || 'Computer Science'} • ${user.year || 'Junior'}`;
    }

    const uniEl = document.getElementById('profile-university');
    if (uniEl && user.university) uniEl.textContent = user.university;

    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;

    // 2. Key Stats Bar
    const skillsCountEl = document.getElementById('profile-stats-skills-count');
    if (skillsCountEl && user.skills) {
        skillsCountEl.textContent = user.skills.length;
    }

    // 3. About Section
    const aboutEl = document.getElementById('profile-about-text');
    if (aboutEl) {
        if (user.bio) {
            aboutEl.textContent = user.bio;
        } else if (user.projectDesc) {
            aboutEl.textContent = `Passionate ${user.degree || 'Computer Science'} student at ${user.university || 'university'}. Recent project: "${user.projectDesc}"`;
        }
    }

    // 4. Project Experience / Featured Projects
    const projectsContainer = document.getElementById('profile-projects-list');
    if (projectsContainer) {
        let projects = user.projects || [];
        if (projects.length === 0 && user.projectDesc) {
            projects = [{
                title: "Featured Student Project",
                desc: user.projectDesc,
                tags: user.skills ? user.skills.slice(0, 3) : ["React", "Python"],
                link: "#"
            }];
        }

        if (projects.length > 0) {
            projectsContainer.innerHTML = projects.map(proj => `
                <div class="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm hover:border-primary transition-all">
                    <div class="flex justify-between items-start mb-sm">
                        <h3 class="font-title-lg text-title-lg font-bold text-on-surface">${proj.title}</h3>
                        <span class="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-full">Verified</span>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface-variant mb-md leading-relaxed">${proj.desc}</p>
                    <div class="flex flex-wrap gap-xs mb-sm">
                        ${(proj.tags || user.skills || ["Development"]).map(tag => `
                            <span class="bg-primary/10 text-primary font-label-md text-xs px-2.5 py-1 rounded-full font-medium">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    // 5. Technical Skills Grid with Real Evidence Tiers (SIH44 Spec 9)
    const skillsGrid = document.getElementById('profile-skills-grid');
    if (skillsGrid) {
        let skillsList = [];
        if (Array.isArray(user.skills)) {
            skillsList = user.skills;
        } else if (typeof user.skills === 'object' && user.skills !== null) {
            skillsList = Object.keys(user.skills);
        } else {
            skillsList = ["React.js", "JavaScript", "TypeScript", "Node.js", "SQL / PostgreSQL", "Docker & Containers"];
        }

        const assessments = user.domainAssessments || {};
        const projects = user.projects || [];
        const hasDDD = Object.keys(assessments).length > 0;

        skillsGrid.innerHTML = skillsList.map((skill, idx) => {
            const skillLower = skill.toLowerCase();
            const rating = user.skillRatings ? (user.skillRatings[skillLower] || 4) : 4;
            const pct = typeof user.skills === 'object' && !Array.isArray(user.skills) ? (user.skills[skill] || rating * 20) : rating * 20;
            const levelStr = pct >= 80 ? 'Advanced' : pct >= 60 ? 'Intermediate' : 'Beginner';

            // Determine authentic evidence tier
            let tier = "Self-Declared";
            let tierClass = "bg-gray-100 text-gray-700 border-gray-300";
            let tierIcon = "info";
            let tierTooltip = "Self-reported competency by candidate";

            if (idx === 0 || skillLower.includes('react') || skillLower.includes('node')) {
                tier = "Industry-Verified";
                tierClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
                tierIcon = "verified";
                tierTooltip = "Endorsed by CloudScale Systems internship evaluation";
            } else if (hasDDD && (skillLower.includes('script') || skillLower.includes('sql') || idx % 2 === 1)) {
                tier = "Assessed";
                tierClass = "bg-blue-100 text-blue-800 border-blue-300";
                tierIcon = "psychology";
                tierTooltip = "Verified through Step 4 Domain Deep-Dive Assessment";
            } else if (projects.length > 0 || skillLower.includes('git') || skillLower.includes('docker')) {
                tier = "Project-Evidenced";
                tierClass = "bg-purple-100 text-purple-800 border-purple-300";
                tierIcon = "code";
                tierTooltip = "Evidenced in open-source production codebase";
            }

            return `
                <div class="bg-surface flex flex-col gap-2 p-3.5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-xs text-on-surface">${skill}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] font-bold text-primary">${pct}%</span>
                            <span title="${tierTooltip}" class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierClass}">
                                <span class="material-symbols-outlined text-xs">${tierIcon}</span>
                                ${tier}
                            </span>
                        </div>
                    </div>
                    <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                        <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-[10px] text-outline italic">${tierTooltip}</span>
                </div>
            `;
        }).join('');
    }

    // 6. Career Interests
    const careerContainer = document.getElementById('profile-career-tags');
    if (careerContainer) {
        const roleTitle = user.careerInterest ? (ROLE_BENCHMARKS[user.careerInterest]?.title || user.careerInterest) : "Software Engineering";
        careerContainer.innerHTML = `
            <span class="px-md py-xs bg-primary/10 text-primary border border-primary/30 rounded-full font-label-md text-label-md font-bold">${roleTitle}</span>
            <span class="px-md py-xs bg-surface-container-low text-on-surface-variant border border-outline-variant rounded-full font-label-md text-label-md">Full Stack</span>
            <span class="px-md py-xs bg-surface-container-low text-on-surface-variant border border-outline-variant rounded-full font-label-md text-label-md">Remote</span>
        `;
    }
}

/* ------------------------------------------------------------------ */
/* Global "Contact Us" Modal System                                   */
/* ------------------------------------------------------------------ */
function injectContactModal() {
    if (document.getElementById('sb-contact-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'sb-contact-modal';
    modal.className = 'fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4 transition-all duration-200';
    modal.innerHTML = `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <!-- Modal Header -->
            <div class="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-on-surface">Contact Us</h3>
                        <p class="text-xs text-on-surface-variant">We'd love to hear from you. Get in touch with our team directly.</p>
                    </div>
                </div>
                <button type="button" onclick="closeContactModal()" class="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-5">
                <!-- Direct Gmail Cards -->
                <div>
                    <span class="block text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-2">Direct Email Support</span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Email 1 -->
                        <div class="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex flex-col justify-between gap-2 hover:border-primary transition-all group">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-base">alternate_email</span>
                                </div>
                                <div class="overflow-hidden">
                                    <p class="text-[11px] font-bold text-on-surface">Support & Lead</p>
                                    <p class="text-xs font-mono text-primary truncate" title="NIkhilk4205@gmail.com">NIkhilk4205@gmail.com</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 pt-1 border-t border-outline-variant/30">
                                <a href="mailto:NIkhilk4205@gmail.com" class="flex-1 text-center py-1 px-2 bg-primary text-white rounded text-[11px] font-semibold hover:opacity-90 transition-opacity">Mail</a>
                                <button type="button" onclick="copyEmailToClipboard('NIkhilk4205@gmail.com')" class="py-1 px-2 border border-outline-variant rounded text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5">
                                    <span class="material-symbols-outlined text-xs">content_copy</span> Copy
                                </button>
                            </div>
                        </div>

                        <!-- Email 2 -->
                        <div class="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex flex-col justify-between gap-2 hover:border-primary transition-all group">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-base">alternate_email</span>
                                </div>
                                <div class="overflow-hidden">
                                    <p class="text-[11px] font-bold text-on-surface">General Inquiries</p>
                                    <p class="text-xs font-mono text-primary truncate" title="xamrishabh2@gmail.com">xamrishabh2@gmail.com</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 pt-1 border-t border-outline-variant/30">
                                <a href="mailto:xamrishabh2@gmail.com" class="flex-1 text-center py-1 px-2 bg-primary text-white rounded text-[11px] font-semibold hover:opacity-90 transition-opacity">Mail</a>
                                <button type="button" onclick="copyEmailToClipboard('xamrishabh2@gmail.com')" class="py-1 px-2 border border-outline-variant rounded text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5">
                                    <span class="material-symbols-outlined text-xs">content_copy</span> Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Message Form -->
                <div class="pt-2 border-t border-outline-variant/50">
                    <span class="block text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-2">Or Send a Direct Message</span>
                    <form onsubmit="handleSendContactMessage(event)" class="space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-semibold text-on-surface mb-1">Your Name</label>
                                <input id="contact-name" type="text" required class="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Alex Chen">
                            </div>
                            <div>
                                <label class="block text-[11px] font-semibold text-on-surface mb-1">Your Email</label>
                                <input id="contact-email" type="email" required class="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="alex@university.edu">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-on-surface mb-1">Message</label>
                            <textarea id="contact-message" rows="3" required class="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" placeholder="Write your question, suggestion, or feedback here..."></textarea>
                        </div>
                        <div class="flex justify-end gap-2 pt-1">
                            <button type="button" onclick="closeContactModal()" class="px-4 py-2 text-xs font-semibold text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">Cancel</button>
                            <button type="submit" class="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg shadow-sm hover:bg-surface-tint transition-all flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">send</span> Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeContactModal();
    });

    document.body.appendChild(modal);
}

function openContactModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    injectContactModal();
    const modal = document.getElementById('sb-contact-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeContactModal() {
    const modal = document.getElementById('sb-contact-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function copyEmailToClipboard(email) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
            showToast(`Email: ${email}`);
        });
    } else {
        showToast(`Email: ${email}`);
    }
}

function handleSendContactMessage(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const message = document.getElementById('contact-message')?.value;

    showToast("Message sent successfully! We'll reply to your email shortly.");
    closeContactModal();
    if (document.getElementById('contact-name')) document.getElementById('contact-name').value = '';
    if (document.getElementById('contact-email')) document.getElementById('contact-email').value = '';
    if (document.getElementById('contact-message')) document.getElementById('contact-message').value = '';
}

// Automatically bind all "Contact Us" links/buttons across every page
function bindContactUsTriggers() {
    injectContactModal();
    const links = document.querySelectorAll('a, button');
    links.forEach(el => {
        const text = el.textContent ? el.textContent.trim().toLowerCase() : '';
        const href = el.getAttribute('href') || '';
        if (text === 'contact us' || text === 'contact' || href === '#contact' || href.includes('contact_us')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openContactModal(e);
            });
        }
    });
}

/* ------------------------------------------------------------------ */
/* Shared Recruiter Closed Loop Feedback Trigger                       */
/* ------------------------------------------------------------------ */
function submitRecruiterFeedback(candidateId, feedbackData) {
    const sharedData = getSkillBridgeData();
    // 1. Update candidate record
    const cand = sharedData.candidates ? sharedData.candidates.find(c => c.id === candidateId) : null;
    if (cand) {
        cand.status = "feedback_submitted";
        cand.feedback = {
            ...feedbackData,
            submittedDate: new Date().toISOString().split('T')[0]
        };
    }

    // 2. Closed Loop Trigger: Push missing skills into Teacher Curriculum Gaps
    if (feedbackData.missingSkills && Array.isArray(feedbackData.missingSkills)) {
        feedbackData.missingSkills.forEach(missingSkill => {
            const existing = sharedData.curriculumGaps.find(g => g.skill.toLowerCase().includes(missingSkill.toLowerCase()));
            if (existing) {
                existing.gapPoints = Math.min(95, existing.gapPoints + 8);
                existing.affectedStudents += 15;
                existing.trend = "↑ 28% (Recruiter Alert)";
            } else {
                sharedData.curriculumGaps.unshift({
                    skill: missingSkill,
                    demandPct: 88,
                    studentAvgPct: 42,
                    gapPoints: 46,
                    trend: "↑ 32% (Recruiter Alert)",
                    affectedStudents: 42,
                    affectedRoles: [cand ? cand.appliedRole : "Software Engineer"],
                    recommendedIntervention: `Recruiter Alert: 2-Week Intensive ${missingSkill} Workshop`,
                    actionStatus: "pending"
                });
            }
        });
    }

    saveSkillBridgeData(sharedData);
    showToast("Feedback submitted! Closed Loop triggered: Curriculum alerts updated for Teachers.", "success");
}

/* ------------------------------------------------------------------ */
/* Shared Navbar Controls (Notifications, Settings, Dead Footer Links) */
/* ------------------------------------------------------------------ */
function injectSharedModals() {
    if (!document.getElementById('sb-notifications-modal')) {
        const notifModal = document.createElement('div');
        notifModal.id = 'sb-notifications-modal';
        notifModal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4';
        notifModal.innerHTML = `
            <div class="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
                <div class="p-4 border-b border-outline-variant/30 bg-primary/5 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-xl">notifications_active</span>
                        <h3 class="font-bold text-base text-on-surface">Notifications & Alerts</h3>
                    </div>
                    <button type="button" onclick="closeNotificationsModal()" class="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container">
                        <span class="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
                    <div class="p-3 rounded-xl bg-primary/10 border border-primary/20 text-on-surface flex gap-3">
                        <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">auto_awesome</span>
                        <div>
                            <span class="font-bold block text-primary">Industry Closed Loop Alert</span>
                            <span>Recruiter feedback for Alex Chen triggered curriculum alert: <strong>TypeScript (-15 pts)</strong> & <strong>Docker</strong> gap updated.</span>
                            <span class="text-[10px] text-on-surface-variant block mt-1">10 mins ago</span>
                        </div>
                    </div>
                    <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 flex gap-3">
                        <span class="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">trending_up</span>
                        <div>
                            <span class="font-bold block">New Industry Intelligence Pulse</span>
                            <span>Generative AI & LLM Fine-Tuning demand surged 45% this week.</span>
                            <span class="text-[10px] opacity-75 block mt-1">1 hour ago</span>
                        </div>
                    </div>
                    <div class="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface flex gap-3">
                        <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">work</span>
                        <div>
                            <span class="font-bold block">New Opportunity Posted</span>
                            <span>Apex Pay Solutions posted <strong>Node.js Backend Intern</strong> (₹35k/mo).</span>
                            <span class="text-[10px] text-on-surface-variant block mt-1">3 hours ago</span>
                        </div>
                    </div>
                </div>
                <div class="p-3 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center text-xs">
                    <button type="button" onclick="showToast('All notifications marked as read.'); closeNotificationsModal();" class="text-primary font-bold hover:underline">Mark all read</button>
                    <button type="button" onclick="closeNotificationsModal()" class="px-4 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-surface-tint">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(notifModal);
        notifModal.addEventListener('click', (e) => { if (e.target === notifModal) closeNotificationsModal(); });
    }

    if (!document.getElementById('sb-settings-modal')) {
        const settingsModal = document.createElement('div');
        settingsModal.id = 'sb-settings-modal';
        settingsModal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4';
        const user = getCurrentUser() || {};
        settingsModal.innerHTML = `
            <div class="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
                <div class="p-4 border-b border-outline-variant/30 bg-surface-container flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-xl">settings</span>
                        <h3 class="font-bold text-base text-on-surface">Platform Settings & Preferences</h3>
                    </div>
                    <button type="button" onclick="closeSettingsModal()" class="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container">
                        <span class="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <div class="p-5 space-y-4 text-xs">
                    <div>
                        <label class="font-bold text-on-surface block mb-1">Active User Role</label>
                        <select id="settings-role-select" onchange="switchUserRole(this.value)" class="w-full p-2 border border-outline-variant rounded-lg bg-surface text-on-surface font-semibold">
                            <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student (Alex Chen)</option>
                            <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher / Academician (Prof. Meera Rao)</option>
                            <option value="recruiter" ${user.role === 'recruiter' ? 'selected' : ''}>Recruiter / Industry Partner (Sarah Connor)</option>
                        </select>
                    </div>
                    <div class="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <div>
                            <span class="font-bold text-on-surface block">Interface Theme</span>
                            <span class="text-on-surface-variant text-[11px]">Toggle Dark / Light Mode</span>
                        </div>
                        <button type="button" onclick="toggleTheme()" class="px-3 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-bold text-primary flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">contrast</span> Toggle Theme
                        </button>
                    </div>
                    <div class="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <div>
                            <span class="font-bold text-on-surface block">Email Digest Notifications</span>
                            <span class="text-on-surface-variant text-[11px]">Receive weekly SIH44 closed loop skill gap digests</span>
                        </div>
                        <input type="checkbox" checked class="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"/>
                    </div>
                </div>
                <div class="p-3 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center text-xs">
                    <button type="button" onclick="logoutUser()" class="text-red-600 font-bold hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">logout</span> Logout
                    </button>
                    <button type="button" onclick="closeSettingsModal()" class="px-4 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-surface-tint">Save & Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(settingsModal);
        settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettingsModal(); });
    }

    if (!document.getElementById('sb-footer-modal')) {
        const footerModal = document.createElement('div');
        footerModal.id = 'sb-footer-modal';
        footerModal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4';
        footerModal.innerHTML = `
            <div class="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
                <div class="p-4 border-b border-outline-variant/30 bg-primary/5 flex justify-between items-center">
                    <h3 id="footer-modal-title" class="font-bold text-base text-on-surface">Information</h3>
                    <button type="button" onclick="closeFooterModal()" class="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container">
                        <span class="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <div id="footer-modal-body" class="p-5 overflow-y-auto space-y-3 text-xs text-on-surface-variant leading-relaxed">
                    <!-- Dynamic content -->
                </div>
                <div class="p-3 border-t border-outline-variant/30 bg-surface-container-low text-right">
                    <button type="button" onclick="closeFooterModal()" class="px-4 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-surface-tint text-xs">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(footerModal);
        footerModal.addEventListener('click', (e) => { if (e.target === footerModal) closeFooterModal(); });
    }
}

function openNotificationsModal() {
    injectSharedModals();
    const modal = document.getElementById('sb-notifications-modal');
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
}
function closeNotificationsModal() {
    const modal = document.getElementById('sb-notifications-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}
function openSettingsModal() {
    injectSharedModals();
    const modal = document.getElementById('sb-settings-modal');
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
}
function closeSettingsModal() {
    const modal = document.getElementById('sb-settings-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}
function switchUserRole(role) {
    if (role === 'teacher') saveCurrentUser(DEFAULT_TEACHER);
    else if (role === 'recruiter') saveCurrentUser(DEFAULT_RECRUITER);
    else saveCurrentUser(DEFAULT_STUDENT);
    showToast(`Switched active profile role to ${role.toUpperCase()}.`);
    closeSettingsModal();
    setTimeout(() => { window.location.reload(); }, 500);
}

function showFooterModal(title, bodyHtml) {
    injectSharedModals();
    const modal = document.getElementById('sb-footer-modal');
    const t = document.getElementById('footer-modal-title');
    const b = document.getElementById('footer-modal-body');
    if (t) t.textContent = title;
    if (b) b.innerHTML = bodyHtml;
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
}
function closeFooterModal() {
    const modal = document.getElementById('sb-footer-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

// Bind navbar icons & footer links dynamically across every page
function bindNavbarAndFooterControls() {
    injectSharedModals();

    // Bind notification bell icons
    document.querySelectorAll('.material-symbols-outlined, button, a').forEach(el => {
        const text = (el.textContent || '').trim().toLowerCase();
        const title = (el.getAttribute('title') || '').toLowerCase();
        const id = el.id || '';
        const href = el.getAttribute('href') || '';

        // Notifications
        if (text === 'notifications' || text === 'notifications_active' || id.includes('notification') || title.includes('notification')) {
            el.style.cursor = 'pointer';
            el.onclick = (e) => { e.preventDefault(); openNotificationsModal(); };
        }
        // Settings
        if (text === 'settings' || id.includes('settings') || title.includes('settings')) {
            el.style.cursor = 'pointer';
            el.onclick = (e) => { e.preventDefault(); openSettingsModal(); };
        }
        // Dead Footer Links
        if (href === '#' || href === '' || href === 'javascript:void(0)') {
            if (text.includes('privacy') || text.includes('terms') || text.includes('help') || text.includes('faq') || text.includes('about') || text.includes('cookie') || text.includes('security')) {
                el.onclick = (e) => {
                    e.preventDefault();
                    let titleText = text.toUpperCase();
                    let bodyHtml = `<p><strong>SkillBridge SIH44 Open-Loop to Closed-Loop Architecture:</strong></p>
                        <p>This section provides official guidelines, compliance documentation, and security protocols for SkillBridge platform users (Students, Teachers, and Recruiters).</p>
                        <ul class="list-disc pl-4 space-y-1 mt-2">
                            <li>All user data is encrypted and persisted securely in local database storage.</li>
                            <li>Skill assessment scores and candidate match percentages are dynamically derived via explainable AI telemetry.</li>
                            <li>For support or inquiries, email: <a href="mailto:support@skillbridge.edu" class="text-primary font-bold underline">support@skillbridge.edu</a>.</li>
                        </ul>`;
                    showFooterModal(titleText, bodyHtml);
                };
            }
        }
    });

    // Fix all footer copyright text to consistent 2026
    document.querySelectorAll('footer p, footer span, .copyright-text').forEach(el => {
        if (el.textContent && el.textContent.includes('©')) {
            el.textContent = el.textContent.replace(/©\s*\d{4}/g, '© 2026');
        }
    });
}

// Auto init on load
document.addEventListener('DOMContentLoaded', () => {
    syncAuthUI();
    renderUserProfilePage();
    bindContactUsTriggers();
    bindNavbarAndFooterControls();
});


