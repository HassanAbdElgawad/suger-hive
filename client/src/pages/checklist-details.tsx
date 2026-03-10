import React, { useState, useEffect, useRef } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Sidebar, Header } from "./home";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  Calendar,
  Building2,
  Users,
  AlertCircle,
  Camera,
  X as CloseIcon,
  CircleDot,
  Circle,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Edit2,
  Check,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useLanguage, translateName, translateBranch, translateStatus } from "@/lib/language";
import { addNotification } from "@/lib/notifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ItemStatus = 'complete' | 'partial' | 'incomplete';

interface ChecklistItem {
  id: number;
  text: string;
  status: ItemStatus;
  photo?: string | null;
  comment?: string;
  tags?: string[];
  type: 'checkbox';
  statusChanged?: boolean;
}

interface HistoryEntry {
  id: string;
  date: string;
  completedAt: string;
  completedBy: string;
  progress: number;
  status: string;
  items: ChecklistItem[];
}

function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const SUGGESTED_TASKS = [
  "Check equipment temperature",
  "Verify cash register balance",
  "Inspect cleanliness of work area",
  "Review stock levels",
  "Confirm staff attendance",
  "Check expiry dates on products",
  "Test fire safety equipment",
  "Verify display arrangement",
  "Review customer feedback",
  "Check refrigerator temperature",
  "Inspect restroom cleanliness",
  "Verify security camera operation"
];

const SUGGESTED_TAGS = [
  "Safety", "Hygiene", "Inventory", "Equipment", "Staff", 
  "Quality", "Compliance", "Maintenance", "Customer Service", "Finance"
];

