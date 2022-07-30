from django.db import models
from common.models import common_attribute_model
from accounts.models import user_account
from payment.models import user_payment_credit_card_details
import uuid

# Create your models here.
class booking_order(common_attribute_model):

    # payee id = user id
    # when user account is deleted, the booking orderes created
    # by the user will also be deleted
    user_account = models.ForeignKey(user_account, on_delete=models.CASCADE, blank=False, null=True)
    destination_id = models.CharField(max_length=255, blank=False, null=False)
    hotel_id = models.CharField(max_length=255, blank=False, null=False)
    
    hotel_name = models.CharField(max_length=255, blank=True, null=True)
    room_type = models.CharField(max_length=255, blank=True, null=True)
    destination_region = models.CharField(max_length=255, blank=True, null=True)
    
    room_type_id = models.CharField(max_length=255, blank=False, null=False)
    room_breakfast_info = models.CharField(max_length=255, blank=False, null=False)
    
    
    booking_id = models.CharField(max_length=255, blank=True, null=True)
    check_in_date = models.DateField(blank=False, null=False)
    check_out_date = models.DateField(blank=False, null=False)
    number_of_rooms = models.IntegerField(blank=False, null=False)
    number_of_guests_per_rooms = models.IntegerField(blank=False, null=False)
    special_request = models.CharField(max_length=500, blank=True, null=True)
    titles = (
        ('MR','Mr.'),
        ('MS', 'Ms.'),
        ('MRS', 'Mrs.'),
    )
    primary_guest_title = models.CharField(max_length=3, choices=titles, blank=False, null=False)
    primary_guest_first_name = models.CharField(max_length=100, blank=False, null=False)
    primary_guest_last_name = models.CharField(max_length=100, blank=False, null=False)
    primary_guest_email = models.CharField(max_length=100, blank=False, null=False)
    primary_guest_phone = models.CharField(max_length=100, blank=False, null=False)
    primary_guest_phone_country = models.CharField(max_length=200, blank=False, null=False)
    did_primary_guest_accept_tnc = models.BooleanField(blank=False, null=False)
    #promotion_json
    #cost_breaking_Down
    cost_in_sgd  = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)

    # format in YYYY-MM-DD HH:MM
    datetime_created = models.DateTimeField(auto_now_add=True)

    # the payment details for the booking order
    payment_id = models.ForeignKey(user_payment_credit_card_details, on_delete=models.PROTECT, blank=True, null=True)

    # to be updated during deployment
    booking_terms_and_condition = "This is a sample booking terms and condition"
    hotel_terms_and_condition = "This is a sample hotel terms and condition"
    booking_tnc = models.CharField(max_length = 1000, default = booking_terms_and_condition)
    hotel_tnc = models.CharField(max_length = 1000, default = hotel_terms_and_condition)


