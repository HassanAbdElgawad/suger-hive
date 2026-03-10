import { useState } from "react";
import { Sidebar, Header } from "./home";
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  FileDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language";

export default function OrganizationSettings() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("settings.organizationSettings")} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("settings.organization")}</h2>
              <p className="text-[#64748B] mt-1">{t("settings.configureCompany")}</p>
            </div>
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
              {t("settings.saveChanges")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{t("settings.generalInfo")}</CardTitle>
                  <CardDescription>{t("settings.basicDetails")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("settings.companyName")}</label>
                      <input type="text" defaultValue="SugarHive Operations" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("settings.industry")}</label>
                      <input type="text" defaultValue="Food & Beverage" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("settings.supportEmail")}</label>
                    <input type="email" defaultValue="support@sugarhive.com" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" required />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{t("settings.securityRoles")}</CardTitle>
                  <CardDescription>{t("settings.manageAccess")}</CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-[#F1F5F9]">
                  <SettingsOption 
                    icon={<Shield className="text-blue-500" size={18} />}
                    title={t("settings.twoFactor")}
                    description={t("settings.twoFactorDesc")}
                    action={<Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">{t("settings.enabled")}</Badge>}
                  />
                  <SettingsOption 
                    icon={<Smartphone className="text-indigo-500" size={18} />}
                    title={t("settings.mobileAccess")}
                    description={t("settings.mobileAccessDesc")}
                    action={<Button variant="ghost" size="sm" className="text-[#64748B]">{t("settings.configure")}</Button>}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{t("settings.documents")}</CardTitle>
                  <CardDescription>{t("settings.downloadDocs")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/api/download/brd"
                    download="SugarHive_BRD.md"
                    className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B] hover:bg-[#FFFBEB] transition-all group cursor-pointer"
                    data-testid="link-download-brd"
                  >
                    <div className="p-2.5 bg-[#FEF3C7] rounded-lg">
                      <FileDown size={20} className="text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">{t("settings.brdDocument")}</p>
                      <p className="text-xs text-[#64748B]">{t("settings.brdDescription")}</p>
                    </div>
                  </a>
                  <a
                    href="/api/download/user-stories"
                    download="SugarHive_User_Stories.md"
                    className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B] hover:bg-[#FFFBEB] transition-all group cursor-pointer mt-3"
                    data-testid="link-download-user-stories"
                  >
                    <div className="p-2.5 bg-[#EDE9FE] rounded-lg">
                      <FileDown size={20} className="text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">{t("settings.userStoriesDocument")}</p>
                      <p className="text-xs text-[#64748B]">{t("settings.userStoriesDescription")}</p>
                    </div>
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{t("settings.quickLinks")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#F1F5F9]">
                    <QuickLink icon={<Globe size={18} />} label={t("settings.publicWebsite")} />
                    <QuickLink icon={<CreditCard size={18} />} label={t("settings.billing")} />
                    <QuickLink icon={<Bell size={18} />} label={t("settings.globalNotifications")} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsOption({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: React.ReactNode }) {
  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">{title}</h4>
          <p className="text-xs text-[#64748B]">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function QuickLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <span className="text-[#94A3B8] group-hover:text-[#F59E0B] transition-colors">{icon}</span>
        <span className="text-sm font-medium text-[#64748B] group-hover:text-[#0F172A]">{label}</span>
      </div>
      <ChevronRight size={16} className="text-[#94A3B8]" />
    </div>
  );
}
