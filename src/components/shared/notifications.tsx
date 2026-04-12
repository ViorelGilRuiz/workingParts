"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppNotification } from "@/types";

interface NotificationsProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const colorMap = {
  success: "text-green-600 bg-green-50 border-green-200",
  error: "text-red-600 bg-red-50 border-red-200",
  warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
  info: "text-blue-600 bg-blue-50 border-blue-200"
};

export function Notifications({ notifications, unreadCount, onMarkAsRead, onDismiss }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen((value) => !value)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <Card className="absolute right-0 top-12 z-50 w-80 max-h-96 overflow-y-auto p-0 shadow-lg">
          <div className="border-b p-4">
            <h3 className="font-semibold">Notificaciones</h3>
          </div>
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
            ) : (
              notifications.map((notification) => {
                const Icon = iconMap[notification.type];

                return (
                  <div
                    key={notification.id}
                    className={`p-4 ${colorMap[notification.type]} ${!notification.readAt ? "bg-opacity-75" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="mt-1 text-sm opacity-90">{notification.message}</p>
                        <p className="mt-2 text-xs opacity-70">{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.readAt ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => onDismiss(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
