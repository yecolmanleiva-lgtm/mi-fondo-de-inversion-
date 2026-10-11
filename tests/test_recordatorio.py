import importlib.util
import unittest
from datetime import datetime, timezone
from unittest.mock import patch
from urllib.error import HTTPError
from pathlib import Path

spec = importlib.util.spec_from_file_location("reminder", Path(__file__).parents[1]/"scripts/enviar_recordatorio.py")
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

class ReminderTests(unittest.TestCase):
    def test_months_and_timezone(self):
        for month in range(1,13):
            result = m.plan("schedule", "mensual", "123", datetime(2027,month,7,11,tzinfo=timezone.utc))
            self.assertEqual(result, (f"aporte-2027-{month:02}",False,True))
    def test_no_early_or_wrong_day(self):
        for day,hour in [(7,10),(6,11),(8,11)]:
            self.assertIsNone(m.plan("schedule","mensual","123",datetime(2027,1,day,hour,tzinfo=timezone.utc)))
    def test_validation_does_not_send(self):
        self.assertEqual(m.plan("workflow_dispatch","validar","123",datetime.now()),("prueba-123",True,False))
    def test_reruns_have_same_id(self):
        self.assertEqual(m.plan("workflow_dispatch","enviar-prueba","123",datetime.now()),("prueba-123",False,False))
    def test_unknown_mode_rejected(self):
        with self.assertRaises(ValueError): m.plan("push","mensual","123",datetime.now())
    def test_claim_skips_existing(self):
        with patch.object(m,"github",return_value={}) as api:
            self.assertIsNone(m.claim_month("aporte-2027-01")); self.assertEqual(api.call_count,1)
    def test_claim_is_durable_before_send(self):
        missing=HTTPError("https://api.github.com",404,"not found",{},None)
        with patch.object(m,"github",side_effect=[missing,{"content":{"sha":"abc"}}]) as api, patch.dict(m.os.environ,{"GITHUB_RUN_ID":"123"}):
            self.assertEqual(m.claim_month("aporte-2027-01")[2],"abc")
            self.assertEqual(api.call_args.args[0],"PUT")
    def test_permission_error_does_not_send(self):
        with patch.object(m,"github",side_effect=HTTPError("https://api.github.com",403,"denied",{},None)):
            with self.assertRaises(HTTPError): m.claim_month("aporte-2027-01")

if __name__ == "__main__": unittest.main()
