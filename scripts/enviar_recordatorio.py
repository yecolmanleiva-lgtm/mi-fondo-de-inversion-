"""Un único destinatario. Nunca imprimir credenciales, tokens ni errores completos."""
import base64
import hashlib
import json
import os
import sys
from datetime import datetime
from zoneinfo import ZoneInfo
from urllib.error import HTTPError
from urllib.request import Request, urlopen

URL = "https://yecolmanleiva-lgtm.github.io/mi-fondo-de-inversion-/"
TITLE = "🔔 Recordatorio de aporte mensual"
BODY = "Hoy es día de realizar tu aporte al fondo de inversión. ¡Cada aporte te acerca a tu meta!"


def plan(event, mode, run_id, now):
    if event == "schedule":
        local = now.astimezone(ZoneInfo("America/Asuncion"))
        if local.day != 7 or local.hour < 8:
            return None
        return ("aporte-" + local.strftime("%Y-%m"), False, True)
    if event != "workflow_dispatch" or mode not in ("validar", "enviar-prueba"):
        raise ValueError("Modo de ejecución no permitido")
    if not run_id.isdigit():
        raise ValueError("Identificador de ejecución inválido")
    return ("prueba-" + run_id, mode == "validar", False)


def github(method, path, data=None):
    req = Request("https://api.github.com/repos/" + os.environ["GITHUB_REPOSITORY"] + path,
                  method=method, data=None if data is None else json.dumps(data).encode(),
                  headers={"Authorization": "Bearer " + os.environ["GITHUB_TOKEN"],
                           "Accept": "application/vnd.github+json", "User-Agent": "MiFondo",
                           "Content-Type": "application/json"})
    with urlopen(req, timeout=30) as response:
        return json.load(response)


def claim_month(event_id):
    # El commit registra actividad mensual y bloquea repeticiones aun tras reiniciar el runner.
    path = "/contents/.github/recordatorios/" + event_id + ".json"
    try:
        github("GET", path + "?ref=main")
        return None
    except HTTPError as error:
        if error.code != 404:
            raise
    record = {"id": event_id, "estado": "intento-reservado", "run_id": os.environ["GITHUB_RUN_ID"]}
    result = write_record(path, record)
    return path, record, result["content"]["sha"]


def write_record(path, record, sha=None):
    data = {"message": "Registrar recordatorio mensual " + record["id"], "branch": "main",
            "content": base64.b64encode((json.dumps(record, indent=2) + "\n").encode()).decode()}
    if sha:
        data["sha"] = sha
    return github("PUT", path, data)


def main():
    from firebase_admin import initialize_app, credentials, messaging
    selected = plan(os.environ["GITHUB_EVENT_NAME"], os.environ["MODO"],
                    os.environ["GITHUB_RUN_ID"], datetime.now(ZoneInfo("UTC")))
    if selected is None:
        print("Fuera del día/horario autorizado; no se envía.")
        return
    event_id, dry_run, monthly = selected
    account = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
    token = os.environ["FCM_TOKEN"].strip()
    if account.get("project_id") != "mi-fondo-de-inversion":
        raise ValueError("La cuenta de servicio pertenece a otro proyecto")
    if not token or any(c.isspace() for c in token):
        raise ValueError("FCM_TOKEN vacío o con espacios internos")
    if dry_run:
        print("Código de comparación del destinatario: " + hashlib.sha256(token.encode()).hexdigest()[:12])
    initialize_app(credentials.Certificate(account))
    # token es correcto para getToken(); NO sustituirlo por fid: son identificadores distintos.
    message = messaging.Message(token=token, data={
        "id": event_id, "title": TITLE if monthly else "🧪 Prueba de Mi Fondo",
        "body": BODY if monthly else "Esta es una prueba. Si la ves, confirmá la recepción.",
        "url": URL,
    }, webpush=messaging.WebpushConfig(headers={"Urgency": "high", "TTL": "86400"}))
    claimed = claim_month(event_id) if monthly else None
    if monthly and claimed is None:
        print("Este mes ya tiene un intento registrado; no se duplica.")
        return
    # No reintentar automáticamente tras un resultado incierto. El SW deduplica por data.id.
    messaging.send(message, dry_run=dry_run)
    print("Validación aceptada por FCM; NO se entregó ninguna notificación." if dry_run else
          "FCM aceptó el mensaje. La recepción en el Xiaomi está pendiente de confirmar.")
    if claimed:
        path, record, sha = claimed
        record["estado"] = "aceptado-por-fcm"
        write_record(path, record, sha)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        # Algunos mensajes de excepciones incluyen destinos o detalles de credenciales.
        code = str(getattr(error, "code", ""))
        safe_code = code if code.replace("-", "").replace("_", "").isalnum() else ""
        print("::error::No se completó el envío: " + type(error).__name__ + " " + safe_code)
        print("Revisar secretos/proyecto/permisos. Un token UNREGISTERED debe renovarse desde el Xiaomi.")
        sys.exit(1)
