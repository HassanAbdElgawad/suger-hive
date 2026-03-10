import { useState } from "react";
import { Sidebar, Header } from "./home";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Users, 
  Zap,
  ChevronRight,
  Trophy,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useLanguage } from "@/lib/language";

const branchPerformance = [
  { name: "Riyadh Front", score: 96, active: 12, issues: 0, color: "#10B981" },
  { name: "Jeddah Main", score: 88, active: 8, issues: 2, color: "#F59E0B" },
  { name: "Dammam Hub", score: 92, active: 15, issues: 1, color: "#6366F1" },
  { name: "Khobar Mall", score: 74, active: 6, issues: 4, color: "#EF4444" },
  { name: "Makkah Store", score: 90, active: 10, issues: 0, color: "#8B5CF6" },
];

export default function BranchComparison() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("branches.branchComparison")} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("branches.branchAnalysis")}</h2>
              <p className="text-[#64748B] mt-1">{t("branches.crossLocationPerformance")}</p>
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-[#0F172A]">Top: Riyadh Front</span>
               </div>
            </div>
          </div>

          <Card className="shadow-sm border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t("branches.efficiencyScore")}</CardTitle>
              <CardDescription>{t("branches.scoreByCompliance")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchPerformance} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontBold: 'bold', fill: '#0F172A'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                    {branchPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchPerformance.map((branch, i) => (
              <Link key={i} href={`/branches/${encodeURIComponent(branch.name)}`}>
                <Card className="shadow-sm border-[#E2E8F0] hover:border-[#F59E0B] transition-all cursor-pointer group h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-[#F59E0B]/10 transition-colors">
                        <Building2 size={20} className="text-[#64748B] group-hover:text-[#F59E0B]" />
                      </div>
                      <Badge className={`border-none ${branch.score >= 90 ? 'bg-emerald-50 text-emerald-600' : branch.score >= 80 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                        {branch.score}%
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold mt-2">{branch.name}</CardTitle>
                    <div className="flex items-center gap-1 text-[#64748B] text-xs">
                      <MapPin size={12} /> Saudi Arabia
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F1F5F9]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.activeStaff")}</p>
                        <p className="text-xl font-bold text-[#0F172A]">{branch.active}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t("branches.openIssues")}</p>
                        <p className={`text-xl font-bold ${branch.issues > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{branch.issues}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ChevronRight size={16} className="text-[#CBD5E1] group-hover:text-[#F59E0B] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
