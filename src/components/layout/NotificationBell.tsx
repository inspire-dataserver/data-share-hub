
import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/context/NotificationContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    const colors = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-amber-500',
      error: 'text-red-500',
    };
    
    return <Bell className={`h-4 w-4 ${colors[type as keyof typeof colors]}`} />;
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-0 ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-tight">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
