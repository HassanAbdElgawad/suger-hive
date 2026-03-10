import { useState } from "react";
import { Sidebar, Header } from "./home";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language";

const data = [
  { time: "06:00", completion: 20 },
  { time: "08:00", completion: 45 },
  { time: "10:00", completion: 65 },
  { time: "12:00", completion: 82 },
  { time: "14:00", completion: 78 },
  { time: "16:00", completion: 90 },
  { time: "18:00", completion: 95 },
];

const checklistData = [
  { name: "Opening", score: 98, status: "Perfect" },
  { name: "Hygiene", score: 85, status: "Good" },
  { name: "Equipment", score: 92, status: "Excellent" },
  { name: "Inventory", score: 70, status: "Needs Focus" },
  { name: "Closing", score: 0, status: "Pending" },
];

export default function DailyPerformance() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("reports.dailyPerformanceReport")} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">{t("reports.todaysOverview")}</h2>
              <p className="text-[#64748B] mt-1">{t("reports.operationalHealth")} Feb 3, 2026</p>
            </div>
            <Badge variant="outline" className="px-4 py-2 border-[#E2E8F0] bg-[#F59E0B]/5 text-[#F59E0B] font-bold text-sm">
              <TrendingUp size={16} className="ltr:mr-2 rtl:ml-2" /> {t("reports.liveAnalytics")}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TooltipProvider>
              <Card className="shadow-sm border-[#E2E8F0]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-[#94A3B8] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0F172A] text-white border-none p-3 rounded-xl shadow-xl max-w-xs">
                          <p className="text-xs leading-relaxed">{t("reports.completionRateTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">+4%</Badge>
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("reports.completionRate")}</p>
                  <h3 className="text-3xl font-bold text-[#0F172A]">94.2%</h3>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-[#E2E8F0]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg border border-orange-100 text-orange-600">
                      <Clock size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-[#94A3B8] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0F172A] text-white border-none p-3 rounded-xl shadow-xl max-w-xs">
                          <p className="text-xs leading-relaxed">{t("reports.resolutionTimeTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Badge className="bg-red-50 text-red-600 border-red-100">+12m</Badge>
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("reports.avgResolutionTime")}</p>
                  <h3 className="text-3xl font-bold text-[#0F172A]">24m</h3>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-[#E2E8F0]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-600">
                      <TrendingUp size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-[#94A3B8] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0F172A] text-white border-none p-3 rounded-xl shadow-xl max-w-xs">
                          <p className="text-xs leading-relaxed">{t("reports.efficiencyTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100">{t("reports.stable")}</Badge>
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{t("reports.operationalEfficiency")}</p>
                  <h3 className="text-3xl font-bold text-[#0F172A]">88.5%</h3>
                </CardContent>
              </Card>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="shadow-sm border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{t("reports.activityTrend")}</CardTitle>
                <CardDescription>{t("reports.checklistCompletions")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="completion" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{t("reports.categoryBreakdown")}</CardTitle>
                <CardDescription>{t("reports.performanceByType")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {checklistData.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#0F172A]">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <Badge variant="ghost" className="text-[10px] font-bold uppercase tracking-wider p-0">{item.status}</Badge>
                        <span className="text-[#64748B] font-bold">{item.score}%</span>
                      </div>
                    </div>
                    <Progress value={item.score} className={`h-2 bg-[#F1F5F9] ${item.score >= 90 ? '[&>div]:bg-emerald-500' : item.score >= 70 ? '[&>div]:bg-orange-400' : '[&>div]:bg-red-400'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
