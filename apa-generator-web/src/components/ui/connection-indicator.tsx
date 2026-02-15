"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useApiHealth, ConnectionStatus } from "@/hooks/use-api-health";
import { cn } from "@/lib/utils";

interface ConnectionIndicatorProps {
  className?: string;
}

export function ConnectionIndicator({ className }: ConnectionIndicatorProps) {
  const { status, checkNow } = useApiHealth(30000);

  const statusConfig: Record<ConnectionStatus, { 
    icon: React.ReactNode; 
    label: string; 
    classes: string;
  }> = {
    checking: {
      icon: <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />,
      label: "Verificando...",
      classes: "text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30",
    },
    connected: {
      icon: <Wifi className="h-3 w-3 text-green-600 dark:text-green-400" />,
      label: "API Conectada",
      classes: "text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/30",
    },
    disconnected: {
      icon: <WifiOff className="h-3 w-3 text-red-500 dark:text-red-400" />,
      label: "API Desconectada",
      classes: "text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30",
    },
  };

  const cfg = statusConfig[status];

  return (
    <button
      onClick={checkNow}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-200 hover:shadow-sm",
        cfg.classes,
        className
      )}
      title={`Estado: ${cfg.label}. Clic para verificar de nuevo.`}
      aria-label={`Estado de conexión: ${cfg.label}`}
      aria-live="polite"
    >
      {cfg.icon}
      <span className="hidden sm:inline">{cfg.label}</span>
    </button>
  );
}
