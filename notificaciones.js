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

async function activarNotificaciones() {
  try {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Este dispositivo no admite notificaciones.");
      return;
    }

    const permiso = await Notification.requestPermission();

    if (permiso !== "granted") {
      alert("No se concedió permiso para las notificaciones.");
      return;
    }

    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"
    );

    const { getMessaging, getToken } = await import(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js"
    );

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    const registro = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registro
    });

    if (!token) {
      alert("No se pudo registrar este dispositivo.");
      return;
    }

    alert("¡Notificaciones activadas correctamente!");
    console.log("Token FCM:", token);
    const copiar = confirm(
  "¿Querés copiar el identificador de este celular para probar las notificaciones?"
);

if (copiar) {
  try {
    await navigator.clipboard.writeText(token);
    alert("¡Identificador copiado!");
  } catch (error) {
    alert("No se pudo copiar el identificador.");
  }
}
  } catch (error) {
    console.error("Error al activar notificaciones:", error);
    alert("No se pudieron activar las notificaciones.");
  }
}

window.activarNotificaciones = activarNotificaciones;