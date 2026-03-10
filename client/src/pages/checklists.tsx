import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sidebar, Header } from "./home";
import { useLanguage, translateName, translateBranch } from "@/lib/language";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar as CalendarIcon,
  Building2,
  Users,
  Settings,
  ClipboardList,
  Camera,
  X as CloseIcon,
  Check,
  History,
  CircleDot,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth, getUserBranchFilter } from "@/lib/auth";
import { addNotification } from "@/lib/notifications";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, Copy, FileText, Share2 } from "lucide-react";

type ItemStatus = 'complete' | 'partial' | 'incomplete';

interface HistoryItem {
  id: number;
  text: string;
  status: ItemStatus;
  photo?: string | null;
  comment?: string;
  type: string;
}

interface HistoryEntry {
  id: string;
  date: string;
  completedAt: string;
  completedBy: string;
  progress: number;
  status: string;
  items: HistoryItem[];
}

export default function Checklists() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get("filter");
      if (filter === "overdue") return "overdue";
      if (filter === "completed") return "completed";
      return "all";
    }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [historyChecklistId, setHistoryChecklistId] = useState<string | null>(null);
  const [historyChecklistTitle, setHistoryChecklistTitle] = useState("");
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [viewingHistoryEntry, setViewingHistoryEntry] = useState<HistoryEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openHistory = (checklistId: string, title: string) => {
    const saved = localStorage.getItem(`sugarhive_history_${checklistId}`);
    let entries: HistoryEntry[] = saved ? JSON.parse(saved) : [];
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    entries = entries.filter(e => new Date(e.completedAt) >= fifteenDaysAgo);
    setHistoryEntries(entries);
    setHistoryChecklistId(checklistId);
    setHistoryChecklistTitle(title);
    if (entries.length > 0) {
      setViewingHistoryEntry(entries[0]);
    }
  };

  const closeHistory = () => {
    setHistoryChecklistId(null);
    setHistoryChecklistTitle("");
    setHistoryEntries([]);
    setViewingHistoryEntry(null);
  };
  const [formData, setFormData] = useState({
    title: "",
    frequency: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    branches: [] as string[],
    assignees: [] as string[]
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem("sugarhive_checklists");
    if (!saved || saved === "[]") {
      return [
        { id: '1', title: "Branch Cleaning - Morning Shift", branch: "Riyadh Front", assignee: "Mohammed Al-Otaibi", status: "Partial" as const, progress: 45, dueDate: "Today, 12:00 PM", priority: "High", frequency: "Daily", startDate: "2026-02-11", endDate: "2026-02-28", startTime: "09:00", endTime: "11:00" },
        { id: '2', title: "Night Shift Cleaning", branch: "Jeddah Main", assignee: "Omar Fahad", status: "Incomplete" as const, progress: 0, dueDate: "Tomorrow, 09:00 AM", priority: "Medium", frequency: "Daily", startDate: "2026-02-11", endDate: "2026-02-28", startTime: "21:00", endTime: "23:00" },
        { id: '3', title: "Regular Machine Maintenance", branch: "Dammam Hub", assignee: "Huda Al-Qahtani", status: "Completed" as const, progress: 100, dueDate: "Jan 24, 2026", priority: "Normal", frequency: "Weekly", startDate: "2026-01-17", endDate: "2026-01-24", startTime: "08:00", endTime: "10:00" },
        { id: '4', title: "Quarterly Quality Audit", branch: "Riyadh Front", assignee: "Mohammed Al-Otaibi", status: "Overdue" as const, progress: 15, dueDate: "Yesterday, 05:00 PM", priority: "Critical", frequency: "Monthly", startDate: "2026-01-10", endDate: "2026-02-10", startTime: "14:00", endTime: "17:00" },
      ];
    }
    const parsed = JSON.parse(saved);
    return parsed.map((c: any) => {
      if (c.status === 'Draft') return c;
      const savedItems = localStorage.getItem(`sugarhive_items_${c.id}`);
      if (savedItems) {
        const taskItems = JSON.parse(savedItems);
        if (taskItems.length > 0) {
          const completeCount = taskItems.filter((i: any) => i.status === 'complete').length;
          const partialCount = taskItems.filter((i: any) => i.status === 'partial').length;
          const totalCount = taskItems.length;
          const realProgress = Math.round(((completeCount + partialCount * 0.5) / totalCount) * 100);
          let realStatus: string;
          if (completeCount === totalCount) realStatus = 'Completed';
          else if (completeCount > 0 || partialCount > 0) realStatus = 'Partial';
          else realStatus = 'Incomplete';
          if (c.status === 'Overdue' && realStatus !== 'Completed') realStatus = 'Overdue';
          return { ...c, progress: realProgress, status: realStatus };
        }
      }
      if (c.progress === 100 && c.status !== 'Completed' && c.status !== 'Overdue') return { ...c, status: 'Completed' };
      if (c.progress < 100 && c.status === 'Completed') {
        const newStatus = c.progress === 0 ? 'Incomplete' : 'Partial';
        return { ...c, status: newStatus };
      }
      return c;
    });
  });

  useEffect(() => {
    localStorage.setItem("sugarhive_checklists", JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      setChecklists((prev: any[]) => {
        let changed = false;
        const updated = prev.map((c: any) => {
          if (c.status === 'Completed' || c.status === 'Draft' || !c.endTime) return c;

          if (c.endDate && todayStr > c.endDate && c.progress < 100) {
            if (c.status !== 'Overdue') {
              changed = true;
              return { ...c, status: 'Overdue' };
            }
            return c;
          }

          if (c.endDate && todayStr === c.endDate && c.progress < 100) {
            const [endH, endM] = c.endTime.split(':').map(Number);
            const endTimeMinutes = endH * 60 + endM;
            if (currentTimeMinutes >= endTimeMinutes && c.status !== 'Overdue') {
              changed = true;
              return { ...c, status: 'Overdue' };
            }
            if (currentTimeMinutes < endTimeMinutes && c.status === 'Overdue') {
              changed = true;
              const newStatus = c.progress === 0 ? 'Incomplete' : 'Partial';
              return { ...c, status: newStatus };
            }
            return c;
          }

          const isWithinDateRange = (!c.startDate || todayStr >= c.startDate) && (!c.endDate || todayStr <= c.endDate);
          if (!isWithinDateRange) return c;
          const [endH, endM] = c.endTime.split(':').map(Number);
          const endTimeMinutes = endH * 60 + endM;
          if (currentTimeMinutes > endTimeMinutes && c.status !== 'Overdue' && c.progress < 100) {
            changed = true;
            return { ...c, status: 'Overdue' };
          }
          if (currentTimeMinutes <= endTimeMinutes && c.status === 'Overdue') {
            changed = true;
            const newStatus = c.progress === 0 ? 'Incomplete' : 'Partial';
            return { ...c, status: newStatus };
          }
          return c;
        });
        return changed ? updated : prev;
      });
    };
    checkOverdue();
    const interval = setInterval(checkOverdue, 60000);
    return () => clearInterval(interval);
  }, []);

  const isTimeValid = (() => {
    if (!formData.startDate || !formData.startTime || !formData.endTime) return true;
    if (formData.endDate && formData.endDate < formData.startDate) return false;
    if (formData.endTime <= formData.startTime) return false;
    return true;
  })();

  const isFormValid = formData.title && formData.frequency && formData.startDate && formData.startTime && formData.endTime && formData.branches.length > 0 && formData.assignees.length > 0 && isTimeValid;

  const timeOptions = (() => {
    const opts: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        opts.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return opts;
  })();

  const formatTimeLabel = (timeVal: string) => {
    const [h, m] = timeVal.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const [branches] = useState(() => {
    const saved = localStorage.getItem("sugarhive_branches");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Riyadh Front" },
      { name: "Jeddah Main" },
      { name: "Dammam Hub" },
      { name: "Makkah Center" },
    ];
  });

  const getTeamMembers = (): any[] => {
    const saved = localStorage.getItem("sugarhive_team");
    if (saved) return JSON.parse(saved);
    return [];
  };

  const getStaffForBranch = (branchName: string): string[] => {
    const team = getTeamMembers();
    if (branchName === "all") {
      return Array.from(new Set(team.filter((m: any) => m.status === "Active" && m.role === "Supervisor").map((m: any) => m.name)));
    }
    return team
      .filter((m: any) => m.branch === branchName && m.status === "Active" && m.role === "Supervisor")
      .map((m: any) => m.name);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      setChecklists((prev: any[]) => prev.map(c => c.id === editingTemplate.id ? {
        ...c,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        branch: formData.branches.includes("all") ? "All Branches" : formData.branches.join(", "),
        assignee: formData.assignees.join(", "),
        frequency: formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)
      } : c));
      toast({
        title: t("checklists.templateUpdated"),
        description: t("checklists.templateUpdatedDesc"),
      });
    } else {
      const branchList = formData.branches.includes("all") 
        ? branches.map((b: any) => b.name) 
        : formData.branches;

      const draftGroupId = Math.random().toString(36).substr(2, 9);
      const newChecklists: any[] = [];
      branchList.forEach((branchName: string) => {
        const branchSupervisors = getStaffForBranch(branchName).filter(s => formData.assignees.includes(s));
        const assigneeStr = branchSupervisors.length > 0 ? branchSupervisors.join(", ") : formData.assignees.join(", ");

        const newChecklist = {
          id: Math.random().toString(36).substr(2, 9),
          draftGroupId,
          title: formData.title,
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          branch: branchName,
          assignee: assigneeStr,
          status: "Draft" as const,
          progress: 0,
          dueDate: "Just now",
          priority: "Normal",
          frequency: formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)
        };
        newChecklists.push(newChecklist);
      });

      setChecklists((prev: any[]) => [...newChecklists, ...prev]);
      const firstId = newChecklists[0]?.id;
      toast({
        title: t("checklists.draftCreated"),
        description: t("checklists.draftCreatedDesc"),
      });
      setFormData({ title: "", frequency: "", startDate: "", endDate: "", startTime: "", endTime: "", branches: [], assignees: [] });
      setEditingTemplate(null);
      setIsDialogOpen(false);
      if (firstId) {
        setTimeout(() => navigate(`/checklists/${firstId}`), 100);
      }
      return;
    }
      setFormData({ title: "", frequency: "", startDate: "", endDate: "", startTime: "", endTime: "", branches: [], assignees: [] });
    setEditingTemplate(null);
    setIsDialogOpen(false);
  };

  const handleDuplicateTemplate = (template: any) => {
    const duplicated = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      title: `${template.title} (Copy)`,
      status: "Incomplete" as const,
      progress: 0,
      dueDate: "Just now"
    };
    setChecklists((prev: any[]) => [duplicated, ...prev]);
    toast({
      title: t("checklists.templateDuplicated"),
      description: t("checklists.templateDuplicatedDesc"),
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setChecklists((prevChecklists: any[]) => prevChecklists.filter(c => c.id !== id));
    toast({
      title: t("checklists.templateDeleted"),
      description: t("checklists.templateDeletedDesc"),
    });
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    const today = new Date().toISOString().split('T')[0];
    const startDate = template.startDate || today;
    const endDate = template.endDate || today;
    const startTime = template.startTime || "09:00";
    let endTime = template.endTime || "17:00";
    if (endTime && startTime && endTime <= startTime) {
      endTime = "";
    }
    setFormData({
      title: template.title,
      frequency: template.frequency.toLowerCase(),
      startDate,
      endDate,
      startTime,
      endTime,
      branches: template.branch === "All Branches" ? ["all"] : template.branch.split(", "),
      assignees: template.assignee ? template.assignee.split(", ") : []
    });
    setIsDialogOpen(true);
  };

  const handleExportPDF = (title: string) => {
    toast({
      title: t("checklists.exportingPDF"),
      description: `${t("checklists.exportingPDFDesc")} ${title}...`,
    });
    setTimeout(() => {
      toast({
        title: t("checklists.exportComplete"),
        description: t("checklists.exportCompleteDesc"),
      });
    }, 1500);
  };

  const branchFilter = getUserBranchFilter(user);

  const filteredChecklists = checklists.filter((item: any) => {
    if (item.status === "Draft" && !isAdmin) return false;

    if (!isAdmin) {
      const savedItems = localStorage.getItem(`sugarhive_items_${item.id}`);
      const tasks = savedItems ? JSON.parse(savedItems) : [];
      if (tasks.length === 0) return false;
    }

    const matchesBranch = !branchFilter || item.branch === branchFilter || item.branch === "All Branches" || (item.branch && item.branch.split(", ").includes(branchFilter));

    const matchesTab = 
      activeTab === "all" ? (isAdmin ? true : item.status !== "Draft") : 
      activeTab === "drafts" ? item.status === "Draft" :
      activeTab === "overdue" ? item.status === "Overdue" :
      activeTab === "pending" ? (item.status === "Incomplete" || item.status === "Partial" || item.status === "Overdue") :
      item.status === "Completed";
      
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFrequency = frequencyFilter === "All" || item.frequency === frequencyFilter;
    
    return matchesBranch && matchesTab && matchesSearch && matchesFrequency;
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          title={t("checklists.management")} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("checklists.title")}</h2>
              <p className="text-[#64748B] mt-1">{t("checklists.manageTrack")}</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white border-[#E2E8F0] hover:bg-slate-50">
                    <Filter size={18} className="ltr:mr-2 rtl:ml-2" /> {t("checklists.filter")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl border-[#E2E8F0]">
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklists.filterByFrequency")}</div>
                  {["All", "Daily", "Weekly", "Monthly"].map((freq) => {
                    const freqLabels: Record<string, string> = {
                      "All": t("common.all"),
                      "Daily": t("common.daily"),
                      "Weekly": t("common.weekly"),
                      "Monthly": t("common.monthly"),
                    };
                    return (
                      <DropdownMenuItem 
                        key={freq}
                        onClick={() => setFrequencyFilter(freq)}
                        className={`flex items-center gap-2 p-2.5 cursor-pointer rounded-lg transition-colors ${
                          frequencyFilter === freq ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <span className="text-sm font-semibold">{freqLabels[freq]}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingTemplate(null);
                    setFormData({ title: "", frequency: "", startDate: "", endDate: "", startTime: "", endTime: "", branches: [], assignees: [] });
                }
              }}>
                {isAdmin && (
                  <DialogTrigger asChild>
                    <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-lg shadow-orange-100" data-testid="button-create-checklist">
                      <Plus size={18} className="ltr:mr-2 rtl:ml-2" /> {t("checklists.createNew")}
                    </Button>
                  </DialogTrigger>
                )}
                <DialogContent className="max-w-md max-h-[85vh] flex flex-col overflow-hidden">
                  <DialogHeader className="shrink-0">
                    <DialogTitle>{editingTemplate ? t("checklists.editChecklistTemplate") : t("checklists.newChecklistTemplate")}</DialogTitle>
                    <DialogDescription>{editingTemplate ? t("checklists.editDescription") : t("checklists.newDescription")}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTemplate} className="flex flex-col overflow-hidden flex-1">
                    <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.checklistTitle")} <span className="text-red-500">*</span></Label>
                        <Input 
                          placeholder={t("placeholder.checklistTitle")} 
                          className="rounded-xl border-[#E2E8F0]" 
                          required 
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          data-testid="input-checklist-title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.frequency")} <span className="text-red-500">*</span></Label>
                        <Select 
                          required
                          value={formData.frequency}
                          onValueChange={(v) => setFormData({ ...formData, frequency: v })}
                        >
                          <SelectTrigger className="rounded-xl border-[#E2E8F0]" data-testid="select-frequency">
                            <SelectValue placeholder={t("checklists.selectFrequency")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">{t("common.daily")}</SelectItem>
                            <SelectItem value="weekly">{t("common.weekly")}</SelectItem>
                            <SelectItem value="monthly">{t("common.monthly")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.startDate")} <span className="text-red-500">*</span></Label>
                          <Input 
                            type="date"
                            className="rounded-xl border-[#E2E8F0]" 
                            required 
                            min={editingTemplate ? undefined : new Date().toISOString().split('T')[0]}
                            value={formData.startDate}
                            onChange={(e) => {
                              const newStart = e.target.value;
                              const updates: any = { startDate: newStart };
                              if (formData.endDate && formData.endDate < newStart) {
                                updates.endDate = newStart;
                              }
                              setFormData({ ...formData, ...updates });
                            }}
                            data-testid="input-start-date"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.endDate")}</Label>
                          <Input 
                            type="date"
                            className="rounded-xl border-[#E2E8F0]"
                            min={editingTemplate ? (formData.startDate || undefined) : (formData.startDate || new Date().toISOString().split('T')[0])}
                            value={formData.endDate}
                            onChange={(e) => {
                              const newEndDate = e.target.value;
                              const updates: any = { endDate: newEndDate };
                              if (formData.endTime && formData.startTime && formData.endTime <= formData.startTime) {
                                updates.endTime = "";
                              }
                              setFormData({ ...formData, ...updates });
                            }}
                            data-testid="input-end-date"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.startTime")} <span className="text-red-500">*</span></Label>
                          <Select
                            value={formData.startTime}
                            onValueChange={(val) => {
                              const updates: any = { startTime: val };
                              if (formData.endTime && formData.endTime <= val) {
                                updates.endTime = "";
                              }
                              setFormData({ ...formData, ...updates });
                            }}
                          >
                            <SelectTrigger className="rounded-xl border-[#E2E8F0]" data-testid="input-start-time">
                              <SelectValue placeholder={t("checklists.selectStartTime")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg max-h-60">
                              {timeOptions.map((tv) => (
                                <SelectItem key={tv} value={tv}>{formatTimeLabel(tv)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.endTime")} <span className="text-red-500">*</span></Label>
                          <Select
                            value={formData.endTime}
                            onValueChange={(val) => setFormData({ ...formData, endTime: val })}
                          >
                            <SelectTrigger className={`rounded-xl ${!isTimeValid ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E2E8F0]'}`} data-testid="input-end-time">
                              <SelectValue placeholder={t("checklists.selectEndTime")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg max-h-60">
                              {timeOptions
                                .filter((tv) => !(formData.startTime && tv <= formData.startTime))
                                .map((tv) => (
                                  <SelectItem key={tv} value={tv}>{formatTimeLabel(tv)}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {!isTimeValid && (
                            <p className="text-xs text-red-500 mt-1">
                              {formData.endDate && formData.endDate < formData.startDate 
                                ? t("checklists.endDateAfterStart") 
                                : t("checklists.endTimeAfterStart")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.targetBranches")} <span className="text-red-500">*</span></Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between rounded-xl border-[#E2E8F0] font-normal">
                              <span className="truncate">
                                {formData.branches.length === 0 ? t("checklists.selectBranches") : 
                                 formData.branches.includes("all") ? t("checklists.allBranches") : 
                                 formData.branches.join(", ")}
                              </span>
                              <ChevronRight size={16} className="rotate-90 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-white border-[#E2E8F0]">
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault();
                                if (formData.branches.includes("all")) {
                                  setFormData({ ...formData, branches: [], assignees: [] });
                                } else {
                                  setFormData({ ...formData, branches: ["all"], assignees: [] });
                                }
                              }}
                            >
                              <div className={`w-4 h-4 border rounded flex items-center justify-center ${formData.branches.includes("all") ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#E2E8F0]"}`}>
                                {formData.branches.includes("all") && <Check size={12} className="text-white" />}
                              </div>
                              <span className="font-bold">{t("checklists.allBranches")}</span>
                            </DropdownMenuItem>
                            {!formData.branches.includes("all") && branches.map((b: any) => (
                              <DropdownMenuItem 
                                key={b.name}
                                className="flex items-center gap-2 cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  const newBranches = formData.branches.includes(b.name)
                                    ? formData.branches.filter(name => name !== b.name)
                                    : [...formData.branches, b.name];
                                  setFormData({ ...formData, branches: newBranches, assignees: [] });
                                }}
                              >
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${formData.branches.includes(b.name) ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#E2E8F0]"}`}>
                                  {formData.branches.includes(b.name) && <Check size={12} className="text-white" />}
                                </div>
                                <span>{b.name}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("checklists.assignToSupervisors")} <span className="text-red-500">*</span></Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={formData.branches.length === 0}>
                            <Button variant="outline" className="w-full justify-between rounded-xl border-[#E2E8F0] font-normal disabled:opacity-50">
                              <span className="truncate">
                                {formData.assignees.length === 0 ? t("checklists.selectSupervisors") : formData.assignees.join(", ")}
                              </span>
                              <ChevronRight size={16} className="rotate-90 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-white border-[#E2E8F0]">
                            {formData.branches.length > 0 ? (
                              Array.from(new Set(formData.branches.flatMap(b => getStaffForBranch(b)))).map((staff: string) => (
                                <DropdownMenuItem 
                                  key={staff}
                                  className="flex items-center gap-2 cursor-pointer"
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    const newAssignees = formData.assignees.includes(staff)
                                      ? formData.assignees.filter(s => s !== staff)
                                      : [...formData.assignees, staff];
                                    setFormData({ ...formData, assignees: newAssignees });
                                  }}
                                >
                                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${formData.assignees.includes(staff) ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#E2E8F0]"}`}>
                                    {formData.assignees.includes(staff) && <Check size={12} className="text-white" />}
                                  </div>
                                  <span>{staff}</span>
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <div className="p-2 text-xs text-[#64748B] italic text-center">{t("checklists.selectBranchesFirst")}</div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 flex items-center justify-center shrink-0 border-t border-[#F1F5F9] mt-2">
                      <Button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="button-submit-template"
                      >
                        {editingTemplate ? t("checklists.updateTemplate") : t("checklists.nextAddTasks")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F1F5F9] flex flex-col md:flex-row gap-6 items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className={isAdmin ? "w-[600px]" : "w-[500px]"}>
                <TabsList className={`grid w-full ${isAdmin ? "grid-cols-5" : "grid-cols-4"} bg-[#F1F5F9]`}>
                  <TabsTrigger value="all" className="text-xs" data-testid="tabs-all">{t("checklists.all")}</TabsTrigger>
                  {isAdmin && <TabsTrigger value="drafts" className="text-xs" data-testid="tabs-drafts">{t("checklists.drafts")}</TabsTrigger>}
                  <TabsTrigger value="pending" className="text-xs" data-testid="tabs-pending">{t("checklists.pending")}</TabsTrigger>
                  <TabsTrigger value="overdue" className="text-xs" data-testid="tabs-overdue">{t("checklists.overdue")}</TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs" data-testid="tabs-completed">{t("checklists.completed")}</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                <Input 
                  placeholder={t("checklists.searchChecklists")} 
                  className="pl-10 border-[#E2E8F0] rounded-xl" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {filteredChecklists.map((item: any, i: number) => (
                <ChecklistRow 
                  key={item.id || i}
                  {...item}
                  onDelete={(id: string) => setDeleteConfirmId(id)}
                  onDuplicate={handleDuplicateTemplate}
                  onEdit={handleEditTemplate}
                  onExport={handleExportPDF}
                  onHistory={openHistory}
                  isAdmin={isAdmin}
                />
              ))}
            </div>

            <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
              <p className="text-xs text-[#64748B] font-medium">{t("checklists.showing")} {filteredChecklists.length} {t("checklists.checklistsCount")}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] disabled:opacity-50 disabled:bg-slate-50" disabled>{t("checklists.previous")}</Button>
                <Button variant="outline" size="sm" className="bg-white border-[#E2E8F0] disabled:opacity-50 disabled:bg-slate-50" disabled>{t("checklists.next")}</Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
          <DialogContent className="rounded-xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#0F172A]">{t("checklists.deleteTemplate")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#64748B] py-2">{t("checklists.deleteConfirmMessage")}</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="rounded-xl font-bold" data-testid="button-cancel-delete-template">{t("common.cancel")}</Button>
              <Button onClick={() => { if (deleteConfirmId) { handleDeleteTemplate(deleteConfirmId); } setDeleteConfirmId(null); }} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl" data-testid="button-confirm-delete-template">{t("common.delete")}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!historyChecklistId && !viewingHistoryEntry} onOpenChange={(open) => { if (!open) closeHistory(); }}>
          <DialogContent className="rounded-xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <History size={18} className="text-[#F59E0B]" />
                {t("checklists.history")}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#64748B]">{historyChecklistTitle}</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-[#94A3B8] text-center py-8" data-testid="text-no-history">{t("checklists.noHistory")}</p>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewingHistoryEntry} onOpenChange={(open) => { if (!open) closeHistory(); }}>
          <DialogContent className="rounded-xl max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <History size={18} className="text-[#F59E0B]" />
                {viewingHistoryEntry && new Date(viewingHistoryEntry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#64748B]">{historyChecklistTitle}</DialogDescription>
            </DialogHeader>
            {viewingHistoryEntry && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">{t("checklists.completedBy")}</span>
                    <span className="font-semibold text-[#0F172A]">{viewingHistoryEntry.completedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">{t("checklist.progress")}:</span>
                    <span className="font-semibold text-[#0F172A]">{viewingHistoryEntry.progress}%</span>
                  </div>
                </div>
                <Progress value={viewingHistoryEntry.progress} className={`h-2 bg-[#F1F5F9] ${viewingHistoryEntry.progress === 100 ? '[&>div]:bg-[#10B981]' : '[&>div]:bg-[#F59E0B]'}`} />
                <div className="divide-y divide-[#F1F5F9]">
                  {viewingHistoryEntry.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        item.status === 'complete' ? 'bg-[#10B981] border-[#10B981] text-white' :
                        item.status === 'partial' ? 'bg-orange-400 border-orange-400 text-white' :
                        'border-[#E2E8F0] bg-white'
                      }`}>
                        {item.status === 'complete' && <CheckCircle2 size={12} />}
                        {item.status === 'partial' && <CircleDot size={12} />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-semibold ${item.status === 'complete' ? 'text-[#64748B] line-through' : 'text-[#0F172A]'}`}>
                          {item.text}
                        </span>
                        {item.comment && (
                          <p className="text-xs text-[#94A3B8] mt-1">{item.comment}</p>
                        )}
                      </div>
                      <Badge className={`text-[10px] font-bold border shrink-0 ${
                        item.status === 'complete' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.status === 'partial' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {t(`status.${item.status}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, mo, d] = dateStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[mo - 1]} ${d}`;
}

interface ChecklistRowProps {
  id: string;
  title: string;
  branch: string;
  assignee: string;
  status: 'Incomplete' | 'Partial' | 'Completed' | 'Overdue' | 'Draft';
  progress: number;
  dueDate: string;
  priority: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  onDelete: (id: string) => void;
  onDuplicate: (item: any) => void;
  onEdit: (item: any) => void;
  onExport: (title: string) => void;
  onHistory: (id: string, title: string) => void;
  isAdmin: boolean;
}

function ChecklistRow({ id, title, branch, assignee, status, progress, dueDate, frequency, startDate, endDate, startTime, endTime, onDelete, onDuplicate, onEdit, onExport, onHistory, isAdmin }: ChecklistRowProps) {
  const { t, language } = useLanguage();
  const statusColors: Record<string, string> = {
    'Draft': 'bg-blue-50 text-blue-600 border-blue-100',
    'Partial': 'bg-orange-50 text-orange-600 border-orange-100',
    'Incomplete': 'bg-slate-50 text-slate-600 border-slate-100',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Overdue': 'bg-red-50 text-red-600 border-red-100'
  };

  const displayStatus = status === 'Draft' || status === 'Overdue' ? status :
    progress === 100 ? 'Completed' : progress > 0 ? 'Partial' : 'Incomplete';
  const item = { id, title, branch, assignee, status: displayStatus, progress, dueDate, frequency, startDate, endDate, startTime, endTime };

  return (
    <div className="flex flex-col">
      <div className="p-6 hover:bg-[#F8FAFC] transition-all flex flex-col md:flex-row md:items-center gap-6 group">
        <div className="flex-1">
          <Link href={`/checklists/${id}`}>
            <div className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-[#0F172A] text-lg tracking-tight flex-1 group-hover:text-[#F59E0B] transition-colors">{title}</h4>
                <Badge className={`${statusColors[displayStatus]} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                  {t(`status.${displayStatus.toLowerCase()}`)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-[#64748B] flex-wrap">
                <div className="flex items-center gap-1">
                  <Building2 size={14} />
                  <span>{translateBranch(branch, language)}</span>
                </div>
                <div className="w-px h-3 bg-[#E2E8F0]"></div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{assignee.split(", ").map(a => translateName(a, language)).join(", ")}</span>
                </div>
                {startDate && (
                  <>
                    <div className="w-px h-3 bg-[#E2E8F0]"></div>
                    <div className={`flex items-center gap-1 ${status === 'Overdue' ? 'text-red-500 font-bold' : ''}`}>
                      <CalendarIcon size={14} />
                      <span>{formatShortDate(startDate)}{endDate ? ` - ${formatShortDate(endDate)}` : ` - ${t("checklists.ongoing")}`}</span>
                    </div>
                  </>
                )}
                {startTime && endTime && (
                  <>
                    <div className="w-px h-3 bg-[#E2E8F0]"></div>
                    <div className={`flex items-center gap-1 ${status === 'Overdue' ? 'text-red-500 font-bold' : ''}`}>
                      <Clock size={14} />
                      <span>{formatTime12h(startTime)} - {formatTime12h(endTime)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="w-40 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
              <span>{t("checklists.completion")}</span>
              <span className="text-[#0F172A]">{progress}%</span>
            </div>
            <Progress value={progress} className={`h-1.5 bg-[#F1F5F9] ${progress === 100 ? '[&>div]:bg-[#10B981]' : displayStatus === 'Overdue' ? '[&>div]:bg-[#EF4444]' : '[&>div]:bg-[#F59E0B]'}`} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHistory(id, title)}
              className="border-[#E2E8F0] text-[#64748B] hover:text-[#F59E0B] hover:border-[#F59E0B]/30 font-semibold text-xs gap-1.5 rounded-xl"
              data-testid={`button-history-${id}`}
            >
              <History size={14} />
              <span className="hidden md:inline">{t("checklists.history")}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-[#0F172A] rounded-full h-10 w-10">
                  <MoreHorizontal size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-[#E2E8F0]">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklists.templateActions")}</div>
                {isAdmin && status === 'Draft' && (
                  <DropdownMenuItem 
                    onClick={() => onEdit(item)}
                    className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><Edit2 size={14} /></div>
                    <span className="text-sm font-semibold text-[#0F172A]">{t("checklists.editTemplate")}</span>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem 
                    onClick={() => onDuplicate(item)}
                    className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-md"><Copy size={14} /></div>
                    <span className="text-sm font-semibold text-[#0F172A]">{t("checklists.duplicate")}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onHistory(id, title)}
                  className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                  data-testid={`button-history-${id}`}
                >
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><History size={14} /></div>
                  <span className="text-sm font-semibold text-[#0F172A]">{t("checklists.viewHistory")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onExport(title)}
                  className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                >
                  <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md"><Share2 size={14} /></div>
                  <span className="text-sm font-semibold text-[#0F172A]">{t("checklists.exportPDF")}</span>
                </DropdownMenuItem>
                {isAdmin && status === 'Draft' && (
                  <>
                    <DropdownMenuSeparator className="my-2 bg-[#F1F5F9]" />
                    <DropdownMenuItem 
                      onClick={() => onDelete(id)}
                      className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors"
                    >
                      <div className="p-1.5 bg-red-100 rounded-md"><Trash2 size={14} /></div>
                      <span className="text-sm font-semibold">{t("checklists.deleteTemplate")}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href={`/checklists/${item.id}`}>
              <div className="p-2 bg-white rounded-xl border border-[#E2E8F0] text-[#94A3B8] group-hover:text-[#F59E0B] group-hover:border-[#F59E0B]/30 transition-all shadow-sm cursor-pointer">
                <ChevronRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
