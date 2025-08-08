// import { User } from '@/types';

// // Mock authentication - replace with NextAuth.js in production
// class AuthService {
//   private currentUser: User | null = null;

//   // Mock users for demonstration
//   private mockUsers: User[] = [
//     {
//       id: '1',
//       email: 'admin@example.com',
//       name: 'Admin User',
//       role: 'admin',
//       createdAt: new Date(),
//     },
//     {
//       id: '2',
//       email: 'user@example.com',
//       name: 'Regular User',
//       role: 'user',
//       createdAt: new Date(),
//     },
//   ];

//   async login(email: string, password: string): Promise<User> {
//     // Mock authentication logic
//     const user = this.mockUsers.find(u => u.email === email);
//     if (user && password === 'password') {
//       this.currentUser = user;
//       localStorage.setItem('user', JSON.stringify(user));
//       return user;
//     }
//     throw new Error('Invalid credentials');
//   }

//   logout(): void {
//     this.currentUser = null;
//     localStorage.removeItem('user');
//   }

//   getCurrentUser(): User | null {
//     if (this.currentUser) return this.currentUser;
    
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem('user');
//       if (stored) {
//         this.currentUser = JSON.parse(stored);
//         return this.currentUser;
//       }
//     }
//     return null;
//   }

//   hasPermission(permission: string): boolean {
//     const user = this.getCurrentUser();
//     if (!user) return false;

//     const permissions = {
//       admin: ['read', 'write', 'delete', 'manage_users', 'copy_code'],
//       user: ['read', 'copy_code'],
//       guest: ['read'],
//     };

//     return permissions[user.role]?.includes(permission) || false;
//   }
// }

// export const authService = new AuthService();




// /frontend/lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type User = { email: string; role: "admin" | "user" };

const TOKEN_KEY = "admin_token";
const USER_KEY = "current_user";

function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(USER_KEY);
  return s ? (JSON.parse(s) as User) : null;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(msg?.detail || "Login failed");
  }

  const data = await res.json();
  saveSession(data.token, data.user);
  return data.user as User;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasPermission(permission: string): boolean {
  // Only admin has privileged permissions right now
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === "admin") return true;
  // Future: map permissions for non-admin roles
  return false;
}

export const authService = {
  getCurrentUser,
  login,
  logout,
  hasPermission,
  getToken
};
