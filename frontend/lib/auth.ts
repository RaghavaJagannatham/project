// /frontend/lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

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
  if (!s) return null;
  
  try {
    const userData = JSON.parse(s);
    // Convert string dates back to Date objects if needed
    if (userData.createdAt && typeof userData.createdAt === 'string') {
      userData.createdAt = new Date(userData.createdAt);
    }
    return userData as User;
  } catch {
    return null;
  }
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
  
  // Transform backend user data to frontend User interface
  const user: User = {
    id: data.user.email, // Use email as ID since backend doesn't provide ID
    email: data.user.email,
    name: data.user.email.split('@')[0], // Use email prefix as name
    role: data.user.role,
    createdAt: new Date(),
  };
  
  saveSession(data.token, user);
  return user;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasPermission(permission: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'copy_code'],
    user: ['read', 'copy_code'],
  };
  
  return permissions[user.role]?.includes(permission) || false;
}

export const authService = {
  getCurrentUser,
  login,
  logout,
  hasPermission,
  getToken
};