from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from common.models import common_attribute_model, country_code
from accounts.models import user_account

class user_payment(common_attribute_model):
    payment_mode = models.PositiveIntegerField(validators=[MinValueValidator(10000000),MaxValueValidator(999999999999999)], blank=True, null=True)
    user_account = models.ForeignKey(user_account, on_delete=models.PROTECT, blank=True, null=True)
    is_primary_payment_mode = models.BooleanField(default = False, blank=True, null=True)

class user_payment_credit_card_details(common_attribute_model):
    name_on_card = models.CharField(max_length=255, blank=True, null=True)
    card_number = models.CharField(max_length=20, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    security_code = models.IntegerField(blank=True, null=True)
    billing_address_address = models.CharField(max_length=255, blank=True, null=True)
    billing_address_country = models.ForeignKey(country_code, on_delete=models.PROTECT, blank=True, null=True)
    billing_address_city = models.CharField(max_length=100, blank=True, null=True)
    billing_address_post_code = models.CharField(max_length=100, blank=True, null=True)
    user_payment = models.ForeignKey(user_payment, on_delete=models.PROTECT, blank=True, null=True)


class booking_payment(common_attribute_model):
    name_on_card = models.CharField(max_length=255, blank=True, null=True)
    payment_mode = models.PositiveIntegerField(validators=[MinValueValidator(10000000),MaxValueValidator(999999999999999)], blank=True, null=True)
    # booking_order = models.ForeignKey(booking_order, on_delete=models.CASCADE, blank=True, null=True)

class booking_payment_credit_card_details(common_attribute_model):
    name_on_card = models.CharField(max_length=255, blank=True, null=True)
    card_number = models.IntegerField(blank=True, null=True)
    expiry_date = models.IntegerField(blank=True, null=True)
    security_code = models.IntegerField(blank=True, null=True)
    billing_address_address = models.CharField(max_length=255, blank=True, null=True)
    billing_address_country = models.ForeignKey(country_code,  on_delete=models.CASCADE, blank=True, null=True)
    billing_address_city = models.CharField(max_length=100, blank=True, null=True)
    billing_address_post_code = models.CharField(max_length=100, blank=True, null=True)
    booking_payment = models.ForeignKey(booking_payment, on_delete=models.CASCADE, blank=True, null=True)