function TaskCreationModal({ 
  checklist, 
  onSave,
  onClose
}: { 
  checklist: any; 
  onSave: (tasks: ChecklistItem[]) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [taskText, setTaskText] = useState("");
  const [pendingTasks, setPendingTasks] = useState<{ text: string; tags: string[] }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    setPendingTasks(prev => [...prev, { text: trimmed, tags: [...selectedTags] }]);
    setTaskText("");
    setSelectedTags([]);
    inputRef.current?.focus();
  };

  const addSuggestedTask = (task: string) => {
    if (pendingTasks.some(t => t.text === task)) return;
    setPendingTasks(prev => [...prev, { text: task, tags: [] }]);
  };

  const removeTask = (index: number) => {
    setPendingTasks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  };

  const handleSave = () => {
    if (pendingTasks.length === 0) return;
    const items: ChecklistItem[] = pendingTasks.map((task, index) => ({
      id: index + 1,
      text: task.text,
      status: 'incomplete' as ItemStatus,
      photo: null,
      comment: '',
      tags: task.tags,
      type: 'checkbox' as const,
    }));
    onSave(items);
  };

  const availableSuggestions = SUGGESTED_TASKS.filter(
    s => !pendingTasks.some(t => t.text === s)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="task-creation-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-[#F1F5F9]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">{t("checklist.addTasksTo")} "{checklist.title}"</h3>
              <p className="text-sm text-[#64748B] mt-1">{t("checklist.createTasksDesc")}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all shrink-0"
              data-testid="button-close-task-modal"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#0F172A]">{t("checklist.newTask")}</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("checklist.typeTask")}
                className="flex-1 text-sm border border-[#E2E8F0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B] placeholder:text-[#94A3B8]"
                data-testid="input-new-task"
                autoFocus
              />
              <Button
                onClick={addTask}
                disabled={!taskText.trim()}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl px-4"
                data-testid="button-add-task"
              >
                <Plus size={16} className="mr-1" />
                {t("checklist.add")}
              </Button>
            </div>

          </div>


          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#F59E0B]" />
              <label className="text-sm font-bold text-[#0F172A]">{t("checklist.suggestedTasks")}</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto">
              {availableSuggestions.map(task => (
                <button
                  key={task}
                  onClick={() => addSuggestedTask(task)}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-dashed border-[#E2E8F0] text-[#64748B] hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/5 hover:text-[#0F172A] transition-all flex items-center gap-2"
                  data-testid={`suggestion-${task}`}
                >
                  <Plus size={12} className="shrink-0 text-[#F59E0B]" />
                  <span className="truncate">{task}</span>
                </button>
              ))}
            </div>
          </div>

          {pendingTasks.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0F172A]">
                {t("checklist.addedTasks")} ({pendingTasks.length})
              </label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3"
                    data-testid={`pending-task-${index}`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-[#E2E8F0] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{task.text}</p>
                    </div>
                    <button
                      onClick={() => removeTask(index)}
                      className="text-[#94A3B8] hover:text-red-500 transition-colors shrink-0"
                      data-testid={`remove-task-${index}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#F1F5F9] flex justify-end gap-3">
          <Button
            onClick={handleSave}
            disabled={pendingTasks.length === 0}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl px-6 disabled:opacity-50"
            data-testid="button-save-tasks"
          >
            {t("checklist.saveTasks")} ({pendingTasks.length})
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChecklistDetails() {
  const [match, params] = useRoute("/checklists/:id");
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor';
  
  const checklistId = params?.id || "";
  
  const [checklist, setChecklist] = useState<any>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const checklists = JSON.parse(saved);
      const found = checklists.find((c: any) => c.id === checklistId);
      if (found) {
        const savedItems = localStorage.getItem(`sugarhive_items_${checklistId}`);
        if (savedItems && JSON.parse(savedItems).length > 0) {
          const parsed = JSON.parse(savedItems);
          const migrated = parsed.map((item: any) => {
            if (item.status === undefined && item.completed !== undefined) {
              return { ...item, status: item.completed ? 'complete' : 'incomplete' };
            }
            return item;
          });
          setItems(migrated);
          const completeCount = migrated.filter((i: any) => i.status === 'complete').length;
          const partialCount = migrated.filter((i: any) => i.status === 'partial').length;
          const totalCount = migrated.length;
          const realProgress = totalCount > 0 ? Math.round(((completeCount + partialCount * 0.5) / totalCount) * 100) : 0;
          let realStatus: string;
          if (found.status === 'Draft') realStatus = 'Draft';
          else if (completeCount === totalCount && totalCount > 0) realStatus = 'Completed';
          else if (completeCount > 0 || partialCount > 0) realStatus = 'Partial';
          else realStatus = 'Incomplete';
          if (found.status === 'Overdue' && realStatus !== 'Completed') realStatus = 'Overdue';
          setChecklist({ ...found, progress: realProgress, status: realStatus });
        } else if (checklistId === '4') {
          setChecklist(found);
          const defaultOverdueItems: ChecklistItem[] = [
            { id: 1, text: "Check espresso machine pressure and calibration", status: 'partial', type: 'checkbox', comment: "Pressure slightly low, needs follow-up" },
            { id: 2, text: "Inspect grinder burrs for wear", status: 'incomplete', type: 'checkbox' },
            { id: 3, text: "Test water filtration system", status: 'incomplete', type: 'checkbox' },
            { id: 4, text: "Verify refrigerator temperature logs", status: 'incomplete', type: 'checkbox', comment: "Thermometer not found" },
            { id: 5, text: "Review food safety compliance checklist", status: 'incomplete', type: 'checkbox' },
            { id: 6, text: "Audit cleaning supply inventory", status: 'complete', type: 'checkbox' },
          ];
          setItems(defaultOverdueItems);
          localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(defaultOverdueItems));
        } else {
          setChecklist(found);
          if (!isAdmin) {
            navigate("/checklists");
            return;
          }
          setShowTaskCreation(true);
        }
      }
    }
    const savedHistory = localStorage.getItem(`sugarhive_history_${checklistId}`);
    if (savedHistory) {
      try {
        let entries = JSON.parse(savedHistory);
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        entries = entries.filter((e: any) => new Date(e.completedAt) >= fifteenDaysAgo);
        localStorage.setItem(`sugarhive_history_${checklistId}`, JSON.stringify(entries));
        setHistory(entries);
      } catch {
        setHistory([]);
      }
    }

    setIsLoading(false);
  }, [checklistId]);

  const saveToHistory = (overrideItems?: ChecklistItem[], overrideProgress?: number, overrideStatus?: string) => {
    const historyItems = overrideItems || items;
    if (historyItems.length === 0 || !checklist) return;
    const today = new Date().toISOString().split('T')[0];
    const entry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      date: today,
      completedAt: new Date().toISOString(),
      completedBy: user?.name || 'Unknown',
      progress: overrideProgress ?? checklist?.progress ?? 0,
      status: overrideStatus ?? checklist?.status ?? 'Incomplete',
      items: historyItems.map(i => ({ ...i, photo: null })),
    };
    const existingRaw = localStorage.getItem(`sugarhive_history_${checklistId}`);
    const existing: HistoryEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const filtered = existing.filter(e => new Date(e.completedAt) >= fifteenDaysAgo && e.date !== today);
    const updatedHistory = [entry, ...filtered];
    setHistory(updatedHistory);
    try {
      localStorage.setItem(`sugarhive_history_${checklistId}`, JSON.stringify(updatedHistory));
    } catch {
    }
    return entry;
  };


  const handleTasksSaved = (newItems: ChecklistItem[]) => {
    let allItems: ChecklistItem[];
    if (items.length > 0) {
      const maxId = Math.max(...items.map(i => i.id), 0);
      const reIdedNew = newItems.map((item, idx) => ({ ...item, id: maxId + idx + 1 }));
      allItems = [...items, ...reIdedNew];
    } else {
      allItems = newItems;
    }
    setItems(allItems);
    localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(allItems));

    const completeCount = allItems.filter(i => i.status === 'complete').length;
    const partialCount = allItems.filter(i => i.status === 'partial').length;
    const totalCount = allItems.length;
    const newProgress = totalCount > 0 ? Math.round(((completeCount + partialCount * 0.5) / totalCount) * 100) : 0;
    const keepDraft = checklist?.status === "Draft";
    let newStatus = keepDraft ? "Draft" : "Incomplete";
    if (!keepDraft) {
      if (completeCount === totalCount && totalCount > 0) newStatus = 'Completed';
      else if (completeCount > 0 || partialCount > 0) newStatus = 'Partial';
    }

    setChecklist((prev: any) => ({ ...prev, progress: newProgress, status: newStatus }));
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const allChecklists = JSON.parse(saved);
      const updatedChecklists = allChecklists.map((c: any) =>
        c.id === checklistId ? { ...c, progress: newProgress, status: newStatus } : c
      );
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedChecklists));
    }

    if (!keepDraft) {
      const historyEntry: HistoryEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString().split('T')[0],
        completedAt: new Date().toISOString(),
        completedBy: user?.name || 'Unknown',
        progress: newProgress,
        status: newStatus,
        items: allItems.map(i => ({ ...i, photo: null })),
      };
      const existingRaw = localStorage.getItem(`sugarhive_history_${checklistId}`);
      const existing: HistoryEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      const entryDate = new Date().toISOString().split('T')[0];
      const filtered = existing.filter(e => new Date(e.completedAt) >= fifteenDaysAgo && e.date !== entryDate);
      const updatedHistory = [historyEntry, ...filtered];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(`sugarhive_history_${checklistId}`, JSON.stringify(updatedHistory));
      } catch {
      }
    }

    setShowTaskCreation(false);
    toast({
      title: t("checklist.tasksAdded"),
      description: `${newItems.length} ${t("toast.tasksAddedDesc")}`,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedItems = items.filter(i => i.id !== taskId);
    setItems(updatedItems);
    localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(updatedItems));
    toast({ title: t("checklist.taskDeleted"), description: t("checklist.taskDeletedDesc") });
  };

  const handleEditTask = (taskId: number) => {
    const task = items.find(i => i.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setEditingTaskText(task.text);
    }
  };

  const handleSaveEditTask = () => {
    if (!editingTaskText.trim() || editingTaskId === null) return;
    const updatedItems = items.map(i =>
      i.id === editingTaskId ? { ...i, text: editingTaskText.trim() } : i
    );
    setItems(updatedItems);
    localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(updatedItems));
    setEditingTaskId(null);
    setEditingTaskText("");
    toast({ title: t("checklist.taskUpdated"), description: t("checklist.taskUpdatedDesc") });
  };

  const handleEditChecklist = () => {
    setEditTitle(checklist?.title || "");
    setShowEditDialog(true);
  };

  const handleSaveChecklist = () => {
    if (!editTitle.trim()) return;
    const updated = { ...checklist, title: editTitle.trim() };
    setChecklist(updated);
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const all = JSON.parse(saved);
      const updatedAll = all.map((c: any) => c.id === checklistId ? { ...c, title: editTitle.trim() } : c);
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedAll));
    }
    setShowEditDialog(false);
    toast({ title: t("checklist.checklistUpdated"), description: t("checklist.checklistUpdatedDesc") });
  };

  const isDraft = checklist?.status === "Draft";

  const handlePublishChecklist = () => {
    if (items.length === 0) {
      toast({ title: t("checklist.cannotPublish"), description: t("checklist.addTaskFirst") });
      return;
    }
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const all = JSON.parse(saved);
      const draftGroupId = checklist?.draftGroupId;
      const updatedAll = all.map((c: any) => {
        const isCurrentOrSibling = c.id === checklistId || (draftGroupId && c.draftGroupId === draftGroupId && c.status === "Draft");
        if (!isCurrentOrSibling) return c;
        if (c.id !== checklistId) {
          const siblingItems = localStorage.getItem(`sugarhive_items_${c.id}`);
          if (!siblingItems || JSON.parse(siblingItems).length === 0) {
            localStorage.setItem(`sugarhive_items_${c.id}`, JSON.stringify(
              items.map((item, idx) => ({ ...item, id: idx + 1, status: 'incomplete', photo: null, comment: '' }))
            ));
          }
        }
        return { ...c, status: "Incomplete", progress: 0 };
      });
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedAll));

      updatedAll.filter((c: any) => (c.id === checklistId || (draftGroupId && c.draftGroupId === draftGroupId)) && c.status === "Incomplete").forEach((c: any) => {
        const assignees = c.assignee ? c.assignee.split(", ") : [];
        assignees.forEach((assignee: string) => {
          addNotification({
            recipient: assignee,
            title: t("notification.newChecklistAssigned"),
            message: `${t("notification.checklistAssignedMessage")} "${c.title}". ${t("notification.branch")}: ${c.branch}.`,
            type: "checklist",
            branch: c.branch,
            checklistId: c.id,
          });
        });
      });
    }
    setChecklist((prev: any) => ({ ...prev, status: "Incomplete", progress: 0 }));
    toast({
      title: t("checklist.published"),
      description: t("checklist.publishedDesc"),
    });
    navigate("/checklists");
  };

  const handleUnpublishChecklist = () => {
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const all = JSON.parse(saved);
      const draftGroupId = checklist?.draftGroupId;
      const updatedAll = all.map((c: any) => {
        const isCurrentOrSibling = c.id === checklistId || (draftGroupId && c.draftGroupId === draftGroupId && c.status !== "Draft");
        if (!isCurrentOrSibling) return c;
        return { ...c, status: "Draft", progress: 0 };
      });
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedAll));
    }
    setChecklist((prev: any) => ({ ...prev, status: "Draft", progress: 0 }));
    toast({
      title: t("checklist.unpublished"),
      description: t("checklist.unpublishedDesc"),
    });
  };

  const handleDeleteChecklist = () => {
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const all = JSON.parse(saved);
      const filtered = all.filter((c: any) => c.id !== checklistId);
      localStorage.setItem("sugarhive_checklists", JSON.stringify(filtered));
    }
    localStorage.removeItem(`sugarhive_items_${checklistId}`);
    toast({ title: t("checklist.deleted"), description: t("checklist.deletedDesc") });
    navigate("/checklists");
  };

  const updateItems = (updatedItems: ChecklistItem[]) => {
    setItems(updatedItems);
    localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(updatedItems));

    const completeCount = updatedItems.filter(i => i.status === 'complete').length;
    const partialCount = updatedItems.filter(i => i.status === 'partial').length;
    const totalCount = updatedItems.length;
    if (totalCount === 0) return;
    const newProgress = Math.round(((completeCount + partialCount * 0.5) / totalCount) * 100);
    
    let newStatus = 'Incomplete';
    if (completeCount === totalCount) {
      newStatus = 'Completed';
    } else if (completeCount === 0 && partialCount === 0) {
      newStatus = 'Incomplete';
    } else {
      newStatus = 'Partial';
    }

    setChecklist((prev: any) => {
      const keepOverdue = prev?.status === 'Overdue' && newStatus !== 'Completed';
      return { ...prev, progress: newProgress, status: keepOverdue ? 'Overdue' : newStatus };
    });
    
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const allChecklists = JSON.parse(saved);
      const updatedChecklists = allChecklists.map((c: any) => {
        if (c.id !== checklistId) return c;
        const keepOverdue = c.status === 'Overdue' && newStatus !== 'Completed';
        return { ...c, progress: newProgress, status: keepOverdue ? 'Overdue' : newStatus };
      });
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedChecklists));
    }
  };

  const isOverdue = checklist?.status === 'Overdue';

  const setItemStatus = (id: number, newStatus: ItemStatus) => {
    if (isBeforeStart) {
      const dateStr = new Date(checklist.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = checklist.startTime ? ` at ${formatTime12h(checklist.startTime)}` : '';
      toast({ title: t("checklist.notAvailableYet"), description: `This checklist starts on ${dateStr}${timeStr}. Tasks cannot be completed before then.`, variant: "destructive" });
      return;
    }
    const updatedItems = items.map(i =>
      i.id === id ? { ...i, status: newStatus } : i
    );
    updateItems(updatedItems);

    const completeCount = updatedItems.filter(i => i.status === 'complete').length;
    const partialCount = updatedItems.filter(i => i.status === 'partial').length;
    const totalCount = updatedItems.length;
    const progress = totalCount > 0 ? Math.round(((completeCount + partialCount * 0.5) / totalCount) * 100) : 0;
    let statusLabel = 'Incomplete';
    if (completeCount === totalCount) statusLabel = 'Completed';
    else if (completeCount > 0 || partialCount > 0) statusLabel = 'Partial';
    saveToHistory(updatedItems, progress, statusLabel);

    if (newStatus === 'complete') {
      setTimeout(() => {
        document.getElementById(`photo-${id}`)?.click();
      }, 100);
    }
  };

  const handlePhotoUpload = (id: number, photo: string | null) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, photo } : item
    );
    updateItems(updatedItems);
  };

  const handleCommentChange = (id: number, comment: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, comment } : item
    );
    updateItems(updatedItems);
  };

  const handleCompleteAll = () => {
    if (isBeforeStart) {
      const dateStr = new Date(checklist.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = checklist.startTime ? ` at ${formatTime12h(checklist.startTime)}` : '';
      toast({ title: t("checklist.notAvailableYet"), description: `This checklist starts on ${dateStr}${timeStr}. Tasks cannot be completed before then.`, variant: "destructive" });
      return;
    }
    const updatedItems = items.map(item => ({ ...item, status: 'complete' as ItemStatus }));
    setItems(updatedItems);
    localStorage.setItem(`sugarhive_items_${checklistId}`, JSON.stringify(updatedItems));
    
    setChecklist((prev: any) => ({ ...prev, progress: 100, status: 'Completed' }));
    
    const saved = localStorage.getItem("sugarhive_checklists");
    if (saved) {
      const allChecklists = JSON.parse(saved);
      const updatedChecklists = allChecklists.map((c: any) => 
        c.id === checklistId ? { ...c, progress: 100, status: 'Completed' } : c
      );
      localStorage.setItem("sugarhive_checklists", JSON.stringify(updatedChecklists));
    }

    saveToHistory(updatedItems, 100, 'Completed');
    
    toast({
      title: t("checklist.completedToast"),
      description: t("checklist.completedDesc"),
    });

    setTimeout(() => {
      setLocation("/checklists");
    }, 1500);
  };

  if (isLoading || !checklist) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-slate-600">{t("checklist.loadingDetails")}</p>
      </div>
    );
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isBeforeStart = (() => {
    if (!checklist.startDate) return false;
    if (todayStr < checklist.startDate) return true;
    if (todayStr === checklist.startDate && checklist.startTime) {
      const [h, m] = checklist.startTime.split(':').map(Number);
      const startMinutes = h * 60 + m;
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      return nowMinutes < startMinutes;
    }
    return false;
  })();

  const checklistStatusColors: Record<string, string> = {
    'Draft': 'bg-blue-50 text-blue-600 border-blue-100',
    'Partial': 'bg-orange-50 text-orange-600 border-orange-100',
    'Incomplete': 'bg-slate-50 text-slate-600 border-slate-100',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Overdue': 'bg-red-50 text-red-600 border-red-100'
  };

  const statusButtonStyles: Record<ItemStatus, { active: string; icon: React.ReactNode; label: string }> = {
    'complete': {
      active: 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600',
      icon: <CheckCircle2 size={14} />,
      label: t("checklist.complete")
    },
    'partial': {
      active: 'bg-orange-400 text-white border-orange-400 hover:bg-orange-500',
      icon: <CircleDot size={14} />,
      label: t("checklist.partial")
    },
    'incomplete': {
      active: 'bg-slate-400 text-white border-slate-400 hover:bg-slate-500',
      icon: <Circle size={14} />,
      label: t("checklist.incomplete")
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("checklist.details")} />

        {showTaskCreation && (
          <TaskCreationModal checklist={checklist} onSave={handleTasksSaved} onClose={() => setShowTaskCreation(false)} />
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/checklists">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">{checklist.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className={`${checklistStatusColors[checklist.status] || checklistStatusColors['Incomplete']} border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                    {t(`status.${checklist.status.toLowerCase()}`)}
                  </Badge>
                  <span className="text-[#64748B] text-sm">•</span>
                  <div className="flex items-center gap-1 text-[#64748B] text-sm font-medium">
                    <Building2 size={14} />
                    <span>{translateBranch(checklist.branch, language)}</span>
                  </div>
                  {checklist.startTime && checklist.endTime && (
                    <>
                      <span className="text-[#64748B] text-sm">•</span>
                      <div className={`flex items-center gap-1 text-sm font-medium ${checklist.status === 'Overdue' ? 'text-red-500' : 'text-[#64748B]'}`}>
                        <Clock size={14} />
                        <span>{formatTime12h(checklist.startTime)} - {formatTime12h(checklist.endTime)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {isAdmin && (
            <div className="flex items-center gap-2">
              {isDraft ? (
                <Button
                  onClick={handlePublishChecklist}
                  disabled={items.length === 0}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold shadow-lg shadow-orange-100 disabled:opacity-50"
                  data-testid="button-publish-checklist"
                >
                  <Check size={16} className="mr-1.5" />
                  {t("checklist.publishChecklist")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnpublishConfirm(true)}
                  className="border-[#E2E8F0] text-slate-600 hover:text-orange-600 hover:border-orange-300 font-bold"
                  data-testid="button-unpublish-checklist"
                >
                  <EyeOff size={14} className="mr-1.5" />
                  {t("checklist.unpublish")}
                </Button>
              )}
            </div>
            )}
          </div>

          {isDraft && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3" data-testid="draft-banner">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Edit2 size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900">{t("checklist.draftMode")}</p>
                <p className="text-xs text-blue-700">{t("checklist.draftModeDesc")}</p>
              </div>
            </div>
          )}

          {!isDraft && isBeforeStart && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3" data-testid="future-start-banner">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">{t("checklist.scheduledChecklist")}</p>
                <p className="text-xs text-amber-700">This checklist starts on <span className="font-bold">{new Date(checklist.startDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}{checklist.startTime ? ` at ${formatTime12h(checklist.startTime)}` : ''}</span>. Tasks cannot be completed until then.</p>
              </div>
            </div>
          )}

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{t("checklist.editChecklist")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#0F172A]">{t("checklist.checklistTitle")}</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveChecklist(); }}
                    className="border-[#E2E8F0] rounded-xl focus:ring-[#F59E0B]/30 focus:border-[#F59E0B]"
                    data-testid="input-edit-checklist-title"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)} className="rounded-xl">{t("common.cancel")}</Button>
                  <Button onClick={handleSaveChecklist} className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl" data-testid="button-save-checklist-edit">{t("common.save")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="rounded-xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#0F172A]">{t("checklist.deleteChecklist")}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#64748B] py-2">{t("confirm.deleteMessage")}</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-xl font-bold" data-testid="button-cancel-delete">{t("common.cancel")}</Button>
                <Button onClick={() => { setShowDeleteConfirm(false); handleDeleteChecklist(); }} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl" data-testid="button-confirm-delete">{t("common.delete")}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showUnpublishConfirm} onOpenChange={setShowUnpublishConfirm}>
            <DialogContent className="rounded-xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#0F172A]">{t("checklist.unpublishChecklist")}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#64748B] py-2">{t("checklist.unpublishMessage")}</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowUnpublishConfirm(false)} className="rounded-xl font-bold" data-testid="button-cancel-unpublish">{t("common.cancel")}</Button>
                <Button onClick={() => { setShowUnpublishConfirm(false); handleUnpublishChecklist(); }} className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl" data-testid="button-confirm-unpublish">{t("checklist.unpublish")}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteTaskId !== null} onOpenChange={(open) => { if (!open) setDeleteTaskId(null); }}>
            <DialogContent className="rounded-xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#0F172A]">{t("checklist.deleteTask")}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#64748B] py-2">{t("confirm.deleteMessage")}</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDeleteTaskId(null)} className="rounded-xl font-bold" data-testid="button-cancel-delete-task">{t("common.cancel")}</Button>
                <Button onClick={() => { if (deleteTaskId !== null) { handleDeleteTask(deleteTaskId); setDeleteTaskId(null); } }} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl" data-testid="button-confirm-delete-task">{t("common.delete")}</Button>
              </div>
            </DialogContent>
          </Dialog>

          {items.length === 0 && !showTaskCreation ? (
            <Card className="shadow-sm border-[#E2E8F0]">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                  <Plus size={28} className="text-[#F59E0B]" />
                </div>
                <p className="text-lg font-bold text-[#0F172A]">{t("checklist.noTasksYet")}</p>
                <p className="text-sm text-[#64748B]">{isAdmin ? t("checklist.addTasksToChecklist") : t("checklist.noTasksAssigned")}</p>
                {isAdmin && (
                <Button
                  onClick={() => setShowTaskCreation(true)}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl px-6"
                  data-testid="button-open-task-creator"
                >
                  <Plus size={16} className="mr-2" />
                  {t("checklist.addTasks")}
                </Button>
                )}
              </CardContent>
            </Card>
          ) : items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm border-[#E2E8F0] overflow-hidden">
                  <CardHeader className="bg-white border-b border-[#F1F5F9] pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{t("checklist.operationalTasks")}</CardTitle>
                      <CardDescription>{isAdmin ? t("checklist.reviewTasks") : isSupervisor ? t("checklist.setStatusTasks") : t("checklist.viewTasks")}</CardDescription>
                    </div>
                    {isAdmin && isDraft && (
                    <Button
                      size="sm"
                      className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-sm"
                      onClick={() => setShowTaskCreation(true)}
                      data-testid="button-add-more-tasks"
                    >
                      <Plus size={16} className="mr-1.5" /> {t("checklist.addTasks")}
                    </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-[#F1F5F9]">
                      {items.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-5 space-y-4 hover:bg-[#F8FAFC] transition-colors group"
                          data-testid={`checklist-item-${item.id}`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                              <div 
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                  item.status === 'complete' ? 'bg-[#10B981] border-[#10B981] text-white' : 
                                  item.status === 'partial' ? 'bg-orange-400 border-orange-400 text-white' :
                                  'border-[#E2E8F0] bg-white'
                                }`}
                              >
                                {item.status === 'complete' && <CheckCircle2 size={14} />}
                                {item.status === 'partial' && <CircleDot size={14} />}
                              </div>
                              {editingTaskId === item.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingTaskText}
                                    onChange={(e) => setEditingTaskText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditTask(); if (e.key === 'Escape') { setEditingTaskId(null); setEditingTaskText(""); } }}
                                    className="flex-1 text-sm font-semibold border border-[#F59E0B] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30"
                                    autoFocus
                                    data-testid={`input-edit-task-${item.id}`}
                                  />
                                  <Button size="sm" variant="ghost" onClick={handleSaveEditTask} className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50" data-testid={`button-save-edit-${item.id}`}>
                                    <Check size={16} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => { setEditingTaskId(null); setEditingTaskText(""); }} className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-50" data-testid={`button-cancel-edit-${item.id}`}>
                                    <CloseIcon size={16} />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex-1 min-w-0">
                                  <span className={`text-sm font-semibold ${
                                    item.status === 'complete' ? 'text-[#64748B] line-through' : 'text-[#0F172A]'
                                  }`}>
                                    {item.text}
                                  </span>
                                </div>
                              )}
                              {isAdmin && isDraft && editingTaskId !== item.id && (
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEditTask(item.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-[#F59E0B] hover:bg-amber-50" data-testid={`button-edit-task-${item.id}`}>
                                    <Edit2 size={14} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setDeleteTaskId(item.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50" data-testid={`button-delete-task-${item.id}`}>
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              )}
                            </div>

                            </div>

                          <input
                            type="file"
                            id={`photo-${item.id}`}
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  handlePhotoUpload(item.id, reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />

                          {isSupervisor && (
                            <div className="pl-10 flex flex-wrap gap-2">
                              {(['complete', 'partial', 'incomplete'] as ItemStatus[]).map(s => {
                                const style = statusButtonStyles[s];
                                const isActive = item.status === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => setItemStatus(item.id, s)}
                                    disabled={!!isBeforeStart}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                      isBeforeStart
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                        : isActive 
                                          ? style.active
                                          : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8]'
                                    }`}
                                    data-testid={`status-${s}-item-${item.id}`}
                                  >
                                    {style.icon}
                                    {style.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {!isAdmin && !isSupervisor && (
                            <div className="pl-10">
                              <p className="text-xs text-[#94A3B8] italic">{t("checklist.onlySupervisors")}</p>
                            </div>
                          )}

                          {isSupervisor && item.status === 'complete' && (
                            <div className="pl-10">
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`h-9 font-bold ${item.photo ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300' : 'border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 bg-amber-50/30'}`}
                                  onClick={() => document.getElementById(`photo-${item.id}`)?.click()}
                                  data-testid={`take-photo-item-${item.id}`}
                                >
                                  <Camera size={14} className="mr-2" />
                                  {item.photo ? t("checklist.changePhoto") : t("checklist.takePhoto")}
                                </Button>

                                {item.photo && (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#E2E8F0]">
                                    <img src={item.photo} alt="Item" className="w-full h-full object-cover" />
                                    <button
                                      className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-lg"
                                      onClick={() => handlePhotoUpload(item.id, null)}
                                    >
                                      <CloseIcon size={8} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              {!item.photo && (
                                <p className="text-[10px] text-amber-500 mt-1 font-medium">{t("checklist.photoConfirm")}</p>
                              )}
                            </div>
                          )}

                          {isSupervisor && !isBeforeStart && (item.status === 'partial' || item.status === 'incomplete') && (
                            <div className="pl-10">
                              <textarea
                                placeholder={t("checklist.commentWhy")}
                                value={item.comment || ''}
                                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                className={`w-full text-sm border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B] placeholder:text-[#94A3B8] min-h-[60px] ${
                                  !item.comment?.trim() ? 'border-amber-300 bg-amber-50/30' : 'border-[#E2E8F0]'
                                }`}
                                data-testid={`comment-item-${item.id}`}
                              />
                              {!item.comment?.trim() && (
                                <p className="text-[10px] text-amber-500 mt-1 font-medium">{t("checklist.commentRequired")}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle className="text-base font-bold">{t("checklist.completionProgress")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-2xl font-bold text-[#0F172A]">{checklist.progress}%</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{t("checklist.target")}</span>
                    </div>
                    <Progress value={checklist.progress} className={`h-3 bg-[#F1F5F9] ${checklist.progress === 100 ? '[&>div]:bg-[#10B981]' : checklist.status === 'Overdue' ? '[&>div]:bg-[#EF4444]' : '[&>div]:bg-[#F59E0B]'}`} />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="text-center p-2 bg-emerald-50 rounded-lg">
                        <p className="text-lg font-bold text-emerald-600">{items.filter(i => i.status === 'complete').length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{t("checklist.complete")}</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <p className="text-lg font-bold text-orange-600">{items.filter(i => i.status === 'partial').length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{t("checklist.partial")}</p>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-600">{items.filter(i => i.status === 'incomplete').length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("checklist.incomplete")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle className="text-base font-bold">{t("checklist.details")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.frequency")}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                        <Clock size={14} className="text-[#F59E0B]" />
                        <span>{checklist.frequency}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.assignee")}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                        <Users size={14} className="text-[#F59E0B]" />
                        <span>{checklist.assignee?.split(", ").map((a: string) => translateName(a, language)).join(", ")}</span>
                      </div>
                    </div>
                    {checklist.startTime && checklist.endTime && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.timeWindow")}</p>
                      <div className={`flex items-center gap-2 text-sm font-semibold ${checklist.status === 'Overdue' ? 'text-red-500' : 'text-[#0F172A]'}`}>
                        <Clock size={14} className={checklist.status === 'Overdue' ? 'text-red-500' : 'text-[#F59E0B]'} />
                        <span>{formatTime12h(checklist.startTime)} - {formatTime12h(checklist.endTime)}</span>
                      </div>
                      {checklist.status === 'Overdue' && (
                        <p className="text-[11px] text-red-400 font-medium">{t("checklist.overdueMessage")}</p>
                      )}
                    </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle className="text-base font-bold">{t("checklist.operationHistory")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <p className="text-sm text-[#94A3B8] text-center py-4" data-testid="text-no-history">{t("checklist.noHistoryYet")}</p>
                    ) : (
                      <div className="space-y-3" data-testid="history-list">
                        {history.slice(0, 1).map((entry, idx) => {
                          const completedCount = entry.items.filter(i => i.status === 'complete').length;
                          const partialCount = entry.items.filter(i => i.status === 'partial').length;
                          const incompleteCount = entry.items.filter(i => i.status === 'incomplete').length;
                          const entryDate = new Date(entry.completedAt);
                          const dateStr = entryDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          const timeStr = entryDate.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

                          return (
                            <div
                              key={entry.id || idx}
                              className="p-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/50"
                              data-testid={`history-entry-${idx}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    entry.progress === 100 ? 'bg-emerald-100 text-emerald-600' :
                                    entry.progress > 0 ? 'bg-amber-100 text-amber-600' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {entry.progress === 100 ? '✓' : `${entry.progress}%`}
                                  </div>
                                  <span className="text-xs font-bold text-[#0F172A]">{entry.progress}%</span>
                                </div>
                                <Badge className={`border-none text-[9px] font-bold uppercase ${
                                  entry.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                  entry.status === 'Overdue' ? 'bg-red-50 text-red-500' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                  {translateStatus(entry.status, language)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-[#64748B] mb-1.5">
                                <Clock size={11} />
                                <span>{dateStr} {timeStr}</span>
                              </div>
                              <p className="text-[11px] text-[#64748B]">
                                {t("checklist.completedBy")} <span className="font-semibold text-[#0F172A]">{translateName(entry.completedBy, language)}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-[10px] font-medium">
                                {completedCount > 0 && (
                                  <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{completedCount} {t("checklist.itemsCompleted")}</span>
                                )}
                                {partialCount > 0 && (
                                  <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{partialCount} {t("checklist.itemsPartial")}</span>
                                )}
                                {incompleteCount > 0 && (
                                  <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{incompleteCount} {t("checklist.itemsIncomplete")}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
