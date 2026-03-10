import { useState } from "react";
import { Link } from "wouter";
import { Sidebar, Header } from "./home";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  ChevronRight, 
  Plus, 
  Search, 
  MoreVertical,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useAuth, getUserBranchFilter } from "@/lib/auth";
import { useLanguage, translateName, translateBranch } from "@/lib/language";

export default function Branches() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const branchFilter = getUserBranchFilter(user);
  const isAdmin = user?.role === "admin";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    manager: ""
  });

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

  const getStaffCount = (branchName: string) => {
    return teamMembers.filter((m: any) => m.branch === branchName).length;
  };

  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem("sugarhive_branches");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Riyadh Front", location: "Airport Road, Riyadh", manager: "Mohammed Al-Otaibi", status: "Active" },
      { name: "Jeddah Main", location: "Tahlia Street, Jeddah", manager: "Sara Ahmed", status: "Active" },
      { name: "Dammam Hub", location: "Corniche Road, Dammam", manager: "Khalid Al-Shamri", status: "Active" },
      { name: "Makkah Center", location: "Ibrahim Al Khalil St, Makkah", manager: "Faisal Khalid", status: "Inactive" },
    ];
  });

  const isFormValid = formData.name && formData.manager;

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBranch = {
      ...formData,
      staff: 0,
      status: "Active"
    };
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    localStorage.setItem("sugarhive_branches", JSON.stringify(updatedBranches));
    
    toast({
      title: t("branches.branchRegistered"),
      description: `${formData.name} ${t("toast.branchRegisteredDesc")}`,
    });
    
    setFormData({ name: "", location: "", manager: "" });
    setIsDialogOpen(open => !open);
  };

  const filteredBranches = branches.filter((b: any) => {
    const matchesBranch = !branchFilter || b.name === branchFilter;
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          title={t("branches.locationsTitle")} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("branches.title")}</h2>
              <p className="text-[#64748B] mt-1">{t("branches.subtitle")}</p>
            </div>
            
            {isAdmin && (<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-lg shadow-orange-100">
                  <Plus size={18} className="ltr:mr-2 rtl:ml-2" /> {t("branches.addBranch")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("branches.addNewBranch")}</DialogTitle>
                  <DialogDescription>{t("branches.registerLocation")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddBranch}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("branches.branchName")} <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder={t("placeholder.branchName")} 
                        className="rounded-xl border-[#E2E8F0]" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("branches.locationAddress")}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-[#94A3B8]" size={16} />
                        <Input 
                          placeholder={t("placeholder.locationAddress")} 
                          className="pl-10 rounded-xl border-[#E2E8F0]" 
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">{t("branches.branchManager")} <span className="text-red-500">*</span></Label>
                      <Select 
                        required 
                        value={formData.manager}
                        onValueChange={(v) => setFormData({ ...formData, manager: v })}
                      >
                        <SelectTrigger className="rounded-xl border-[#E2E8F0] h-10 px-3 py-2 text-sm">
                          <SelectValue placeholder={t("branches.assignManager")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E2E8F0] max-h-[200px] overflow-y-auto" position="popper" sideOffset={5}>
                          <SelectItem value="Ahmed Admin" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Ahmed Admin</SelectItem>
                          <SelectItem value="Sara Ahmed" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Sara Ahmed</SelectItem>
                          <SelectItem value="Mohammed Al-Otaibi" className="focus:bg-[#F59E0B]/10 focus:text-[#F59E0B] cursor-pointer">Mohammed Al-Otaibi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="pt-4 flex items-center justify-center">
                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="w-1/2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold h-12 rounded-xl mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("branches.registerBranch")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch: any, i: number) => (
              <BranchCard 
                key={i}
                name={branch.name} 
                location={branch.location} 
                manager={branch.manager}
                staff={getStaffCount(branch.name)}
                status={branch.status}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function BranchCard({ name, location, manager, staff, status }: { name: string, location: string, manager: string, staff: number, status: string }) {
  const { t, language } = useLanguage();
  return (
    <Card className="shadow-sm border-[#E2E8F0] hover:border-[#F59E0B]/30 transition-all cursor-pointer group bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-[#F8FAFC] rounded-lg group-hover:bg-[#F59E0B]/10 transition-colors border border-[#F1F5F9]">
            <Building2 className="text-[#F59E0B]" size={20} />
          </div>
          <Badge className={status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}>
            {status === 'Active' ? t("status.active") : status}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold mt-4 tracking-tight">{translateBranch(name, language)}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-[#64748B]">
          <MapPin size={14} className="shrink-0" /> <span className="truncate">{location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b border-[#F1F5F9] pb-3">
          <span className="text-[#64748B] font-medium">{t("branches.branchManager")}</span>
          <span className="text-[#0F172A] font-bold">{translateName(manager, language)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#64748B] font-medium">{t("branches.totalStaff")}</span>
          <span className="text-[#0F172A] font-bold">{staff} {t("branches.members")}</span>
        </div>
        <div className="pt-2 flex justify-end">
          <Link href={`/branches/${encodeURIComponent(name)}`}>
            <Button variant="ghost" size="sm" className="text-[#F59E0B] font-bold hover:bg-[#F59E0B]/5 rounded-xl">
              {t("branches.viewDetails")} <ChevronRight size={16} className="ltr:ml-1 rtl:mr-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
