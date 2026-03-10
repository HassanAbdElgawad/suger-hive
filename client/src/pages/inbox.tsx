import { useState, useEffect, ReactNode } from "react";
import { Sidebar, Header } from "./home";
import { getNotifications, markNotificationRead } from "@/lib/notifications";
import { 
  Search, 
  Filter, 
  Inbox as InboxIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Bell,
  ClipboardList,
  CheckSquare,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export default function Inbox() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const all = getNotifications();
      const mine = user?.role === 'admin' ? all : all.filter((n: any) => n.recipient === user?.name);
      setNotifications(mine);
    };
    load();
    window.addEventListener("sugarhive_notification_update", load);
    return () => window.removeEventListener("sugarhive_notification_update", load);
  }, [user?.name, user?.role]);

  const messages = notifications.map((n: any) => ({
    id: n.id,
    sender: "SugarHive",
    role: t("inbox.operationsSystem"),
    subject: n.title,
    preview: n.message,
    content: n.message,
    time: n.time,
    unread: !n.read,
    type: n.type === "checklist" ? "info" : n.type === "error" ? "error" : "info",
    notificationType: n.type,
    branch: n.branch || "",
    status: n.read ? "completed" : "pending",
    isUrgent: n.type === "error",
    notificationId: n.id,
  }));

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  const filteredMessages = messages.filter(msg => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'unread' && msg.unread) ||
      (activeTab === 'read' && !msg.unread);
    
    const matchesSearch = !searchQuery || 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleMessageSelect = (msgId: string) => {
    setSelectedMessageId(msgId);
    const notification = notifications.find((n: any) => String(n.id) === String(msgId));
    if (notification && !notification.read) {
      markNotificationRead(String(msgId));
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n: any) => {
      if (!n.read) markNotificationRead(String(n.id));
    });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} title={t("inbox.notifications")} />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#F1F5F9]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                <Input 
                  placeholder={t("inbox.searchNotifications")} 
                  className="pl-10 border-[#E2E8F0] rounded-xl h-10 text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-notifications"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-2 space-y-1">
                <InboxNavItem icon={<Bell size={18} />} label={t("inbox.all")} count={messages.length} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <InboxNavItem icon={<Clock size={18} />} label={t("inbox.unread")} count={messages.filter(m => m.unread).length} active={activeTab === 'unread'} onClick={() => setActiveTab('unread')} />
                <InboxNavItem icon={<CheckCircle2 size={18} />} label={t("inbox.read")} count={messages.filter(m => !m.unread).length} active={activeTab === 'read'} onClick={() => setActiveTab('read')} />
              </div>
            </div>
            {messages.some(m => m.unread) && (
              <div className="p-4 border-t border-[#F1F5F9]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-xl text-xs font-bold border-[#E2E8F0] text-[#64748B]"
                  onClick={handleMarkAllRead}
                  data-testid="button-mark-all-read"
                >
                  <CheckCircle2 size={14} className="ltr:mr-2 rtl:ml-2" />
                  {t("inbox.markAllAsRead")}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white flex flex-col">
            <div className="h-14 border-b border-[#F1F5F9] flex items-center justify-between px-6">
              <h3 className="font-bold text-[#0F172A]">
                {activeTab === 'all' ? t("inbox.allNotifications") : activeTab === 'unread' ? t("inbox.unread") : t("inbox.read")}
              </h3>
              <span className="text-xs text-[#94A3B8] font-medium">{filteredMessages.length} {filteredMessages.length !== 1 ? t("inbox.notifications_count") : t("inbox.notification")}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#F1F5F9]">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <MessageItem 
                    key={msg.id}
                    sender={msg.sender} 
                    role={msg.role}
                    subject={msg.subject} 
                    preview={msg.preview}
                    time={msg.time}
                    unread={msg.unread}
                    type={msg.type as any}
                    notificationType={msg.notificationType}
                    active={selectedMessageId === msg.id}
                    onClick={() => handleMessageSelect(msg.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#94A3B8] p-8 text-center">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-lg">{t("inbox.noNotificationsYet")}</p>
                  <p className="text-sm">{t("inbox.notificationsAppearHere")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden xl:flex w-[450px] bg-[#F8FAFC] border-l border-[#E2E8F0] flex-col">
             {selectedMessage ? (
               <div className="p-4 md:p-8 space-y-8">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                       <ClipboardList size={24} className="text-[#F59E0B]" />
                     </div>
                     <div>
                       <h4 className="font-bold text-[#0F172A]">{selectedMessage.sender}</h4>
                       <p className="text-xs text-[#64748B]">{selectedMessage.role}</p>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-[#0F172A]">{selectedMessage.subject}</h2>
                      <span className="text-xs text-[#94A3B8] font-medium">{selectedMessage.time}</span>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                     <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
                       {selectedMessage.content}
                     </p>
                   </div>
                   {selectedMessage.branch && (
                     <div className="flex items-center gap-2">
                       <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-none text-xs font-bold">{selectedMessage.branch}</Badge>
                     </div>
                   )}
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#94A3B8]">
                 <Bell size={64} className="mb-4 opacity-10" />
                 <p className="font-medium">{t("inbox.selectNotification")}</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface InboxNavItemProps {
  icon?: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function InboxNavItem({ icon, label, count, active = false, onClick }: InboxNavItemProps) {
  return (
    <div 
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && <span className={active ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}>{icon}</span>}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-[#F59E0B] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
          {count}
        </span>
      )}
    </div>
  );
}

interface MessageItemProps {
  sender: string;
  role: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  active?: boolean;
  onClick?: () => void;
  type: 'success' | 'error' | 'info';
  notificationType?: string;
}

function MessageItem({ sender, role, subject, preview, time, unread = false, active = false, onClick, type, notificationType }: MessageItemProps) {
  const typeColors = {
    success: 'bg-[#10B981]',
    error: 'bg-[#EF4444]',
    info: 'bg-[#F59E0B]'
  };

  const icon = notificationType === 'training' 
    ? <GraduationCap size={18} className="text-[#F59E0B]" />
    : <ClipboardList size={18} className="text-[#F59E0B]" />;

  return (
    <div 
      className={`p-6 hover:bg-[#F8FAFC] transition-all cursor-pointer relative group ${unread ? 'bg-[#F59E0B]/5' : ''} ${active ? 'bg-[#F1F5F9]' : ''}`}
      onClick={onClick}
      data-testid="notification-item"
    >
      {(unread || active) && <div className={`absolute left-0 top-0 bottom-0 w-1 ${active ? 'bg-[#F59E0B]' : 'bg-[#F59E0B]/50'}`}></div>}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
              {icon}
            </div>
            {unread && <div className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-white ${typeColors[type]}`}></div>}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={`text-sm font-bold ${unread ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{subject}</h4>
            </div>
            <p className="text-xs text-[#64748B] line-clamp-2">{preview}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{time}</span>
          {unread && <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>}
        </div>
      </div>
    </div>
  );
}
