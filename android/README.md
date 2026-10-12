# Mi Fondo — Android personal

Aplicación Android 8.0 o posterior. La interfaz, los datos y las alarmas residen en el teléfono. No declara permiso INTERNET, no carga Firebase ni registra service workers. El recordatorio es el día 7 de cada mes a las 08:00 de America/Asuncion, independientemente de los aportes registrados.

## Uso y traslado de datos

1. En la aplicación anterior, Ajustes → Exportar. Conservar ese JSON.
2. Instalar el APK y abrir Mi Fondo. Ajustes → Restaurar permite recuperar ese archivo. Confirmar total e historial antes de retirar la versión anterior.
3. En Ajustes → Recordatorio mensual, pulsar Activar y conceder notificaciones y alarmas/recordatorios cuando Android lo solicite. Probar recordatorio permite comprobar un aviso unos segundos después de cerrar la pantalla de la app.

El almacenamiento de Chrome no se traslada automáticamente al APK. Exportar antes de desinstalar o borrar datos. La firma de actualización se conserva privadamente fuera de este repositorio.

## Compilación reproducible

Requiere Node 22, JDK 17, SDK Android 35. `cd web`, `npm ci`, `npm test`, `npm run build`. Copiar el contenido de `web/dist/` a `app/src/main/assets/www/`. Desde `android/`, ejecutar `./gradlew testDebugUnitTest assembleRelease` y, con emulador API 35, `./gradlew connectedDebugAndroidTest`.

El flujo manual `compilar-android.yml` hace esas comprobaciones y entrega un APK sin firmar. La firma se aplica localmente; ninguna clave privada de Android se envía al repositorio ni a GitHub. También puede compilarse firmado localmente con ANDROID_KEYSTORE_PATH y ANDROID_KEYSTORE_PASSWORD, alias mi-fondo.

## Límites de Android

La app cerrada normalmente permite recibir la alarma. Con el teléfono apagado no puede sonar; tras reiniciar y desbloquear se recupera un aviso pendiente solo durante el mismo día 7. Forzar detención exige volver a abrir la app. Sin permiso de alarmas exactas, Android puede retrasar la hora. Las restricciones de batería del fabricante pueden requerir un ajuste en el teléfono. La zona horaria usa los datos del sistema: mantener Android actualizado para las reglas de Paraguay.

El calendario financiero importado se conserva como estaba; sus preferencias de día/hora no cambian este recordatorio fijo. Las pruebas de notificación no alteran la próxima fecha mensual.
