package py.mifondo.personal;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import org.json.JSONException;
import org.json.JSONObject;

/** Local-only monthly reminder. Call from the app's default process (minSdk 26). */
public final class ReminderScheduler {
    static final String MONTHLY_ACTION = "py.mifondo.personal.MONTHLY_REMINDER";
    static final String TEST_ACTION = "py.mifondo.personal.TEST_REMINDER";
    static final String EXTRA_DUE = "scheduled_due";
    private static final String PREFS = "monthly_reminder_private";
    private static final String ENABLED = "enabled";
    private static final String NEXT_DUE = "next_due";
    private static final String DELIVERED = "delivered_month";
    private static final String MODE = "schedule_mode";
    private static final String ERROR = "last_error";
    private static final String CHANNEL = "monthly_contribution";
    private static final int MONTHLY_REQUEST = 7008;
    private static final int TEST_REQUEST = 7009;
    private static final int MONTHLY_NOTIFICATION = 7008;
    private static final int TEST_NOTIFICATION = 7009;
    private static final Object LOCK = new Object();

    private ReminderScheduler() {}

    public static Status enable(Context context) {
        synchronized (LOCK) {
            Context app = context.getApplicationContext();
            SharedPreferences prefs = prefs(app);
            boolean wasEnabled = prefs.getBoolean(ENABLED, false);
            if (!prefs.edit().putBoolean(ENABLED, true).commit()) return storageError(app);
            // Repeated enable calls are harmless. A fresh enable never catches up immediately.
            if (wasEnabled) scheduleExistingOrFuture(app);
            else scheduleFuture(app, 0);
            return getStatus(app);
        }
    }

    public static Status disable(Context context) {
        synchronized (LOCK) {
            Context app = context.getApplicationContext();
            // Persist first so an already queued receiver cannot deliver after disable.
            if (!prefs(app).edit().putBoolean(ENABLED, false).putLong(NEXT_DUE, 0)
                    .putString(MODE, "none").remove(ERROR).commit()) return storageError(app);
            cancel(app, MONTHLY_ACTION, MONTHLY_REQUEST);
            return getStatus(app);
        }
    }

    /** Call on app resume and after notification/exact-alarm permission changes. */
    public static Status reschedule(Context context) {
        synchronized (LOCK) {
            Context app = context.getApplicationContext();
            SharedPreferences prefs = prefs(app);
            if (prefs.getBoolean(ENABLED, false)) scheduleExistingOrFuture(app);
            else cancel(app, MONTHLY_ACTION, MONTHLY_REQUEST);
            return getStatus(app);
        }
    }

    static void recoverAfterBoot(Context context) {
        synchronized (LOCK) {
            SharedPreferences prefs = prefs(context);
            if (!prefs.getBoolean(ENABLED, false)) return;
            long due = prefs.getLong(NEXT_DUE, 0);
            if (ReminderCalendar.isDeliverableToday(System.currentTimeMillis(), due,
                    prefs.getString(DELIVERED, ""))) {
                deliverMonthly(context, due);
            } else {
                scheduleFuture(context, due);
            }
        }
    }

    static void deliverMonthly(Context context, long expectedDue) {
        synchronized (LOCK) {
            SharedPreferences prefs = prefs(context);
            long due = prefs.getLong(NEXT_DUE, 0);
            if (!prefs.getBoolean(ENABLED, false) || expectedDue <= 0 || expectedDue != due) return;
            String previousMonth = prefs.getString(DELIVERED, "");
            long now = System.currentTimeMillis();
            if (ReminderCalendar.isDeliverableToday(now, due, previousMonth)
                    && notificationsAllowed(context)) {
                // Claim before posting: another broadcast cannot sound twice for this month.
                String month = ReminderCalendar.monthAt(due);
                if (prefs.edit().putString(DELIVERED, month).commit()) {
                    try {
                        notificationManager(context).notify(MONTHLY_NOTIFICATION, notification(context, false));
                    } catch (RuntimeException failure) {
                        prefs.edit().putString(DELIVERED, previousMonth).commit();
                    }
                }
            }
            // A delivery delayed beyond day 7 is skipped, then the next month is scheduled.
            scheduleFuture(context, due);
        }
    }

