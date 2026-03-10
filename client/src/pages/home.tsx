import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { getUnreadCount } from "@/lib/notifications";
import { useLanguage, translateName, translateRole, translateBranch } from "@/lib/language";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Building2, 
  GraduationCap, 
  Bell,
  LogOut,
  Settings,
  ChevronRight,
  Menu,
  Plus,
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Calendar,
  FileText,
  UserPlus,
  FileBarChart,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogDescription, 
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth, hasPermission, ROLE_LABELS, getUserBranchFilter } from "@/lib/auth";

import logo from "@/assets/logo-new.png";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  href?: string;
  onNavigate?: () => void;
}

export { getNotifications, addNotification, markNotificationRead, getUnreadCount } from "@/lib/notifications";

export function Sidebar({ isSidebarOpen, setSidebarOpen }: { isSidebarOpen: boolean, setSidebarOpen: (v: boolean) => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const role = user?.role || "employee";

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleNavigate = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const roleKey = `role.${role}` as const;

  return (
    <>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'md:w-20 w-64'} bg-white border-r border-[#E2E8F0] transition-all duration-300 flex flex-col fixed top-0 h-full z-40 ${isSidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full md:translate-x-0'} md:sticky md:top-0 md:h-screen ltr:left-0 rtl:right-0 ltr:border-r rtl:border-l rtl:border-r-0`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-[#F1F5F9]">
          <img src={logo} alt="SugarHive Logo" className={`${isSidebarOpen ? 'w-full' : 'h-7 w-auto'} transition-all`} />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label={t("nav.dashboard")} active={location === "/"} collapsed={!isSidebarOpen} onNavigate={handleNavigate} />
          <NavItem href="/checklists" icon={<CheckSquare size={20} />} label={t("nav.checklists")} active={location === "/checklists" || location.startsWith("/checklists/")} collapsed={!isSidebarOpen} onNavigate={handleNavigate} />
          
          {(hasPermission(role, "branches") || hasPermission(role, "team")) && (
            <div className="pt-4 pb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {isSidebarOpen ? t("nav.management") : "•••"}
            </div>
          )}
          
          {hasPermission(role, "branches") && (
            <NavItem href="/branches" icon={<Building2 size={20} />} label={t("nav.branches")} active={location === "/branches" || location.startsWith("/branches/")} collapsed={!isSidebarOpen} onNavigate={handleNavigate} />
          )}
          {hasPermission(role, "team") && (
            <NavItem href="/team" icon={<Users size={20} />} label={t("nav.team")} active={location === "/team"} collapsed={!isSidebarOpen} onNavigate={handleNavigate} />
          )}
          <NavItem href="/training" icon={<GraduationCap size={20} />} label={t("nav.training")} active={location === "/training"} collapsed={!isSidebarOpen} onNavigate={handleNavigate} />
        </nav>

        <div className="p-4 border-t border-[#F1F5F9] space-y-2">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#F59E0B] transition-all text-sm font-medium"
            data-testid="button-language-toggle"
          >
            <Globe size={18} />
            {isSidebarOpen && <span>{t("language.toggle")}</span>}
          </button>
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-2 rounded-xl border border-[#F1F5F9]">
            <Avatar className="w-9 h-9 border-2 border-white shadow-sm shrink-0">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} />
              <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-[#0F172A]">{user?.name || 'User'}</p>
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">{t(roleKey)}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
            data-testid="button-logout"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>{t("nav.signOut")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active = false, collapsed = false, href = "/", onNavigate }: NavItemProps) {
  return (
    <Link href={href}>
      <a 
        onClick={onNavigate}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group ${
          active ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
        }`}
      >
        <span className={active ? 'text-[#F59E0B]' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}>{icon}</span>
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
        {!collapsed && active && <div className="ltr:ml-auto rtl:mr-auto w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>}
      </a>
    </Link>
  );
}

export function Header({ 
  isSidebarOpen, 
  setSidebarOpen, 
  title, 
  searchQuery, 
  setSearchQuery 
}: { 
  isSidebarOpen: boolean, 
  setSidebarOpen: (v: boolean) => void, 
  title: string, 
  searchQuery?: string, 
  setSearchQuery?: (v: string) => void 
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const role = user?.role || "employee";
  const [, setLocation] = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setUnreadCount(getUnreadCount(role === 'admin' ? undefined : user?.name));
    updateCount();
    window.addEventListener("sugarhive_notification_update", updateCount);
    const interval = setInterval(updateCount, 5000);
    return () => {
      window.removeEventListener("sugarhive_notification_update", updateCount);
      clearInterval(interval);
    };
  }, [user?.name, role]);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#64748B] hover:bg-[#F1F5F9]">
          <Menu size={20} />
        </Button>
        <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        {setSearchQuery && (
          <div className="relative hidden md:block w-64">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              placeholder={t("header.search")} 
              className="w-full bg-[#F1F5F9] border-none rounded-full py-2 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm focus:ring-2 focus:ring-[#F59E0B] transition-all outline-none"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <button
          onClick={() => setLocation("/inbox")}
          className="relative p-2 rounded-full hover:bg-[#F1F5F9] transition-all"
          data-testid="button-notifications"
        >
          <Bell size={20} className="text-[#64748B]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 ltr:-right-0.5 rtl:-left-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}


export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const branchFilter = getUserBranchFilter(user);

  const courses = (() => {
    const saved = localStorage.getItem("sugarhive_courses");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: "Advanced Operations Mastery", progress: 75, category: "Operations" },
      { id: 2, title: "Safety & Hygiene Protocols", progress: 100, category: "Compliance" },
      { id: 3, title: "Customer Service Excellence", progress: 30, category: "Hospitality" },
      { id: 4, title: "Leadership Fundamentals", progress: 10, category: "Management" },
    ];
  })();

  const teamMembers = (() => {
    const saved = localStorage.getItem("sugarhive_team");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Ahmed Admin", role: "Super Admin", email: "admin@sugarhive.com", branch: "Headquarters", status: "Active" },
      { name: "Sara Ahmed", role: "Branch Manager", email: "sara.a@sugarhive.com", branch: "Jeddah Main", status: "Active" },
      { name: "Mohammed Al-Otaibi", role: "Supervisor", email: "m.otaibi@sugarhive.com", branch: "Riyadh Front", status: "Active" },
      { name: "Khalid Al-Shamri", role: "Operations", email: "k.shamri@sugarhive.com", branch: "Dammam Hub", status: "Active" },
      { name: "Faisal Khalid", role: "Branch Manager", email: "f.khalid@sugarhive.com", branch: "Makkah Center", status: "Active" },
      { name: "Noura Ali", role: "Operations", email: "n.ali@sugarhive.com", branch: "Riyadh Front", status: "Active" },
      { name: "Layla Hassan", role: "Operations", email: "l.hassan@sugarhive.com", branch: "Riyadh Front", status: "Active" },
      { name: "Omar Fahad", role: "Supervisor", email: "o.fahad@sugarhive.com", branch: "Jeddah Main", status: "Active" },
      { name: "Reem Al-Dosari", role: "Operations", email: "r.dosari@sugarhive.com", branch: "Jeddah Main", status: "Active" },
      { name: "Youssef Nasser", role: "Operations", email: "y.nasser@sugarhive.com", branch: "Jeddah Main", status: "Active" },
      { name: "Huda Al-Qahtani", role: "Supervisor", email: "h.qahtani@sugarhive.com", branch: "Dammam Hub", status: "Active" },
      { name: "Tariq Saleh", role: "Operations", email: "t.saleh@sugarhive.com", branch: "Dammam Hub", status: "Active" },
      { name: "Mona Ibrahim", role: "Operations", email: "m.ibrahim@sugarhive.com", branch: "Dammam Hub", status: "Active" },
      { name: "Ali Al-Harbi", role: "Operations", email: "a.harbi@sugarhive.com", branch: "Makkah Center", status: "Active" },
      { name: "Fatimah Zayed", role: "Supervisor", email: "f.zayed@sugarhive.com", branch: "Makkah Center", status: "Active" },
      { name: "Hassan Majed", role: "Operations", email: "h.majed@sugarhive.com", branch: "Makkah Center", status: "Active" },
    ];
  })();

  const checklists = (() => {
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved && saved !== "[]") return JSON.parse(saved);
    return [
      { id: '1', title: "Branch Cleaning - Morning Shift", branch: "Riyadh Front", assignee: "Mohammed Al-Otaibi", status: "Partial", progress: 45, dueDate: "Today, 12:00 PM", priority: "High", frequency: "Daily" },
      { id: '2', title: "Weekly Inventory Audit", branch: "Jeddah Main", assignee: "Sara Ahmed", status: "Incomplete", progress: 0, dueDate: "Tomorrow, 09:00 AM", priority: "Medium", frequency: "Weekly" },
      { id: '3', title: "Regular Machine Maintenance", branch: "Dammam Hub", assignee: "Khalid Al-Shamri", status: "Completed", progress: 100, dueDate: "Jan 24, 2026", priority: "Normal", frequency: "Weekly" },
      { id: '4', title: "Quarterly Quality Audit", branch: "Riyadh Front", assignee: "Ahmed Admin", status: "Overdue", progress: 15, dueDate: "Yesterday, 05:00 PM", priority: "Critical", frequency: "Monthly" },
    ];
  })();

  const filteredByBranchChecklists = branchFilter
    ? checklists.filter((c: any) => c.branch === branchFilter || c.branch === "All Branches" || (c.branch && c.branch.split(", ").includes(branchFilter)))
    : checklists;

  const filteredByBranchTeam = branchFilter
    ? teamMembers.filter((m: any) => m.branch === branchFilter)
    : teamMembers;

  const filteredByBranchCourses = branchFilter
    ? courses.filter((c: any) => c.branch === branchFilter)
    : courses;

  const completedCount = filteredByBranchChecklists.filter((c: any) => c.status === "Completed").length;
  const pendingCount = filteredByBranchChecklists.filter((c: any) => c.status === "Incomplete" || c.status === "Partial").length;
  const overdueCount = filteredByBranchChecklists.filter((c: any) => c.status === "Overdue").length;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChecklists = filteredByBranchChecklists.filter((item: any) => {
    const matchesTab = activeTab === "all" ? true : (item.status === "Partial" || item.status === "Overdue" || item.status === "Incomplete");
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const [newTask, setNewTask] = useState(() => {
    const saved = localStorage.getItem("sugarhive_draft_task");
    return saved ? JSON.parse(saved) : { title: "", priority: "", dueDate: "", assignee: "" };
  });

  useEffect(() => {
    localStorage.setItem("sugarhive_draft_task", JSON.stringify(newTask));
  }, [newTask]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setNewTask({ title: "", priority: "", dueDate: "", assignee: "" });
    toast({
      title: t("home.taskAssigned"),
      description: t("home.taskAssignedDesc"),
    });
  };

  const isFormValid = newTask.title && newTask.priority && newTask.dueDate && newTask.assignee;

  const getOperationalLogs = () => {
    const logs: { title: string; subtitle: string; type: 'success' | 'error' | 'info' | 'warning'; timestamp: number; link?: string }[] = [];

    filteredByBranchChecklists.forEach((cl: any) => {
      if (cl.status === "Completed") {
        logs.push({ title: `${translateName(cl.assignee, language)} ${t("log.completedChecklist")}`, subtitle: `${cl.title} — ${translateBranch(cl.branch, language)}`, type: "success", timestamp: cl.completedAt || (Date.now() - 300000), link: `/checklists/${cl.id}` });
      }
      if (cl.status === "Overdue") {
        logs.push({ title: t("log.checklistOverdue"), subtitle: `${cl.title} — ${translateBranch(cl.branch, language)} (${t("log.assignedTo")} ${translateName(cl.assignee, language)})`, type: "error", timestamp: cl.updatedAt || (Date.now() - 600000), link: `/checklists/${cl.id}` });
      }
      if (cl.status === "Partial") {
        logs.push({ title: `${translateName(cl.assignee, language)} ${t("log.partiallyCompleted")}`, subtitle: `${cl.title} — ${translateBranch(cl.branch, language)} (${cl.progress}%)`, type: "warning", timestamp: cl.updatedAt || (Date.now() - 900000), link: `/checklists/${cl.id}` });
      }
    });

    const notifications = (() => {
      const saved = localStorage.getItem("sugarhive_notifications");
      return saved ? JSON.parse(saved) : [];
    })();
    notifications.slice(0, 15).forEach((notif: any) => {
      let type: 'success' | 'error' | 'info' | 'warning' = 'info';
      let link = '/inbox';
      if (notif.type === 'training') { type = 'info'; link = '/training'; }
      else if (notif.type === 'checklist' && notif.title?.toLowerCase().includes('complet')) { type = 'success'; link = '/checklists'; }
      else if (notif.type === 'checklist' && notif.title?.toLowerCase().includes('overdue')) { type = 'error'; link = '/checklists'; }
      else if (notif.type === 'checklist') { type = 'warning'; link = '/checklists'; }
      else if (notif.type === 'team') { type = 'info'; link = '/team'; }
      logs.push({ title: notif.title, subtitle: notif.message?.slice(0, 80) || "", type, timestamp: notif.createdAt || (Date.now() - 1200000), link });
    });

    filteredByBranchCourses.forEach((course: any) => {
      if (course.assignees && course.assignees.length > 0) {
        logs.push({ title: t("log.courseAssigned"), subtitle: `"${course.title}" ${t("log.assignedToEmployees")} ${course.assignees.length} ${course.assignees.length !== 1 ? t("log.employees") : t("log.employee")}`, type: "info", timestamp: course.createdAt || (Date.now() - 3600000), link: '/training' });
      }
      if (course.progress === 100) {
        logs.push({ title: t("log.courseCompleted"), subtitle: `"${course.title}" — ${t("log.allLessonsFinished")}`, type: "success", timestamp: course.completedAt || (Date.now() - 1800000), link: '/training' });
      }
    });

    filteredByBranchTeam.filter((m: any) => m.status === "Active").slice(0, 3).forEach((member: any, i: number) => {
      logs.push({ title: `${translateName(member.name, language)} ${t("log.isActive")}`, subtitle: `${translateRole(member.role, language)} — ${translateBranch(member.branch, language)}`, type: "info", timestamp: Date.now() - (7200000 + i * 600000), link: '/team' });
    });

    const unique = logs.reduce((acc: typeof logs, log) => {
      const key = log.title + log.subtitle;
      if (!acc.find(l => l.title + l.subtitle === key)) acc.push(log);
      return acc;
    }, []);
    unique.sort((a, b) => b.timestamp - a.timestamp);
    return unique;
  };

  const formatTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("time.justNow");
    if (mins < 60) return `${mins} ${t("time.minsAgo")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${t("time.hrsAgo")}`;
    const days = Math.floor(hrs / 24);
    return `${days} ${t("time.daysAgo")}`;
  };

  const handleExportLogs = () => {
    const logs = getOperationalLogs();
    if (logs.length === 0) {
      toast({ title: t("home.noLogs.export"), description: t("home.noLogsExportDesc"), variant: "destructive" });
      return;
    }
    const escapeCSV = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const header = "Date & Time,Event,Details,Type";
    const rows = logs.map(log => {
      const date = new Date(log.timestamp).toLocaleString();
      return [escapeCSV(date), escapeCSV(log.title), escapeCSV(log.subtitle), escapeCSV(log.type)].join(",");
    });
    const csvContent = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SugarHive_Operational_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: t("home.logsExported"), description: `${logs.length} log entries exported successfully.` });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("home.operationsDashboard")} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">{t("home.welcome")}, {user?.name?.split(' ')[0] || 'User'} 👋</h2>
              <p className="text-[#64748B] mt-1">{t("home.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label={t("home.completedTasks")} value={String(completedCount)} trend="" icon={<CheckCircle2 className="text-[#10B981]" />} href="/checklists?filter=completed" />
            <StatCard label={t("home.pendingTasks")} value={String(pendingCount)} trend="" icon={<Clock className="text-[#F59E0B]" />} href="/checklists" />
            <StatCard label={t("home.activeUsers")} value={String(filteredByBranchTeam.filter((m: any) => m.status === "Active").length)} trend="" icon={<Users className="text-[#6366F1]" />} href="/team" />
            <StatCard label={t("home.overdueTasks")} value={String(overdueCount)} trend="" icon={<AlertCircle className="text-[#EF4444]" />} isWarning href="/checklists?filter=overdue" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 shadow-sm border-[#E2E8F0] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-[#F1F5F9] px-6 py-4">
                <div>
                  <CardTitle className="text-lg font-bold text-[#0F172A]">{t("home.liveOperations")}</CardTitle>
                  <CardDescription>{t("home.liveOperationsDesc")}</CardDescription>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2 bg-[#F1F5F9]">
                    <TabsTrigger value="all" className="text-xs">{t("common.all")}</TabsTrigger>
                    <TabsTrigger value="active" className="text-xs">{t("checklists.active")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#F1F5F9]">
                  {filteredChecklists.length > 0 ? filteredChecklists.map((item: any) => (
                    <ChecklistItem 
                      key={item.id}
                      id={item.id}
                      title={item.title} 
                      branch={item.branch} 
                      status={item.status === "Partial" ? "In Progress" : item.status === "Incomplete" ? "Pending" : item.status} 
                      progress={item.progress} 
                      time={item.dueDate}
                      isOverdue={item.status === "Overdue"}
                    />
                  )) : (
                    <div className="p-8 text-center text-[#64748B] text-sm">{t("checklists.noChecklists")}</div>
                  )}
                </div>
                <div className="p-4 bg-[#F8FAFC] border-t border-[#F1F5F9] text-center">
                  <Link href="/checklists">
                    <Button variant="ghost" size="sm" className="text-[#64748B] text-xs font-semibold">
                      {t("home.viewAllOperations")} <ChevronRight size={14} className="ltr:ml-1 rtl:mr-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#E2E8F0] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#0F172A]">{t("home.trainingHub")}</CardTitle>
                <CardDescription>{t("home.trainingHubDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                {(() => {
                  const completedCourses = filteredByBranchCourses.filter((c: any) => c.progress === 100);
                  return completedCourses.length > 0 ? (
                    <>
                      {completedCourses.slice(0, 3).map((course: any, index: number) => {
                        const colors = ["#F59E0B", "#10B981", "#6366F1"];
                        return (
                          <div key={course.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{course.title}</span>
                              <span className="text-[#10B981] font-bold">{t("status.completed")}</span>
                            </div>
                            <Progress value={100} className="h-2 bg-[#F1F5F9] [&>div]:bg-[var(--progress-color)]" style={{ "--progress-color": colors[index % colors.length] } as React.CSSProperties} />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p className="text-sm text-[#64748B]">{t("home.noCompletedCourses")}</p>
                  );
                })()}
                
                <div className="pt-6 border-t border-[#F1F5F9]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-4">{t("home.certifiedToday")}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="w-8 h-8 border-2 border-white ring-1 ring-[#F1F5F9]">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#64748B] ring-1 ring-[#F1F5F9]">
                        {filteredByBranchCourses.filter((c: any) => c.progress === 100).length}
                      </div>
                    </div>
                    <Link href="/training">
                      <Button variant="ghost" size="sm" className="text-[#F59E0B] hover:text-[#D97706] hover:bg-[#F59E0B]/5 text-xs font-bold p-0 px-2 h-7 rounded-lg transition-all">
                        {t("home.manage")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
              {(() => {
                const incompleteCourse = filteredByBranchCourses.find((c: any) => c.progress < 100);
                return incompleteCourse ? (
                  <div className="p-6 bg-[#FEF3C7]/30 border-t border-[#FEF3C7]">
                    <div className="flex gap-3">
                      <GraduationCap className="text-[#F59E0B] shrink-0" size={20} />
                      <div>
                        <p className="text-xs font-bold text-[#92400E]">{t("training.continueLearning")}</p>
                        <p className="text-xs text-[#92400E]/80">{incompleteCourse.title} ({incompleteCourse.progress}%)</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
             <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{t("home.operationalLogs")}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-[#64748B] h-8 w-8 p-0 hover:bg-[#F1F5F9] rounded-full">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#E2E8F0] rounded-xl shadow-xl w-48 p-1">
                        <DropdownMenuItem 
                          className="flex items-center gap-2 p-2 text-sm text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer rounded-lg font-medium"
                          onClick={handleExportLogs}
                        >
                          <FileText size={16} className="text-[#64748B]" /> {t("home.exportCSV")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#F1F5F9] max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {(() => {
                      const displayLogs = getOperationalLogs().slice(0, 10);
                      if (displayLogs.length === 0) {
                        return <p className="text-sm text-[#64748B] py-4">{t("home.noLogs")}</p>;
                      }
                      return displayLogs.map((log, i) => (
                        <ActivityItem
                          key={i}
                          title={log.title}
                          subtitle={log.subtitle}
                          time={formatTimeAgo(log.timestamp)}
                          type={log.type}
                          link={log.link}
                        />
                      ));
                    })()}
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: ReactNode;
  isWarning?: boolean;
  href?: string;
}

function StatCard({ label, value, trend, icon, href }: StatCardProps) {
  const CardWrapper = ({ children }: { children: ReactNode }) => {
    if (href) {
      return <Link href={href} className="block no-underline">{children}</Link>;
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className="shadow-sm border-[#E2E8F0] hover:border-[#F59E0B]/30 transition-all group cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#F8FAFC] rounded-lg group-hover:bg-[#F59E0B]/10 transition-colors border border-[#F1F5F9]">
              {icon}
            </div>
            {trend && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                trend.startsWith('+') 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {trend}
              </span>
            )}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-[#0F172A] tracking-tight">{value}</h3>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

interface ChecklistItemProps {
  id: string;
  title: string;
  branch: string;
  status: string;
  progress: number;
  time: string;
  isOverdue?: boolean;
}

function ChecklistItem({ id, title, branch, status, progress, time, isOverdue = false }: ChecklistItemProps) {
  return (
    <Link href={`/checklists/${id}`}>
      <div className="p-5 hover:bg-[#F8FAFC] transition-all flex flex-col md:flex-row md:items-center gap-4 group cursor-pointer">
        <div className="flex-1">
          <h4 className="font-bold text-[#0F172A] leading-tight mb-1 group-hover:text-[#F59E0B] transition-colors">{title}</h4>
          <div className="flex items-center gap-3 text-xs text-[#64748B] font-medium">
            <span className="flex items-center gap-1"><Building2 size={12} /> {branch}</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className={isOverdue ? "text-red-500 font-bold" : ""}>{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-32">
            <Progress value={progress} className={`h-1.5 bg-[#F1F5F9] ${isOverdue ? '[&>div]:bg-red-500' : progress === 100 ? '[&>div]:bg-[#10B981]' : '[&>div]:bg-[#F59E0B]'}`} />
          </div>
          <span className="text-xs font-bold text-[#0F172A] min-w-[32px] text-right">{progress}%</span>
          <Badge className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none ${
            status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
            status === 'Overdue' ? 'bg-red-50 text-red-600' : 
            status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {status}
          </Badge>
        </div>
      </div>
    </Link>
  );
}


function ActivityItem({ title, subtitle, time, type, link }: { title: string, subtitle: string, time: string, type: 'success' | 'error' | 'info' | 'warning', link?: string }) {
  const colors = {
    success: 'bg-[#10B981]',
    error: 'bg-[#EF4444]',
    info: 'bg-[#6366F1]',
    warning: 'bg-[#F59E0B]'
  };

  const content = (
    <div className={`flex gap-4 ${link ? 'cursor-pointer hover:bg-[#F8FAFC] -mx-2 px-2 py-1.5 -my-1 rounded-lg transition-colors' : ''}`}>
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${colors[type]} ring-4 ring-white shadow-sm z-10`} />
      <div className="space-y-1 flex-1">
        <p className="text-sm font-bold text-[#0F172A] leading-tight">{title}</p>
        <p className="text-xs text-[#64748B]">{subtitle}</p>
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider pt-1">{time}</p>
      </div>
      {link && <ChevronRight size={16} className="text-[#94A3B8] mt-1 shrink-0" />}
    </div>
  );

  if (link) {
    return <Link href={link} data-testid={`log-link-${type}`}>{content}</Link>;
  }
  return content;
}