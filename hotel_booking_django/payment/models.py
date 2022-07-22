from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from common.models import common_attribute_model
from accounts.models import user_account
from django_cryptography.fields import encrypt

class user_payment(common_attribute_model):
    payment_mode = models.PositiveIntegerField(validators=[MinValueValidator(10000000),MaxValueValidator(999999999999999)], blank=True, null=True)
    user_account = models.ForeignKey(user_account, on_delete=models.SET_NULL, blank=False, null=True)
    is_primary_payment_mode = models.BooleanField(default = False, blank=True, null=True)

class user_payment_credit_card_details(common_attribute_model):
    name_on_card = encrypt(models.CharField(max_length=255, blank=True, null=True))
    card_number = encrypt(models.CharField(max_length=20, blank=True, null=True))
    expiry_date = encrypt(models.DateField(blank=True, null=True))
    security_code = encrypt(models.CharField(max_length=3, blank=True, null=True))
    billing_address_address = encrypt(models.CharField(max_length=255, blank=True, null=True))
    billing_address_country = encrypt(models.CharField(max_length=100, blank=True, null=True))
    billing_address_city = encrypt(models.CharField(max_length=100, blank=True, null=True))
    billing_address_post_code = encrypt(models.CharField(max_length=100, blank=True, null=True))
    user_payment = models.ForeignKey(user_payment, on_delete=models.PROTECT, blank=True, null=True)