    /** Explicit user action: replace any pending test, independent of monthly enable/dedup. */
    public static boolean scheduleTest(Context context) {
        synchronized (LOCK) {
            if (!notificationsAllowed(context)) return false;
            try {
                setAlarm(context, System.currentTimeMillis() + 5_000,
                        pendingIntent(context, TEST_ACTION, TEST_REQUEST, 0));
                return true;
            } catch (RuntimeException failure) {
                return false;
            }
        }
    }

    /** Used by the test receiver, or directly by an explicit user test action. */
    public static boolean showTestNotification(Context context) {
        synchronized (LOCK) {
            if (!notificationsAllowed(context)) return false;
            try {
                notificationManager(context).notify(TEST_NOTIFICATION, notification(context, true));
                return true;
            } catch (RuntimeException failure) {
                return false;
            }
        }
    }

    public static Status getStatus(Context context) {
        synchronized (LOCK) {
            SharedPreferences prefs = prefs(context);
            boolean enabled = prefs.getBoolean(ENABLED, false);
            boolean exactAllowed = exactAlarmsAllowed(context);
            String error = prefs.getString(ERROR, "");
            String mode = prefs.getString(MODE, "none");
            // Android cancels exact alarms when this special access is revoked.
            if (enabled && "exact".equals(mode) && !exactAllowed && error.isEmpty()) {
                error = "El permiso de alarma exacta cambió; abre la app para reprogramar el aviso aproximado.";
            }
            return new Status(enabled, notificationsAllowed(context), exactAllowed,
                    enabled ? prefs.getLong(NEXT_DUE, 0) : 0,
                    enabled && "exact".equals(mode) && exactAllowed, error);
        }
    }

    public static String getStatusJson(Context context) { return getStatus(context).toJson(); }

    private static void scheduleExistingOrFuture(Context context) {
        SharedPreferences prefs = prefs(context);
        long due = prefs.getLong(NEXT_DUE, 0);
        long now = System.currentTimeMillis();
        // Keep a still-eligible delayed alarm when the user opens the app on day 7.
        // A first enable after 08:00 already persisted next month, so it cannot enter here.
        if (ReminderCalendar.isDeliverableToday(now, due, prefs.getString(DELIVERED, ""))) {
            installMonthly(context, due, now + 1_000);
        } else {
            scheduleFuture(context, due);
        }
    }

    private static void scheduleFuture(Context context, long previousDue) {
        SharedPreferences prefs = prefs(context);
        if (!prefs.getBoolean(ENABLED, false)) return;
        long due = ReminderCalendar.nextScheduledDue(System.currentTimeMillis(),
                prefs.getString(DELIVERED, ""), previousDue);
        installMonthly(context, due, due);
    }

    private static void installMonthly(Context context, long due, long triggerAt) {
        SharedPreferences prefs = prefs(context);
        // Store the logical occurrence before scheduling; the receiver rejects stale broadcasts.
        if (!prefs.edit().putLong(NEXT_DUE, due).putString(MODE, "none").remove(ERROR).commit()) return;
        try {
            boolean exact = setAlarm(context, triggerAt, pendingIntent(context, MONTHLY_ACTION, MONTHLY_REQUEST, due));
            prefs.edit().putString(MODE, exact ? "exact" : "inexact").remove(ERROR).commit();
        } catch (RuntimeException failure) {
            cancel(context, MONTHLY_ACTION, MONTHLY_REQUEST);
            prefs.edit().putLong(NEXT_DUE, 0).putString(MODE, "none")
                    .putString(ERROR, "No se pudo programar el recordatorio. Vuelve a abrir la app para reintentar.").commit();
        }
    }

    /** Return the mode actually installed, including a permission-race fallback. */
    private static boolean setAlarm(Context context, long triggerAt, PendingIntent operation) {
        AlarmManager alarms = alarmManager(context);
        if (exactAlarmsAllowed(context)) {
            try {
                alarms.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
                return true;
            } catch (SecurityException permissionChanged) {
                // Special access can change between the check and the scheduling call.
            }
        }
        alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
        return false;
    }

