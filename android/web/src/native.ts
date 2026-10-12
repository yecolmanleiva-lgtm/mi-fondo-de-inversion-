export type ReminderStatus = {
  enabled: boolean;
  notificationsAllowed: boolean;
  exactAlarmsAllowed: boolean;
  nextTriggerMillis: number | null;
  exact: boolean;
  timezone: string;
  error?: string;
};

export type BackupResult = {ok: boolean; message: string};

export type MiFondoNativeBridge = {
  getReminderStatus(): string;
  enableReminders(): void;
  disableReminders(): void;
  testReminder(): void;
  openReminderSettings(): void;
  exportBackup(json: string, filename: string): void;
};

declare global {
  interface Window {
    MiFondoNative?: MiFondoNativeBridge;
  }
  interface WindowEventMap {
    'native-status': Event;
    'native-backup': CustomEvent<BackupResult>;
  }
}

export const nativeBridge = () => window.MiFondoNative;

export function readReminderStatus(): ReminderStatus | null {
  const bridge = nativeBridge();
  if (!bridge) return null;
  const status: unknown = JSON.parse(bridge.getReminderStatus());
  if (!status || typeof status !== 'object') throw new Error('No se pudo comprobar el recordatorio de Android.');
  const value = status as ReminderStatus;
  if (typeof value.enabled !== 'boolean' || typeof value.notificationsAllowed !== 'boolean'
    || typeof value.exactAlarmsAllowed !== 'boolean' || typeof value.exact !== 'boolean'
    || typeof value.timezone !== 'string'
    || !(value.nextTriggerMillis === null || (typeof value.nextTriggerMillis === 'number' && Number.isFinite(value.nextTriggerMillis)))) {
    throw new Error('El estado del recordatorio de Android no es válido.');
  }
  return value;
}
