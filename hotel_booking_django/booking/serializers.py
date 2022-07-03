from rest_framework import serializers
from .models import booking_order

# returns all the datafields in the booking_order model
class booking_serializer(serializers.ModelSerializer):
    class Meta:
        model = booking_order
        fields = (
            'uid',
            'user_account', 
            'hotel_id', 
            'room_type_id', 
            'booking_id',
            'check_in_date',
            'check_out_date',
            'number_of_rooms',
            'number_of_guests_per_rooms',
            'special_request',
            'primary_guest_title',
            'primary_guest_first_name',
            'primary_guest_last_name',
            'primary_guest_phone',
            'primary_guest_phone_country',
            'primary_guest_passport_number',
            'primary_guest_passport_country',
            'cost_in_sgd',
            'datetime_created'
            )