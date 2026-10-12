package py.mifondo.personal;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int IMPORT = 41, EXPORT = 42, NOTIFICATIONS = 43;
    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingBackup;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        FrameLayout root = new FrameLayout(this);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Solo archivos elegidos explícitamente en el selector.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                Uri uri = req.getUrl();
                if ("https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())) {
                    WebResourceResponse local = loader.shouldInterceptRequest(uri);
                    if (local != null) return local;
                }
                // Esta app no tiene permiso INTERNET y nunca carga código remoto.
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
                        new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri uri = req.getUrl();
                return !("https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost()));
            }
            @Override public void onPageFinished(WebView view, String url) { notifyStatus(); }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
                try { startActivityForResult(intent, IMPORT); }
                catch (Exception e) { fileCallback.onReceiveValue(null); fileCallback=null; toast("No se pudo abrir el selector de archivos."); }
                return true;
            }
        });
        web.addJavascriptInterface(new NativeBridge(), "MiFondoNative");
        web.loadUrl(ORIGIN + "/www/index.html");
        ReminderScheduler.reschedule(this);
    }

    private final class NativeBridge {
        @JavascriptInterface public String getReminderStatus() {
            return ReminderScheduler.getStatusJson(MainActivity.this);
        }
        @JavascriptInterface public void enableReminders() { runOnUiThread(() -> {
            ReminderScheduler.enable(MainActivity.this);
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
                requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATIONS);
            else askForExactAlarmIfNeeded();
            notifyStatus();
        }); }
        @JavascriptInterface public void disableReminders() { runOnUiThread(() -> {
            ReminderScheduler.disable(MainActivity.this); notifyStatus();
        }); }
        @JavascriptInterface public void testReminder() { runOnUiThread(() -> {
            if (ReminderScheduler.scheduleTest(MainActivity.this))
                toast("Prueba programada. Podés cerrar la app para comprobarla.");
            else toast("Permití las notificaciones de Mi Fondo antes de probar.");
            notifyStatus();
        }); }
        @JavascriptInterface public void openReminderSettings() { runOnUiThread(() -> {
            if (!ReminderScheduler.getStatus(MainActivity.this).notificationsAllowed) {
                Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                        .putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName());
                startActivity(intent);
            } else if (Build.VERSION.SDK_INT >= 31 && !getSystemService(android.app.AlarmManager.class).canScheduleExactAlarms()) {
                startActivity(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:"+getPackageName())));
            } else startActivity(new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE,getPackageName()));
        }); }
        @JavascriptInterface public void exportBackup(String json, String filename) { runOnUiThread(() -> {
            try {
                if (pendingBackup != null) throw new IllegalStateException("Ya hay un respaldo pendiente");
                if (json == null || json.getBytes(StandardCharsets.UTF_8).length > 600000) throw new IllegalArgumentException("Tamaño inválido");
                JSONObject parsed = new JSONObject(json);
                if (parsed.optInt("version") != 1 || !parsed.has("entries") || !parsed.has("settings")) throw new IllegalArgumentException("Formato inválido");
                pendingBackup = json;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("application/json").putExtra(Intent.EXTRA_TITLE,
                        filename != null && filename.matches("mi-fondo-[0-9-]+\\.json") ? filename : "mi-fondo-respaldo.json");
                startActivityForResult(intent, EXPORT);
            } catch (Exception e) { pendingBackup=null; backupResult(false,"No se pudo preparar el respaldo."); }
        }); }
    }

    private void askForExactAlarmIfNeeded() {
        if (Build.VERSION.SDK_INT >= 31 && !getSystemService(android.app.AlarmManager.class).canScheduleExactAlarms()) {
            new AlertDialog.Builder(this).setTitle("Recordatorio a las 08:00")
                    .setMessage("Permití alarmas y recordatorios para respetar la hora. Sin ese permiso, Android puede retrasar el aviso.")
                    .setPositiveButton("Permitir",(dialog,which)->startActivity(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,Uri.parse("package:"+getPackageName()))))
                    .setNegativeButton("Después",null).show();
        }
    }
    @Override public void onRequestPermissionsResult(int code,String[] permissions,int[] grants) {
        super.onRequestPermissionsResult(code,permissions,grants);
        if(code==NOTIFICATIONS) { ReminderScheduler.reschedule(this); if(grants.length>0&&grants[0]==PackageManager.PERMISSION_GRANTED)askForExactAlarmIfNeeded(); notifyStatus(); }
    }
    @Override protected void onResume() {
        super.onResume(); ReminderScheduler.reschedule(this); notifyStatus();
    }
    private void notifyStatus() {
        if(web!=null)web.post(()->web.evaluateJavascript("window.dispatchEvent(new Event('native-status'))",null));
    }
    private void toast(String text) {Toast.makeText(this,text,Toast.LENGTH_LONG).show();}
    private void backupResult(boolean ok,String message) {
        try {JSONObject detail=new JSONObject();detail.put("ok",ok);detail.put("message",message);
            web.evaluateJavascript("window.dispatchEvent(new CustomEvent('native-backup',{detail:"+detail+"}))",null);
        } catch(Exception ignored) {toast(message);}
    }
    @Override protected void onActivityResult(int code,int result,Intent data) {
        super.onActivityResult(code,result,data);
        if(code==IMPORT&&fileCallback!=null){fileCallback.onReceiveValue(result==RESULT_OK&&data!=null&&data.getData()!=null?new Uri[]{data.getData()}:null);fileCallback=null;}
        if(code==EXPORT){
            String json=pendingBackup;pendingBackup=null;
            if(result!=RESULT_OK||data==null||data.getData()==null||json==null){backupResult(false,"Exportación cancelada; tus datos siguen en la app.");return;}
            try(OutputStream out=getContentResolver().openOutputStream(data.getData(),"wt")) {
                if(out==null)throw new IllegalStateException();out.write(json.getBytes(StandardCharsets.UTF_8));out.flush();
                backupResult(true,"Respaldo guardado. Conservá el archivo en un lugar privado.");
            }catch(Exception e){backupResult(false,"No se pudo guardar el respaldo. Probá otra ubicación.");}
        }
    }
    @Override public void onBackPressed() { if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed(); }
    @Override protected void onDestroy() {if(fileCallback!=null)fileCallback.onReceiveValue(null);if(web!=null){web.removeJavascriptInterface("MiFondoNative");web.destroy();}super.onDestroy();}
}
