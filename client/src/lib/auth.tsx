import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "manager" | "supervisor" | "employee";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
}

export interface Invite {
  code: string;
  role: UserRole;
  branch: string;
  createdBy: string;
  createdAt: string;
  used: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (code: string, name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AUTH_KEY = "sugarhive_auth_user";
const INVITES_KEY = "sugarhive_invites";

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getInvites(): Invite[] {
  const saved = localStorage.getItem(INVITES_KEY);
  if (saved) return JSON.parse(saved);
  return [];
}

export function createInvite(role: UserRole, branch: string, createdBy: string): Invite {
  const invite: Invite = {
    code: generateInviteCode(),
    role,
    branch,
    createdBy,
    createdAt: new Date().toISOString(),
    used: false,
  };
  const invites = getInvites();
  invites.push(invite);
  localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
  return invite;
}

export function getInviteByCode(code: string): Invite | undefined {
  const invites = getInvites();
  return invites.find(i => i.code === code && !i.used);
}

function markInviteUsed(code: string) {
  const invites = getInvites();
  const updated = invites.map(i => i.code === code ? { ...i, used: true } : i);
  localStorage.setItem(INVITES_KEY, JSON.stringify(updated));
}

const defaultUsers: (AuthUser & { password: string })[] = [
  { id: "1", name: "Ahmed Admin", email: "admin@sugarhive.com", password: "admin123", role: "admin", branch: "All Branches" },
  { id: "2", name: "Sara Ahmed", email: "manager@sugarhive.com", password: "manager123", role: "manager", branch: "Jeddah Main" },
  { id: "3", name: "Mohammed Al-Otaibi", email: "supervisor@sugarhive.com", password: "supervisor123", role: "supervisor", branch: "Riyadh Front" },
  { id: "4", name: "Noura Ali", email: "employee@sugarhive.com", password: "employee123", role: "employee", branch: "Riyadh Front" },
];

const USERS_KEY = "sugarhive_auth_users";

function getUsers(): (AuthUser & { password: string })[] {
  const saved = localStorage.getItem(USERS_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    const hasOldBranches = parsed.some((u: any) => u.branch === "Downtown Branch");
    if (hasOldBranches) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return parsed;
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) return JSON.parse(saved);
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const { password: _, ...authUser } = found;
      setUser(authUser);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = (code: string, name: string, email: string, password: string) => {
    const invite = getInviteByCode(code);
    if (!invite) {
      return { success: false, error: "Invalid or expired invite code" };
    }
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists" };
    }
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
      role: invite.role,
      branch: invite.branch,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    markInviteUsed(code);
    const teamMembers = JSON.parse(localStorage.getItem("sugarhive_team") || "[]");
    const roleLabel = invite.role === "admin" ? "Super Admin" : invite.role === "manager" ? "Branch Manager" : invite.role === "supervisor" ? "Supervisor" : "Operations";
    teamMembers.push({ name, role: roleLabel, email, branch: invite.branch, status: "Active" });
    localStorage.setItem("sugarhive_team", JSON.stringify(teamMembers));
    const { password: _, ...authUser } = newUser;
    setUser(authUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  supervisor: "Supervisor",
  employee: "Employee",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["dashboard", "checklists", "branches", "team", "training", "settings", "reports"],
  manager: ["dashboard", "checklists", "branches", "team", "training", "reports"],
  supervisor: ["dashboard", "checklists", "team", "training"],
  employee: ["dashboard", "checklists", "team", "training"],
};

export function hasPermission(role: UserRole, feature: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(feature) ?? false;
}

export function getUserBranchFilter(user: AuthUser | null): string | null {
  if (!user) return null;
  if (user.role === "admin") return null;
  return user.branch;
}
