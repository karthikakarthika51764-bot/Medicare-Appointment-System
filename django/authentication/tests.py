from unittest.mock import patch

from django.core.cache import cache
from django.core import mail
from django.test import override_settings
from rest_framework.test import APITestCase


class FakeCollection:
    def __init__(self, documents):
        self.documents = documents

    def create_index(self, *args, **kwargs):
        return None

    def find_one(self, query):
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document.copy()
        return None

    def replace_one(self, query, document, upsert=False):
        for index, existing in enumerate(self.documents):
            if all(existing.get(key) == value for key, value in query.items()):
                replacement = document.copy()
                replacement["_id"] = existing.get("_id", len(self.documents))
                self.documents[index] = replacement
                return
        replacement = document.copy()
        replacement["_id"] = len(self.documents)
        self.documents.append(replacement)

    def delete_one(self, query):
        self.documents[:] = [
            document for document in self.documents
            if not all(document.get(key) == value for key, value in query.items())
        ]

    def insert_one(self, document):
        if self.find_one({"email": document["email"]}):
            raise RuntimeError("duplicate")
        document = document.copy()
        document["_id"] = len(self.documents)
        self.documents.append(document)

    def update_one(self, query, update):
        document = self.find_one(query)
        if not document:
            return type("Result", (), {"matched_count": 0})()
        document.update(update.get("$set", {}))
        for index, existing in enumerate(self.documents):
            if existing.get("_id") == document.get("_id"):
                self.documents[index] = document
        return type("Result", (), {"matched_count": 1})()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    USE_DEFAULT_STATIC_OTP=True,
)
class EmailPasswordAuthTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.addCleanup(cache.clear)

    def test_register_verify_and_login(self):
        register = self.client.post(
            "/api/register/",
            {"name": "Patient One", "email": "patient@example.com", "password": "strongpass"},
            format="json",
        )
        self.assertEqual(register.status_code, 200)
        self.assertIn("123456", mail.outbox[0].body)

        verify = self.client.post(
            "/api/verify-registration/",
            {"email": "PATIENT@EXAMPLE.COM", "otp": "123456"},
            format="json",
        )
        self.assertEqual(verify.status_code, 201)
        self.assertTrue(verify.data["access"])

        login = self.client.post(
            "/api/login/",
            {"email": "patient@example.com", "password": "strongpass"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertTrue(login.data["refresh"])

    def test_forgot_password_resets_password_once(self):
        self.client.post(
            "/api/register/",
            {"name": "Patient One", "email": "patient@example.com", "password": "strongpass"},
            format="json",
        )
        self.client.post(
            "/api/verify-registration/",
            {"email": "patient@example.com", "otp": "123456"},
            format="json",
        )
        forgot = self.client.post("/api/forgot-password/", {"email": "patient@example.com"}, format="json")
        self.assertEqual(forgot.status_code, 200)
        reset = self.client.post(
            "/api/reset-password/",
            {"email": "patient@example.com", "otp": "123456", "password": "newstrongpass"},
            format="json",
        )
        self.assertEqual(reset.status_code, 200)
        reused = self.client.post(
            "/api/reset-password/",
            {"email": "patient@example.com", "otp": "123456", "password": "anotherpass"},
            format="json",
        )
        self.assertEqual(reused.status_code, 400)
