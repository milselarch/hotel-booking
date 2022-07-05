from rest_framework import serializers
from .models import booking_order

# serialize all the datafields in the booking_order model
class booking_serializer(serializers.ModelSerializer):
    class Meta:
        model = booking_order
        fields = ("__all__")


# serialize the datafields required for booking post request response
class booking_response_serializer(serializers.ModelSerializer):
    class Meta:
        model = booking_order
        fields = (
            "cost_in_sgd",
            "uid",
            "booking_tnc",
            "hotel_tnc",
        )