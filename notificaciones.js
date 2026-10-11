const firebaseConfig = {
  apiKey: "AIzaSyDXoAjd4mRkhCTfUUUzzy650sE5N9jyovw",
  authDomain: "mi-fondo-de-inversion.firebaseapp.com",
  projectId: "mi-fondo-de-inversion",
  storageBucket: "mi-fondo-de-inversion.firebasestorage.app",
  messagingSenderId: "1064935832439",
  appId: "1:1064935832439:web:95bf7fa5bee1c2197d3f72"
};

const vapidKey =
  "BHiiODbBiqwKxqh6b6G7dCsLF1y-R7jMWs2iSJR2IGQbhP7d2Q-MavJ5uljteoJkJxuVZA-CwnoVMO5hBlr1tJ0";

let messagingPromise;
function prepararMensajeria() {
  if (!messagingPromise) messagingPromise = (async () => {
    const [{ initializeApp, getApps }, { getMessaging, getToken, onMessage }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js")
    ]);
    const app = getApps().find(app => app.options.appId === firebaseConfig.appId) || initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    onMessage(messaging, async payload => {
      const registro = await navigator.serviceWorker.ready;
      const data = payload.data?.id ? payload.data : {
        id: payload.messageId, title: payload.notification?.title,
        body: payload.notification?.body, url: new URL("./", location.href).href
      };
      // El SW existente muestra y deduplica; no crear una segunda notificación aquí.
      registro.active?.postMessage({ type: "PUSH", data });
    });
    return { messaging, getToken };
  })().catch(error => { messagingPromise = null; throw error; });
  return messagingPromise;
}
async function activarNotificaciones() {
  try {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Este dispositivo no admite notificaciones."); return;
    }
    if (await Notification.requestPermission() !== "granted") {
      alert("No se concedió permiso para las notificaciones."); return;
    }
    const { messaging, getToken } = await prepararMensajeria();
    const registro = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registro });
    if (!token) throw new Error("Sin token");
    if (confirm("Permiso activado. ¿Copiar el identificador para actualizar FCM_TOKEN en GitHub?")) {
      await navigator.clipboard.writeText(token);
      alert("Identificador copiado. Guardalo únicamente en el secreto FCM_TOKEN de GitHub.");
    }
  } catch {
    alert("No se pudo completar la activación o copia. Comprobá la conexión y los permisos.");
  }
}
window.activarNotificaciones = activarNotificaciones;
if ("Notification" in window && "serviceWorker" in navigator && Notification.permission === "granted") {
  prepararMensajeria().catch(() => console.warn("Recepción en primer plano no disponible; comprobá la conexión."));
}
