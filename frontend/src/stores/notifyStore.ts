import { create } from 'zustand';

type Severity = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  severity: Severity;
  key: number;
}

interface NotifyState {
  notification: Notification | null;
  notify: (message: string, severity?: Severity) => void;
  clear: () => void;
}

export const useNotifyStore = create<NotifyState>((set) => ({
  notification: null,
  notify: (message, severity = 'info') =>
    set({ notification: { message, severity, key: Date.now() } }),
  clear: () => set({ notification: null }),
}));
