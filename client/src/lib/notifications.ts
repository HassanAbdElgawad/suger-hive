const NOTIFICATIONS_KEY = "sugarhive_notifications";
const NOTIFICATION_EVENT = "sugarhive_notification_update";

export function getNotifications(): any[] {
  const saved = localStorage.getItem(NOTIFICATIONS_KEY);
  return saved ? JSON.parse(saved) : [];
}

let notifCounter = 0;

export function addNotification(notification: { recipient: string; title: string; message: string; type: string; branch?: string; checklistId?: string }) {
  const notifications = getNotifications();
  notifCounter++;
  const id = `notif_${Date.now()}_${notifCounter}`;
  notifications.unshift({
    id,
    ...notification,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString(),
    read: false,
    createdAt: Date.now(),
  });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(NOTIFICATION_EVENT));
}

export function markNotificationRead(id: string) {
  const notifications = getNotifications();
  const updated = notifications.map((n: any) => String(n.id) === String(id) ? { ...n, read: true } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(NOTIFICATION_EVENT));
}

export function getUnreadCount(userName?: string): number {
  const notifications = getNotifications();
  if (userName) return notifications.filter((n: any) => !n.read && n.recipient === userName).length;
  return notifications.filter((n: any) => !n.read).length;
}
