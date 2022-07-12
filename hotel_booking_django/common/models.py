from django.db import models
import uuid

class common_attribute_model(models.Model):
    uid = models.UUIDField(primary_key=True, unique = True, default=uuid.uuid4, editable=False)
    is_deleted = models.BooleanField(default=False)
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_modified = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class country_code(common_attribute_model):
    country_id = models.CharField(max_length=5)
    country_name = models.CharField(max_length=100, blank=True, null=True)
    country_phone_code = models.CharField(max_length=10, blank=True, null=True)  

class country_currency(common_attribute_model):
    country = models.ForeignKey(country_code, on_delete=models.PROTECT)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    exchange_rate_date_updated = models.DateTimeField(blank=True, null=True)