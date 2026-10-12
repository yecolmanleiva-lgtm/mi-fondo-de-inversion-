import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Bell, Check, Download, ShieldCheck, Upload, Wallet} from 'lucide-react';
import {localParts, validateBackup} from '../functions/domain.mjs';
import {askConfirmation} from './confirm';
import {nativeBridge, readReminderStatus, type ReminderStatus} from './native';
import type {Portfolio, Settings} from './types';

type Props = {
  p: Portfolio;
  canExport: boolean;
  canWrite: boolean;
  busy: boolean;
  save: (op: string, data: unknown) => Promise<void>;
  run: (fn: () => Promise<void>) => Promise<void>;
  notify: (message: string, error?: boolean) => void;
};

export default function SettingsPage({p, canExport, canWrite, busy, save, run, notify}: Props) {
  const [status, setStatus] = useState<ReminderStatus | null>(null);
  const [statusError, setStatusError] = useState('');
  const [exporting, setExporting] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const native = !!nativeBridge();

  const refresh = () => {
    try {
      setStatus(readReminderStatus());
      setStatusError('');
    } catch (error) {
      setStatus(null);
      setStatusError(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    const backupDone = () => setExporting(false);
    refresh();
    window.addEventListener('native-status', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('native-backup', backupDone);
    document.addEventListener('visibilitychange', visible);
    return () => {
      window.removeEventListener('native-status', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('native-backup', backupDone);
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);

  const reminderAction = (action: 'enableReminders' | 'disableReminders' | 'testReminder' | 'openReminderSettings') => {
    void run(async () => {
      const bridge = nativeBridge();
      if (!bridge) throw new Error('Los recordatorios están disponibles en la aplicación Android.');
      bridge[action]();
      refresh();
      if (action === 'testReminder') notify(status?.exactAlarmsAllowed ? 'Prueba solicitada para dentro de 5 segundos. Comprueba la notificación en el teléfono.' : 'Prueba solicitada. Sin permiso de hora exacta, Android puede retrasarla. Comprueba la notificación en el teléfono.');
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const valuation = String(form.get('valuation'));
    // Retain legacy schedule fields for JSON compatibility. The Android reminder
    // is stored independently and always runs on the 7th at 08:00 Paraguay time.
    const settings: Settings = {
      ...p.settings,
      fundName: String(form.get('fundName')),
      monthly: Number(form.get('monthly')),
      goal: Number(form.get('goal')),
      day: Number(form.get('day')),
      time: String(form.get('time')),
      startMonth: String(form.get('startMonth')),
      theme: String(form.get('theme')) as Settings['theme'],
      valuation: valuation === '' ? null : Number(valuation),
      valuationDate: valuation === '' ? null : String(form.get('valuationDate')),
    };
    void run(async () => { await save('settings', settings); notify('Preferencias guardadas.'); });
  };

  const exportData = () => {
    const json = JSON.stringify({version: 1, exportedAt: new Date().toISOString(), settings: p.settings, entries: p.entries}, null, 2);
    const filename = `mi-fondo-${localParts().date}.json`;
    const bridge = nativeBridge();
    if (bridge) {
      setExporting(true);
      try { bridge.exportBackup(json, filename); }
      catch (error) { setExporting(false); notify(error instanceof Error ? error.message : String(error), true); }
      return;
    }
    const url = URL.createObjectURL(new Blob([json], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Descarga solicitada. Comprueba que el archivo se haya guardado.');
  };

  const reminderReady = !!status?.enabled && status.notificationsAllowed && !!status.nextTriggerMillis && !status.error;
  const reminderLabel = !native ? 'Vista previa: recordatorios disponibles en Android'
    : statusError ? 'No se pudo comprobar el recordatorio'
    : !status ? 'Comprobando recordatorio…'
    : !status.enabled ? 'Recordatorio desactivado'
    : !status.notificationsAllowed ? 'Falta permitir las notificaciones'
    : status.error ? 'El recordatorio necesita atención'
    : !status.nextTriggerMillis ? 'Recordatorio pendiente de programar'
    : status.exact ? 'Recordatorio mensual activado' : 'Recordatorio activado con hora aproximada';

  return <>
    <div className="page-heading"><div><div className="eyebrow">A TU MEDIDA</div><h1>Ajustes de mi fondo</h1><p>Tu plan, tus preferencias y tus recordatorios en este teléfono.</p></div></div>
    <section className="card cloud-choice"><h2>Tu fondo en este teléfono</h2><p className="muted">Tus aportes y preferencias se guardan en el dispositivo. Puedes usar la aplicación y recibir recordatorios sin internet. Exporta un respaldo antes de cambiar de teléfono o desinstalar la aplicación.</p></section>
    <form onSubmit={submit} key={p.revision} className="settings-form">
      <section className="card">
        <div className="section-heading"><h2><Wallet size={19}/>Tu plan de inversión</h2></div>
        <label>Nombre del fondo<input name="fundName" required maxLength={70} defaultValue={p.settings.fundName}/></label>
        <div className="form-grid">
          <label>Aporte mensual (Gs.)<input name="monthly" type="number" inputMode="numeric" required min="1" max="1000000000000" step="1" defaultValue={p.settings.monthly}/></label>
          <label>Meta financiera (Gs.)<input name="goal" type="number" inputMode="numeric" required min="1" max="1000000000000" step="1" defaultValue={p.settings.goal}/></label>
          <label>Inicio del plan<input name="startMonth" type="month" required min="2000-01" max="2099-12" defaultValue={p.settings.startMonth}/></label>
          <label>Apariencia<select name="theme" defaultValue={p.settings.theme}><option value="light">Claro</option><option value="dark">Oscuro</option><option value="system">Según el teléfono</option></select></label>
          <label>Día de aporte en el calendario<input name="day" type="number" min="1" max="31" required defaultValue={p.settings.day}/></label>
          <label>Hora del plan (Paraguay)<input name="time" type="time" required defaultValue={p.settings.time}/></label>
        </div>
        <p className="small muted">El importe mensual actual se usa para evaluar todos los meses del plan. Estas fechas organizan tu calendario; el recordatorio de Android permanece fijo el día 7 a las 08:00.</p>
      </section>
      <section className="card">
        <h2>Valor informado por el fondo <span className="muted small">Opcional</span></h2>
        <div className="form-grid"><label>Valor actual (Gs.)<input name="valuation" type="number" min="0" max="1000000000000" step="1" defaultValue={p.settings.valuation ?? ''} placeholder="Sin registrar"/></label><label>Fecha de la valoración<input name="valuationDate" type="date" min="2000-01-01" max={localParts().date} defaultValue={p.settings.valuationDate ?? ''}/></label></div>
        <p className="small muted">Introduce solamente el valor que te comunica el fondo. No calculamos ni inventamos rendimientos.</p>
      </section>
      <button className="button primary settings-save" disabled={!canWrite}><Check size={19}/>{busy ? 'Guardando…' : 'Guardar preferencias'}</button>
    </form>
    <div className="settings-grid">
      <section className="card">
        <div className="section-heading"><h2><Bell size={19}/>Recordatorio mensual</h2><span className="pill">Paraguay</span></div>
        <p><strong>Día 7 de cada mes · 08:00</strong><br/>Hora de Paraguay · America/Asuncion</p>
        <div className={'status '+(reminderReady ? 'success' : 'pending')} role="status"><span className="tiny-dot"/>{reminderLabel}</div>
        <p className="muted">Android programa el aviso en este teléfono y puede mostrarlo con la aplicación cerrada. El recordatorio mensual se mantiene aunque ya hayas registrado el aporte.</p>
        {status?.nextTriggerMillis && status.enabled ? <p className="small">Próximo aviso: {new Intl.DateTimeFormat('es-PY', {timeZone: 'America/Asuncion', dateStyle: 'long', timeStyle: 'short'}).format(new Date(status.nextTriggerMillis))}.</p> : null}
        {native && status && <p className="small muted">Notificaciones: {status.notificationsAllowed ? 'permitidas' : 'sin permiso'}. Hora exacta: {status.exactAlarmsAllowed ? 'permitida' : 'sin permiso; Android puede retrasar el aviso'}.</p>}
        {(statusError || status?.error) && <p className="small danger-text" role="alert">{statusError || status?.error}</p>}
        <div className="button-row">
          <button className="button primary" disabled={!native || busy} onClick={() => reminderAction('enableReminders')}><Bell size={17}/>{status?.enabled ? 'Reactivar' : 'Activar'}</button>
          <button className="button secondary" disabled={!native || busy || !status?.enabled} onClick={() => reminderAction('disableReminders')}>Desactivar</button>
          <button className="button secondary" disabled={!native || busy || !status?.notificationsAllowed} onClick={() => reminderAction('testReminder')}>Probar recordatorio</button>
          <button className="button secondary" disabled={!native || busy} onClick={() => reminderAction('openReminderSettings')}>Permisos de Android</button>
        </div>
        <p className="small muted">Si Android restringe los avisos, revisa los permisos y batería de Mi Fondo. Si fuerzas su detención, vuelve a abrirla para reactivar la programación.</p>
      </section>
      <div className="settings-right">
        <section className="card">
          <h2><ShieldCheck size={19}/>Copia de seguridad</h2>
          <p className="muted">Exporta tus aportes y preferencias. La restauración sustituye los datos actuales. Los respaldos JSON anteriores son compatibles; los permisos y la activación del recordatorio se administran en cada teléfono.</p>
          <div className="button-row"><button className="button secondary" disabled={!canExport || busy || exporting} onClick={exportData}><Download size={17}/>{exporting ? 'Elige dónde guardar…' : 'Exportar'}</button><button className="button secondary" disabled={!canWrite || exporting} onClick={() => input.current?.click()}><Upload size={17}/>Restaurar</button></div>
          <input ref={input} className="sr-only" type="file" accept="application/json,.json" onChange={event => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void run(async () => {
              if (file.size > 600000) throw new Error('El respaldo supera 600 KB.');
              const raw = JSON.parse(await file.text()), data = validateBackup(raw);
              if (await askConfirmation(`¿Reemplazar tus datos por ${data.entries.length} aportes del respaldo? Exporta primero si necesitas conservar los actuales.`)) {
                await save('restore', {version: 1, ...data});
                notify('Respaldo restaurado.');
              }
            });
          }}/>
          <p className="small muted">Capacidad de esta versión: 1.000 aportes. El archivo contiene información financiera y no está cifrado; guárdalo en un lugar privado.</p>
        </section>
        <section className="card"><h2>Siempre a mano</h2><p className="muted">La aplicación y tus registros están disponibles sin conexión. Puedes cerrarla y volver a abrirla para continuar donde dejaste tus aportes.</p><p className="small muted">Si borras los datos de la aplicación o la desinstalas, necesitarás tu respaldo JSON para recuperar los registros.</p></section>
      </div>
    </div>
  </>;
}
