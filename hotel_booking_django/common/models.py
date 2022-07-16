from django.db import models
import uuid

class common_attribute_model(models.Model):
    uid = models.UUIDField(primary_key=True, unique = True, default=uuid.uuid4, editable=False)
    is_deleted = models.BooleanField(default=False)
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_modified = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
