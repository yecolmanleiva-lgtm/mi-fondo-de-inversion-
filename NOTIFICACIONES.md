# Recordatorio mensual

Día 7, 08:00 America/Asuncion (11:00 UTC). GitHub Actions puede retrasar o perder una ejecución bajo carga; no es una alarma exacta. El Xiaomi necesita conectividad y permiso de notificaciones. No depende de la computadora.

## Cambios mínimos
- Se corrigió el SyntaxError confirmado en los logs de la ejecución 38172279000: un segundo Message quedó sin cerrar y faltaba send.
- Se envía un mensaje data con id/title/body/url, que coincide con el receptor ya instalado. La ruta al tocarlo apunta a la subcarpeta correcta.
- Se añadió recepción en primer plano. Se quitó la impresión del token en consola.
- El SDK se fija en 7.7.0. La advertencia de token obsoleto no era el error fatal: el destino sigue siendo un token obtenido por getToken, no un FID.
- .github/recordatorios guarda solo mes, estado e identificador de ejecución. Se reserva antes de enviar: repetir una ejecución mensual no reenvía. Además, el receptor guarda los ids recibidos. La actividad de estos commits mensuales evita el repositorio inactivo; si pasan 60 días sin actividad, GitHub puede desactivar la programación y debe revisarse Actions.

Un fallo después de reservar un mes deja un resultado incierto y requiere revisión; no se reintenta ciegamente. Una prueba manual usa otro identificador por ejecución; repetir el mismo run conserva el identificador. No hay garantía de entrega exactamente una vez ante todas las fallas.

## Prueba coordinada
Actions → Recordatorio mensual → Run workflow. modo=validar comprueba FCM sin entregar; modo=enviar-prueba envía solo al secreto FCM_TOKEN. No ejecutar pruebas sin avisar a quien tiene el teléfono. FCM aceptado NO equivale a recepción visible.

Para actualizar el receptor en primer plano, abrir la app con Internet y volver a abrirla. No desinstalar ni borrar almacenamiento. Los mensajes data en segundo plano son compatibles con el sw.js ya publicado. No se modificó ese archivo ni los bundles de aportes/cálculos, ni el manifiesto/URL de instalación. Si la app aún tiene un worker antiguo anterior a Firebase, cerrar todas sus ventanas y abrirla de nuevo; no borrar datos.

Los aportes siguen en IndexedDB mi-fondo-personal del teléfono; existe exportación JSON en Ajustes. Usar esa exportación como respaldo. No se accedió a los registros del Xiaomi desde esta computadora.

Si FCM devuelve UNREGISTERED, copiar el identificador desde el Xiaomi y reemplazar únicamente el secreto FCM_TOKEN en GitHub. No publicar el identificador ni las credenciales. El registro del navegador no confirma que GitHub tenga ese mismo token; no hay renovación automática del secreto.

Fuentes: https://firebase.google.com/docs/cloud-messaging/web/receive-messages ; https://firebase.google.com/support/release-notes/admin/python ; https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
