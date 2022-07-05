from django.db import models
from common.models import common_attribute_model, country_code
from accounts.models import user_account
from payment.models import booking_payment
# Create your models here.
class booking_order(common_attribute_model):
    user_account = models.ForeignKey(user_account, on_delete=models.PROTECT, blank=True, null=True)
    hotel_id = models.CharField(max_length=255, blank=True, null=True)
    room_type_id = models.CharField(max_length=255, blank=True, null=True)
    booking_id = models.CharField(max_length=255, blank=True, null=True)
    check_in_date = models.DateField(blank=True, null=True)
    check_out_date = models.DateField(blank=True, null=True)
    number_of_rooms = models.IntegerField(blank=True, null=True)
    number_of_guests_per_rooms = models.IntegerField(blank=True, null=True)
    special_request = models.IntegerField(blank=True, null=True)
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

    # payee id can be accessed under payment_id
    payment_id = models.ForeignKey(booking_payment, on_delete=models.PROTECT, blank=True, null=True)

    # format in YYYY-MM-DD HH:MM
    datetime_created = models.DateTimeField(auto_now_add=True)

    # to be updated during deployment
    booking_link = r"https://localhost:8000/booking_tnc"
    hotel_link = r"https://localhost:8000/hotel_tnc"
    booking_tnc = models.URLField(max_length = 200, default = booking_link)
    hotel_tnc = models.URLField(max_length = 200, default = hotel_link)


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
