from django.db import models
from common.models import common_attribute_model, country_code
from accounts.models import user_account
from payment.models import user_payment_credit_card_details

# Create your models here.
class booking_order(common_attribute_model):

    # payee id = user id
    user_account = models.ForeignKey(user_account, on_delete=models.PROTECT, blank=True, null=True)
    hotel_id = models.CharField(max_length=255, blank=True, null=True)
    room_type_id = models.CharField(max_length=255, blank=True, null=True)
    booking_id = models.CharField(max_length=255, blank=True, null=True)
    check_in_date = models.DateField(blank=True, null=True)
    check_out_date = models.DateField(blank=True, null=True)
    number_of_rooms = models.IntegerField(blank=True, null=True)
    number_of_guests_per_rooms = models.IntegerField(blank=True, null=True)
    special_request = models.CharField(max_length=500, blank=True, null=True)
    titles = (
        ('MR','Mr.'),
        ('MS', 'Ms.'),
        ('MRS', 'Mrs.'),
    )
    primary_guest_title = models.CharField(max_length=3, choices=titles, blank=True, null=True)
    primary_guest_first_name = models.CharField(max_length=100, blank=True, null=True)
    primary_guest_last_name = models.CharField(max_length=100, blank=True, null=True)
    primary_guest_phone = models.CharField(max_length=100, blank=True, null=True)
    primary_guest_phone_country = models.ForeignKey(country_code, related_name="primary_guest_phone_country", on_delete=models.PROTECT, blank=True, null=True)
    primary_guest_passport_number = models.CharField(max_length=100, blank=True, null=True)
    primary_guest_passport_country = models.ForeignKey(country_code, related_name="primary_guest_passport_country", on_delete=models.PROTECT, blank=True, null=True)
    #promotion_json
    #cost_breaking_Down
    cost_in_sgd  = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)

    # format in YYYY-MM-DD HH:MM
    datetime_created = models.DateTimeField(auto_now_add=True)

    # the payment details for the booking order
    payment_id = models.ForeignKey(user_payment_credit_card_details, on_delete=models.PROTECT, blank=True, null=True)

    # to be updated during deployment
    booking_terms_and_condition = "This is a sample booking terms and condition"
    hotel_terms_and_condition = "This is a sample hotel terms and condition"
    booking_tnc = models.CharField(max_length = 1000, default = booking_terms_and_condition)
    hotel_tnc = models.CharField(max_length = 1000, default = hotel_terms_and_condition)


class secondary_guests(common_attribute_model):
    booking_id =  models.IntegerField(blank=True, null=True)
    titles = (
        ('MR','Mr.'),
        ('MS', 'Ms.'),
        ('MRS', 'Mrs.'),
    )
    secondary_guest_title = models.CharField(max_length=3, choices=titles, blank=True, null=True)
    secondary_guest_first_name = models.CharField(max_length=100, blank=True, null=True)
    secondary_guest_last_name = models.CharField(max_length=100, blank=True, null=True)
    #secondary_guest_phone = models.CharField(max_length=100)
    #secondary_guest_phone_country = models.ForeignKey(country_code, on_delete=models.PROTECT)
    secondary_guest_passport_number = models.CharField(max_length=100, blank=True, null=True)
    secondary_guest_passport_country = models.ForeignKey(country_code, on_delete=models.PROTECT, blank=True, null=True)
