from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from common.models import common_attribute_model
from accounts.models import user_account

class user_payment(common_attribute_model):
    payment_mode = models.PositiveIntegerField(validators=[MinValueValidator(10000000),MaxValueValidator(999999999999999)], blank=True, null=True)
    user_account = models.ForeignKey(user_account, on_delete=models.PROTECT, blank=False, null=False)
    is_primary_payment_mode = models.BooleanField(default = False, blank=True, null=True)

class user_payment_credit_card_details(common_attribute_model):
    name_on_card = models.CharField(max_length=255, blank=False, null=False)
    card_number = models.CharField(max_length=20, blank=False, null=False)
    expiry_date = models.DateField(blank=False, null=False)
    security_code = models.IntegerField(blank=False, null=False)
    billing_address_address = models.CharField(max_length=255, blank=False, null=False)
    billing_address_country = models.CharField(max_length=100, blank=False, null=False)
    billing_address_city = models.CharField(max_length=100, blank=False, null=False)
    billing_address_post_code = models.CharField(max_length=100, blank=False, null=False)
    user_payment = models.ForeignKey(user_payment, on_delete=models.PROTECT, blank=True, null=True)

