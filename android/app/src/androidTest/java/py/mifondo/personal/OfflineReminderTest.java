package py.mifondo.personal;

import android.Manifest;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.ParcelFileDescriptor;
import android.os.SystemClock;
import android.service.notification.StatusBarNotification;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.io.FileOutputStream;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public final class OfflineReminderTest {
    private Context context;
    @Before public void prepare() throws Exception {
        context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        shell("pm grant " + context.getPackageName() + " android.permission.POST_NOTIFICATIONS");
        shell("appops set " + context.getPackageName() + " SCHEDULE_EXACT_ALARM allow");
        ReminderScheduler.disable(context);
        context.getSharedPreferences("monthly_reminder_private", Context.MODE_PRIVATE).edit().clear().commit();
        context.getSystemService(NotificationManager.class).cancelAll();
    }
    @After public void clean() {
        ReminderScheduler.disable(context);
        context.getSystemService(NotificationManager.class).cancelAll();
    }

    @Test public void completeInterfaceLoadsWithoutInternetPermission() throws Exception {
        assertEquals(PackageManager.PERMISSION_DENIED,
                context.checkSelfPermission(Manifest.permission.INTERNET));
        try (ActivityScenario<MainActivity> screen = ActivityScenario.launch(MainActivity.class)) {
            String text = "";
            for (int i = 0; i < 60; i++) {
                text = evaluate(screen, "document.body.innerText");
                if (text.contains("Ajustes") && text.contains("aporte")) break;
                SystemClock.sleep(250);
            }
            assertTrue("La interfaz financiera debe cargar desde el APK: " + text,
                    text.contains("Ajustes") && text.contains("aporte"));
            String bridge = evaluate(screen, "JSON.parse(window.MiFondoNative.getReminderStatus()).timezone");
            assertTrue(bridge.contains("America/Asuncion"));
            Bitmap screenshot = InstrumentationRegistry.getInstrumentation().getUiAutomation().takeScreenshot();
            assertNotNull(screenshot);
            try (FileOutputStream output = new FileOutputStream(new File(context.getCacheDir(), "ui-offline.png"))) {
                screenshot.compress(Bitmap.CompressFormat.PNG, 100, output);
            }
        }
    }

    @Test public void localAlarmNotifiesAfterActivityClosesAndDoesNotChangeMonthlyDate() throws Exception {
        ActivityScenario<MainActivity> screen = ActivityScenario.launch(MainActivity.class);
        try {
            ReminderScheduler.Status monthly = ReminderScheduler.enable(context);
            assertTrue(monthly.notificationsAllowed);
            assertTrue(monthly.exact);
            ZonedDateTime due = Instant.ofEpochMilli(monthly.nextTriggerMillis).atZone(ReminderCalendar.ZONE);
            assertEquals(7, due.getDayOfMonth());
            assertEquals(8, due.getHour());
            assertEquals(0, due.getMinute());
            assertTrue(monthly.nextTriggerMillis > System.currentTimeMillis());
            assertTrue(ReminderScheduler.scheduleTest(context));
            screen.close();
            long deadline = SystemClock.elapsedRealtime() + 25000;
            boolean found = false;
            while (SystemClock.elapsedRealtime() < deadline && !found) {
                for (StatusBarNotification notice : context.getSystemService(NotificationManager.class).getActiveNotifications()) {
                    if ("Prueba de notificación".equals(notice.getNotification().extras.getString("android.subText"))) found = true;
                }
                if (!found) SystemClock.sleep(250);
            }
            assertTrue("Android debe mostrar el aviso local después de cerrar la Activity", found);
            assertEquals(monthly.nextTriggerMillis, ReminderScheduler.getStatus(context).nextTriggerMillis);
            ReminderScheduler.reschedule(context);
            assertEquals(monthly.nextTriggerMillis, ReminderScheduler.getStatus(context).nextTriggerMillis);
            ReminderScheduler.disable(context);
            ReminderScheduler.reschedule(context);
            assertFalse(ReminderScheduler.getStatus(context).enabled);
            assertEquals(0L, ReminderScheduler.getStatus(context).nextTriggerMillis);
            PendingIntent alarm = PendingIntent.getBroadcast(context, 7008,
                    new Intent(context, ReminderReceiver.class).setAction(ReminderScheduler.MONTHLY_ACTION),
                    PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
            assertNull("Desactivar debe cancelar también la alarma de Android", alarm);
        } finally { screen.close(); }
    }

    private static String evaluate(ActivityScenario<MainActivity> screen, String script) throws Exception {
        CountDownLatch done = new CountDownLatch(1);
        AtomicReference<String> result = new AtomicReference<>();
        screen.onActivity(activity -> {
            WebView web = findWeb(activity.getWindow().getDecorView());
            assertNotNull(web);
            web.evaluateJavascript(script, value -> { result.set(value); done.countDown(); });
        });
        assertTrue("JavaScript debe responder", done.await(5, TimeUnit.SECONDS));
        return result.get() == null ? "" : result.get();
    }
    private static WebView findWeb(View view) {
        if (view instanceof WebView) return (WebView) view;
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int i=0; i<group.getChildCount(); i++) {
                WebView web = findWeb(group.getChildAt(i));
                if (web != null) return web;
            }
        }
        return null;
    }
    private static void shell(String command) throws Exception {
        try (ParcelFileDescriptor fd = InstrumentationRegistry.getInstrumentation().getUiAutomation().executeShellCommand(command);
             ParcelFileDescriptor.AutoCloseInputStream in = new ParcelFileDescriptor.AutoCloseInputStream(fd)) {
            byte[] buffer = new byte[1024];
            while (in.read(buffer) != -1) { /* drain before continuing */ }
        }
    }
}