    private static PendingIntent pendingIntent(Context context, String action, int request, long due) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(action).putExtra(EXTRA_DUE, due);
        return PendingIntent.getBroadcast(context, request, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void cancel(Context context, String action, int request) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(action);
        PendingIntent pending = PendingIntent.getBroadcast(context, request, intent,
                PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
        if (pending != null) {
            alarmManager(context).cancel(pending);
            pending.cancel();
        }
    }

    private static Notification notification(Context context, boolean test) {
        ensureChannel(context);
        Intent open = new Intent().setClassName(context, "py.mifondo.personal.MainActivity")
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent content = PendingIntent.getActivity(context, 7010, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        int icon = context.getResources().getIdentifier("ic_stat_reminder", "drawable", context.getPackageName());
        if (icon == 0) icon = android.R.drawable.ic_dialog_info;
        String body = "Hoy es día de realizar tu aporte al fondo de inversión. ¡Cada aporte te acerca a tu meta!";
        Notification.Builder builder = new Notification.Builder(context, CHANNEL)
                .setSmallIcon(icon)
                .setContentTitle("🔔 Recordatorio de aporte mensual")
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setCategory(Notification.CATEGORY_REMINDER)
                .setContentIntent(content)
                .setAutoCancel(true);
        if (test) builder.setSubText("Prueba de notificación");
        return builder.build();
    }

    private static boolean notificationsAllowed(Context context) {
        ensureChannel(context);
        if (Build.VERSION.SDK_INT >= 33 && context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) return false;
        NotificationManager manager = notificationManager(context);
        NotificationChannel channel = manager.getNotificationChannel(CHANNEL);
        return manager.areNotificationsEnabled() && channel != null
                && channel.getImportance() != NotificationManager.IMPORTANCE_NONE;
    }

    private static void ensureChannel(Context context) {
        NotificationChannel channel = new NotificationChannel(CHANNEL, "Aporte mensual", NotificationManager.IMPORTANCE_DEFAULT);
        channel.setDescription("Recordatorio local del día 7 a las 08:00, hora de Asunción.");
        notificationManager(context).createNotificationChannel(channel);
    }

    private static boolean exactAlarmsAllowed(Context context) {
        return Build.VERSION.SDK_INT < 31 || alarmManager(context).canScheduleExactAlarms();
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    private static AlarmManager alarmManager(Context context) {
        return (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    }

    private static NotificationManager notificationManager(Context context) {
        return (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    private static Status storageError(Context context) {
        Status status = getStatus(context);
        return new Status(status.enabled, status.notificationsAllowed, status.exactAlarmsAllowed,
                status.nextTriggerMillis, status.exact, "No se pudo guardar la configuración local del recordatorio.");
    }

    public static final class Status {
        public final boolean enabled;
        public final boolean notificationsAllowed;
        public final boolean exactAlarmsAllowed;
        public final long nextTriggerMillis;
        public final boolean exact;
        public final String timezone = ReminderCalendar.TIMEZONE;
        public final String error;

        private Status(boolean enabled, boolean notificationsAllowed, boolean exactAlarmsAllowed,
                       long nextTriggerMillis, boolean exact, String error) {
            this.enabled = enabled;
            this.notificationsAllowed = notificationsAllowed;
            this.exactAlarmsAllowed = exactAlarmsAllowed;
            this.nextTriggerMillis = nextTriggerMillis;
            this.exact = exact;
            this.error = error;
        }

        public String toJson() {
            try {
                JSONObject json = new JSONObject().put("enabled", enabled)
                        .put("notificationsAllowed", notificationsAllowed)
                        .put("exactAlarmsAllowed", exactAlarmsAllowed)
                        .put("nextTriggerMillis", nextTriggerMillis)
                        .put("exact", exact).put("timezone", timezone);
                if (!error.isEmpty()) json.put("error", error);
                return json.toString();
            } catch (JSONException impossibleForTheseValues) {
                return "{\"enabled\":false,\"error\":\"No se pudo leer el estado local.\"}";
            }
        }
    }
}
