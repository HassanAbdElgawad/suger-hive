import { useState } from "react";
import { Sidebar, Header } from "./home";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Search, 
  Filter,
  Building2,
  CheckCircle2,
  Pencil,
  Trash2,
  UserX,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useAuth, getUserBranchFilter, createInvite, getInvites, type UserRole, type Invite } from "@/lib/auth";
import { Copy, LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useLanguage, translateName, translateRole, translateBranch } from "@/lib/language";

export default function Team() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const userBranchFilter = getUserBranchFilter(user);
  const isAdmin = user?.role === "admin";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    branch: ""
  });
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState<string>("");
  const [inviteBranch, setInviteBranch] = useState<string>("");
  const [generatedInvite, setGeneratedInvite] = useState<Invite | null>(null);
  const [assignCourseOpen, setAssignCourseOpen] = useState(false);
  const [assignCourseMember, setAssignCourseMember] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMemberEmail, setDeleteMemberEmail] = useState<string | null>(null);

  const getAvailableCourses = () => {
    const saved = localStorage.getItem("sugarhive_courses");
    if (saved) return JSON.parse(saved);
    return [];
  };

  const getAssignedCourses = (email: string) => {
    const saved = localStorage.getItem("sugarhive_assigned_courses");
    if (saved) {
      const all = JSON.parse(saved);
      return all[email] || [];
    }
    return [];
  };

  const handleAssignCourse = () => {
    if (!assignCourseMember || !selectedCourseId) return;
    const saved = localStorage.getItem("sugarhive_assigned_courses");
    const all = saved ? JSON.parse(saved) : {};
    const memberCourses = all[assignCourseMember] || [];
    if (memberCourses.includes(Number(selectedCourseId))) {
      toast({ title: t("team.alreadyAssigned"), description: "This course is already assigned to this member." });
      return;
    }
    memberCourses.push(Number(selectedCourseId));
    all[assignCourseMember] = memberCourses;
    localStorage.setItem("sugarhive_assigned_courses", JSON.stringify(all));
    const courses = getAvailableCourses();
    const course = courses.find((c: any) => c.id === Number(selectedCourseId));
    toast({ title: t("team.assignCourse"), description: `"${course?.title || 'Course'}" has been assigned successfully.` });
    setAssignCourseOpen(false);
    setSelectedCourseId("");
    setAssignCourseMember(null);
  };

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

  const [teamMembers, setTeamMembers] = useState(() => {
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
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmail) {
      const updatedTeam = teamMembers.map((m: any) => 
        m.email === editingEmail ? { ...m, ...formData } : m
      );
      setTeamMembers(updatedTeam);
      localStorage.setItem("sugarhive_team", JSON.stringify(updatedTeam));
      toast({
        title: t("team.updateMember"),
        description: `${formData.name}'s details have been updated.`,
      });
    } else {
      const newMember = {
        ...formData,
        status: "Active"
      };
      const updatedTeam = [newMember, ...teamMembers];
      setTeamMembers(updatedTeam);
      localStorage.setItem("sugarhive_team", JSON.stringify(updatedTeam));
      
      toast({
        title: t("team.inviteMember"),
        description: `${formData.name} ${t("toast.memberInvitedDesc")}`,
      });
    }
    
    setFormData({ name: "", email: "", role: "", branch: "" });
    setEditingEmail(null);
    setIsDialogOpen(false);
  };

  const handleEditMember = (member: any) => {
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      branch: member.branch
    });
    setEditingEmail(member.email);
    setIsDialogOpen(true);
  };

  const handleRemoveMember = (email: string) => {
    setDeleteMemberEmail(email);
    setDeleteConfirmOpen(true);
  };

  const confirmRemoveMember = () => {
    if (!deleteMemberEmail) return;
    const updatedTeam = teamMembers.filter((m: any) => m.email !== deleteMemberEmail);
    setTeamMembers(updatedTeam);
    localStorage.setItem("sugarhive_team", JSON.stringify(updatedTeam));
    toast({
      title: t("team.removeMember"),
      description: "The team member has been removed from the platform.",
    });
    setDeleteConfirmOpen(false);
    setDeleteMemberEmail(null);
  };

  const handleToggleStatus = (email: string) => {
    const updatedTeam = teamMembers.map((m: any) => 
      m.email === email ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
    );
    setTeamMembers(updatedTeam);
    localStorage.setItem("sugarhive_team", JSON.stringify(updatedTeam));
    toast({
      title: t("team.status"),
      description: "The team member's status has been updated.",
    });
  };

  const handleGenerateInvite = () => {
    if (!inviteRole || !inviteBranch) return;
    const invite = createInvite(inviteRole as UserRole, inviteBranch, user?.name || "Admin");
    setGeneratedInvite(invite);
    toast({ title: t("team.generateInviteLink"), description: t("team.shareLinkMessage") });
  };

  const getInviteUrl = (code: string) => {
    return `${window.location.origin}/register/${code}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("team.copyLink"), description: t("team.copyLink") });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredTeam = teamMembers.filter((m: any) => {
    const matchesUserBranch = !userBranchFilter || m.branch === userBranchFilter;

    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesBranch = branchFilter === "all" || m.branch === branchFilter;

    return matchesUserBranch && matchesSearch && matchesRole && matchesBranch;
  });

  const totalPages = Math.ceil(filteredTeam.length / PAGE_SIZE);
  const paginatedTeam = filteredTeam.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("team.management")} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("team.members")}</h2>
              <p className="text-[#64748B] mt-1">{t("team.manageDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white border-[#E2E8F0] rounded-xl h-11 px-6 font-semibold text-[#1E293B] shadow-sm hover:bg-[#F8FAFC] transition-all">
                    <Filter size={18} className="mr-2 text-[#64748B]" /> 
                    {roleFilter === "all" && branchFilter === "all" ? t("team.filter") : t("team.filtersActive")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-[#E2E8F0] rounded-2xl shadow-xl p-3 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] px-1">{t("team.filterByRole")}</Label>
                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                      <SelectTrigger className="rounded-xl border-[#E2E8F0] h-10 bg-[#F8FAFC]">
                        <SelectValue placeholder={t("team.allRoles")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg">
                        <SelectItem value="all">{t("team.allRoles")}</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] px-1">{t("team.filterByBranch")}</Label>
                    <Select value={branchFilter} onValueChange={(v) => { setBranchFilter(v); setCurrentPage(1); }}>
                      <SelectTrigger className="rounded-xl border-[#E2E8F0] h-10 bg-[#F8FAFC]">
                        <SelectValue placeholder={t("team.allBranches")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg">
                        <SelectItem value="all">{t("team.allBranches")}</SelectItem>
                        <SelectItem value="Headquarters">{t("team.headquarters")}</SelectItem>
                        {getBranches().map((b: any) => (
                          <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(roleFilter !== "all" || branchFilter !== "all") && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs font-bold text-[#F59E0B] hover:text-[#D97706] hover:bg-[#F59E0B]/5 rounded-lg py-2 h-auto"
                      onClick={() => {
                        setRoleFilter("all");
                        setBranchFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      {t("team.resetFilters")}
                    </Button>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              )}
              
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setFormData({ name: "", email: "", role: "", branch: "" });
                  setEditingEmail(null);
                }
              }}>
                {isAdmin && (
                <DialogTrigger asChild>
                  <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-lg shadow-orange-100">
                    <UserPlus size={18} className="mr-2" /> {t("team.addMember")}
                  </Button>
                </DialogTrigger>
                )}
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingEmail ? t("team.editTeamMember") : t("team.addTeamMember")}</DialogTitle>
                    <DialogDescription>
                      {editingEmail ? t("team.updateDescription") : t("team.inviteDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMember}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("team.fullName")} <span className="text-red-500 font-bold ml-1">*</span></Label>
                        <Input 
                          placeholder={t("placeholder.fullName")} 
                          className="rounded-xl border-[#E2E8F0]" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("team.emailAddress")} <span className="text-red-500 font-bold ml-1">*</span></Label>
                        <Input 
                          type="email" 
                          placeholder={t("placeholder.email")} 
                          className="rounded-xl border-[#E2E8F0]" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("team.role")} <span className="text-red-500 font-bold ml-1">*</span></Label>
                          <Select 
                            required 
                            value={formData.role}
                            onValueChange={(v) => setFormData({ ...formData, role: v })}
                          >
                            <SelectTrigger className="rounded-xl border-[#E2E8F0]">
                              <SelectValue placeholder={t("team.selectRole")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E2E8F0] max-h-[200px] overflow-y-auto">
                              <SelectItem value="Admin" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Admin</SelectItem>
                              <SelectItem value="Manager" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Manager</SelectItem>
                              <SelectItem value="Supervisor" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Supervisor</SelectItem>
                              <SelectItem value="Operations" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Operations</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider">{t("team.branch")} <span className="text-red-500 font-bold ml-1">*</span></Label>
                          <Select 
                            required 
                            value={formData.branch}
                            onValueChange={(v) => setFormData({ ...formData, branch: v })}
                          >
                            <SelectTrigger className="rounded-xl border-[#E2E8F0]">
                              <SelectValue placeholder={t("team.selectBranch")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E2E8F0] max-h-[200px] overflow-y-auto">
                              <SelectItem value="Headquarters" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">{t("team.headquarters")}</SelectItem>
                              {getBranches().map((b: any) => (
                                <SelectItem key={b.name} value={b.name} className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 flex items-center justify-center">
                      <Button
                        type="submit"
                        className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl mx-auto"
                      >
                        {editingEmail ? t("team.updateMember") : t("team.inviteMember")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {isAdmin && (
              <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
                setInviteDialogOpen(open);
                if (!open) {
                  setInviteRole("");
                  setInviteBranch("");
                  setGeneratedInvite(null);
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/5" data-testid="button-generate-invite">
                    <LinkIcon size={18} className="mr-2" /> {t("team.generateInviteLink")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("team.generateInviteLink")}</DialogTitle>
                    <DialogDescription>{t("team.generateInviteDescription")}</DialogDescription>
                  </DialogHeader>
                  {!generatedInvite ? (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("team.role")} <span className="text-red-500">*</span></Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger className="rounded-xl border-[#E2E8F0]" data-testid="select-invite-role">
                            <SelectValue placeholder={t("team.selectRoleForInvitee")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#E2E8F0]">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider">{t("team.branch")} <span className="text-red-500">*</span></Label>
                        <Select value={inviteBranch} onValueChange={setInviteBranch}>
                          <SelectTrigger className="rounded-xl border-[#E2E8F0]" data-testid="select-invite-branch">
                            <SelectValue placeholder={t("team.selectBranchInvite")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#E2E8F0]">
                            {getBranches().map((b: any) => (
                              <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleGenerateInvite}
                        disabled={!inviteRole || !inviteBranch}
                        className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl disabled:opacity-50"
                        data-testid="button-create-invite"
                      >
                        <LinkIcon size={18} className="mr-2" /> {t("team.generateLink")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                        <CheckCircle2 className="text-emerald-500 mx-auto" size={32} />
                        <p className="text-sm font-bold text-emerald-700">{t("team.inviteLinkCreated")}</p>
                        <p className="text-xs text-emerald-600">{t("team.shareLinkMessage")}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.inviteLink")}</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={getInviteUrl(generatedInvite.code)}
                            className="rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-sm font-mono"
                            data-testid="input-invite-url"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-xl border-[#E2E8F0] hover:bg-[#F59E0B]/10 hover:text-[#F59E0B]"
                            onClick={() => copyToClipboard(getInviteUrl(generatedInvite.code))}
                            data-testid="button-copy-invite"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.role")}</p>
                          <p className="font-bold text-[#0F172A] capitalize" data-testid="text-invite-generated-role">{generatedInvite.role}</p>
                        </div>
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.branch")}</p>
                          <p className="font-bold text-[#F59E0B]" data-testid="text-invite-generated-branch">{generatedInvite.branch}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setGeneratedInvite(null);
                          setInviteRole("");
                          setInviteBranch("");
                        }}
                        variant="outline"
                        className="w-full rounded-xl border-[#E2E8F0]"
                        data-testid="button-generate-another"
                      >
                        {t("team.generateAnotherLink")}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F1F5F9] flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                <Input 
                  placeholder={t("team.search")} 
                  className="pl-10 border-[#E2E8F0] rounded-xl" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {paginatedTeam.map((member: any, i: number) => (
                <TeamMemberRow 
                  key={member.email}
                  name={member.name} 
                  role={member.role} 
                  email={member.email}
                  branch={member.branch}
                  status={member.status}
                  assignedCourses={getAssignedCourses(member.email)}
                  availableCourses={getAvailableCourses()}
                  onRemove={() => handleRemoveMember(member.email)}
                  onToggleStatus={() => handleToggleStatus(member.email)}
                  onEdit={() => handleEditMember(member)}
                  onAssignCourse={() => {
                    setAssignCourseMember(member.email);
                    setSelectedCourseId("");
                    setAssignCourseOpen(true);
                  }}
                  isAdmin={isAdmin}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[#F1F5F9]">
                <p className="text-sm text-[#64748B] font-medium" data-testid="text-pagination-info">
                  {t("team.showing")} {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredTeam.length)} {t("team.ofMembers")} {filteredTeam.length} {t("team.membersLabel")}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] h-9 px-3"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    data-testid="button-prev-page"
                  >
                    {t("team.previous")}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className={`rounded-lg min-w-[36px] h-9 ${page === currentPage ? "bg-[#F59E0B] hover:bg-[#D97706] text-white border-[#F59E0B] shadow-sm" : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"}`}
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] h-9 px-3"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    data-testid="button-next-page"
                  >
                    {t("team.next")}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Dialog open={assignCourseOpen} onOpenChange={(open) => {
            setAssignCourseOpen(open);
            if (!open) {
              setSelectedCourseId("");
              setAssignCourseMember(null);
            }
          }}>
            <DialogContent className="max-w-md bg-white rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <GraduationCap size={20} className="text-[#F59E0B]" />
                  {t("team.assignCourse")}
                </DialogTitle>
                <DialogDescription className="text-[#64748B]">
                  {t("team.selectCourseToAssign")} {teamMembers.find((m: any) => m.email === assignCourseMember)?.name || t("team.thisMember")}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.selectCourse")} <span className="text-red-500">*</span></Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger className="rounded-xl border-[#E2E8F0] h-11" data-testid="select-course">
                      <SelectValue placeholder={t("team.chooseCourse")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E2E8F0] max-h-[250px] overflow-y-auto">
                      {getAvailableCourses().map((course: any) => (
                        <SelectItem key={course.id} value={String(course.id)} className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-[#F59E0B]" />
                            {course.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {assignCourseMember && getAssignedCourses(assignCourseMember).length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.alreadyAssigned")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {getAssignedCourses(assignCourseMember).map((courseId: number) => {
                        const course = getAvailableCourses().find((c: any) => c.id === courseId);
                        return course ? (
                          <Badge key={courseId} className="bg-[#F59E0B]/10 text-[#F59E0B] border-none text-xs font-bold">
                            {course.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="pt-4 flex items-center justify-center">
                <Button
                  onClick={handleAssignCourse}
                  disabled={!selectedCourseId}
                  className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl mx-auto disabled:opacity-50"
                  data-testid="button-confirm-assign-course"
                >
                  {t("team.assignCourse")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="max-w-sm bg-white rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Trash2 size={20} className="text-red-500" />
                  {t("team.removeMember")}
                </DialogTitle>
                <DialogDescription className="text-[#64748B]">
                  {t("team.removeConfirm")} <span className="font-bold text-[#0F172A]">{teamMembers.find((m: any) => m.email === deleteMemberEmail)?.name}</span> {t("team.removeConfirmEnd")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setDeleteConfirmOpen(false); setDeleteMemberEmail(null); }}
                  className="flex-1 rounded-xl h-11 border-[#E2E8F0] font-bold"
                  data-testid="button-cancel-delete-member"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={confirmRemoveMember}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-11"
                  data-testid="button-confirm-delete-member"
                >
                  {t("team.remove")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

function TeamMemberRow({ 
  name, 
  role, 
  email, 
  branch, 
  status,
  assignedCourses,
  availableCourses,
  isAdmin,
  onRemove,
  onToggleStatus,
  onEdit,
  onAssignCourse
}: { 
  name: string, 
  role: string, 
  email: string, 
  branch: string, 
  status: string,
  assignedCourses: number[],
  availableCourses: any[],
  onRemove: () => void,
  onToggleStatus: () => void,
  onEdit: () => void,
  onAssignCourse: () => void,
  isAdmin?: boolean
}) {
  const { t, language } = useLanguage();
  const displayName = translateName(name, language);
  const displayRole = translateRole(role, language);
  const displayBranch = translateBranch(branch, language);
  const assignedCourseNames = assignedCourses
    .map(id => availableCourses.find((c: any) => c.id === id))
    .filter(Boolean);

  return (
    <div className="p-4 md:p-5 hover:bg-[#FAFBFC] transition-all flex flex-col md:flex-row md:items-center gap-4 group cursor-default" data-testid={`row-member-${email}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-10 h-10 md:w-11 md:h-11 border-2 border-white shadow-sm ring-1 ring-[#F1F5F9] shrink-0">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
          <AvatarFallback className="text-sm font-bold bg-[#F59E0B]/10 text-[#F59E0B]">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h4 className="font-bold text-[#0F172A] tracking-tight text-sm md:text-base truncate">{displayName}</h4>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium mt-0.5 truncate">
            <Mail size={11} className="text-[#94A3B8] shrink-0" /> <span className="truncate">{email}</span>
          </div>
          {assignedCourseNames.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {assignedCourseNames.map((course: any) => (
                <span key={course.id} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-bold">
                  <BookOpen size={10} />
                  {course.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 ml-[52px] md:ml-0">
        <div className="min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Shield size={13} className="text-[#F59E0B]" />
            <span className="text-sm font-bold text-[#0F172A] capitalize">{displayRole}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <Building2 size={11} className="text-[#94A3B8]" />
            {displayBranch}
          </div>
        </div>

        <Badge className={`shrink-0 ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold' : 'bg-slate-50 text-slate-600 border-slate-100 font-bold'}`}>
          {status === 'Active' ? t("team.active") : t("team.inactive")}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-white border border-transparent hover:border-[#E2E8F0] shadow-sm transition-all h-9 w-9">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-[#E2E8F0] rounded-xl shadow-xl p-1">
            <DropdownMenuItem 
              onClick={onAssignCourse}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#1E293B] cursor-pointer rounded-lg hover:bg-[#F59E0B]/5 focus:bg-[#F59E0B]/5 transition-colors"
              data-testid={`assign-course-${email}`}
            >
              <GraduationCap size={16} className="text-[#F59E0B]" />
              {t("team.assignCourse")}
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator className="my-1 bg-[#F1F5F9]" />
                <DropdownMenuItem 
                  onClick={onEdit}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#1E293B] cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                >
                  <Pencil size={16} className="text-[#64748B]" />
                  {t("team.editDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onToggleStatus}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#1E293B] cursor-pointer rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors"
                >
                  <UserX size={16} className="text-[#64748B]" />
                  {status === "Active" ? t("team.deactivateUser") : t("team.activateUser")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-[#F1F5F9]" />
                <DropdownMenuItem 
                  onClick={onRemove}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  {t("team.removeMember")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
