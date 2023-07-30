# search_api/models.py
from django.contrib.auth.models import User
from django.db import models
import uuid

class APIKey(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    key = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return str(self.key)
