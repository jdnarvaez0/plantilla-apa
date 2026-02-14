'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

interface UseApiHealthReturn {
    status: ConnectionStatus;
    lastChecked: Date | null;
    checkNow: () => Promise<void>;
}

/**
 * Hook to monitor the backend API connection status.
 * Checks health on mount and at regular intervals.
 */
export function useApiHealth(intervalMs: number = 30000): UseApiHealthReturn {
    const [status, setStatus] = useState<ConnectionStatus>('checking');
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkHealth = useCallback(async () => {
        try {
            await apiService.healthCheck();
            setStatus('connected');
        } catch {
            setStatus('disconnected');
        } finally {
            setLastChecked(new Date());
        }
    }, []);

    useEffect(() => {
        // Initial check
        checkHealth();

        // Periodic checks
        const interval = setInterval(checkHealth, intervalMs);

        // Also check when the window regains focus
        const handleFocus = () => {
            checkHealth();
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, [checkHealth, intervalMs]);

    return {
        status,
        lastChecked,
        checkNow: checkHealth,
    };
}
