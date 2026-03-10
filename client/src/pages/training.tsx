import { useState, ReactNode, useEffect } from "react";
import { Sidebar, Header } from "./home";
import { addNotification } from "@/lib/notifications";
import { useAuth } from "@/lib/auth";
import { useLanguage, translateName, translateRole, translateBranch } from "@/lib/language";
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Award,
  Plus,
  Video,
  Layers,
  Users,
  CheckCircle2,
  Check,
  X,
  Trash2,
  ImagePlus,
  ChevronRight,
  Presentation
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Training() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(3);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLessons, setEditLessons] = useState<{title: string; attachment?: {name: string; type: string; dataUrl: string}}[]>([]);
  const [editNewLessonTitle, setEditNewLessonTitle] = useState("");
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("sugarhive_training_categories");
    if (saved) return JSON.parse(saved);
    return ["Operations", "Compliance", "Hospitality", "Management"];
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; type: 'video' | 'pdf'; dataUrl: string}[]>([]);
  const [lessons, setLessons] = useState<{title: string; attachment?: {name: string; type: 'video' | 'pdf' | 'pptx'; dataUrl: string}}[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [courseImage, setCourseImage] = useState<string>("");
  const [editCourseImage, setEditCourseImage] = useState<string>("");
  const [editAssignees, setEditAssignees] = useState<string[]>([]);
  const [courseAssignees, setCourseAssignees] = useState<string[]>([]);
  const [courseBranch, setCourseBranch] = useState<string>("");
  const [editBranch, setEditBranch] = useState<string>("");
  const [editInstructor, setEditInstructor] = useState<string>("");
  const [editDuration, setEditDuration] = useState<string>("");
  const [editInstructorEmail, setEditInstructorEmail] = useState<string>("");
  const [empProgressState, setEmpProgressState] = useState<Record<string, number>>(() => {
    return JSON.parse(localStorage.getItem("sugarhive_employee_course_progress") || "{}");
  });

  const getBranches = () => {
    const saved = localStorage.getItem("sugarhive_branches");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Riyadh Front", location: "Airport Road, Riyadh", manager: "Mohammed Al-Otaibi", status: "Active" },
      { name: "Jeddah Main", location: "Tahlia Street, Jeddah", manager: "Sara Ahmed", status: "Active" },
      { name: "Dammam Hub", location: "Corniche Road, Dammam", manager: "Khalid Al-Shamri", status: "Active" },
      { name: "Makkah Center", location: "Ibrahim Al Khalil St, Makkah", manager: "Faisal Khalid", status: "Inactive" },
    ];
  };

  const getTeamMembers = (): any[] => {
    const saved = localStorage.getItem("sugarhive_team");
    if (saved) return JSON.parse(saved);
    const defaults = [
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
    localStorage.setItem("sugarhive_team", JSON.stringify(defaults));
    return defaults;
  };

  useEffect(() => {
    localStorage.setItem("sugarhive_training_categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: t("training.categoryExists"), variant: "destructive" });
      return;
    }
    setCategories([...categories, trimmed]);
    setSelectedCategory(trimmed);
    setNewCategoryInput("");
    toast({ title: t("training.categoryAdded"), description: `"${trimmed}" is now available.` });
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    if (selectedCategory === cat) setSelectedCategory("");
    toast({ title: t("training.categoryRemoved"), description: `"${cat}" has been removed.` });
  };

  const saveEmployeeCourseProgress = (courseId: number, lessonsCompleted: number) => {
    if (!user?.name) return;
    const stored = { ...empProgressState };
    const key = `${courseId}_${user.name}`;
    stored[key] = lessonsCompleted;
    localStorage.setItem("sugarhive_employee_course_progress", JSON.stringify(stored));
    setEmpProgressState(stored);

    setCourses((prev: any[]) => prev.map((c: any) => {
      if (c.id !== courseId) return c;
      const updatedAssignees = [...(c.assignees || [])];
      if (!updatedAssignees.includes(user.name)) {
        updatedAssignees.push(user.name);
      }
      const totalLessons = c.lessonData?.length || c.topics?.length || 1;
      const allAssignees = [...updatedAssignees];
      const progressKeysForCourse = Object.keys(stored).filter(k => k.startsWith(`${courseId}_`));
      progressKeysForCourse.forEach(k => {
        const empName = k.replace(`${courseId}_`, '');
        if (empName && !allAssignees.includes(empName)) {
          allAssignees.push(empName);
        }
      });
      let totalCompleted = 0;
      allAssignees.forEach((name: string) => {
        const empKey = `${courseId}_${name}`;
        totalCompleted += (stored[empKey] || 0);
      });
      const totalPossible = allAssignees.length * totalLessons;
      const newProgress = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
      return { ...c, assignees: updatedAssignees, progress: newProgress };
    }));
  };

  const handleNextLesson = () => {
    const course = courses.find((c: any) => c.id === activeCourseId);
    const lessonCount = course?.lessonData?.length || course?.topics?.length || 1;
    if (currentLessonIndex < lessonCount - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      saveEmployeeCourseProgress(activeCourseId!, currentLessonIndex + 2);
      toast({
        title: t("training.lessonCompleted"),
        description: t("training.movingToNext"),
      });
    } else {
      saveEmployeeCourseProgress(activeCourseId!, lessonCount);
      toast({
        title: t("training.courseCompleted"),
        description: t("training.congratsFinished"),
      });
      setActiveCourseId(null);
    }
  };

  const defaultAssignees: Record<number, string[]> = {
    1: ["Khalid Al-Shamri", "Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Tariq Saleh", "Ali Al-Harbi", "Hassan Majed"],
    2: ["Khalid Al-Shamri", "Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Tariq Saleh", "Mona Ibrahim", "Ali Al-Harbi", "Hassan Majed"],
    3: ["Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Ali Al-Harbi"],
    4: ["Khalid Al-Shamri", "Tariq Saleh", "Mona Ibrahim", "Hassan Majed"],
  };

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("sugarhive_courses");
    if (saved) {
      const parsed = JSON.parse(saved);
      let fixed = false;
      const restored = parsed.map((c: any) => {
        if ((!c.assignees || c.assignees.length === 0) && defaultAssignees[c.id]) {
          fixed = true;
          c = { ...c, assignees: defaultAssignees[c.id] };
        }
        return c;
      });
      if (fixed) {
        localStorage.setItem("sugarhive_courses", JSON.stringify(restored));
      }
      return restored;
    }
    return [
      {
        id: 1,
        title: "Advanced Operations Mastery",
        lessons: 4,
        duration: "4.5 hrs",
        progress: 75,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&h=250&auto=format&fit=crop",
        category: "Operations",
        description: "Master the intricacies of store operations, from supply chain management to workforce optimization. This comprehensive course covers advanced strategies for scaling branch performance.",
        instructor: "Ahmed Admin",
        instructorEmail: "ahmed@sugarhive.com",
        topics: ["Supply Chain Logistics", "Staff Scheduling", "Inventory Management", "Quality Control"],
        resources: [],
        attachments: [],
        lessonData: [
          { title: "Supply Chain Logistics" },
          { title: "Staff Scheduling" },
          { title: "Inventory Management" },
          { title: "Quality Control" },
        ],
        assignees: ["Khalid Al-Shamri", "Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Tariq Saleh", "Ali Al-Harbi", "Hassan Majed"],
        branch: "Riyadh Front"
      },
      {
        id: 2,
        title: "Safety & Hygiene Protocols",
        lessons: 4,
        duration: "2 hrs",
        progress: 100,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&h=250&auto=format&fit=crop",
        category: "Compliance",
        description: "Ensure your branch meets all health and safety regulations with essential hygiene protocols and sanitation standards. Required for all operations team members.",
        instructor: "Sara Ahmed",
        instructorEmail: "sara@sugarhive.com",
        topics: ["Food Safety Standards", "Emergency Evacuation", "Sanitation Procedures", "Personal Hygiene"],
        resources: [],
        attachments: [],
        lessonData: [
          { title: "Food Safety Standards" },
          { title: "Emergency Evacuation" },
          { title: "Sanitation Procedures" },
          { title: "Personal Hygiene" },
        ],
        assignees: ["Khalid Al-Shamri", "Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Tariq Saleh", "Mona Ibrahim", "Ali Al-Harbi", "Hassan Majed"],
        branch: "Jeddah Main"
      },
      {
        id: 3,
        title: "Customer Service Excellence",
        lessons: 4,
        duration: "3 hrs",
        progress: 30,
        image: "https://images.unsplash.com/photo-1556740734-7f9a2b7a0f4c?q=80&w=400&h=250&auto=format&fit=crop",
        category: "Hospitality",
        description: "Transform your customer interactions into memorable experiences with advanced communication techniques and service recovery strategies.",
        instructor: "Sara Ahmed",
        instructorEmail: "sara@sugarhive.com",
        topics: ["Communication Skills", "Handling Complaints", "Guest Experience Design", "Upselling Techniques"],
        resources: [],
        attachments: [],
        lessonData: [
          { title: "Communication Skills" },
          { title: "Handling Complaints" },
          { title: "Guest Experience Design" },
          { title: "Upselling Techniques" },
        ],
        assignees: ["Noura Ali", "Layla Hassan", "Reem Al-Dosari", "Youssef Nasser", "Ali Al-Harbi"],
        branch: "Dammam Hub"
      },
      {
        id: 4,
        title: "Leadership Fundamentals",
        lessons: 4,
        duration: "6 hrs",
        progress: 10,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&h=250&auto=format&fit=crop",
        category: "Management",
        description: "Develop the core leadership skills needed to inspire and manage a diverse team effectively across multiple branches.",
        instructor: "Faisal Khalid",
        instructorEmail: "faisal@sugarhive.com",
        topics: ["Team Building", "Conflict Resolution", "Coaching & Mentoring", "Strategic Planning"],
        resources: [],
        attachments: [],
        lessonData: [
          { title: "Team Building" },
          { title: "Conflict Resolution" },
          { title: "Coaching & Mentoring" },
          { title: "Strategic Planning" },
        ],
        assignees: ["Khalid Al-Shamri", "Tariq Saleh", "Mona Ibrahim", "Hassan Majed"],
        branch: "Makkah Center"
      }
    ];
  });

  useEffect(() => {
    const coursesForStorage = courses.map((c: any) => {
      const stripped = { ...c };
      if (stripped.lessonData) {
        stripped.lessonData = stripped.lessonData.map((l: any) => ({
          ...l,
          attachment: l.attachment ? { name: l.attachment.name, type: l.attachment.type } : undefined
        }));
      }
      if (stripped.attachments) {
        stripped.attachments = stripped.attachments.map((a: any) => ({ name: a.name, type: a.type }));
      }
      if (stripped.image && stripped.image.startsWith('blob:')) {
        stripped.image = "";
      }
      return stripped;
    });
    try {
      localStorage.setItem("sugarhive_courses", JSON.stringify(coursesForStorage));
    } catch (e) {
      console.warn("Could not save courses to localStorage:", e);
    }
  }, [courses]);

  useEffect(() => {
    const existing = localStorage.getItem("sugarhive_employee_course_progress");
    if (!existing || existing === "{}") {
      const seeded: Record<string, number> = {};
      courses.forEach((course: any) => {
        const totalLessons = course.lessonData?.length || course.topics?.length || 1;
        const assignees = course.assignees || [];
        if (course.progress === 100) {
          assignees.forEach((name: string) => {
            seeded[`${course.id}_${name}`] = totalLessons;
          });
        } else if (course.progress > 0) {
          const completedCount = Math.max(1, Math.round(assignees.length * (course.progress / 100)));
          assignees.forEach((name: string, idx: number) => {
            if (idx < completedCount) {
              const lessonsForEmployee = Math.min(totalLessons, Math.max(1, Math.round(totalLessons * (course.progress / 100)) + (idx % 2 === 0 ? 0 : 1)));
              seeded[`${course.id}_${name}`] = Math.min(lessonsForEmployee, totalLessons);
            }
          });
        }
      });
      if (Object.keys(seeded).length > 0) {
        localStorage.setItem("sugarhive_employee_course_progress", JSON.stringify(seeded));
        setEmpProgressState(seeded);
      }
    }
  }, []);

  const getMergedAssignees = (course: any) => {
    const team = getTeamMembers();
    const courseAssigneeNames = [...(course.assignees || [])];
    const savedAssigned = localStorage.getItem("sugarhive_assigned_courses");
    if (savedAssigned) {
      const all = JSON.parse(savedAssigned);
      for (const [email, courseIds] of Object.entries(all)) {
        if ((courseIds as number[]).includes(course.id)) {
          const member = team.find((m: any) => m.email === email);
          if (member && !courseAssigneeNames.includes(member.name)) {
            courseAssigneeNames.push(member.name);
          }
        }
      }
    }
    return courseAssigneeNames;
  };

  useEffect(() => {
    let changed = false;
    const cleaned = courses.map((c: any) => {
      const merged = getMergedAssignees(c);
      const current = c.assignees || [];
      if (merged.length !== current.length || !merged.every((n: string) => current.includes(n))) {
        changed = true;
        return { ...c, assignees: merged };
      }
      return c;
    });
    if (changed) setCourses(cleaned);
  }, [courses]);

  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const handleDeleteCourse = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCourseToDelete(courseId);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete !== null) {
      setCourses(courses.filter((c: any) => c.id !== courseToDelete));
      setCourseToDelete(null);
      toast({
        title: t("training.courseDeleted"),
        description: t("training.courseDeletedDesc"),
        variant: "destructive",
      });
    }
  };

  const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedCategory) {
      toast({ title: t("training.pleaseSelectCategory"), variant: "destructive" });
      return;
    }
    if (lessons.length === 0) {
      toast({ title: t("training.pleaseAddLesson"), variant: "destructive" });
      return;
    }
    const missingAttachment = lessons.find(l => !l.attachment);
    if (missingAttachment) {
      toast({ title: t("training.allLessonsNeedAttachment"), description: `"${missingAttachment.title}" ${t("training.missingAttachment")}`, variant: "destructive" });
      return;
    }
    const courseTitle = formData.get("title") as string;
    const courseInstructor = (formData.get("instructor") as string || "").trim();
    const courseInstructorEmail = (formData.get("instructorEmail") as string || "").trim();
    const courseDuration = (formData.get("duration") as string || "").trim();
    if (!courseInstructor) {
      toast({ title: t("training.pleaseEnterInstructor"), variant: "destructive" });
      return;
    }
    if (!courseInstructorEmail) {
      toast({ title: t("training.pleaseEnterInstructorEmail"), variant: "destructive" });
      return;
    }
    if (!courseDuration) {
      toast({ title: t("training.pleaseEnterDuration"), variant: "destructive" });
      return;
    }
    const newCourse = {
      id: Date.now(),
      title: courseTitle,
      lessons: lessons.length,
      duration: courseDuration,
      progress: 0,
      image: courseImage || "https://images.unsplash.com/photo-1434031211128-095490e7e73b?q=80&w=400&h=250&auto=format&fit=crop",
      category: selectedCategory,
      description: formData.get("description") as string,
      instructor: courseInstructor,
      instructorEmail: courseInstructorEmail,
      topics: lessons.map(l => l.title),
      resources: lessons.filter(l => l.attachment).map(l => l.attachment!.name),
      attachments: lessons.filter(l => l.attachment).map(l => l.attachment!),
      lessonData: lessons,
      assignees: courseAssignees,
    };
    setCourses([...courses, newCourse]);
    const team = getTeamMembers();
    const savedAssigned = localStorage.getItem("sugarhive_assigned_courses");
    const allAssigned = savedAssigned ? JSON.parse(savedAssigned) : {};
    for (const assigneeName of courseAssignees) {
      const member = team.find((m: any) => m.name === assigneeName);
      if (member) {
        const memberCourses = allAssigned[member.email] || [];
        if (!memberCourses.includes(newCourse.id)) {
          allAssigned[member.email] = [...memberCourses, newCourse.id];
        }
      }
    }
    localStorage.setItem("sugarhive_assigned_courses", JSON.stringify(allAssigned));
    courseAssignees.forEach(assignee => {
      addNotification({
        recipient: assignee,
        title: t("notification.newTrainingAssigned"),
        message: `${t("notification.trainingAssignedMessage")} "${courseTitle}" (${selectedCategory}). ${t("notification.itHas")} ${lessons.length} ${lessons.length !== 1 ? t("notification.lessonsCountPlural") : t("notification.lessonsCount")}.`,
        type: "training",
      });
    });
    setIsCreateDialogOpen(false);
    setSelectedCategory("");
    setNewCategoryInput("");
    setUploadedFiles([]);
    setLessons([]);
    setNewLessonTitle("");
    setCourseImage("");
    setCourseAssignees([]);
    setCourseBranch("");
    toast({
      title: t("training.coursePublished"),
      description: courseAssignees.length > 0 
        ? `${t("training.coursePublished")} - ${courseAssignees.length} ${t("training.membersSelected")}`
        : t("training.coursePublished"),
    });
  };

  const openEditCourse = (course: any) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditCategory(course.category);
    setEditLessons(course.lessonData || course.topics.map((t: string) => ({ title: t })));
    setEditNewLessonTitle("");
    setEditCourseImage(course.image || "");
    setEditAssignees(course.assignees || []);
    setEditBranch(course.branch || "");
    setEditInstructor(course.instructor || "");
    setEditDuration(course.duration || "");
    setEditInstructorEmail(course.instructorEmail || "");
    setSelectedCourse(null);
  };

  const handleSaveEditCourse = () => {
    if (!editTitle.trim()) {
      toast({ title: t("training.courseTitleRequired"), variant: "destructive" });
      return;
    }
    if (!editCategory) {
      toast({ title: t("training.pleaseSelectCategory"), variant: "destructive" });
      return;
    }
    if (editLessons.length === 0) {
      toast({ title: t("training.pleaseAddLesson"), variant: "destructive" });
      return;
    }
    const missingAttachment = editLessons.find(l => !l.attachment);
    if (missingAttachment) {
      toast({ title: t("training.allLessonsNeedAttachment"), description: `"${missingAttachment.title}" ${t("training.missingAttachment")}`, variant: "destructive" });
      return;
    }
    if (!editInstructor.trim()) {
      toast({ title: t("training.pleaseEnterInstructor"), variant: "destructive" });
      return;
    }
    if (!editInstructorEmail.trim()) {
      toast({ title: t("training.pleaseEnterInstructorEmail"), variant: "destructive" });
      return;
    }
    if (!editDuration.trim()) {
      toast({ title: t("training.pleaseEnterDuration"), variant: "destructive" });
      return;
    }
    const updated = courses.map((c: any) => c.id === editingCourse.id ? {
      ...c,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
      image: editCourseImage || c.image,
      lessons: editLessons.length,
      duration: editDuration.trim(),
      instructor: editInstructor.trim(),
      instructorEmail: editInstructorEmail.trim(),
      topics: editLessons.map((l: any) => l.title),
      resources: editLessons.filter((l: any) => l.attachment).map((l: any) => l.attachment.name),
      attachments: editLessons.filter((l: any) => l.attachment).map((l: any) => l.attachment),
      lessonData: editLessons,
      assignees: editAssignees,
    } : c);
    setCourses(updated);
    const team = getTeamMembers();
    const savedAssigned = localStorage.getItem("sugarhive_assigned_courses");
    const allAssigned = savedAssigned ? JSON.parse(savedAssigned) : {};
    for (const member of team) {
      const memberCourses = allAssigned[member.email] || [];
      const isAssigned = editAssignees.includes(member.name);
      const hasId = memberCourses.includes(editingCourse.id);
      if (isAssigned && !hasId) {
        allAssigned[member.email] = [...memberCourses, editingCourse.id];
      } else if (!isAssigned && hasId) {
        allAssigned[member.email] = memberCourses.filter((id: number) => id !== editingCourse.id);
      }
    }
    localStorage.setItem("sugarhive_assigned_courses", JSON.stringify(allAssigned));
    setEditingCourse(null);
    toast({ title: t("training.courseUpdated"), description: t("training.courseUpdatedDesc") });
  };

  const handleContinueLearning = (courseId: number) => {
    const key = `${courseId}_${user?.name}`;
    const completedLessons = empProgressState[key] || 0;
    setActiveCourseId(courseId);
    setCurrentLessonIndex(completedLessons);
    setSelectedCourse(null);
  };

  const currentActiveCourse = courses.find((c: any) => c.id === activeCourseId);

  if (activeCourseId && currentActiveCourse) {
    const courseLessons: {title: string; attachment?: {name: string; type: string; dataUrl: string}}[] = currentActiveCourse.lessonData || currentActiveCourse.topics.map((t: string) => ({ title: t }));
    const totalLessons = courseLessons.length;
    const safeIndex = Math.min(currentLessonIndex, totalLessons - 1);
    const currentLesson = courseLessons[safeIndex];
    const hasAttachment = currentLesson?.attachment?.dataUrl ? currentLesson.attachment : undefined;
    const isPdf = hasAttachment?.type === 'pdf';
    const isVideo = hasAttachment?.type === 'video';
    const isPptx = hasAttachment?.type === 'pptx';

    return (
      <div className="flex h-screen bg-white font-sans text-[#1E293B]">
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-[#F1F5F9] flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 text-[#64748B] hover:text-[#0F172A]"
                onClick={() => setActiveCourseId(null)}
                data-testid="button-back-courses"
              >
                <Plus size={20} className="rotate-45" />
              </Button>
              <div className="h-4 w-px bg-[#F1F5F9]" />
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest leading-none mb-1">{t("training.trainingHub")}</p>
                <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">{currentActiveCourse.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{t("training.lessonXofY")} {safeIndex + 1} {t("training.of")} {totalLessons}</span>
                <Progress value={((safeIndex + 1) / totalLessons) * 100} className="w-32 h-1.5 bg-[#F1F5F9] rounded-full [&>div]:bg-[#F59E0B]" />
              </div>
              <Button 
                onClick={handleNextLesson}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-10 px-6 rounded-xl text-xs"
              >
                {safeIndex === totalLessons - 1 ? t("training.finishCourse") : t("training.nextLesson")}
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex">
            <div className="w-80 border-r border-[#F1F5F9] flex flex-col bg-[#F8FAFC]">
              <div className="p-6 shrink-0 border-b border-[#F1F5F9]">
                <h3 className="font-bold text-[#0F172A] mb-1">{t("training.courseContent")}</h3>
                <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">{totalLessons} {t("training.lessons")} • {currentActiveCourse.duration}</p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {courseLessons.map((lesson, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentLessonIndex(i)}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${i === safeIndex ? 'bg-white border-l-4 border-l-[#F59E0B]' : 'hover:bg-white'}`}
                    data-testid={`lesson-sidebar-${i}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i < safeIndex ? 'bg-[#10B981] text-white' : i === safeIndex ? 'bg-[#F59E0B] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>
                      {i < safeIndex ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${i === safeIndex ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{lesson.title}</span>
                      {lesson.attachment && (
                        <span className="text-[10px] text-[#94A3B8] font-medium">{lesson.attachment.type === 'pdf' ? t("training.pdfDocument") : lesson.attachment.type === 'pptx' ? t("training.powerpoint") : t("training.video")}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">{t("training.lesson")} {safeIndex + 1}</Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-[#0F172A] tracking-tight">{currentLesson?.title}</h3>
                </div>

                {isPdf && hasAttachment && (
                  <div className="w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg">
                    <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2">
                      <FileText size={14} className="text-[#F59E0B]" />
                      <span className="text-xs font-bold text-[#0F172A]">{hasAttachment.name}</span>
                    </div>
                    <iframe
                      src={hasAttachment.dataUrl}
                      className="w-full bg-white"
                      style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
                      title={hasAttachment.name}
                      data-testid="pdf-viewer"
                    />
                  </div>
                )}

                {isVideo && hasAttachment && (
                  <div className="w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg">
                    <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2">
                      <Video size={14} className="text-[#F59E0B]" />
                      <span className="text-xs font-bold text-[#0F172A]">{hasAttachment.name}</span>
                    </div>
                    <video
                      src={hasAttachment.dataUrl}
                      controls
                      className="w-full bg-black"
                      style={{ maxHeight: 'calc(100vh - 280px)' }}
                      data-testid="video-player"
                    />
                  </div>
                )}

                {isPptx && hasAttachment && (
                  <div className="w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg">
                    <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2">
                      <Presentation size={14} className="text-[#F59E0B]" />
                      <span className="text-xs font-bold text-[#0F172A]">{hasAttachment.name}</span>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center bg-[#F8FAFC] py-16" style={{ minHeight: '400px' }}>
                      <Presentation size={48} className="text-[#F59E0B] mb-4" />
                      <p className="text-sm font-bold text-[#0F172A] mb-2">{hasAttachment.name}</p>
                      <p className="text-xs text-[#64748B] mb-4">{t("training.pptxDownloadDesc")}</p>
                      <a
                        href={hasAttachment.dataUrl}
                        download={hasAttachment.name}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl text-xs transition-colors"
                        data-testid="pptx-download"
                      >
                        <FileText size={14} />
                        {t("training.downloadPowerPoint")}
                      </a>
                    </div>
                  </div>
                )}

                {!hasAttachment && (
                  <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl relative group cursor-pointer">
                    <img src={currentActiveCourse.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-[#F59E0B]/80 rounded-full flex items-center justify-center shadow-2xl">
                        <BookOpen className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-bold text-sm">{t("training.lesson")} {safeIndex + 1}: {currentLesson?.title}</p>
                      <p className="text-white/60 text-xs">{t("training.textLesson")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayedCourses = isAdmin
    ? courses
    : (user?.role === "manager" || user?.role === "supervisor")
    ? courses.filter((c: any) => {
        const assignees = getMergedAssignees(c);
        return assignees.includes(user?.name || "");
      })
    : courses.filter((c: any) => {
        const assignees = getMergedAssignees(c);
        return assignees.includes(user?.name || "");
      });

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("training.trainingAndDevelopment")} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("training.trainingHub")}</h2>
              <p className="text-[#64748B] mt-1">{t("training.developSkills")}</p>
            </div>
            
            {isAdmin && <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-lg shadow-orange-100 px-6 font-bold h-11 rounded-xl">
                  <BookOpen size={18} className="ltr:mr-2 rtl:ml-2" /> {t("training.createCourse")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
                <DialogHeader className="shrink-0">
                  <DialogTitle>{t("training.newTrainingCourse")}</DialogTitle>
                  <DialogDescription>{t("training.createModuleDesc")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="flex flex-col overflow-hidden flex-1">
                  <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.courseThumbnail")}</Label>
                      <div
                        className="relative w-full h-36 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#F59E0B]/50 transition-colors cursor-pointer overflow-hidden group bg-[#F8FAFC]"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const blobUrl = URL.createObjectURL(file);
                              setCourseImage(blobUrl);
                            }
                          };
                          input.click();
                        }}
                        data-testid="button-upload-course-image"
                      >
                        {courseImage ? (
                          <>
                            <img src={courseImage} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{t("training.changeImage")}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <ImagePlus size={24} className="text-[#94A3B8]" />
                            <span className="text-xs font-medium text-[#94A3B8]">{t("training.clickUploadImage")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.courseTitle")} <span className="text-red-500">*</span></Label>
                      <Input name="title" placeholder={t("placeholder.courseTitle")} className="rounded-xl border-[#E2E8F0]" required data-testid="input-course-title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("training.instructor")} <span className="text-red-500">*</span></Label>
                        <Input name="instructor" placeholder={t("placeholder.instructor")} className="rounded-xl border-[#E2E8F0]" required data-testid="input-course-instructor" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("training.instructorEmail")} <span className="text-red-500">*</span></Label>
                        <Input name="instructorEmail" type="email" placeholder={t("placeholder.instructorEmail")} className="rounded-xl border-[#E2E8F0]" required data-testid="input-course-instructor-email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.duration")} <span className="text-red-500">*</span></Label>
                      <Input name="duration" placeholder={t("placeholder.duration")} className="rounded-xl border-[#E2E8F0]" required data-testid="input-course-duration" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.category")} <span className="text-red-500">*</span></Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map(cat => (
                          <div
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${selectedCategory === cat ? 'bg-[#F59E0B] text-white border-[#F59E0B]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B]/40'}`}
                            data-testid={`category-option-${cat}`}
                          >
                            <span>{cat}</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeCategory(cat); }}
                              className="ml-0.5 hover:text-red-500 transition-colors"
                              data-testid={`button-remove-category-${cat}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                          placeholder={t("training.addNewCategory")}
                          className="rounded-xl border-[#E2E8F0] text-sm flex-1"
                          data-testid="input-new-category"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCategory}
                          className="rounded-xl border-[#E2E8F0] text-[#F59E0B] hover:bg-[#FEF3C7] font-bold"
                          data-testid="button-add-category"
                        >
                          <Plus size={14} className="ltr:mr-1 rtl:ml-1" />
                          {t("training.add")}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.description")} <span className="text-red-500">*</span></Label>
                      <Textarea name="description" placeholder={t("placeholder.courseDescription")} className="rounded-xl border-[#E2E8F0] min-h-[100px] resize-none" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.assignTo")}</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between rounded-xl border-[#E2E8F0] font-normal" data-testid="select-course-assignees">
                            <span className="truncate text-left">
                              {courseAssignees.length === 0 ? t("training.selectTeamMembers") : `${courseAssignees.length} ${t("training.membersSelected")}`}
                            </span>
                            <ChevronRight size={16} className="rotate-90 opacity-50 shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[250px] overflow-y-auto bg-white border-[#E2E8F0]">
                          {(() => {
                            const allOperations = getTeamMembers().filter((m: any) => m.status === "Active" && m.role === "Operations");
                            const allSelected = allOperations.length > 0 && allOperations.every((m: any) => courseAssignees.includes(m.name));
                            return (
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer border-b border-[#F1F5F9] mb-1"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  if (allSelected) {
                                    setCourseAssignees([]);
                                  } else {
                                    setCourseAssignees(allOperations.map((m: any) => m.name));
                                  }
                                }}
                              >
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${allSelected ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#E2E8F0]"}`}>
                                  {allSelected && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-bold">{t("training.selectAll")}</span>
                              </DropdownMenuItem>
                            );
                          })()}
                          {getTeamMembers().filter((m: any) => m.status === "Active" && m.role === "Operations").map((member: any) => (
                            <DropdownMenuItem
                              key={member.email}
                              className="flex items-center gap-2 cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault();
                                setCourseAssignees(prev =>
                                  prev.includes(member.name)
                                    ? prev.filter(n => n !== member.name)
                                    : [...prev, member.name]
                                );
                              }}
                            >
                              <div className={`w-4 h-4 border rounded flex items-center justify-center ${courseAssignees.includes(member.name) ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#E2E8F0]"}`}>
                                {courseAssignees.includes(member.name) && <Check size={12} className="text-white" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{translateName(member.name, language)}</span>
                                <span className="text-[10px] text-[#94A3B8]">{translateBranch(member.branch, language)} &middot; {translateRole(member.role, language)}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {courseAssignees.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {courseAssignees.map(name => (
                            <Badge key={name} className="bg-[#F59E0B]/10 text-[#F59E0B] border-none text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                              {name}
                              <button type="button" onClick={() => setCourseAssignees(prev => prev.filter(n => n !== name))} className="hover:text-red-500">
                                <X size={10} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("training.lessons")} <span className="text-red-500">*</span></Label>
                      <div className="flex gap-2">
                        <Input
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newLessonTitle.trim()) {
                                setLessons(prev => [...prev, { title: newLessonTitle.trim() }]);
                                setNewLessonTitle("");
                              }
                            }
                          }}
                          placeholder={t("training.enterLessonTitle")}
                          className="rounded-xl border-[#E2E8F0] text-sm flex-1"
                          data-testid="input-lesson-title"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newLessonTitle.trim()) {
                              setLessons(prev => [...prev, { title: newLessonTitle.trim() }]);
                              setNewLessonTitle("");
                            }
                          }}
                          className="rounded-xl border-[#E2E8F0] text-[#F59E0B] hover:bg-[#FEF3C7] font-bold"
                          data-testid="button-add-lesson"
                        >
                          <Plus size={14} className="ltr:mr-1 rtl:ml-1" />
                          {t("training.add")}
                        </Button>
                      </div>
                      {lessons.length > 0 && (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {lessons.map((lesson, idx) => (
                            <div key={idx} className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-2.5">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</div>
                                  <span className="text-sm font-medium text-[#0F172A] truncate">{lesson.title}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setLessons(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-1 text-[#94A3B8] hover:text-red-500 transition-colors shrink-0"
                                  data-testid={`button-remove-lesson-${idx}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="px-3 pb-2.5 flex items-center gap-2">
                                {!lesson.attachment ? (
                                  <>
                                    <span className="text-[10px] text-red-400 font-semibold ltr:mr-1 rtl:ml-1">{t("training.required")}</span>
                                    <button
                                      type="button"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                      data-testid={`button-attach-video-${idx}`}
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'video/*';
                                        input.onchange = (e: any) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const blobUrl = URL.createObjectURL(file);
                                            setLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'video', dataUrl: blobUrl } } : l));
                                            toast({ title: t("training.videoAttached"), description: `${file.name} added to "${lesson.title}"` });
                                          }
                                        };
                                        input.click();
                                      }}
                                    >
                                      <Video size={12} />
                                      {t("training.uploadVideo")}
                                    </button>
                                    <button
                                      type="button"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                      data-testid={`button-attach-pdf-${idx}`}
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.pdf';
                                        input.onchange = (e: any) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const blobUrl = URL.createObjectURL(file);
                                            setLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'pdf', dataUrl: blobUrl } } : l));
                                            toast({ title: t("training.pdfAttached"), description: `${file.name} added to "${lesson.title}"` });
                                          }
                                        };
                                        input.click();
                                      }}
                                    >
                                      <FileText size={12} />
                                      {t("training.uploadPdf")}
                                    </button>
                                    <button
                                      type="button"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                      data-testid={`button-attach-pptx-${idx}`}
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.ppt,.pptx,.odp';
                                        input.onchange = (e: any) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const blobUrl = URL.createObjectURL(file);
                                            setLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'pptx', dataUrl: blobUrl } } : l));
                                            toast({ title: t("training.pptxAttached"), description: `${file.name} added to "${lesson.title}"` });
                                          }
                                        };
                                        input.click();
                                      }}
                                    >
                                      <Presentation size={12} />
                                      {t("training.uploadPowerPoint")}
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-none text-[10px] font-bold">
                                      {lesson.attachment.type === 'video' ? <Video size={10} className="mr-1" /> : lesson.attachment.type === 'pptx' ? <Presentation size={10} className="mr-1" /> : <FileText size={10} className="mr-1" />}
                                      {lesson.attachment.name}
                                    </Badge>
                                    <button
                                      type="button"
                                      title="Remove attachment"
                                      className="p-1 text-[#94A3B8] hover:text-red-500 transition-colors"
                                      onClick={() => setLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: undefined } : l))}
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {lessons.length === 0 && (
                        <p className="text-xs text-[#94A3B8] text-center py-3">{t("training.noLessonsYet")}</p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="pt-4 flex items-center justify-center shrink-0 border-t border-[#F1F5F9]">
                    <Button
                      type="submit"
                      className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl"
                    >
                      {t("training.publishCourse")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <MetricCard label={t("training.totalCourses")} value={String(displayedCourses.length)} icon={<BookOpen className="text-blue-500" />} />
             <MetricCard label={t("training.activeLearners")} value={String(displayedCourses.filter((c: any) => c.progress > 0 && c.progress < 100).length)} icon={<TrendingUp className="text-emerald-500" />} />
             <MetricCard label={t("training.certifications")} value={String(displayedCourses.filter((c: any) => c.progress === 100).length)} icon={<Award className="text-orange-500" />} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-[#0F172A]">{isAdmin ? t("training.allCourses") : t("training.myAssignedCourses")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedCourses.map((course: any) => {
                  let cardProgress = course.progress;
                  if (!isAdmin) {
                    const totalLessons = course.lessonData?.length || course.topics?.length || 1;
                    const key = `${course.id}_${user?.name}`;
                    const done = empProgressState[key] || 0;
                    cardProgress = Math.min(Math.round((done / totalLessons) * 100), 100);
                  }
                  return (
                  <CourseCard 
                    key={course.id}
                    title={course.title} 
                    lessons={course.lessons} 
                    duration={course.duration} 
                    progress={cardProgress}
                    image={course.image}
                    category={course.category}
                    onClick={() => setSelectedCourse(course)}
                    onDelete={isAdmin ? (e) => handleDeleteCourse(course.id, e) : undefined}
                  />
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-[#0F172A]">{user?.role === "employee" ? t("training.myProgress") : t("training.employeeProgress")}</CardTitle>
                  <CardDescription>{user?.role === "employee" ? t("training.yourTrainingProgress") : t("training.trainingProgressByEmployee")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {(() => {
                    const employeeMap: Record<string, { total: number; completed: number; inProgress: number; totalLessons: number; completedLessons: number }> = {};
                    const team = getTeamMembers();
                    const branchMembers = (isAdmin || user?.role === "manager" || user?.role === "supervisor")
                      ? (isAdmin ? null : team.filter((m: any) => m.branch === user?.branch).map((m: any) => m.name))
                      : null;

                    displayedCourses.forEach((course: any) => {
                      const assignees = getMergedAssignees(course);
                      const totalLessons = course.lessonData?.length || course.topics?.length || 1;
                      assignees.forEach((name: string) => {
                        if (user?.role === "employee" && name !== user?.name) return;
                        if (branchMembers && !branchMembers.includes(name)) return;
                        if (!employeeMap[name]) {
                          employeeMap[name] = { total: 0, completed: 0, inProgress: 0, totalLessons: 0, completedLessons: 0 };
                        }
                        employeeMap[name].total += 1;
                        employeeMap[name].totalLessons += totalLessons;
                        const key = `${course.id}_${name}`;
                        const doneLessons = empProgressState[key] || 0;
                        employeeMap[name].completedLessons += doneLessons;
                        if (doneLessons >= totalLessons) {
                          employeeMap[name].completed += 1;
                        } else if (doneLessons > 0) {
                          employeeMap[name].inProgress += 1;
                        }
                      });
                    });

                    const employees = Object.entries(employeeMap)
                      .map(([name, data]) => ({
                        name,
                        ...data,
                        progressPercent: data.totalLessons > 0 ? Math.round((data.completedLessons / data.totalLessons) * 100) : 0
                      }))
                      .sort((a, b) => b.progressPercent - a.progressPercent);

                    if (employees.length === 0) {
                      return <p className="text-sm text-[#64748B] py-4 text-center">{t("training.noEmployeesAssigned")}</p>;
                    }

                    return employees.map((emp) => (
                      <div key={emp.name} className="p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#F1F5F9]" data-testid={`employee-progress-${emp.name}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8 border border-[#F1F5F9]">
                            <AvatarFallback className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold">
                              {translateName(emp.name, language).split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#0F172A] truncate">{translateName(emp.name, language)}</p>
                            <p className="text-[10px] text-[#94A3B8]">
                              {emp.completed}/{emp.total} {t("common.completed")}
                              {emp.inProgress > 0 && ` · ${emp.inProgress} ${t("common.inProgress")}`}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#0F172A]">{emp.progressPercent}%</span>
                        </div>
                        <Progress 
                          value={emp.progressPercent} 
                          className={`h-1.5 bg-[#F1F5F9] rounded-full [&>div]:transition-all [&>div]:duration-500 ${
                            emp.progressPercent === 100 ? '[&>div]:bg-[#10B981]' : emp.progressPercent > 0 ? '[&>div]:bg-[#F59E0B]' : '[&>div]:bg-[#E2E8F0]'
                          }`} 
                        />
                      </div>
                    ));
                  })()}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>


        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] p-0 border-none rounded-3xl overflow-hidden flex flex-col">
            {selectedCourse && (
              <>
                <div className="h-64 relative shrink-0">
                  <img src={selectedCourse.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8">
                    <Badge className="bg-[#F59E0B] text-white border-none mb-3 font-bold uppercase tracking-widest text-[10px]">
                      {selectedCourse.category}
                    </Badge>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{selectedCourse.title}</h2>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                        <Clock size={18} className="text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{t("training.duration")}</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedCourse.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                        <FileText size={18} className="text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{t("training.lessons")}</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedCourse.lessons} {t("training.modules")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                        <Users size={18} className="text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{t("training.instructor")}</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedCourse.instructor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-[#0F172A] tracking-tight">{t("training.aboutCourse")}</h4>
                    <p className="text-[#64748B] leading-relaxed text-sm">{selectedCourse.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="space-y-4">
                      <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">{t("training.whatYoullLearn")}</h4>
                      <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {selectedCourse.topics.map((topic: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#475569]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {selectedCourse.attachments && selectedCourse.attachments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">{t("training.courseMaterials")}</h4>
                      <div className="space-y-2">
                        {selectedCourse.attachments.map((att: any, i: number) => (
                          <a
                            key={i}
                            href={att.dataUrl}
                            download={att.name}
                            className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0] hover:border-[#F59E0B]/40 transition-colors cursor-pointer"
                            data-testid={`attachment-${i}`}
                          >
                            {att.type === 'video' ? <Video size={16} className="text-[#F59E0B] shrink-0" /> : <FileText size={16} className="text-[#F59E0B] shrink-0" />}
                            <span className="text-sm font-medium text-[#0F172A] truncate flex-1">{att.name}</span>
                            <Badge variant="secondary" className="text-[10px] shrink-0">{att.type.toUpperCase()}</Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {(() => {
                    if (user?.role === "employee") return true;
                    const team = getTeamMembers();
                    const branchMembers = (!isAdmin && (user?.role === "manager" || user?.role === "supervisor"))
                      ? team.filter((m: any) => m.branch === user?.branch).map((m: any) => m.name)
                      : null;
                    const mergedAssignees = getMergedAssignees(selectedCourse);
                    const progressKeys = Object.keys(empProgressState).filter(k => k.startsWith(`${selectedCourse.id}_`));
                    progressKeys.forEach(k => {
                      const empName = k.replace(`${selectedCourse.id}_`, '');
                      if (empName && !mergedAssignees.includes(empName)) {
                        mergedAssignees.push(empName);
                      }
                    });
                    const filteredAssignees = branchMembers ? mergedAssignees.filter((n: string) => branchMembers.includes(n)) : mergedAssignees;
                    return filteredAssignees.length > 0;
                  })() && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">{isAdmin ? t("training.assignedEmployeesProgress") : t("training.myProgress")}</h4>
                      <div className="space-y-2">
                        {(() => {
                          const totalLessons = selectedCourse.lessonData?.length || selectedCourse.topics?.length || 1;

                          if (user?.role === "employee" || user?.role === "manager" || user?.role === "supervisor") {
                            const myName = user?.name || "";
                            const key = `${selectedCourse.id}_${myName}`;
                            const lessonsCompleted = empProgressState[key] || 0;
                            const pct = Math.min(Math.round((lessonsCompleted / totalLessons) * 100), 100);
                            const statusLabel = pct === 100 ? t("training.completed") : pct > 0 ? t("training.inProgress") : t("training.notStarted");
                            const statusColor = pct === 100 ? "text-emerald-600 bg-emerald-50" : pct > 0 ? "text-[#F59E0B] bg-amber-50" : "text-[#94A3B8] bg-slate-50";
                            return [(
                              <div key={0} className="bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0] space-y-2" data-testid="employee-course-progress-0">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold">
                                      {translateName(myName, language).split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-[#0F172A]">{translateName(myName, language)}</span>
                                  </div>
                                  <Badge className={`${statusColor} border-none text-[10px] font-bold uppercase`}>
                                    {statusLabel}
                                  </Badge>
                                </div>
                                <Progress value={pct} className={`h-1.5 bg-[#F1F5F9] rounded-full [&>div]:transition-all ${pct === 100 ? '[&>div]:bg-[#10B981]' : pct > 0 ? '[&>div]:bg-[#F59E0B]' : '[&>div]:bg-[#E2E8F0]'}`} />
                                <p className="text-[10px] text-[#94A3B8] text-right font-medium">{lessonsCompleted}/{totalLessons} {t("training.lessons")}</p>
                              </div>
                            )];
                          }

                          const team = getTeamMembers();
                          const branchMembers = (!isAdmin && (user?.role === "manager" || user?.role === "supervisor"))
                            ? team.filter((m: any) => m.branch === user?.branch).map((m: any) => m.name)
                            : null;
                          const mergedAssignees = getMergedAssignees(selectedCourse);
                          const progressKeys = Object.keys(empProgressState).filter(k => k.startsWith(`${selectedCourse.id}_`));
                          progressKeys.forEach(k => {
                            const empName = k.replace(`${selectedCourse.id}_`, '');
                            if (empName && !mergedAssignees.includes(empName)) {
                              mergedAssignees.push(empName);
                            }
                          });
                          const filteredAssignees = branchMembers ? mergedAssignees.filter((n: string) => branchMembers.includes(n)) : mergedAssignees;

                          return filteredAssignees.map((name: string, i: number) => {
                            const key = `${selectedCourse.id}_${name}`;
                            const lessonsCompleted = empProgressState[key] || 0;
                            const pct = Math.min(Math.round((lessonsCompleted / totalLessons) * 100), 100);
                            const statusLabel = pct === 100 ? t("training.completed") : pct > 0 ? t("training.inProgress") : t("training.notStarted");
                            const statusColor = pct === 100 ? "text-emerald-600 bg-emerald-50" : pct > 0 ? "text-[#F59E0B] bg-amber-50" : "text-[#94A3B8] bg-slate-50";

                            return (
                              <div key={i} className="bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0] space-y-2" data-testid={`employee-course-progress-${i}`}>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold">
                                      {translateName(name, language).split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-[#0F172A]">{translateName(name, language)}</span>
                                  </div>
                                  <Badge className={`${statusColor} border-none text-[10px] font-bold uppercase`}>
                                    {statusLabel}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 ltr:pl-11 rtl:pr-11">
                                  <Progress 
                                    value={pct} 
                                    className={`h-1.5 flex-1 bg-[#E2E8F0] rounded-full [&>div]:transition-all [&>div]:duration-500 ${
                                      pct === 100 ? '[&>div]:bg-[#10B981]' : pct > 0 ? '[&>div]:bg-[#F59E0B]' : '[&>div]:bg-[#E2E8F0]'
                                    }`} 
                                  />
                                  <span className="text-xs font-bold text-[#64748B] min-w-[60px] text-right">{lessonsCompleted}/{totalLessons} {t("training.lessons")}</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#F1F5F9] flex gap-4 shrink-0">
                    {(user?.role === 'employee' || user?.role === 'manager' || user?.role === 'supervisor') && <Button 
                      onClick={() => handleContinueLearning(selectedCourse.id)}
                      className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-100"
                    >
                      {(() => {
                        const myKey = `${selectedCourse.id}_${user?.name || ""}`;
                        const myLessons = empProgressState[myKey] || 0;
                        return myLessons > 0 ? t("training.continueCourse") : t("training.startCourse");
                      })()}
                    </Button>}
                    {isAdmin && <Button 
                      onClick={() => openEditCourse(selectedCourse)}
                      className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-100"
                      data-testid="button-edit-course"
                    >
                      {t("training.editCourse")}
                    </Button>}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingCourse} onOpenChange={(open) => { if (!open) setEditingCourse(null); }}>
          <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>{t("training.editCourse")}</DialogTitle>
              <DialogDescription>{t("training.updateCourseDesc")}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.courseThumbnail")}</Label>
                  <div
                    className="relative w-full h-36 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#F59E0B]/50 transition-colors cursor-pointer overflow-hidden group bg-[#F8FAFC]"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const blobUrl = URL.createObjectURL(file);
                          setEditCourseImage(blobUrl);
                        }
                      };
                      input.click();
                    }}
                    data-testid="edit-button-upload-course-image"
                  >
                    {editCourseImage ? (
                      <>
                        <img src={editCourseImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{t("training.changeImage")}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <ImagePlus size={24} className="text-[#94A3B8]" />
                        <span className="text-xs font-medium text-[#94A3B8]">{t("training.clickUploadImage")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.courseTitle")} <span className="text-red-500">*</span></Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-xl border-[#E2E8F0]" data-testid="edit-input-title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">{t("training.instructor")} <span className="text-red-500">*</span></Label>
                    <Input value={editInstructor} onChange={(e) => setEditInstructor(e.target.value)} placeholder={t("placeholder.instructor")} className="rounded-xl border-[#E2E8F0]" data-testid="edit-input-instructor" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">{t("training.instructorEmail")} <span className="text-red-500">*</span></Label>
                    <Input value={editInstructorEmail} onChange={(e) => setEditInstructorEmail(e.target.value)} type="email" placeholder={t("placeholder.instructorEmail")} className="rounded-xl border-[#E2E8F0]" data-testid="edit-input-instructor-email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.duration")} <span className="text-red-500">*</span></Label>
                  <Input value={editDuration} onChange={(e) => setEditDuration(e.target.value)} placeholder={t("placeholder.duration")} className="rounded-xl border-[#E2E8F0]" data-testid="edit-input-duration" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.category")} <span className="text-red-500">*</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <div
                        key={cat}
                        onClick={() => setEditCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${editCategory === cat ? 'bg-[#F59E0B] text-white border-[#F59E0B]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B]/40'}`}
                        data-testid={`edit-category-option-${cat}`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.description")} <span className="text-red-500">*</span></Label>
                  <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="rounded-xl border-[#E2E8F0] min-h-[80px] resize-none" data-testid="edit-input-description" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.assignToEmployees")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const allOps = getTeamMembers().filter((m: any) => m.role === 'Operations');
                      const allSelected = allOps.length > 0 && allOps.every((m: any) => editAssignees.includes(m.name));
                      return allOps.length > 0 ? (
                        <div
                          onClick={() => {
                            if (allSelected) {
                              setEditAssignees([]);
                            } else {
                              setEditAssignees(allOps.map((m: any) => m.name));
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${allSelected ? 'bg-[#F59E0B] text-white border-[#F59E0B]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B]/40'}`}
                          data-testid="edit-assignee-select-all"
                        >
                          {t("training.selectAll")}
                        </div>
                      ) : null;
                    })()}
                    {getTeamMembers().filter((m: any) => m.role === 'Operations').map((member: any) => {
                      const isSelected = editAssignees.includes(member.name);
                      return (
                        <div
                          key={member.name}
                          onClick={() => {
                            setEditAssignees(prev =>
                              isSelected ? prev.filter(n => n !== member.name) : [...prev, member.name]
                            );
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${isSelected ? 'bg-[#F59E0B] text-white border-[#F59E0B]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B]/40'}`}
                          data-testid={`edit-assignee-${member.name}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-white/30 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                            {translateName(member.name, language).charAt(0)}
                          </div>
                          {translateName(member.name, language)}
                        </div>
                      );
                    })}
                    {getTeamMembers().filter((m: any) => m.role === 'Operations').length === 0 && (
                      <p className="text-xs text-[#94A3B8]">{t("training.noEmployeesFound")}</p>
                    )}
                  </div>
                </div>
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider">{t("training.lessons")} <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Input
                      value={editNewLessonTitle}
                      onChange={(e) => setEditNewLessonTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (editNewLessonTitle.trim()) {
                            setEditLessons(prev => [...prev, { title: editNewLessonTitle.trim() }]);
                            setEditNewLessonTitle("");
                          }
                        }
                      }}
                      placeholder={t("training.enterLessonTitle")}
                      className="rounded-xl border-[#E2E8F0] text-sm flex-1"
                      data-testid="edit-input-lesson-title"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (editNewLessonTitle.trim()) {
                          setEditLessons(prev => [...prev, { title: editNewLessonTitle.trim() }]);
                          setEditNewLessonTitle("");
                        }
                      }}
                      className="rounded-xl border-[#E2E8F0] text-[#F59E0B] hover:bg-[#FEF3C7] font-bold"
                      data-testid="edit-button-add-lesson"
                    >
                      <Plus size={14} className="ltr:mr-1 rtl:ml-1" />
                      {t("training.add")}
                    </Button>
                  </div>
                  {editLessons.length > 0 && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {editLessons.map((lesson, idx) => (
                        <div key={idx} className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</div>
                              <span className="text-sm font-medium text-[#0F172A] truncate">{lesson.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditLessons(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1 text-[#94A3B8] hover:text-red-500 transition-colors shrink-0"
                              data-testid={`edit-button-remove-lesson-${idx}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="px-3 pb-2.5 flex items-center gap-2">
                            {!lesson.attachment ? (
                              <>
                                <span className="text-[10px] text-red-400 font-semibold ltr:mr-1 rtl:ml-1">{t("training.required")}</span>
                                <button
                                  type="button"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                  data-testid={`edit-button-attach-video-${idx}`}
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'video/*';
                                    input.onchange = (e: any) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const blobUrl = URL.createObjectURL(file);
                                        setEditLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'video', dataUrl: blobUrl } } : l));
                                        toast({ title: t("training.videoAttached"), description: `${file.name} added to "${lesson.title}"` });
                                      }
                                    };
                                    input.click();
                                  }}
                                >
                                  <Video size={12} />
                                  {t("training.uploadVideo")}
                                </button>
                                <button
                                  type="button"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                  data-testid={`edit-button-attach-pdf-${idx}`}
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.pdf';
                                    input.onchange = (e: any) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const blobUrl = URL.createObjectURL(file);
                                        setEditLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'pdf', dataUrl: blobUrl } } : l));
                                        toast({ title: t("training.pdfAttached"), description: `${file.name} added to "${lesson.title}"` });
                                      }
                                    };
                                    input.click();
                                  }}
                                >
                                  <FileText size={12} />
                                  {t("training.uploadPdf")}
                                </button>
                                <button
                                  type="button"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-red-200 text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                                  data-testid={`edit-button-attach-pptx-${idx}`}
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.ppt,.pptx,.odp';
                                    input.onchange = (e: any) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const blobUrl = URL.createObjectURL(file);
                                        setEditLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: { name: file.name, type: 'pptx', dataUrl: blobUrl } } : l));
                                        toast({ title: t("training.pptxAttached"), description: `${file.name} added to "${lesson.title}"` });
                                      }
                                    };
                                    input.click();
                                  }}
                                >
                                  <Presentation size={12} />
                                  {t("training.uploadPowerPoint")}
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-none text-[10px] font-bold">
                                  {lesson.attachment.type === 'video' ? <Video size={10} className="mr-1" /> : lesson.attachment.type === 'pptx' ? <Presentation size={10} className="mr-1" /> : <FileText size={10} className="mr-1" />}
                                  {lesson.attachment.name}
                                </Badge>
                                <button
                                  type="button"
                                  title="Remove attachment"
                                  className="p-1 text-[#94A3B8] hover:text-red-500 transition-colors"
                                  onClick={() => setEditLessons(prev => prev.map((l, i) => i === idx ? { ...l, attachment: undefined } : l))}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {editLessons.length === 0 && (
                    <p className="text-xs text-[#94A3B8] text-center py-3">{t("training.noLessonsEditYet")}</p>
                  )}
                </div>
              </div>
              <DialogFooter className="pt-4 flex items-center justify-center shrink-0 border-t border-[#F1F5F9]">
                <Button
                  type="button"
                  onClick={handleSaveEditCourse}
                  className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl"
                  data-testid="button-save-edit-course"
                >
                  {t("training.saveChanges")}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={courseToDelete !== null} onOpenChange={(open) => { if (!open) setCourseToDelete(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t("training.deleteCourse")}</DialogTitle>
              <DialogDescription>{t("training.deleteCourseConfirm")}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setCourseToDelete(null)} className="flex-1 rounded-xl font-bold h-11" data-testid="button-cancel-delete">
                {t("common.cancel")}
              </Button>
              <Button onClick={confirmDeleteCourse} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold h-11" data-testid="button-confirm-delete">
                {t("common.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <Card className="shadow-sm border-[#E2E8F0] bg-white group hover:border-[#F59E0B]/30 transition-all cursor-default rounded-2xl">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] group-hover:bg-[#F59E0B]/5 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{label}</p>
          <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

interface CourseCardProps {
  title: string;
  lessons: number;
  duration: string;
  progress: number;
  image: string;
  category: string;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

function CourseCard({ title, lessons, duration, progress, image, category, onClick, onDelete }: CourseCardProps) {
  const { t } = useLanguage();
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden group hover:shadow-xl transition-all border-[#E2E8F0] cursor-pointer bg-white rounded-2xl relative"
    >
      {onDelete && <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-8 w-8 rounded-lg shadow-lg"
          onClick={onDelete}
        >
          <Plus size={16} className="rotate-45" />
        </Button>
      </div>}
      <div className="h-44 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-[#0F172A] border-none backdrop-blur-md font-bold text-[10px] uppercase tracking-wider shadow-sm px-2.5 py-1">
            {category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
           <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
             <PlayCircle className="text-white fill-white" size={32} />
           </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="font-bold text-[#0F172A] text-lg leading-tight mb-2 group-hover:text-[#F59E0B] transition-colors tracking-tight">{title}</h4>
          <div className="flex items-center gap-4 text-[11px] text-[#64748B] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-[#94A3B8]" />
              <span>{lessons} {t("training.lessons")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#94A3B8]" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

