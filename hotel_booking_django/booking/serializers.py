from rest_framework import serializers
from .models import booking_order
from payment.serializers import user_payment_credit_card_details_serializer

# serialize all the datafields in the booking_order model
class booking_serializer(serializers.ModelSerializer):
    
    class Meta:
        model = booking_order
        fields = ("__all__")
        
class booking_history_serializer(serializers.ModelSerializer):
    
    payment_id = user_payment_credit_card_details_serializer()
    datetime_created = serializers.DateTimeField(read_only=True,format="%d-%b-%Y %H:%M:%S")
    check_in_date = serializers.DateField(format="%d-%b-%Y")
    check_out_date = serializers.DateField(format="%d-%b-%Y")
    
    
    class Meta:
        model = booking_order
        fields = ("__all__")