import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Sidebar, Header } from "./home";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ClipboardList,
  UserPlus
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, translateName, translateRole, translateBranch } from "@/lib/language";

export default function BranchDetails() {
  const [match, params] = useRoute("/branches/:id");
  const branchName = decodeURIComponent(params?.id || "");
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { toast } = useToast();
  const { t, language } = useLanguage();

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

  const [teamMembers, setTeamMembers] = useState(() => {
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
  });

  const branches = (() => {
    const saved = localStorage.getItem("sugarhive_branches");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Riyadh Front", location: "Airport Road, Riyadh", manager: "Mohammed Al-Otaibi", status: "Active" },
      { name: "Jeddah Main", location: "Tahlia Street, Jeddah", manager: "Sara Ahmed", status: "Active" },
      { name: "Dammam Hub", location: "Corniche Road, Dammam", manager: "Khalid Al-Shamri", status: "Active" },
      { name: "Makkah Center", location: "Ibrahim Al Khalil St, Makkah", manager: "Faisal Khalid", status: "Inactive" },
    ];
  })();

  const currentBranch = branches.find((b: any) => b.name === branchName);
  const branchChecklists = checklists.filter((c: any) => c.branch === branchName);
  const branchStaff = teamMembers.filter((m: any) => m.branch === branchName);
  const totalProgress = branchChecklists.reduce((acc: number, c: any) => acc + (c.progress || 0), 0);
  const complianceScore = branchChecklists.length > 0 
    ? Math.round(totalProgress / branchChecklists.length) 
    : 0;
  const completedChecklists = branchChecklists.filter((c: any) => c.status === "Completed").length;

  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", role: "" });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email || !staffForm.role) return;
    const newMember = {
      name: staffForm.name,
      email: staffForm.email,
      role: staffForm.role,
      branch: branchName,
      status: "Active"
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem("sugarhive_team", JSON.stringify(updated));
    setStaffForm({ name: "", email: "", role: "" });
    setIsAddStaffOpen(false);
    toast({
      title: t("branches.staffAdded"),
      description: `${staffForm.name} ${t("toast.staffAddedDesc")} ${branchName}.`,
    });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={`${branchName} ${t("branches.details")}`} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={window.location.search.includes('from=checklists') ? "/checklists" : "/branches"}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{branchName}</h2>
                <div className="flex items-center gap-2 text-[#64748B] mt-1">
                  <Badge variant="outline" className="bg-white border-[#E2E8F0]">{currentBranch?.status === "Inactive" ? t("branches.inactiveBranch") : t("branches.activeBranch")}</Badge>
                  {currentBranch?.location && (
                    <>
                      <span>•</span>
                      <span>{currentBranch.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Dialog open={!!selectedChecklist} onOpenChange={(open) => !open && setSelectedChecklist(null)}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <ClipboardList size={20} />
                  </div>
                  <DialogTitle className="text-xl font-bold text-[#0F172A]">{t("branches.checklistDetails")}</DialogTitle>
                </div>
                <DialogDescription className="text-[#64748B]">
                  {t("branches.detailedInfo")}
                </DialogDescription>
              </DialogHeader>
              
              {selectedChecklist && (
                <div className="space-y-6 py-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklists.title_field")}</Label>
                    <p className="text-lg font-bold text-[#0F172A]">{selectedChecklist.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.assignedTo")}</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">
                          {selectedChecklist.assignee?.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-[#0F172A]">{translateName(selectedChecklist.assignee, language)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.dueDate")}</Label>
                      <div>
                        <Badge className={`${
                          selectedChecklist.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          selectedChecklist.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        } border-none text-[10px] font-bold uppercase`}>
                          {selectedChecklist.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.status")}</Label>
                      <div>
                        <Badge className={`${
                          selectedChecklist.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          selectedChecklist.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        } border-none text-[10px] font-bold uppercase`}>
                          {selectedChecklist.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("checklist.dueDate")}</Label>
                      <p className="text-sm text-[#475569] font-medium">{selectedChecklist.dueDate}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F1F5F9]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">{t("checklist.progress")}</span>
                      <span className="font-bold text-[#F59E0B]">{selectedChecklist.progress}%</span>
                    </div>
                    <Progress value={selectedChecklist.progress} className="h-2 mt-2 bg-[#F1F5F9] [&>div]:bg-[#F59E0B]" />
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4 flex items-center justify-center">
                <Button 
                  onClick={() => setSelectedChecklist(null)}
                  className="w-1/2 bg-[#0F172A] text-white font-bold h-12 rounded-xl mx-auto"
                >
                  {t("common.close")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{t("branches.operationalPerformance")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#64748B]">{t("branches.complianceScore")}</span>
                    <span className="text-2xl font-bold text-[#0F172A]">{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-3 bg-[#F1F5F9] [&>div]:bg-[#F59E0B]" />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.totalChecklists")}</p>
                      <p className="text-lg font-bold text-[#0F172A]">{branchChecklists.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.completed")}</p>
                      <p className="text-lg font-bold text-[#10B981]">{completedChecklists}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.staff")}</p>
                      <p className="text-lg font-bold text-[#6366F1]">{branchStaff.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{t("branches.branchChecklists")}</CardTitle>
                    <CardDescription>{t("branches.allChecklistsAssigned")}</CardDescription>
                  </div>
                  <Link href="/checklists">
                    <Button variant="outline" size="sm" className="text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:bg-[#F8FAFC]">
                      {t("branches.viewAll")}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {branchChecklists.length > 0 ? (
                    <div className="space-y-4">
                      {branchChecklists.map((item: any, i: number) => (
                        <Link key={item.id || i} href={`/checklists/${item.id}`} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] hover:border-[#F59E0B]/30 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg transition-colors ${
                              item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Overdue' ? 'bg-red-50 text-red-600' :
                              'bg-orange-50 text-orange-600'
                            } group-hover:bg-[#F59E0B] group-hover:text-white`}>
                              {item.status === 'Completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0F172A]">{item.title}</p>
                              <p className="text-xs text-[#64748B]">{item.dueDate} • {translateName(item.assignee, language)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${
                              item.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              item.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              item.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            } border-none text-[10px] font-bold uppercase`}>
                              {item.priority}
                            </Badge>
                            <Badge className={`${
                              item.status === 'Completed' ? 'bg-emerald-500' :
                              item.status === 'Overdue' ? 'bg-red-500' :
                              item.status === 'Partial' ? 'bg-orange-500' :
                              'bg-gray-500'
                            } text-white border-none`}>
                              {item.status}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardList className="mx-auto text-[#94A3B8] mb-3" size={32} />
                      <p className="text-sm text-[#64748B]">{t("branches.noChecklistsAssigned")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{t("branches.branchStaff")}</CardTitle>
                    <CardDescription>{branchStaff.length} {t("branches.teamMembers")}</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-sm"
                    onClick={() => setIsAddStaffOpen(true)}
                    data-testid="button-add-staff"
                  >
                    <UserPlus size={16} className="ltr:mr-1.5 rtl:ml-1.5" /> {t("branches.addStaff")}
                  </Button>
                </CardHeader>
                <CardContent>
                  {branchStaff.length > 0 ? (
                    <div className="space-y-3">
                      {branchStaff.map((member: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-xs font-bold text-[#F59E0B]">
                              {member.name?.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0F172A]">{translateName(member.name, language)}</p>
                              <p className="text-[10px] text-[#64748B]">{translateRole(member.role, language)}</p>
                            </div>
                          </div>
                          <Badge className={`${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'} border-none text-[10px] font-bold`}>
                            {member.status === 'Active' ? t("status.active") : member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="mx-auto text-[#94A3B8] mb-3" size={32} />
                      <p className="text-sm text-[#64748B]">{t("branches.noStaff")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog open={isAddStaffOpen} onOpenChange={(open) => {
                setIsAddStaffOpen(open);
                if (!open) setStaffForm({ name: "", email: "", role: "" });
              }}>
                <DialogContent className="max-w-md bg-white rounded-2xl border-none shadow-2xl">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <UserPlus size={20} />
                      </div>
                      <DialogTitle className="text-xl font-bold text-[#0F172A]">{t("branches.addStaffTo")} {branchName}</DialogTitle>
                    </div>
                    <DialogDescription className="text-[#64748B]">
                      {t("branches.addNewTeamMember")}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStaff}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.fullName")} <span className="text-red-500">*</span></Label>
                        <Input 
                          placeholder={t("placeholder.fullName")} 
                          className="rounded-xl border-[#E2E8F0] h-11" 
                          required 
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          data-testid="input-staff-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.emailAddress")} <span className="text-red-500">*</span></Label>
                        <Input 
                          type="email" 
                          placeholder={t("placeholder.email")} 
                          className="rounded-xl border-[#E2E8F0] h-11" 
                          required 
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          data-testid="input-staff-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("team.role")} <span className="text-red-500">*</span></Label>
                        <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                          <SelectTrigger className="rounded-xl border-[#E2E8F0] h-11" data-testid="select-staff-role">
                            <SelectValue placeholder={t("branches.selectRole")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#E2E8F0] rounded-xl shadow-lg">
                            <SelectItem value="Branch Manager" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">{t("role.branchManager")}</SelectItem>
                            <SelectItem value="Supervisor" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">{t("role.supervisor")}</SelectItem>
                            <SelectItem value="Operations" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">{t("role.operations")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="pt-4 flex items-center justify-center">
                      <Button
                        type="submit"
                        disabled={!staffForm.name || !staffForm.email || !staffForm.role}
                        className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl mx-auto disabled:opacity-50"
                        data-testid="button-submit-staff"
                      >
                        {t("branches.addToBranch")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {currentBranch && (
                <Card className="shadow-sm border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{t("branches.branchInfo")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#64748B]">{t("branches.manager")}</span>
                      <span className="font-bold text-[#0F172A]">{translateName(currentBranch.manager, language)}</span>
                    </div>
                    {currentBranch.location && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#64748B]">{t("branches.location")}</span>
                        <span className="font-bold text-[#0F172A] text-right max-w-[180px]">{currentBranch.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#64748B]">{t("checklist.status")}</span>
                      <Badge className={`${currentBranch.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'} border-none text-[10px] font-bold`}>
                        {currentBranch.status === 'Active' ? t("status.active") : currentBranch.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
